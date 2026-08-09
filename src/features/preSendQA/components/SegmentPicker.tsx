import { mockSegments } from "../data/mockData";

interface SegmentPickerProps {
  selectedSegmentId: string | null;
  onSelect: (segmentId: string) => void;
}

export function SegmentPicker({ onSelect, selectedSegmentId }: SegmentPickerProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="mb-3 text-sm font-semibold text-app-text">Select a Braze segment</legend>
      {mockSegments.map((segment) => {
        const selected = selectedSegmentId === segment.id;

        return (
          <label
            key={segment.id}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 transition ${
              selected ? "border-app-primary bg-indigo-50" : "border-slate-200 bg-white hover:border-app-primary"
            }`}
          >
            <input
              type="radio"
              name="segment"
              className="h-4 w-4 accent-app-primary"
              checked={selected}
              onChange={() => onSelect(segment.id)}
            />
            <span className="text-sm font-medium text-app-text">{segment.name}</span>
          </label>
        );
      })}
    </fieldset>
  );
}
