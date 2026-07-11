export type PlaylistRequest = {
  prompt: string;
  artists: string[];
  genres: string[];
  playlistLength: number;
  isPublic: boolean;
};

export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  imageUrl: string;
  spotifyUrl: string;
};

export type PlaylistScores = {
  spotifyMatch: number;
  duplicateScore: number;
  playlistLength: number;
  matchConfidence: number;
};

export type GeneratedPlaylist = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  spotifyUrl: string;
  isPublic: boolean;
  songs: Song[];
  scores: PlaylistScores;
  published: boolean;
  passedQualityGate: boolean;
  provider: string;
  model: string;
  promptVersion: string;
};

export type ApiSpotifyTrack = {
  id: string;
  uri: string;
  title: string;
  artist: string;
  artists: string[];
  album: string;
  spotifyUrl: string;
  duration?: string | null;
  imageUrl?: string | null;
};

export type ApiGeneratedSong = {
  title: string;
  artist: string;
  spotify: ApiSpotifyTrack | null;
};

export type ApiPlaylistCandidate = {
  name: string;
  description: string;
  songs: ApiGeneratedSong[];
};

export type ApiPlaylistScores = {
  spotifyMatch: number;
  duplicateScore: number;
  playlistLength: number;
  matchConfidence: number;
};

export type ApiPublishedPlaylist = {
  id: string;
  name: string;
  url: string;
  trackCount: number;
  public: boolean;
};

export type GeneratePlaylistResponse = {
  playlist: ApiPlaylistCandidate;
  scores: ApiPlaylistScores;
  passedQualityGate: boolean;
  published: boolean;
  publication: ApiPublishedPlaylist | null;
  provider: string;
  model: string;
  promptVersion: string;
};

export type ApiErrorResponse = {
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
  detail?: string;
  message?: string;
};