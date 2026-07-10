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
};

export type GeneratePlaylistResponse = {
  playlist: GeneratedPlaylist;
  published: boolean;
  provider: string;
  model: string;
  promptVersion: string;
};