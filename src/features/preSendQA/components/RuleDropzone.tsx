import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Plus, X } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { useAppDispatch } from "../../../store/hooks";
import { addRule, removeRule } from "../store/preSendQASlice";
import { ruleLabels, ruleToolbox } from "../data/mockData";
import type { ValidationRule, ValidationRuleType } from "../types";
import { RuleEditor } from "./RuleEditor";
import { cn } from "../../../lib/utils";

interface RuleDropzoneProps {
  fieldKey: string;
  rules: ValidationRule[];
  isDragging?: boolean;
}

type EditorState = {
  type: Extract<ValidationRuleType, "enum" | "regex">;
} | null;

export function RuleDropzone({ fieldKey, isDragging = false, rules }: RuleDropzoneProps) {
  const dispatch = useAppDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editor, setEditor] = useState<EditorState>(null);
  const { isOver, setNodeRef } = useDroppable({
    id: `field-${fieldKey}`,
    data: { fieldKey },
  });

  const incomplete = rules.length === 0;

  const addRuleByType = (type: ValidationRuleType) => {
    setMenuOpen(false);

    if (type === "enum" || type === "regex") {
      setEditor({ type });
      return;
    }

    dispatch(
      addRule({
        fieldKey,
        type,
        label: ruleLabels[type],
      }),
    );
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-xl border p-4 transition",
        isOver && "border-app-primary bg-indigo-50",
        !isOver && incomplete && "border-dashed border-app-danger bg-red-50/40",
        !isOver && !incomplete && "border-slate-200 bg-white",
        isDragging && !isOver && "border-dashed",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-mono text-sm font-semibold text-app-text">{fieldKey}</div>
          {incomplete ? <div className="mt-1 text-xs text-app-danger">Needs at least one rule</div> : null}
        </div>
        <div className="relative">
          <Button
            variant="secondary"
            className="h-8 min-h-8 w-8 rounded-full px-0 py-0"
            aria-label={`Add rule for ${fieldKey}`}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </Button>
          {menuOpen ? (
            <div className="absolute right-0 top-10 z-20 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-panel">
              {ruleToolbox.map((rule) => (
                <button
                  key={rule.type}
                  type="button"
                  className="block w-full px-3 py-2 text-left font-mono text-sm text-app-text hover:bg-indigo-50 hover:text-app-primaryDark"
                  onClick={() => addRuleByType(rule.type)}
                >
                  {rule.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex min-h-8 flex-wrap gap-2">
        {rules.length ? (
          rules.map((rule) => (
            <Badge key={rule.id} tone="primary" className="gap-1.5 font-mono">
              {rule.label}
              <button
                type="button"
                aria-label={`Remove ${rule.label} from ${fieldKey}`}
                className="rounded-full p-0.5 text-app-primaryDark/70 hover:bg-white hover:text-app-primaryDark"
                onClick={() => dispatch(removeRule({ fieldKey, ruleId: rule.id }))}
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </Badge>
          ))
        ) : (
          <span className="text-sm italic text-app-faint">Drop a rule here, or use +</span>
        )}
      </div>

      {editor ? (
        <RuleEditor
          fieldKey={fieldKey}
          type={editor.type}
          onCancel={() => setEditor(null)}
          onApply={(label, payload) => {
            dispatch(
              addRule({
                fieldKey,
                type: editor.type,
                label,
                values: payload.values,
                pattern: payload.pattern,
              }),
            );
            setEditor(null);
          }}
        />
      ) : null}
    </div>
  );
}
