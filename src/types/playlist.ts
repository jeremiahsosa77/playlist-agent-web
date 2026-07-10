export type PlaylistMood =
  | "focus"
  | "lift"
  | "late-night"
  | "reset"
  | "hype";

export type GenerationState = "idle" | "loading" | "ready" | "error";

export interface PlaylistRequest {
  mood: PlaylistMood;
  energy: number;
  activity: string;
  songCount: number;
  notes: string;
}

export interface Song {
  title: string;
  artist: string;
  duration: string;
  genre: string;
}

export interface Playlist {
  title: string;
  summary: string;
  vibe: string[];
  songs: Song[];
  createdAt: string;
  request: PlaylistRequest;
}