export type WorkflowStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type PrepChoice = "export" | "skip";

export type SourceTab = "cached" | "query";

export type DataSourceType = "segment" | "query";

export interface DataSource {
  id: string;
  type: DataSourceType;
  name: string;
  lastRefreshed: string;
  userCount: number;
}

export interface Segment {
  id: string;
  name: string;
}

export interface Canvas {
  id: string;
  name: string;
  kind: "Canvas" | "Campaign";
  status: string;
  stepsCount?: number;
  selectable: boolean;
  unavailableReason?: string;
}

export type CanvasStepType = "decision" | "message";

export interface CanvasStep {
  id: string;
  name: string;
  type: CanvasStepType;
  channel?: "Email" | "SMS";
  stepLabel?: string;
  selectable: boolean;
  unavailableReason?: string;
}

export interface Message {
  id: string;
  name: string;
  channel: "Email" | "SMS";
  stepLabel: string;
}

export type ExtractedFieldType = "attribute" | "event" | "connected_content";

export interface ExtractedField {
  id: string;
  path: string;
  key: string;
  type: ExtractedFieldType;
  supported: boolean;
}

export interface Mapping {
  id: string;
  mergeFieldId: string;
  mergeFieldKey: string;
  sourceField: string;
  originalSourceField: string;
  confidence: number;
  confirmed: boolean;
  manualOverride: boolean;
}

export type ValidationRuleType = "notNull" | "numeric" | "date" | "enum" | "regex";

export interface ValidationRule {
  id: string;
  fieldKey: string;
  type: ValidationRuleType;
  label: string;
  values?: string[];
  pattern?: string;
}

export type RunSize =
  | { kind: "all"; value: number; label: string }
  | { kind: "preset"; value: number; label: string }
  | { kind: "custom"; value: number; label: string };

export type RunStatus = "idle" | "running" | "completed";

export interface FailureGroup {
  id: string;
  count: number;
  reason: string;
  impact: string;
}

export interface ValidationResults {
  passed: number;
  failed: number;
  passRate: string;
  failureGroups: FailureGroup[];
}

export interface PreSendQAState {
  maxUnlockedStep: WorkflowStep;
  selectedPrepChoice: PrepChoice | null;
  selectedSegmentForExport: string | null;
  cachedSources: DataSource[];
  selectedCachedSourceId: string | null;
  selectedCanvas: Canvas | null;
  selectedMessage: Message | null;
  extractedFields: ExtractedField[];
  sourceTab: SourceTab;
  mapping: Mapping[];
  mappingRevealed: boolean;
  queryResultSaved: boolean;
  rules: Record<string, ValidationRule[]>;
  runSize: RunSize | null;
  runStatus: RunStatus;
  runProgress: number;
  runStage: string | null;
  validationResults: ValidationResults | null;
}
