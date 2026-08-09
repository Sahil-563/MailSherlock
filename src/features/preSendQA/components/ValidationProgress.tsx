import { ProgressBar } from "../../../components/ui/ProgressBar";

interface ValidationProgressProps {
  progress: number;
  stage: string | null;
}

export function ValidationProgress({ progress, stage }: ValidationProgressProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-app-text">{stage ?? "Preparing validation..."}</span>
        <span className="font-mono text-sm text-app-soft">{progress}%</span>
      </div>
      <ProgressBar value={progress} />
    </div>
  );
}
