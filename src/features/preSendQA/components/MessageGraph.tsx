import { ArrowRight } from "lucide-react";
import { mockCanvasSteps, mockEmailMessage } from "../data/mockData";
import type { Message } from "../types";
import { cn } from "../../../lib/utils";

interface MessageGraphProps {
  selectedMessageId: string | null;
  onSelect: (message: Message) => void;
}

export function MessageGraph({ onSelect, selectedMessageId }: MessageGraphProps) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-[560px] items-center">
        {mockCanvasSteps.map((step, index) => {
          const selected = selectedMessageId === step.id;
          const selectable = step.selectable;

          return (
            <div key={step.id} className="flex items-center">
              <button
                type="button"
                disabled={!selectable}
                onClick={() => onSelect(mockEmailMessage)}
                className={cn(
                  "min-h-[78px] min-w-[150px] rounded-xl border px-4 py-3 text-center transition",
                  selected && "border-app-primary bg-indigo-50 text-app-primaryDark shadow-glow",
                  selectable && !selected && "border-slate-300 bg-white text-app-text hover:border-app-primary hover:bg-indigo-50",
                  !selectable && "cursor-not-allowed border-slate-200 bg-slate-50 text-app-faint",
                )}
              >
                <span className="block text-sm font-semibold">{step.name}</span>
                <span className="mt-1 block font-mono text-xs text-app-faint">
                  {step.stepLabel ?? step.unavailableReason ?? "informational"}
                </span>
              </button>
              {index < mockCanvasSteps.length - 1 ? (
                <ArrowRight className="mx-3 h-5 w-5 flex-none text-app-faint" aria-hidden="true" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
