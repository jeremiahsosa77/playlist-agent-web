import type { Playlist, PlaylistRequest, Song } from "../types/playlist";
import { songLibrary } from "./mock-data";

const sleep = (milliseconds: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

function buildPlaylistTitle(request: PlaylistRequest) {
  switch (request.mood) {
    case "lift":
      return "Bright Lift Mix";
    case "late-night":
      return "Late Night Drift";
    case "reset":
      return "Reset Sequence";
    case "hype":
      return "High Gear Run";
    default:
      return "Focused Momentum";
  }
}

function buildVibe(request: PlaylistRequest) {
  const vibe = [request.mood.replace("-", " "), request.activity, `${request.energy}% energy`];
  if (request.notes.trim()) {
    vibe.push(request.notes.trim().slice(0, 24));
  }

  return vibe;
}

function pickSongs(count: number, energy: number): Song[] {
  const offset = energy > 70 ? 3 : energy < 40 ? 1 : 0;
  const rotated = [...songLibrary.slice(offset), ...songLibrary.slice(0, offset)];
  return rotated.slice(0, Math.max(3, Math.min(count, songLibrary.length)));
}

export async function generatePlaylist(
  request: PlaylistRequest,
): Promise<Playlist> {
  await sleep(650);

  return {
    title: buildPlaylistTitle(request),
    summary:
      "A quick mock generation pass that returns a playlist shaped by the selected mood, pace, and activity.",
    vibe: buildVibe(request),
    songs: pickSongs(request.songCount, request.energy),
    createdAt: new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    }),
    request,
  };
}