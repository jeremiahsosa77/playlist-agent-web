"use client";

type GenerationStatusProps = {
  currentStep?: number;
};

const steps = [
  "Understanding your request",
  "Curating the track list",
  "Matching songs with Spotify",
  "Evaluating playlist quality",
];

export default function GenerationStatus({
  currentStep = 1,
}: GenerationStatusProps) {
  return (
    <section className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
      <div className="flex items-center gap-4">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/10">
          <span className="absolute h-14 w-14 animate-ping rounded-full bg-white/10" />

          <span className="relative h-5 w-5 animate-spin rounded-full border-2 border-white/25 border-t-white" />
        </div>

        <div>
          <p className="text-sm font-medium text-white/55">
            Playlist Agent is working
          </p>

          <h2 className="mt-1 text-xl font-semibold text-white">
            Building your playlist
          </h2>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isComplete = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div
              key={step}
              className="flex items-center gap-4"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition ${
                  isComplete
                    ? "border-white bg-white text-black"
                    : isActive
                      ? "border-white/40 bg-white/15 text-white"
                      : "border-white/10 bg-black/20 text-white/35"
                }`}
              >
                {isComplete ? "✓" : stepNumber}
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-medium transition ${
                    isComplete || isActive
                      ? "text-white"
                      : "text-white/35"
                  }`}
                >
                  {step}
                </p>

                {isActive ? (
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-2/3 animate-pulse rounded-full bg-white" />
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-sm leading-6 text-white/45">
        This usually takes a little longer because every song is
        checked before the playlist is accepted.
      </p>
    </section>
  );
}