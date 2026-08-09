import { useCallback, useEffect, useRef } from "react";
import { RotateCcw, Rocket } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  resetWorkflow,
  setRunProgress,
  setRunStatus,
  setValidationResults,
} from "../store/preSendQASlice";
import {
  selectPreSendQA,
  selectRunProgress,
  selectRunStage,
  selectRunStatus,
  selectSelectedCachedSource,
  selectValidationResults,
} from "../store/selectors";
import { mockRunValidation } from "../services/mockServices";
import { ValidationProgress } from "../components/ValidationProgress";
import { ValidationResults } from "../components/ValidationResults";
import { useNavigate } from "react-router-dom";

export function RunValidationScreen() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const workflow = useAppSelector(selectPreSendQA);
  const selectedSource = useAppSelector(selectSelectedCachedSource);
  const runStatus = useAppSelector(selectRunStatus);
  const runProgress = useAppSelector(selectRunProgress);
  const runStage = useAppSelector(selectRunStage);
  const results = useAppSelector(selectValidationResults);
  const resumedRunning = useRef(false);
  const dataAsOf = selectedSource
    ? `${selectedSource.name} - refreshed ${selectedSource.lastRefreshed}`
    : workflow.sourceTab === "query"
      ? "Custom query result - refreshed just now"
      : "Loyalty Program Members - refreshed just now";

  const runValidation = useCallback(async () => {
    dispatch(setRunStatus("running"));
    dispatch(setRunProgress({ progress: 0, stage: "Preparing validation..." }));
    const validationResults = await mockRunValidation((stage, progress) => {
      dispatch(setRunProgress({ stage, progress }));
    });
    dispatch(setValidationResults(validationResults));
  }, [dispatch]);

  useEffect(() => {
    if (runStatus === "running" && !resumedRunning.current) {
      resumedRunning.current = true;
      void runValidation();
    }
  }, [runStatus, runValidation]);

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-app-ink">Run the validation</h2>
      <p className="mt-1 text-sm leading-6 text-app-soft">
        {runStatus === "completed" ? "Validation complete." : "Ready to validate against the selected audience."}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge tone="primary">Source: {dataAsOf}</Badge>
        {workflow.runSize ? <Badge>Run size: {workflow.runSize.label}</Badge> : null}
      </div>

      {runStatus === "idle" ? (
        <div className="mt-6">
          <Button variant="primary" iconLeft={<Rocket className="h-4 w-4" aria-hidden="true" />} onClick={runValidation}>
            Run validation
          </Button>
        </div>
      ) : null}

      {runStatus === "running" ? (
        <div className="mt-6">
          <ValidationProgress progress={runProgress} stage={runStage} />
        </div>
      ) : null}

      {runStatus === "completed" && results ? (
        <div className="mt-6">
          <ValidationResults results={results} dataAsOf={dataAsOf} />
          <div className="mt-6">
            <Button
              variant="ghost"
              iconLeft={<RotateCcw className="h-4 w-4" aria-hidden="true" />}
              onClick={() => {
                dispatch(resetWorkflow());
                navigate("/pre-send-qa/step/1");
              }}
            >
              Start over
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
