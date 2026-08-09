import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ProgressBar } from "../../../components/ui/ProgressBar";
import { Select } from "../../../components/ui/Select";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { querySql } from "../data/mockData";
import { mockRunMapping } from "../services/mockServices";
import { setMappings, setSelectedCachedSource, setSourceTab } from "../store/preSendQASlice";
import {
  selectCachedSources,
  selectMappingRevealed,
  selectMappings,
  selectPreSendQA,
  selectSelectedCachedSource,
} from "../store/selectors";
import { MappingTable } from "../components/MappingTable";

export function MappingScreen() {
  const dispatch = useAppDispatch();
  const workflow = useAppSelector(selectPreSendQA);
  const sources = useAppSelector(selectCachedSources);
  const selectedSource = useAppSelector(selectSelectedCachedSource);
  const mappings = useAppSelector(selectMappings);
  const mappingRevealed = useAppSelector(selectMappingRevealed);
  const [mappingStage, setMappingStage] = useState<string | null>(null);
  const [mappingProgress, setMappingProgress] = useState(0);
  const mappingRunning = mappingStage !== null && mappingProgress < 100;

  const runQueryMapping = async () => {
    setMappingStage(null);
    setMappingProgress(0);
    const generated = await mockRunMapping((stage, progress) => {
      setMappingStage(stage);
      setMappingProgress(progress);
    });
    dispatch(setMappings(generated));
  };

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-app-ink">
        Choose a data source, then confirm the mapping
      </h2>
      <p className="mt-1 text-sm leading-6 text-app-soft">
        One source configured for this workspace - SQL Server, or a previously exported Braze segment.
      </p>

      <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Mapping source">
        <button
          type="button"
          role="tab"
          aria-selected={workflow.sourceTab === "cached"}
          className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
            workflow.sourceTab === "cached"
              ? "border-app-primary bg-app-primary text-white"
              : "border-slate-300 bg-white text-app-soft hover:border-app-primary"
          }`}
          onClick={() => dispatch(setSourceTab("cached"))}
        >
          Use cached data
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={workflow.sourceTab === "query"}
          className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
            workflow.sourceTab === "query"
              ? "border-app-primary bg-app-primary text-white"
              : "border-slate-300 bg-white text-app-soft hover:border-app-primary"
          }`}
          onClick={() => dispatch(setSourceTab("query"))}
        >
          Write your own query
        </button>
      </div>

      {workflow.sourceTab === "cached" ? (
        <div className="mt-5">
          <label htmlFor="cached-source" className="sr-only">
            Select a cached source
          </label>
          <Select
            id="cached-source"
            className="w-full"
            value={workflow.selectedCachedSourceId ?? ""}
            onChange={(event) => {
              if (event.target.value) {
                dispatch(setSelectedCachedSource(event.target.value));
              }
            }}
          >
            <option value="">Select a cached source...</option>
            {sources.map((source) => (
              <option key={source.id} value={source.id}>
                [{source.type === "segment" ? "Segment" : "Query"}] {source.name} - refreshed {source.lastRefreshed}
              </option>
            ))}
          </Select>
          {selectedSource ? (
            <p className="mt-3 font-mono text-xs text-app-faint">
              Data as of: {selectedSource.name} - refreshed {selectedSource.lastRefreshed}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="mt-5">
          <pre className="overflow-x-auto rounded-xl bg-app-code p-4 font-mono text-sm leading-7 text-slate-100">
            <code>{querySql}</code>
          </pre>
          <Button
            variant="primary"
            iconRight={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
            disabled={mappingRunning}
            onClick={runQueryMapping}
          >
            Run mapping
          </Button>
          {mappingStage ? (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-app-text">{mappingStage}</span>
                <span className="font-mono text-app-soft">{mappingProgress}%</span>
              </div>
              <ProgressBar value={mappingProgress} />
            </div>
          ) : null}
        </div>
      )}

      {mappingRevealed ? <MappingTable mappings={mappings} /> : null}

      {!mappingRevealed ? (
        <EmptyState
          className="mt-5"
          title="No mapping generated yet"
          description={
            workflow.sourceTab === "cached"
              ? "Choose a cached source to reveal suggested mappings."
              : "Run the mock query mapping to analyze columns."
          }
        />
      ) : null}

      {workflow.sourceTab === "query" && workflow.queryResultSaved ? (
        <div className="mt-4 rounded-lg bg-emerald-50 px-3 py-3 text-sm font-semibold text-app-success">
          This result has been saved for reuse - it'll appear under "Use cached data" next time.
        </div>
      ) : null}
    </div>
  );
}
