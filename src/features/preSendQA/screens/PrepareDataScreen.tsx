import { useState } from "react";
import { ArrowRight, CheckCircle2, Database, FastForward } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { ProgressBar } from "../../../components/ui/ProgressBar";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  addCachedSource,
  refreshCachedSource,
  setPrepChoice,
  setSelectedSegment,
} from "../store/preSendQASlice";
import { selectCachedSources, selectPreSendQA } from "../store/selectors";
import { mockSegments } from "../data/mockData";
import { mockExportSegment, mockRefreshSnapshot } from "../services/mockServices";
import { SourceRow } from "../components/SourceRow";
import { SegmentPicker } from "../components/SegmentPicker";

export function PrepareDataScreen() {
  const dispatch = useAppDispatch();
  const workflow = useAppSelector(selectPreSendQA);
  const cachedSources = useAppSelector(selectCachedSources);
  const [exportStage, setExportStage] = useState<string | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportDoneName, setExportDoneName] = useState<string | null>(null);
  const [refreshingSourceId, setRefreshingSourceId] = useState<string | null>(null);

  const selectedSegment = mockSegments.find((segment) => segment.id === workflow.selectedSegmentForExport);
  const exporting = exportStage !== null && exportProgress < 100;

  const runExport = async () => {
    if (!selectedSegment || exporting) {
      return;
    }

    setExportDoneName(null);
    await mockExportSegment((stage, progress) => {
      setExportStage(stage);
      setExportProgress(progress);
    });

    dispatch(
      addCachedSource({
        id: selectedSegment.id === "segment-loyalty" ? "src-loyalty-segment" : `src-${selectedSegment.id}`,
        type: "segment",
        name: selectedSegment.name,
        lastRefreshed: "just now",
        userCount: 42318,
      }),
    );
    setExportDoneName(selectedSegment.name);
  };

  const refreshSource = async (sourceId: string) => {
    setRefreshingSourceId(sourceId);
    const lastRefreshed = await mockRefreshSnapshot();
    dispatch(refreshCachedSource({ sourceId, lastRefreshed }));
    setRefreshingSourceId(null);
  };

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-app-ink">Prepare your data sources</h2>
      <p className="mt-1 text-sm leading-6 text-app-soft">
        Optional - export a Braze segment now, or skip straight to validating a canvas. Revisit this anytime.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <button
          type="button"
          className={`rounded-xl border p-4 text-left transition ${
            workflow.selectedPrepChoice === "export"
              ? "border-app-primary bg-indigo-50 shadow-glow"
              : "border-slate-200 bg-white hover:border-app-primary hover:bg-indigo-50"
          }`}
          onClick={() => dispatch(setPrepChoice("export"))}
        >
          <Database className="mb-3 h-5 w-5 text-app-primaryDark" aria-hidden="true" />
          <span className="block text-sm font-semibold text-app-text">Export a Braze segment</span>
          <span className="mt-1 block text-sm text-app-faint">
            Pull attribute data directly from Braze, saved for reuse
          </span>
        </button>

        <button
          type="button"
          disabled={true}
          className={`rounded-xl border p-4 text-left transition ${
            workflow.selectedPrepChoice === "skip"
              ? "border-app-primary bg-indigo-50 shadow-glow"
              : "border-slate-200 bg-white hover:border-app-primary hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
          }`}
          onClick={() => dispatch(setPrepChoice("skip"))}
        >
          <FastForward className="mb-3 h-5 w-5 text-app-primaryDark" aria-hidden="true" />
          <span className="block text-sm font-semibold text-app-text">Skip - go straight to QA</span>
          <span className="mt-1 block text-sm text-app-faint">Use an existing source, or write a query later</span>
        </button>
      </div>

      {workflow.selectedPrepChoice === "export" ? (
        <div className="mt-6 border-t border-slate-200 pt-5">
          <SegmentPicker
            selectedSegmentId={workflow.selectedSegmentForExport}
            onSelect={(segmentId) => dispatch(setSelectedSegment(segmentId))}
          />
          <div className="mt-4">
            <Button
              variant="primary"
              iconRight={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
              disabled={!selectedSegment || exporting}
              onClick={runExport}
            >
              Export segment
            </Button>
          </div>
          {exportStage ? (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-app-text">{exportStage}</span>
                <span className="font-mono text-app-soft">{exportProgress}%</span>
              </div>
              <ProgressBar value={exportProgress} />
            </div>
          ) : null}
          {exportDoneName ? (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-3 text-sm font-semibold text-app-success">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Saved - "{exportDoneName}" is now available as a data source
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-7">
        <h3 className="text-sm font-semibold text-app-text">Available data sources</h3>
        <div className="mt-3 space-y-2">
          {cachedSources.map((source) => (
            <SourceRow
              key={source.id}
              source={source}
              isRefreshing={refreshingSourceId === source.id}
              onRefresh={refreshSource}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
