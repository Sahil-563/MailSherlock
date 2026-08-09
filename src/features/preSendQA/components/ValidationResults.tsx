import { Download } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { formatNumber } from "../../../lib/utils";
import type { ValidationResults as ValidationResultsType } from "../types";

interface ValidationResultsProps {
  results: ValidationResultsType;
  dataAsOf: string;
}

export function ValidationResults({ dataAsOf, results }: ValidationResultsProps) {
  const [exportStatus, setExportStatus] = useState<"idle" | "preparing" | "ready">("idle");

  const exportFailures = () => {
    setExportStatus("preparing");
    window.setTimeout(() => setExportStatus("ready"), 700);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
          <div className="font-mono text-2xl font-semibold text-app-success">{formatNumber(results.passed)}</div>
          <div className="text-sm text-app-soft">Passed</div>
        </div>
        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <div className="font-mono text-2xl font-semibold text-app-danger">{formatNumber(results.failed)}</div>
          <div className="text-sm text-app-soft">Failed</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="font-mono text-2xl font-semibold text-app-text">{results.passRate}</div>
          <div className="text-sm text-app-soft">Pass rate</div>
        </div>
      </div>

      <div className="font-mono text-xs text-app-faint">Data as of: {dataAsOf}</div>

      <div className="space-y-3">
        {results.failureGroups.map((group) => (
          <div key={group.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-mono text-xl font-semibold text-app-danger">{formatNumber(group.count)}</div>
                <div className="mt-1 text-sm font-semibold text-app-text">{group.reason}</div>
              </div>
              <Badge>{group.impact}</Badge>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="secondary"
          iconLeft={<Download className="h-4 w-4" aria-hidden="true" />}
          disabled={exportStatus === "preparing"}
          onClick={exportFailures}
        >
          Export 1,112 failing records
        </Button>
        {exportStatus === "preparing" ? <span className="text-sm text-app-soft">Preparing export...</span> : null}
        {exportStatus === "ready" ? <Badge tone="success">Export ready</Badge> : null}
      </div>
    </div>
  );
}
