import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { enumSuggestions, regexSuggestions } from "../data/mockData";
import type { ValidationRuleType } from "../types";

interface RuleEditorProps {
  fieldKey: string;
  type: Extract<ValidationRuleType, "enum" | "regex">;
  onApply: (label: string, payload: { values?: string[]; pattern?: string }) => void;
  onCancel: () => void;
}

export function RuleEditor({ fieldKey, onApply, onCancel, type }: RuleEditorProps) {
  const initial = type === "regex" ? regexSuggestions[fieldKey] ?? "" : "";
  const [value, setValue] = useState(initial);
  const label = type === "regex" ? "Pattern" : "Allowed values";
  const suggestion = type === "regex" ? regexSuggestions[fieldKey] ?? "^\\d{4}-\\d{2}-\\d{2}$" : enumSuggestions[fieldKey] ?? "Gold, Silver, Platinum";

  const apply = () => {
    const trimmed = value.trim();

    if (!trimmed) {
      return;
    }

    if (type === "regex") {
      onApply(`Regex: ${trimmed}`, { pattern: trimmed });
      return;
    }

    const values = trimmed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (values.length) {
      onApply(`Enum: ${values.join(", ")}`, { values });
    }
  };

  return (
    <div className="mt-3 rounded-lg border border-slate-200 bg-app-chrome p-3">
      <label className="block text-xs font-semibold text-app-faint" htmlFor={`${fieldKey}-${type}-editor`}>
        {label}
      </label>
      <input
        id={`${fieldKey}-${type}-editor`}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-app-text"
        placeholder={type === "regex" ? "^\\d{4}-\\d{2}-\\d{2}$" : "Gold, Silver, Platinum"}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="secondary" className="h-8 min-h-8 px-3 py-1 text-xs" onClick={() => setValue(suggestion)}>
          Suggest
        </Button>
        <Button variant="secondary" className="h-8 min-h-8 px-3 py-1 text-xs" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" className="h-8 min-h-8 px-3 py-1 text-xs" onClick={apply} disabled={!value.trim()}>
          Apply
        </Button>
      </div>
    </div>
  );
}
