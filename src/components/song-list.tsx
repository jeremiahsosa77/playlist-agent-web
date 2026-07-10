import type { Song } from "../types/playlist";

interface SongListProps {
  songs: Song[];
}

export function SongList({ songs }: SongListProps) {
  return (
    <ol className="grid gap-3">
      {songs.map((song, index) => (
        <li
          key={`${song.title}-${song.artist}`}
          className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
        >
          <div>
            <p className="text-sm font-semibold text-white">
              {index + 1}. {song.title}
            </p>
            <p className="text-sm text-slate-300">{song.artist}</p>
          </div>
          <div className="text-right text-xs uppercase tracking-[0.24em] text-slate-400">
            <p>{song.genre}</p>
            <p>{song.duration}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}