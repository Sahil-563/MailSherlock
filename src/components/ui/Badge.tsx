import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type BadgeTone = "neutral" | "primary" | "success" | "danger" | "warning";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-slate-100 text-app-soft",
  primary: "bg-indigo-50 text-app-primaryDark",
  success: "bg-emerald-50 text-app-success",
  danger: "bg-red-50 text-app-danger",
  warning: "bg-amber-50 text-app-warning",
};

export function Badge({ children, className, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
