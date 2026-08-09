import { Badge } from "../../../components/ui/Badge";
import { mockCanvases } from "../data/mockData";
import type { Canvas } from "../types";
import { cn } from "../../../lib/utils";

interface CanvasListProps {
  selectedCanvasId: string | null;
  onSelect: (canvas: Canvas) => void;
}

export function CanvasList({ onSelect, selectedCanvasId }: CanvasListProps) {
  return (
    <div className="space-y-2">
      {mockCanvases.map((canvas) => {
        const selected = selectedCanvasId === canvas.id;

        return (
          <button
            key={canvas.id}
            type="button"
            disabled={!canvas.selectable}
            onClick={() => onSelect(canvas)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition",
              selected && "border-app-primary bg-indigo-50 shadow-sm",
              !selected && canvas.selectable && "border-slate-200 bg-white hover:border-app-primary hover:bg-indigo-50",
              !canvas.selectable && "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60",
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 flex-none items-center justify-center rounded-full border-2",
                selected ? "border-app-primary bg-app-primary" : "border-slate-300",
              )}
              aria-hidden="true"
            >
              {selected ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
            </span>
            <span className="min-w-0 flex-1">
              <span className={cn("block truncate text-sm font-semibold", selected ? "text-app-primaryDark" : "text-app-text")}>
                {canvas.name}
              </span>
              <span className="mt-0.5 block font-mono text-xs text-app-faint">
                {canvas.kind}
                {canvas.stepsCount ? ` - ${canvas.stepsCount} steps` : ""} - {canvas.status}
              </span>
            </span>
            {!canvas.selectable ? <Badge>Demo unavailable</Badge> : null}
          </button>
        );
      })}
    </div>
  );
}
