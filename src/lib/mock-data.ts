import type {
  GeneratedPlaylist,
  PlaylistRequest,
} from "@/types/playlist";

export const defaultPlaylistRequest: PlaylistRequest = {
  prompt:
    "I am going on a late-night drive and want something atmospheric, energetic, and current without feeling repetitive.",
  artists: [
    "Travis Scott",
    "Drake",
    "Metro Boomin",
  ],
  genres: [
    "Hip Hop",
    "Trap",
    "Alternative R&B",
  ],
  playlistLength: 20,
  isPublic: false,
};

export const mockGeneratedPlaylist: GeneratedPlaylist = {
  id: "mock-playlist-001",
  name: "Neon After Hours",
  description:
    "A late-night mix of atmospheric trap, melodic rap, and smooth alternative R&B built for city lights and empty highways.",
  imageUrl:
    "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80",
  spotifyUrl:
    "https://open.spotify.com/",
  isPublic: false,
  published: true,
  passedQualityGate: true,
  provider: "openrouter",
  model:
    "nvidia/nemotron-3-ultra-550b-a55b:free",
  promptVersion: "playlist-generation-v2",
  scores: {
    spotifyMatch: 1,
    duplicateScore: 1,
    playlistLength: 1,
    matchConfidence: 0.95,
  },
  songs: [
    {
      id: "song-001",
      title: "MY EYES",
      artist: "Travis Scott",
      album: "UTOPIA",
      duration: "4:11",
      imageUrl:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80",
      spotifyUrl:
        "https://open.spotify.com/",
    },
    {
      id: "song-002",
      title: "Marvins Room",
      artist: "Drake",
      album: "Take Care",
      duration: "5:47",
      imageUrl:
        "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&w=400&q=80",
      spotifyUrl:
        "https://open.spotify.com/",
    },
    {
      id: "song-003",
      title: "Raindrops (Insane)",
      artist: "Metro Boomin",
      album: "HEROES & VILLAINS",
      duration: "3:08",
      imageUrl:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80",
      spotifyUrl:
        "https://open.spotify.com/",
    },
    {
      id: "song-004",
      title: "Too Many Nights",
      artist: "Metro Boomin",
      album: "HEROES & VILLAINS",
      duration: "3:20",
      imageUrl:
        "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=400&q=80",
      spotifyUrl:
        "https://open.spotify.com/",
    },
    {
      id: "song-005",
      title: "ASTROTHUNDER",
      artist: "Travis Scott",
      album: "ASTROWORLD",
      duration: "2:22",
      imageUrl:
        "https://images.unsplash.com/photo-1524650359799-842906ca1c06?auto=format&fit=crop&w=400&q=80",
      spotifyUrl:
        "https://open.spotify.com/",
    },
    {
      id: "song-006",
      title: "Feel No Ways",
      artist: "Drake",
      album: "Views",
      duration: "4:00",
      imageUrl:
        "https://images.unsplash.com/photo-1460036521480-ff49c08c2781?auto=format&fit=crop&w=400&q=80",
      spotifyUrl:
        "https://open.spotify.com/",
    },
  ],
};