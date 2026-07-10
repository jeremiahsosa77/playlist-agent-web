import Image from "next/image";

import SongList from "@/components/song-list";
import type { GeneratedPlaylist } from "@/types/playlist";

type PlaylistResultProps = {
  playlist: GeneratedPlaylist;
  onReset: () => void;
};

function formatScore(score: number): string {
  return `${Math.round(score * 100)}%`;
}

export default function PlaylistResult({
  playlist,
  onReset,
}: PlaylistResultProps) {
  return (
    <section className="w-full space-y-6">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[260px_1fr]">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-white/10">
            <Image
              src={playlist.imageUrl}
              alt={`${playlist.name} playlist cover`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 260px"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            <div className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
              {playlist.isPublic ? "Public" : "Private"}
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/45">
                Your playlist
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                {playlist.name}
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
                {playlist.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/55">
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-2">
                  {playlist.songs.length} songs
                </span>

                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-2">
                  AI curated
                </span>

                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-2">
                  Spotify verified
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={playlist.spotifyUrl}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center rounded-2xl bg-[#1ed760] px-5 py-4 text-sm font-semibold text-black transition hover:bg-[#1fdf64]"
              >
                Open in Spotify
              </a>

              <button
                type="button"
                onClick={onReset}
                className="flex flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Create another
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/45">
              Playlist quality
            </p>

            <h3 className="mt-2 text-2xl font-semibold text-white">
              Passed evaluation
            </h3>
          </div>

          <p className="text-sm text-white/45">
            Verified before publishing
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QualityMetric
            label="Spotify match"
            value={formatScore(playlist.scores.spotifyMatch)}
          />

          <QualityMetric
            label="No duplicates"
            value={formatScore(playlist.scores.duplicateScore)}
          />

          <QualityMetric
            label="Requested length"
            value={formatScore(playlist.scores.playlistLength)}
          />

          <QualityMetric
            label="Match confidence"
            value={formatScore(playlist.scores.matchConfidence)}
          />
        </div>
      </div>

      <SongList songs={playlist.songs} />
    </section>
  );
}

type QualityMetricProps = {
  label: string;
  value: string;
};

function QualityMetric({
  label,
  value,
}: QualityMetricProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold text-white">
        {value}
      </p>
    </div>
  );
}