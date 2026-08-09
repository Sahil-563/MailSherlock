import type { ReactNode } from "react";

interface StepCardProps {
  chromeLabel: string;
  children: ReactNode;
}

export function StepCard({ children, chromeLabel }: StepCardProps) {
  return (
    <section className="overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-panel">
      <div className="flex items-center justify-between border-b border-slate-200 bg-app-chrome px-4 py-2.5 font-mono text-xs text-app-faint">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-slate-300" />
          <span className="h-2 w-2 rounded-full bg-slate-300" />
          <span className="h-2 w-2 rounded-full bg-slate-300" />
        </div>
        <span>{chromeLabel}</span>
      </div>
      <div className="screen-enter p-5 sm:p-6">{children}</div>
    </section>
  );
}
