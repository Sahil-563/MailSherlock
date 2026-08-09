import { useEffect, useState } from "react";
import { runSizeOptions } from "../data/mockData";
import type { RunSize } from "../types";
import { cn } from "../../../lib/utils";

interface RunSizeSelectorProps {
  selected: RunSize | null;
  onSelect: (runSize: RunSize) => void;
}

export function RunSizeSelector({ onSelect, selected }: RunSizeSelectorProps) {
  const [customValue, setCustomValue] = useState("");
  const selectedCustom = selected?.kind === "custom";
  const parsedCustom = Number(customValue);
  const customValid = Number.isInteger(parsedCustom) && parsedCustom > 0;

  useEffect(() => {
    if (selected?.kind === "custom") {
      setCustomValue(String(selected.value));
    }
  }, [selected]);

  return (
    <fieldset>
      <legend className="sr-only">Run size</legend>
      <div className="flex flex-wrap gap-2">
        {runSizeOptions.map((option) => (
          <button
            key={`${option.kind}-${option.value}`}
            type="button"
            className={cn(
              "rounded-lg border px-4 py-2.5 font-mono text-sm transition",
              selected?.kind === option.kind && selected.value === option.value
                ? "border-app-primary bg-app-primary text-white"
                : "border-slate-300 bg-white text-app-soft hover:border-app-primary hover:text-app-primaryDark",
            )}
            onClick={() => onSelect(option)}
          >
            {option.label}
          </button>
        ))}
        <button
          type="button"
          className={cn(
            "rounded-lg border px-4 py-2.5 font-mono text-sm transition",
            selectedCustom
              ? "border-app-primary bg-app-primary text-white"
              : "border-slate-300 bg-white text-app-soft hover:border-app-primary hover:text-app-primaryDark",
          )}
          onClick={() => {
            const value = customValid ? parsedCustom : 1;
            setCustomValue(String(value));
            onSelect({ kind: "custom", value, label: `Custom - ${value.toLocaleString("en-US")}` });
          }}
        >
          Custom...
        </button>
      </div>
      {selectedCustom ? (
        <div className="mt-4 max-w-xs">
          <label htmlFor="custom-run-size" className="text-sm font-semibold text-app-text">
            Custom run size
          </label>
          <input
            id="custom-run-size"
            type="number"
            min={1}
            step={1}
            value={customValue}
            onChange={(event) => {
              const value = event.target.value;
              setCustomValue(value);
              const parsed = Number(value);

              if (Number.isInteger(parsed) && parsed > 0) {
                onSelect({ kind: "custom", value: parsed, label: `Custom - ${parsed.toLocaleString("en-US")}` });
              }
            }}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-app-text"
          />
          {!customValid ? <p className="mt-1 text-xs text-app-danger">Enter a positive whole number.</p> : null}
        </div>
      ) : null}
    </fieldset>
  );
}
