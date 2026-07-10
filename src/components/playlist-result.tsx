import { SongList } from "./song-list";
import type { Playlist } from "../types/playlist";

interface PlaylistResultProps {
  playlist: Playlist;
}

export function PlaylistResult({ playlist }: PlaylistResultProps) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-[var(--surface-strong)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Generated playlist</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">{playlist.title}</h2>
          </div>
          <p className="text-sm text-slate-400">{playlist.createdAt}</p>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-slate-300">{playlist.summary}</p>
        <div className="flex flex-wrap gap-2">
          {playlist.vibe.map((item) => (
            <span
              key={item}
              className="rounded-full border border-cyan-200/15 bg-cyan-200/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-cyan-100"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <div className="grid gap-1 text-sm text-slate-300">
          <p>
            <span className="text-slate-400">Mood:</span> {playlist.request.mood}
          </p>
          <p>
            <span className="text-slate-400">Activity:</span> {playlist.request.activity}
          </p>
          <p>
            <span className="text-slate-400">Notes:</span> {playlist.request.notes || "None"}
          </p>
        </div>
        <SongList songs={playlist.songs} />
      </div>
    </section>
  );
}