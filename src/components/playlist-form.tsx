"use client";

import { FormEvent, useState } from "react";

import type { PlaylistRequest } from "@/types/playlist";

type PlaylistFormProps = {
  defaultValues?: PlaylistRequest;
  isGenerating?: boolean;
  onSubmit: (request: PlaylistRequest) => void;
};

function parseCommaSeparatedValues(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function PlaylistForm({
  defaultValues,
  isGenerating = false,
  onSubmit,
}: PlaylistFormProps) {
  const [prompt, setPrompt] = useState(
    defaultValues?.prompt ?? "",
  );

  const [artists, setArtists] = useState(
    defaultValues?.artists.join(", ") ?? "",
  );

  const [genres, setGenres] = useState(
    defaultValues?.genres.join(", ") ?? "",
  );

  const [playlistLength, setPlaylistLength] = useState(
    defaultValues?.playlistLength ?? 20,
  );

  const [isPublic, setIsPublic] = useState(
    defaultValues?.isPublic ?? false,
  );

  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedPrompt = prompt.trim();

    if (trimmedPrompt.length < 10) {
      setError(
        "Describe the playlist you want in at least 10 characters.",
      );
      return;
    }

    if (playlistLength < 5 || playlistLength > 100) {
      setError(
        "Playlist length must be between 5 and 100 songs.",
      );
      return;
    }

    setError("");

    onSubmit({
      prompt: trimmedPrompt,
      artists: parseCommaSeparatedValues(artists),
      genres: parseCommaSeparatedValues(genres),
      playlistLength,
      isPublic,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8"
    >
      <div className="space-y-2">
        <label
          htmlFor="playlist-prompt"
          className="text-sm font-medium text-white"
        >
          Describe the moment
        </label>

        <p className="text-sm leading-6 text-white/55">
          Tell the agent where you are going, how you want to
          feel, and what kind of music would fit.
        </p>

        <textarea
          id="playlist-prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          disabled={isGenerating}
          rows={6}
          placeholder="I’m heading on a date tonight and want something romantic, current, and interesting without feeling too slow..."
          className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-base text-white outline-none transition placeholder:text-white/30 focus:border-white/30 focus:bg-black/30 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="favorite-artists"
            className="text-sm font-medium text-white"
          >
            Favorite artists
          </label>

          <input
            id="favorite-artists"
            type="text"
            value={artists}
            onChange={(event) => setArtists(event.target.value)}
            disabled={isGenerating}
            placeholder="SZA, Daniel Caesar, Brent Faiyaz"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-white/30 focus:bg-black/30 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <p className="text-xs text-white/40">
            Separate each artist with a comma.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="genres"
            className="text-sm font-medium text-white"
          >
            Genres
          </label>

          <input
            id="genres"
            type="text"
            value={genres}
            onChange={(event) => setGenres(event.target.value)}
            disabled={isGenerating}
            placeholder="R&B, Soul, Alternative Pop"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-white/30 focus:bg-black/30 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <p className="text-xs text-white/40">
            These are optional but improve the result.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="playlist-length"
            className="text-sm font-medium text-white"
          >
            Playlist length
          </label>

          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <input
              id="playlist-length"
              type="range"
              min={5}
              max={100}
              step={5}
              value={playlistLength}
              onChange={(event) =>
                setPlaylistLength(Number(event.target.value))
              }
              disabled={isGenerating}
              className="w-full accent-white disabled:cursor-not-allowed"
            />

            <span className="min-w-20 text-right text-sm font-medium text-white">
              {playlistLength} songs
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-white">
            Spotify visibility
          </span>

          <button
            type="button"
            onClick={() => setIsPublic((current) => !current)}
            disabled={isGenerating}
            aria-pressed={isPublic}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left transition hover:bg-black/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>
              <span className="block text-sm font-medium text-white">
                {isPublic ? "Public playlist" : "Private playlist"}
              </span>

              <span className="mt-1 block text-xs text-white/45">
                {isPublic
                  ? "Anyone with the link can discover it."
                  : "Only you can access it in Spotify."}
              </span>
            </span>

            <span
              className={`relative h-7 w-12 rounded-full transition ${
                isPublic ? "bg-white" : "bg-white/15"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full transition ${
                  isPublic
                    ? "left-6 bg-black"
                    : "left-1 bg-white"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isGenerating}
        className="mt-7 flex w-full items-center justify-center rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isGenerating
          ? "Creating your playlist..."
          : "Generate playlist"}
      </button>
    </form>
  );
}