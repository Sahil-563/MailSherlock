import { Badge } from "../../../components/ui/Badge";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setRunSize } from "../store/preSendQASlice";
import {
  selectMappings,
  selectPreSendQA,
  selectRules,
  selectRunSize,
  selectSelectedCachedSource,
} from "../store/selectors";
import { RunSizeSelector } from "../components/RunSizeSelector";

export function RunSizeScreen() {
  const dispatch = useAppDispatch();
  const selectedSource = useAppSelector(selectSelectedCachedSource);
  const workflow = useAppSelector(selectPreSendQA);
  const runSize = useAppSelector(selectRunSize);
  const mappings = useAppSelector(selectMappings);
  const rules = useAppSelector(selectRules);
  const dataAsOf = selectedSource
    ? `${selectedSource.name} - refreshed ${selectedSource.lastRefreshed}`
    : workflow.sourceTab === "query"
      ? "Custom query result - refreshed just now"
      : "Loyalty Program Members - refreshed just now";

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-app-ink">Choose the run size</h2>
      <p className="mt-1 text-sm leading-6 text-app-soft">Pick how many targeted users to validate against.</p>
      <p className="mt-4 font-mono text-xs text-app-faint">Data as of: {dataAsOf}</p>

      <div className="mt-5">
        <RunSizeSelector selected={runSize} onSelect={(size) => dispatch(setRunSize(size))} />
      </div>

      <div className="mt-7 border-t border-slate-200 pt-5">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-app-faint">Rules applied</div>
        <div className="space-y-3">
          {mappings.map((mapping) => {
            const fieldRules = rules[mapping.mergeFieldKey] ?? [];

            return (
              <div key={mapping.id} className="grid gap-2 rounded-lg border border-slate-200 bg-white p-3 sm:grid-cols-[220px_1fr]">
                <div className="font-mono text-sm font-semibold text-app-text">{mapping.mergeFieldKey}</div>
                <div className="flex flex-wrap gap-2">
                  {fieldRules.length ? (
                    fieldRules.map((rule) => (
                      <Badge key={rule.id} tone="primary" className="font-mono">
                        {rule.label}
                      </Badge>
                    ))
                  ) : (
                    <Badge tone="danger">no rules</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
