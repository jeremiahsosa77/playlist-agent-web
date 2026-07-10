"use client";

import GenerationStatus from "@/components/generation-status";
import InteractiveGridBackground from "@/components/interactive-grid-background";
import PlaylistInterview from "@/components/playlist-interview";
import PlaylistResult from "@/components/playlist-result";
import { usePlaylistWorkflow } from "@/hooks/use-playlist-workflow";

export default function HomePage() {
  const {
    workflowState,
    currentStep,
    playlist,
    errorMessage,
    startGeneration,
    resetWorkflow,
    retryGeneration,
  } = usePlaylistWorkflow();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08080a] text-white">
      <InteractiveGridBackground />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={resetWorkflow}
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
            Conversational MVP
          </div>
        </header>

        <section className="flex flex-1 flex-col justify-center py-14 sm:py-20">
          {workflowState === "interview" ? (
            <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-white/40">
                  Your personal music curator
                </p>

                <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                  Tell us the moment.
                  <span className="block text-white/45">
                    We’ll understand the feeling.
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-base leading-8 text-white/50 sm:text-lg">
                  Answer a few focused questions from your AI music curator.
                  The final playlist is matched, evaluated, and prepared for
                  Spotify.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  <FeatureCard
                    number="01"
                    title="Describe"
                    text="Explain the setting, feeling, or occasion."
                  />

                  <FeatureCard
                    number="02"
                    title="Refine"
                    text="Answer a few focused questions."
                  />

                  <FeatureCard
                    number="03"
                    title="Receive"
                    text="Get a playlist built for that exact moment."
                  />
                </div>
              </div>

              <PlaylistInterview onComplete={startGeneration} />
            </div>
          ) : null}

          {workflowState === "generating" ? (
            <div className="mx-auto w-full max-w-2xl">
              <GenerationStatus currentStep={currentStep} />
            </div>
          ) : null}

          {workflowState === "result" && playlist ? (
            <div className="mx-auto w-full max-w-6xl">
              <PlaylistResult
                playlist={playlist}
                onReset={resetWorkflow}
              />
            </div>
          ) : null}

          {workflowState === "error" ? (
            <div className="mx-auto w-full max-w-xl rounded-3xl border border-red-400/20 bg-red-400/10 p-6 text-center shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-red-200/70">
                Generation failed
              </p>

              <h2 className="mt-3 text-2xl font-semibold text-white">
                We could not finish your playlist
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/55">
                {errorMessage ||
                  "Something interrupted the playlist workflow."}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={retryGeneration}
                  className="flex-1 rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Try again
                </button>

                <button
                  type="button"
                  onClick={resetWorkflow}
                  className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Start over
                </button>
              </div>
            </div>
          ) : null}
        </section>

        <footer className="flex flex-col gap-2 border-t border-white/10 py-5 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Built with Next.js, Spotify, Braintrust, and multiple LLM
            providers.
          </p>

          <p>Workflow controller enabled.</p>
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