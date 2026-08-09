import type { SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "min-h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-app-text transition focus:border-app-primary",
        className,
      )}
      {...props}
    />
  );
}
