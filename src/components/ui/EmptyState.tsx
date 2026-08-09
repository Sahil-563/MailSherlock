import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ action, className, description, title }: EmptyStateProps) {
  return (
    <div className={cn("rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5", className)}>
      <h3 className="text-sm font-semibold text-app-text">{title}</h3>
      <p className="mt-1 text-sm text-app-soft">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
