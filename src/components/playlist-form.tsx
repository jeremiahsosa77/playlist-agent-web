"use client";

import { moodOptions } from "../lib/mock-data";
import type { PlaylistRequest } from "../types/playlist";

interface PlaylistFormProps {
  value: PlaylistRequest;
  onChange: (value: PlaylistRequest) => void;
  onSubmit: () => void;
  isGenerating: boolean;
}

export function PlaylistForm({ value, onChange, onSubmit, isGenerating }: PlaylistFormProps) {
  return (
    <form
      className="rounded-[2rem] border border-white/10 bg-[var(--surface)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Brief</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Shape the playlist</h2>
        </div>

        <label className="grid gap-2 text-sm text-slate-200">
          Mood
          <select
            className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-300/40"
            value={value.mood}
            onChange={(event) => onChange({ ...value, mood: event.target.value as PlaylistRequest["mood"] })}
          >
            {moodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm text-slate-200">
          Activity
          <input
            className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40"
            value={value.activity}
            onChange={(event) => onChange({ ...value, activity: event.target.value })}
            placeholder="e.g. design sprint"
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-200">
          Energy: {value.energy}%
          <input
            className="accent-[var(--accent)]"
            type="range"
            min={10}
            max={100}
            value={value.energy}
            onChange={(event) => onChange({ ...value, energy: Number(event.target.value) })}
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-200">
          Song count: {value.songCount}
          <input
            className="accent-[var(--accent)]"
            type="range"
            min={3}
            max={10}
            value={value.songCount}
            onChange={(event) => onChange({ ...value, songCount: Number(event.target.value) })}
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-200">
          Notes
          <textarea
            className="min-h-28 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40"
            value={value.notes}
            onChange={(event) => onChange({ ...value, notes: event.target.value })}
            placeholder="Any extra direction for the playlist generator"
          />
        </label>

        <button
          className="inline-flex w-full items-center justify-center rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate playlist"}
        </button>
      </div>
    </form>
  );
}