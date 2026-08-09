import { useEffect, useState } from "react";
import { Check, Pencil } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import { ProgressBar } from "../../../components/ui/ProgressBar";
import { Badge } from "../../../components/ui/Badge";
import { availableColumns } from "../data/mockData";
import type { Mapping } from "../types";

interface MappingRowProps {
  mapping: Mapping;
  isEditing: boolean;
  onEdit: (mappingId: string) => void;
  onCancel: () => void;
  onSave: (mappingId: string, sourceField: string) => void;
  onConfirm: (mappingId: string) => void;
}

export function MappingRow({ isEditing, mapping, onCancel, onConfirm, onEdit, onSave }: MappingRowProps) {
  const [draft, setDraft] = useState(mapping.sourceField);

  useEffect(() => {
    setDraft(mapping.sourceField);
  }, [mapping.sourceField, isEditing]);

  return (
    <tr className={mapping.manualOverride ? "bg-amber-50/60" : undefined}>
      <td className="whitespace-nowrap px-3 py-3 font-mono text-sm text-app-text">{mapping.mergeFieldKey}</td>
      <td className="min-w-[220px] px-3 py-3">
        {isEditing ? (
          <Select
            aria-label={`Source column for ${mapping.mergeFieldKey}`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="w-full"
          >
            {availableColumns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </Select>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm text-app-text">{mapping.sourceField}</span>
            {mapping.manualOverride ? <Badge tone="warning">Manual override</Badge> : null}
          </div>
        )}
      </td>
      <td className="min-w-[150px] px-3 py-3">
        {mapping.manualOverride ? (
          <Badge tone="warning">Manual override</Badge>
        ) : (
          <div className="flex items-center gap-2">
            <ProgressBar value={mapping.confidence} className="h-1.5 w-16" />
            <span className="font-mono text-xs text-app-soft">{mapping.confidence}%</span>
          </div>
        )}
      </td>
      <td className="min-w-[190px] px-3 py-3">
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="primary" className="h-8 min-h-8 px-3 py-1 text-xs" onClick={() => onSave(mapping.id, draft)}>
              Save
            </Button>
            <Button variant="secondary" className="h-8 min-h-8 px-3 py-1 text-xs" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              className="h-8 min-h-8 px-3 py-1 text-xs"
              iconLeft={<Pencil className="h-3.5 w-3.5" aria-hidden="true" />}
              onClick={() => onEdit(mapping.id)}
            >
              Edit
            </Button>
            <Button
              variant={mapping.confirmed ? "success" : "secondary"}
              className="h-8 min-h-8 px-3 py-1 text-xs"
              iconLeft={mapping.confirmed ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : undefined}
              disabled={mapping.confirmed}
              onClick={() => onConfirm(mapping.id)}
            >
              {mapping.confirmed ? "Confirmed" : "Confirm"}
            </Button>
          </div>
        )}
      </td>
    </tr>
  );
}
