import { RotateCw } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import type { DataSource } from "../types";

interface SourceRowProps {
  source: DataSource;
  isRefreshing?: boolean;
  onRefresh?: (sourceId: string) => void;
}

export function SourceRow({ isRefreshing = false, onRefresh, source }: SourceRowProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 px-3 py-3 sm:flex-row sm:items-center">
      <Badge tone={source.type === "segment" ? "primary" : "warning"} className="w-fit font-mono uppercase">
        {source.type === "segment" ? "Segment" : "Query"}
      </Badge>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-app-text">{source.name}</div>
        <div className="font-mono text-xs text-app-faint">{source.userCount.toLocaleString("en-US")} users</div>
      </div>
      <div className="font-mono text-xs text-app-faint">{isRefreshing ? "Refreshing..." : source.lastRefreshed}</div>
      {onRefresh ? (
        <Button
          variant="ghost"
          className="h-8 min-h-8 px-2.5 py-1 text-xs"
          iconLeft={<RotateCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} aria-hidden="true" />}
          disabled={isRefreshing}
          onClick={() => onRefresh(source.id)}
        >
          Refresh
        </Button>
      ) : null}
    </div>
  );
}
