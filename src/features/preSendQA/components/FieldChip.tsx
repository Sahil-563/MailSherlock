import { Badge } from "../../../components/ui/Badge";
import type { ExtractedField } from "../types";
import { cn } from "../../../lib/utils";

interface FieldChipProps {
  field: ExtractedField;
}

export function FieldChip({ field }: FieldChipProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-sm",
        field.supported
          ? "border-indigo-100 bg-indigo-50 text-app-primaryDark"
          : "border-dashed border-slate-300 bg-white text-app-faint",
      )}
    >
      <span>{field.path}</span>
      <Badge tone={field.supported ? "primary" : "neutral"} className="font-sans">
        {field.type === "connected_content" ? "connected content" : field.type}
      </Badge>
    </div>
  );
}
