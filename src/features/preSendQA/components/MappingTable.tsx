import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { useAppDispatch } from "../../../store/hooks";
import { confirmAllMappings, confirmMapping, editMapping } from "../store/preSendQASlice";
import type { Mapping } from "../types";
import { MappingRow } from "./MappingRow";

interface MappingTableProps {
  mappings: Mapping[];
}

export function MappingTable({ mappings }: MappingTableProps) {
  const dispatch = useAppDispatch();
  const [editingMappingId, setEditingMappingId] = useState<string | null>(null);

  if (!mappings.length) {
    return null;
  }

  return (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse">
        <thead>
          <tr className="border-b border-slate-200 text-left">
            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-app-faint">Merge field</th>
            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-app-faint">
              Source field / column
            </th>
            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-app-faint">Confidence</th>
            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-app-faint">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mappings.map((mapping) => (
            <MappingRow
              key={mapping.id}
              mapping={mapping}
              isEditing={editingMappingId === mapping.id}
              onEdit={setEditingMappingId}
              onCancel={() => setEditingMappingId(null)}
              onSave={(mappingId, sourceField) => {
                dispatch(editMapping({ mappingId, sourceField }));
                setEditingMappingId(null);
              }}
              onConfirm={(mappingId) => dispatch(confirmMapping(mappingId))}
            />
          ))}
        </tbody>
      </table>
      <div className="mt-3 flex justify-end">
        <Button variant="ghost" className="text-xs" onClick={() => dispatch(confirmAllMappings())}>
          Confirm all mappings
        </Button>
      </div>
    </div>
  );
}
