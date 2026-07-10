import { API_URL, USE_MOCK_API } from "@/lib/config";
import { mockGeneratedPlaylist } from "@/lib/mock-data";
import type {
  GeneratePlaylistResponse,
  GeneratedPlaylist,
  PlaylistRequest,
} from "@/types/playlist";

const MOCK_GENERATION_DELAY_MS = 4000;

export async function generatePlaylist(
  request: PlaylistRequest,
): Promise<GeneratedPlaylist> {
  const response = USE_MOCK_API
    ? await generateMockPlaylist(request)
    : await generateRealPlaylist(request);

  return response.playlist;
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
): Promise<GeneratePlaylistResponse> {
  await delay(MOCK_GENERATION_DELAY_MS);

  return {
    playlist: {
      ...mockGeneratedPlaylist,
      isPublic: request.isPublic,
    },
    published: true,
    provider: "openrouter",
    model: "nvidia/nemotron-3-ultra-550b-a55b:free",
    promptVersion: "playlist-generation-v2",
  };
}

async function generateRealPlaylist(
  request: PlaylistRequest,
): Promise<GeneratePlaylistResponse> {
  const response = await fetch(
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
        playlist_length: request.playlistLength,
        is_public: request.isPublic,
      }),
    },
  );

  if (!response.ok) {
    const message = await readErrorMessage(response);

    throw new Error(
      message ||
        `Playlist generation failed with status ${response.status}.`,
    );
  }

  return response.json() as Promise<GeneratePlaylistResponse>;
}

async function readErrorMessage(
  response: Response,
): Promise<string> {
  try {
    const data = (await response.json()) as {
      detail?: string;
      message?: string;
    };

    return data.detail ?? data.message ?? "";
  } catch {
    return "";
  }
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}