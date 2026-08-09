import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectCanContinue, selectRunStatus } from "../store/selectors";
import { unlockStep } from "../store/preSendQASlice";
import type { WorkflowStep } from "../types";

interface StepNavigationProps {
  currentStep: WorkflowStep;
}

export function StepNavigation({ currentStep }: StepNavigationProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const canContinue = useAppSelector((state) => selectCanContinue(state, currentStep));
  const runStatus = useAppSelector(selectRunStatus);
  const previousStep = (currentStep - 1) as WorkflowStep;
  const nextStep = (currentStep + 1) as WorkflowStep;

  return (
    <div className="mt-5 flex items-center justify-between gap-3">
      <Button
        variant="ghost"
        iconLeft={<ArrowLeft className="h-4 w-4" aria-hidden="true" />}
        disabled={currentStep === 1}
        onClick={() => navigate(`/pre-send-qa/step/${previousStep}`)}
      >
        Back
      </Button>

      {currentStep < 8 ? (
        <Button
          variant="primary"
          iconRight={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
          disabled={!canContinue}
          onClick={() => {
            dispatch(unlockStep(nextStep));
            navigate(`/pre-send-qa/step/${nextStep}`);
          }}
        >
          Continue
        </Button>
      ) : (
        <Button
          variant={runStatus === "completed" ? "success" : "secondary"}
          iconLeft={<CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
          disabled={runStatus !== "completed"}
        >
          {runStatus === "completed" ? "Complete" : "Run required"}
        </Button>
      )}
    </div>
  );
}
