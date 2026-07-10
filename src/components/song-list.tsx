import Image from "next/image";

import type { Song } from "@/types/playlist";

type SongListProps = {
  songs: Song[];
};

export default function SongList({
  songs,
}: SongListProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/20">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-white/10 px-4 py-3 text-xs font-medium uppercase tracking-[0.18em] text-white/35 sm:grid-cols-[48px_1fr_1fr_auto]">
        <span>#</span>
        <span>Track</span>
        <span className="hidden sm:block">
          Album
        </span>
        <span>Time</span>
      </div>

      <div>
        {songs.map((song, index) => (
          <a
            key={song.id}
            href={song.spotifyUrl}
            target="_blank"
            rel="noreferrer"
            className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-white/5 px-4 py-3 transition last:border-b-0 hover:bg-white/5 sm:grid-cols-[48px_1fr_1fr_auto]"
          >
            <span className="text-sm text-white/40">
              {index + 1}
            </span>

            <div className="flex min-w-0 items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white/10">
                <Image
                  src={song.imageUrl}
                  alt={`${song.title} cover`}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {song.title}
                </p>

                <p className="mt-1 truncate text-xs text-white/45">
                  {song.artist}
                </p>
              </div>
            </div>

            <p className="hidden truncate text-sm text-white/45 sm:block">
              {song.album}
            </p>

            <span className="text-sm text-white/40">
              {song.duration}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}