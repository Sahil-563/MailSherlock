import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import { ruleToolbox } from "../data/mockData";
import type { ValidationRuleType } from "../types";

interface DraggableRuleProps {
  type: ValidationRuleType;
  label: string;
}

function DraggableRule({ label, type }: DraggableRuleProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `tool-${type}`,
    data: { type },
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      className="inline-flex cursor-grab items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-app-text shadow-sm transition hover:border-app-primary hover:text-app-primaryDark active:cursor-grabbing"
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      }}
      {...listeners}
      {...attributes}
    >
      <GripVertical className="h-3.5 w-3.5 text-app-faint" aria-hidden="true" />
      {label}
    </button>
  );
}

export function RuleToolbox() {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-app-faint">Rule toolbox</div>
      <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-app-chrome p-3">
        {ruleToolbox.map((rule) => (
          <DraggableRule key={rule.type} type={rule.type} label={rule.label} />
        ))}
      </div>
    </div>
  );
}
