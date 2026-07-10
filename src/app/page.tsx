"use client";

import { useState } from "react";
import { GenerationStatus } from "../components/generation-status";
import { PlaylistForm } from "../components/playlist-form";
import { PlaylistResult } from "../components/playlist-result";
import { generatePlaylist } from "../lib/api";
import { samplePlaylist, sampleRequest } from "../lib/mock-data";
import type { GenerationState, Playlist, PlaylistRequest } from "../types/playlist";

export default function Home() {
  const [request, setRequest] = useState<PlaylistRequest>(sampleRequest);
  const [playlist, setPlaylist] = useState<Playlist>(samplePlaylist);
  const [status, setStatus] = useState<GenerationState>("ready");
  const [message, setMessage] = useState("Loaded a starter mix.");

  async function handleGenerate() {
    setStatus("loading");
    setMessage("Building a new mix from your brief.");

    try {
      const nextPlaylist = await generatePlaylist(request);
      setPlaylist(nextPlaylist);
      setStatus("ready");
      setMessage("Playlist generated successfully.");
    } catch {
      setStatus("error");
      setMessage("Something went wrong while generating the playlist.");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 lg:px-8">
      <section className="grid flex-1 gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-10">
        <div className="flex flex-col justify-between gap-8 pt-4 lg:sticky lg:top-8 lg:self-start">
          <div className="max-w-xl space-y-6">
            <GenerationStatus state={status} message={message} />
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">Playlist Agent</p>
              <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Turn a mood brief into a playlist that feels shaped, not random.
              </h1>
              <p className="max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
                This folder is wired as a clean App Router starter: the form collects the brief,
                the API helper simulates generation, and the result area renders the playlist.
              </p>
            </div>
          </div>

          <div className="grid gap-3 rounded-[2rem] border border-white/10 bg-white/5 p-5 text-sm text-slate-300 backdrop-blur-xl">
            <p className="font-medium text-white">Included structure</p>
            <div className="grid gap-1 text-slate-400">
              <p>src/app</p>
              <p>src/components</p>
              <p>src/lib</p>
              <p>src/types</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <PlaylistForm
            value={request}
            onChange={setRequest}
            onSubmit={handleGenerate}
            isGenerating={status === "loading"}
          />
          <PlaylistResult playlist={playlist} />
        </div>
      </section>
    </main>
  );
}
