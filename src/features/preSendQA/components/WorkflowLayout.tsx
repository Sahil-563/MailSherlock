import type { ReactNode } from "react";
import { Navigate, useParams } from "react-router-dom";
import { workflowSteps } from "../data/mockData";
import { useAppSelector } from "../../../store/hooks";
import { selectMaxUnlockedStep } from "../store/selectors";
import type { WorkflowStep } from "../types";
import { StepCard } from "./StepCard";
import { StepNavigation } from "./StepNavigation";
import { ThemeToggle } from "./ThemeToggle";
import { WorkflowStepper } from "./WorkflowStepper";

interface WorkflowLayoutProps {
  children: ReactNode;
  currentStep: WorkflowStep;
}

const toWorkflowStep = (value: string | undefined): WorkflowStep | null => {
  const parsed = Number(value);
  return parsed >= 1 && parsed <= 8 ? (parsed as WorkflowStep) : null;
};

export function WorkflowRouteGuard({
  children,
}: {
  children: (step: WorkflowStep) => ReactNode;
}) {
  const params = useParams();
  const currentStep = toWorkflowStep(params.stepId);
  const maxUnlockedStep = useAppSelector(selectMaxUnlockedStep);

  if (!currentStep) {
    return <Navigate to="/pre-send-qa/step/1" replace />;
  }

  if (currentStep > maxUnlockedStep) {
    return <Navigate to={`/pre-send-qa/step/${maxUnlockedStep}`} replace />;
  }

  return <>{children(currentStep)}</>;
}

export function WorkflowLayout({ children, currentStep }: WorkflowLayoutProps) {
  const maxUnlockedStep = useAppSelector(selectMaxUnlockedStep);
  const chromeLabel =
    workflowSteps.find((step) => step.id === currentStep)?.chrome ??
    "Pre-Send QA";

  return (
    <main className="min-h-screen bg-app-bg px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-app-primaryDark">
              Internal SaaS workflow
            </div>
            <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight text-app-ink sm:text-[34px]">
              Pre-Send QA
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-app-soft">
              Validate Braze message personalization against targeted audience
              data before anything goes live.
            </p>
          </div>
          {/* <ThemeToggle /> */}
        </div>

        <WorkflowStepper
          activeStep={currentStep}
          maxUnlockedStep={maxUnlockedStep}
        />

        <StepCard chromeLabel={chromeLabel}>{children}</StepCard>
        <StepNavigation currentStep={currentStep} />
      </div>
    </main>
  );
}
