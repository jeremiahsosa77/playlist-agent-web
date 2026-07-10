import type { Playlist, PlaylistRequest, Song } from "../types/playlist";

export const moodOptions: Array<{
  value: PlaylistRequest["mood"];
  label: string;
  description: string;
}> = [
  {
    value: "focus",
    label: "Focus",
    description: "Clean, steady songs for deep work.",
  },
  {
    value: "lift",
    label: "Lift",
    description: "Bright momentum for getting unstuck.",
  },
  {
    value: "late-night",
    label: "Late Night",
    description: "Warm, low-light tracks with space.",
  },
  {
    value: "reset",
    label: "Reset",
    description: "A calm sequence to clear the head.",
  },
  {
    value: "hype",
    label: "Hype",
    description: "Sharp beats for high-energy moments.",
  },
];

export const sampleRequest: PlaylistRequest = {
  mood: "focus",
  energy: 62,
  activity: "writing sprint",
  songCount: 8,
  notes: "Keep it clean, no vocals that pull attention away.",
};

export const songLibrary: Song[] = [
  { title: "Glass Horizon", artist: "Northbound", duration: "3:42", genre: "ambient pop" },
  { title: "Quiet Voltage", artist: "Luma Arc", duration: "4:08", genre: "downtempo" },
  { title: "Night Circuit", artist: "Soft Static", duration: "3:21", genre: "electronica" },
  { title: "Blue Current", artist: "Monument Run", duration: "4:15", genre: "indie electronic" },
  { title: "Second Wind", artist: "Aster Field", duration: "3:57", genre: "alt pop" },
  { title: "Warm Static", artist: "Cinder & Coast", duration: "2:58", genre: "lo-fi" },
  { title: "Pulse Window", artist: "Arc Index", duration: "3:36", genre: "synthwave" },
  { title: "Paper Skies", artist: "Vanta June", duration: "4:03", genre: "dream pop" },
  { title: "Afterglow Loop", artist: "Rift Motel", duration: "3:29", genre: "chillwave" },
  { title: "Signal Bloom", artist: "Nova Drift", duration: "4:11", genre: "future garage" },
];

export const samplePlaylist: Playlist = {
  title: "Focused Momentum",
  summary:
    "A balanced set of low-friction tracks built to keep the room steady and the ideas moving.",
  vibe: ["steady", "clear", "minimal vocals", "forward motion"],
  songs: songLibrary.slice(0, 8),
  createdAt: "Today, 9:42 AM",
  request: sampleRequest,
};