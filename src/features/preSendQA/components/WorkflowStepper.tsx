import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { workflowSteps } from "../data/mockData";
import type { WorkflowStep } from "../types";
import { cn } from "../../../lib/utils";

interface WorkflowStepperProps {
  activeStep: WorkflowStep;
  maxUnlockedStep: WorkflowStep;
}

export function WorkflowStepper({ activeStep, maxUnlockedStep }: WorkflowStepperProps) {
  const navigate = useNavigate();

  return (
    <nav aria-label="Workflow steps" className="-mx-2 overflow-x-auto px-2 pb-1">
      <ol className="flex min-w-[700px] items-start">
        {workflowSteps.map((step) => {
          const isActive = step.id === activeStep;
          const isDone = step.id < maxUnlockedStep && !isActive;
          const isLocked = step.id > maxUnlockedStep;
          const isClickable = !isLocked;

          return (
            <li key={step.id} className="relative flex flex-1 flex-col items-center">
              {step.id < workflowSteps.length ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-1/2 top-[15px] h-px w-full",
                    isDone ? "bg-app-success" : "bg-slate-300",
                  )}
                />
              ) : null}
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => navigate(`/pre-send-qa/step/${step.id}`)}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 font-mono text-xs font-bold transition",
                  isActive && "border-app-primary bg-app-primary text-white shadow-glow",
                  isDone && "border-app-success bg-emerald-50 text-app-success hover:bg-emerald-100",
                  !isActive && !isDone && !isLocked && "border-slate-300 bg-white text-app-soft hover:border-app-primary",
                  isLocked && "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-300",
                )}
              >
                {isDone ? <Check className="h-4 w-4" aria-hidden="true" /> : step.id}
              </button>
              <span
                className={cn(
                  "mt-2 max-w-20 text-center text-[11px] font-medium",
                  isActive && "text-app-primaryDark",
                  isDone && "text-app-soft",
                  isLocked && "text-app-faint",
                )}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
