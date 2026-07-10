"use client";

import { useEffect, useState } from "react";

import GenerationStatus from "@/components/generation-status";
import InteractiveGridBackground from "@/components/interactive-grid-background";
import PlaylistForm from "@/components/playlist-form";
import PlaylistResult from "@/components/playlist-result";
import {
  defaultPlaylistRequest,
  mockGeneratedPlaylist,
} from "@/lib/mock-data";
import type {
  GeneratedPlaylist,
  PlaylistRequest,
} from "@/types/playlist";

type ViewState = "form" | "generating" | "result";

export default function HomePage() {
  const [viewState, setViewState] =
    useState<ViewState>("form");

  const [currentStep, setCurrentStep] =
    useState(1);

  const [playlist, setPlaylist] =
    useState<GeneratedPlaylist | null>(null);

  useEffect(() => {
    if (viewState !== "generating") {
      return;
    }

    const stepTimers = [
      window.setTimeout(
        () => setCurrentStep(2),
        900,
      ),
      window.setTimeout(
        () => setCurrentStep(3),
        1800,
      ),
      window.setTimeout(
        () => setCurrentStep(4),
        2800,
      ),
      window.setTimeout(() => {
        setPlaylist(mockGeneratedPlaylist);
        setViewState("result");
      }, 4000),
    ];

    return () => {
      stepTimers.forEach((timer) => {
        window.clearTimeout(timer);
      });
    };
  }, [viewState]);

  function handleSubmit(
    _request: PlaylistRequest,
  ) {
    setCurrentStep(1);
    setPlaylist(null);
    setViewState("generating");
  }

  function handleReset() {
    setCurrentStep(1);
    setPlaylist(null);
    setViewState("form");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08080a] text-white">
      <InteractiveGridBackground />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-lg font-semibold shadow-lg shadow-black/20 backdrop-blur-xl">
              P
            </span>

            <span>
              <span className="block text-sm font-semibold text-white">
                Playlist Agent
              </span>

              <span className="block text-xs text-white/40">
                AI music curation
              </span>
            </span>
          </button>

          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/55 backdrop-blur-xl">
            Frontend MVP
          </div>
        </header>

        <section className="flex flex-1 flex-col justify-center py-14 sm:py-20">
          {viewState === "form" ? (
            <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-white/40">
                  Personalized music, evaluated first
                </p>

                <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                  Describe the moment.
                  <span className="block text-white/45">
                    We’ll build the soundtrack.
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-base leading-8 text-white/50 sm:text-lg">
                  Tell Playlist Agent what you are doing,
                  how you want to feel, and which artists
                  you enjoy. Every track is checked before
                  the playlist is accepted.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  <FeatureCard
                    number="01"
                    title="Describe"
                    text="Use natural language to explain the vibe."
                  />

                  <FeatureCard
                    number="02"
                    title="Evaluate"
                    text="Tracks are validated and scored."
                  />

                  <FeatureCard
                    number="03"
                    title="Listen"
                    text="Receive a playlist ready for Spotify."
                  />
                </div>
              </div>

              <PlaylistForm
                defaultValues={
                  defaultPlaylistRequest
                }
                isGenerating={false}
                onSubmit={handleSubmit}
              />
            </div>
          ) : null}

          {viewState === "generating" ? (
            <div className="mx-auto w-full max-w-2xl">
              <GenerationStatus
                currentStep={currentStep}
              />
            </div>
          ) : null}

          {viewState === "result" &&
          playlist ? (
            <div className="mx-auto w-full max-w-6xl">
              <PlaylistResult
                playlist={playlist}
                onReset={handleReset}
              />
            </div>
          ) : null}
        </section>

        <footer className="flex flex-col gap-2 border-t border-white/10 py-5 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Built with Next.js, Spotify,
            Braintrust, and multiple LLM
            providers.
          </p>

          <p>
            Mock frontend data for Phase 1.
          </p>
        </footer>
      </div>
    </main>
  );
}

type FeatureCardProps = {
  number: string;
  title: string;
  text: string;
};

function FeatureCard({
  number,
  title,
  text,
}: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <p className="text-xs font-semibold text-white/30">
        {number}
      </p>

      <h2 className="mt-3 text-sm font-semibold text-white">
        {title}
      </h2>

      <p className="mt-2 text-xs leading-5 text-white/40">
        {text}
      </p>
    </div>
  );
}