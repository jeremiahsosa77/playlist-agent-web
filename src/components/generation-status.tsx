import type { GenerationState } from "../types/playlist";

const statusCopy: Record<GenerationState, { label: string; tone: string }> = {
  idle: { label: "Ready", tone: "border-white/10 bg-white/5 text-slate-200" },
  loading: { label: "Generating", tone: "border-cyan-300/30 bg-cyan-300/10 text-cyan-50" },
  ready: { label: "Complete", tone: "border-emerald-300/30 bg-emerald-300/10 text-emerald-50" },
  error: { label: "Needs attention", tone: "border-rose-300/30 bg-rose-300/10 text-rose-50" },
};

interface GenerationStatusProps {
  state: GenerationState;
  message?: string;
}

export function GenerationStatus({ state, message }: GenerationStatusProps) {
  const copy = statusCopy[state];

  return (
    <div className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm ${copy.tone}`}>
      <span className="h-2.5 w-2.5 rounded-full bg-current" />
      <span className="font-medium">{copy.label}</span>
      {message ? <span className="text-white/70">{message}</span> : null}
    </div>
  );
}