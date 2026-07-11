import { API_URL, USE_MOCK_API } from "@/lib/config";
import { mockGeneratedPlaylist } from "@/lib/mock-data";
import type {
  ApiErrorResponse,
  ApiGeneratedSong,
  GeneratePlaylistResponse,
  GeneratedPlaylist,
  PlaylistRequest,
  Song,
} from "@/types/playlist";

const MOCK_GENERATION_DELAY_MS = 4000;

const DEFAULT_PLAYLIST_IMAGE_URL =
  "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80";

const DEFAULT_SONG_IMAGE_URL =
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor({
    message,
    status,
    code = "API_ERROR",
    details,
  }: {
    message: string;
    status: number;
    code?: string;
    details?: unknown;
  }) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function generatePlaylist(
  request: PlaylistRequest,
): Promise<GeneratedPlaylist> {
  if (USE_MOCK_API) {
    return generateMockPlaylist(request);
  }

  const response = await generateRealPlaylist(request);

  return adaptGeneratePlaylistResponse(response, request);
}

export async function checkApiHealth(): Promise<boolean> {
  if (USE_MOCK_API) {
    return true;
  }

  try {
    const response = await fetch(`${API_URL}/api/health`, {
      method: "GET",
      cache: "no-store",
    });

    return response.ok;
  } catch {
    return false;
  }
}

async function generateMockPlaylist(
  request: PlaylistRequest,
): Promise<GeneratedPlaylist> {
  await delay(MOCK_GENERATION_DELAY_MS);

  return {
    ...mockGeneratedPlaylist,
    isPublic: request.isPublic,
    published: true,
    passedQualityGate: true,
    provider: "openrouter",
    model: "nvidia/nemotron-3-ultra-550b-a55b:free",
    promptVersion: "playlist-generation-v2",
  };
}

async function generateRealPlaylist(
  request: PlaylistRequest,
): Promise<GeneratePlaylistResponse> {
  let response: Response;

  try {
    response = await fetch(
      `${API_URL}/api/playlists/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: request.prompt,
          artists: request.artists,
          genres: request.genres,
          playlistLength: request.playlistLength,
          isPublic: request.isPublic,
        }),
      },
    );
  } catch {
    throw new ApiError({
      status: 0,
      code: "API_UNREACHABLE",
      message:
        "The playlist service could not be reached. Make sure the backend server is running.",
    });
  }

  if (!response.ok) {
    throw await createApiError(response);
  }

  return parseJsonResponse<GeneratePlaylistResponse>(
    response,
  );
}

function adaptGeneratePlaylistResponse(
  response: GeneratePlaylistResponse,
  request: PlaylistRequest,
): GeneratedPlaylist {
  const publication = response.publication;

  return {
    id:
      publication?.id ??
      createTemporaryPlaylistId(response.playlist.name),
    name: response.playlist.name,
    description: response.playlist.description,
    imageUrl: findPlaylistImage(response.playlist.songs),
    spotifyUrl: publication?.url ?? "",
    isPublic: publication?.public ?? request.isPublic,
    songs: response.playlist.songs.map(
      adaptGeneratedSong,
    ),
    scores: response.scores,
    published: response.published,
    passedQualityGate: response.passedQualityGate,
    provider: response.provider,
    model: response.model,
    promptVersion: response.promptVersion,
  };
}

function adaptGeneratedSong(
  song: ApiGeneratedSong,
  index: number,
): Song {
  const spotify = song.spotify;

  return {
    id:
      spotify?.id ??
      `unmatched-song-${index + 1}`,
    title: spotify?.title ?? song.title,
    artist: spotify?.artist ?? song.artist,
    album: spotify?.album ?? "Spotify match unavailable",
    duration: spotify?.duration ?? "--:--",
    imageUrl:
      spotify?.imageUrl ?? DEFAULT_SONG_IMAGE_URL,
    spotifyUrl: spotify?.spotifyUrl ?? "",
  };
}

function findPlaylistImage(
  songs: ApiGeneratedSong[],
): string {
  for (const song of songs) {
    const imageUrl = song.spotify?.imageUrl;

    if (imageUrl) {
      return imageUrl;
    }
  }

  return DEFAULT_PLAYLIST_IMAGE_URL;
}

function createTemporaryPlaylistId(
  playlistName: string,
): string {
  const normalizedName = playlistName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return normalizedName
    ? `generated-${normalizedName}`
    : "generated-playlist";
}

async function createApiError(
  response: Response,
): Promise<ApiError> {
  const fallbackMessage =
    `Playlist generation failed with status ${response.status}.`;

  try {
    const data =
      await parseJsonResponse<ApiErrorResponse>(
        response,
      );

    return new ApiError({
      status: response.status,
      code:
        data.error?.code ??
        "PLAYLIST_GENERATION_FAILED",
      message:
        data.error?.message ??
        data.detail ??
        data.message ??
        fallbackMessage,
      details: data.error?.details,
    });
  } catch {
    return new ApiError({
      status: response.status,
      code: "PLAYLIST_GENERATION_FAILED",
      message: fallbackMessage,
    });
  }
}

async function parseJsonResponse<T>(
  response: Response,
): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError({
      status: response.status,
      code: "INVALID_API_RESPONSE",
      message:
        "The playlist service returned an invalid response.",
    });
  }
}

function delay(
  milliseconds: number,
): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}