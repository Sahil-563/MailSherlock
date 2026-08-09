import { useState } from "react";
import { DndContext, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { addRule } from "../store/preSendQASlice";
import { selectMappings, selectRules, selectSupportedExtractedFields } from "../store/selectors";
import { ruleLabels } from "../data/mockData";
import type { ValidationRuleType } from "../types";
import { RuleDropzone } from "../components/RuleDropzone";
import { RuleToolbox } from "../components/RuleToolbox";

const isValidationRuleType = (value: unknown): value is ValidationRuleType =>
  value === "notNull" || value === "numeric" || value === "date" || value === "enum" || value === "regex";

export function ValidationRulesScreen() {
  const dispatch = useAppDispatch();
  const mappings = useAppSelector(selectMappings);
  const supportedFields = useAppSelector(selectSupportedExtractedFields);
  const rules = useAppSelector(selectRules);
  const [dragging, setDragging] = useState(false);
  const fieldKeys = mappings.length ? mappings.map((mapping) => mapping.mergeFieldKey) : supportedFields.map((field) => field.key);

  const handleDragStart = (_event: DragStartEvent) => {
    setDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setDragging(false);
    const type = event.active.data.current?.type;
    const fieldKey = event.over?.data.current?.fieldKey;

    if (!isValidationRuleType(type) || typeof fieldKey !== "string") {
      return;
    }

    if (type === "enum" || type === "regex") {
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
    <div>
      <h2 className="font-serif text-2xl font-semibold text-app-ink">Apply validation rules</h2>
      <p className="mt-1 text-sm leading-6 text-app-soft">
        Drag a rule from the toolbox onto a field, or use + for a menu. Every field needs at least one rule.
      </p>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={() => setDragging(false)}>
        <div className="mt-5">
          <RuleToolbox />
        </div>

        <div className="mt-6 space-y-3">
          {fieldKeys.map((fieldKey) => (
            <RuleDropzone
              key={fieldKey}
              fieldKey={fieldKey}
              rules={rules[fieldKey] ?? []}
              isDragging={dragging}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
