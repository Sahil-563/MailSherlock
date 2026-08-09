import type {
  Canvas,
  CanvasStep,
  DataSource,
  ExtractedField,
  FailureGroup,
  Mapping,
  Message,
  RunSize,
  Segment,
  ValidationResults,
  ValidationRule,
  ValidationRuleType,
  WorkflowStep,
} from "../types";

export const workflowSteps: Array<{ id: WorkflowStep; label: string; chrome: string }> = [
  { id: 1, label: "Prepare", chrome: "Step 1: data sources" },
  { id: 2, label: "Select", chrome: "Step 2: canvases & campaigns" },
  { id: 3, label: "Message", chrome: "Step 3: step graph" },
  { id: 4, label: "Fields", chrome: "Step 4: extracted fields" },
  { id: 5, label: "Map", chrome: "Step 5: mapping workspace" },
  { id: 6, label: "Rules", chrome: "Step 6: rule toolbox" },
  { id: 7, label: "Size", chrome: "Step 7: run configuration" },
  { id: 8, label: "Run", chrome: "Step 8: validation run" },
];

export const mockSegments: Segment[] = [
  { id: "segment-loyalty", name: "Loyalty Program Members" },
  { id: "segment-renewal-window", name: "Renewal Window - 30 Days" },
  { id: "segment-active-users", name: "All Active Users" },
];

export const initialCachedSources: DataSource[] = [
  {
    id: "src-loyalty-segment",
    type: "segment",
    name: "Loyalty Program Members",
    lastRefreshed: "2 days ago",
    userCount: 42318,
  },
];

export const mockCanvases: Canvas[] = [
  {
    id: "canvas-loyalty-renewal",
    name: "Loyalty Renewal Reminder",
    kind: "Canvas",
    status: "Live",
    stepsCount: 3,
    selectable: true,
  },
  {
    id: "canvas-cart-abandonment",
    name: "Cart Abandonment Nudge",
    kind: "Canvas",
    status: "demo unavailable",
    selectable: false,
    unavailableReason: "demo unavailable",
  },
  {
    id: "canvas-weekly-digest",
    name: "Weekly Digest",
    kind: "Canvas",
    status: "demo unavailable",
    selectable: false,
    unavailableReason: "demo unavailable",
  },
  {
    id: "canvas-winback",
    name: "Win-back Offer",
    kind: "Canvas",
    status: "demo unavailable",
    selectable: false,
    unavailableReason: "demo unavailable",
  },
];

export const mockCanvasSteps: CanvasStep[] = [
  {
    id: "decision-split",
    name: "Decision Split",
    type: "decision",
    selectable: false,
  },
  {
    id: "message-email-step-2",
    name: "Email",
    type: "message",
    channel: "Email",
    stepLabel: "Step 2",
    selectable: true,
  },
  {
    id: "message-sms",
    name: "SMS",
    type: "message",
    channel: "SMS",
    selectable: false,
    unavailableReason: "demo unavailable",
  },
];

export const mockEmailMessage: Message = {
  id: "message-email-step-2",
  name: "Email",
  channel: "Email",
  stepLabel: "Step 2",
};

export const mockExtractedFields: ExtractedField[] = [
  {
    id: "field-first-name",
    path: "customer.first_name",
    key: "first_name",
    type: "attribute",
    supported: true,
  },
  {
    id: "field-loyalty-tier",
    path: "custom_attribute.loyalty_tier",
    key: "loyalty_tier",
    type: "attribute",
    supported: true,
  },
  {
    id: "field-renewal-date",
    path: "custom_attribute.renewal_date",
    key: "renewal_date",
    type: "attribute",
    supported: true,
  },
  {
    id: "field-last-purchase",
    path: "event.properties.last_purchase_amount",
    key: "last_purchase_amount",
    type: "event",
    supported: true,
  },
  {
    id: "field-offer-code",
    path: "connected_content.offer_code",
    key: "offer_code",
    type: "connected_content",
    supported: false,
  },
];

export const supportedFieldKeys = mockExtractedFields
  .filter((field) => field.supported)
  .map((field) => field.key);

export const availableColumns = [
  "first_name",
  "tier",
  "tier_code",
  "renewal_dt",
  "signup_date",
  "last_purchase_amt",
  "customer_id",
  "email",
  "loyalty_tier",
  "renewal_date",
  "last_purchase_amount",
];

const cachedMappingPairs: Array<[string, string, number]> = [
  ["first_name", "first_name", 99],
  ["loyalty_tier", "loyalty_tier", 99],
  ["renewal_date", "renewal_date", 99],
  ["last_purchase_amount", "last_purchase_amount", 97],
];

const queryMappingPairs: Array<[string, string, number]> = [
  ["first_name", "first_name", 98],
  ["loyalty_tier", "tier", 81],
  ["renewal_date", "renewal_dt", 76],
  ["last_purchase_amount", "last_purchase_amt", 74],
];

export const createMockMappings = (source: "cached" | "query"): Mapping[] => {
  const pairs = source === "cached" ? cachedMappingPairs : queryMappingPairs;

  return pairs.map(([mergeFieldKey, sourceField, confidence]) => {
    const field = mockExtractedFields.find((item) => item.key === mergeFieldKey);

    return {
      id: `mapping-${source}-${mergeFieldKey}`,
      mergeFieldId: field?.id ?? mergeFieldKey,
      mergeFieldKey,
      sourceField,
      originalSourceField: sourceField,
      confidence,
      confirmed: false,
      manualOverride: false,
    };
  });
};

export const ruleLabels: Record<ValidationRuleType, string> = {
  notNull: "Not null",
  numeric: "Type: numeric",
  date: "Type: date",
  enum: "Enum",
  regex: "Regex",
};

export const ruleToolbox: Array<{ type: ValidationRuleType; label: string }> = [
  { type: "notNull", label: "Not null" },
  { type: "numeric", label: "Type: numeric" },
  { type: "date", label: "Type: date" },
  { type: "enum", label: "Enum" },
  { type: "regex", label: "Regex" },
];

export const defaultRules: Record<string, ValidationRule[]> = {
  first_name: [
    {
      id: "rule-first-name-not-null",
      fieldKey: "first_name",
      type: "notNull",
      label: "Not null",
    },
  ],
  loyalty_tier: [
    {
      id: "rule-loyalty-tier-not-null",
      fieldKey: "loyalty_tier",
      type: "notNull",
      label: "Not null",
    },
    {
      id: "rule-loyalty-tier-enum",
      fieldKey: "loyalty_tier",
      type: "enum",
      label: "Enum: Gold, Silver, Platinum",
      values: ["Gold", "Silver", "Platinum"],
    },
  ],
  renewal_date: [
    {
      id: "rule-renewal-date-not-null",
      fieldKey: "renewal_date",
      type: "notNull",
      label: "Not null",
    },
    {
      id: "rule-renewal-date-regex",
      fieldKey: "renewal_date",
      type: "regex",
      label: "Regex: ^\\d{4}-\\d{2}-\\d{2}$",
      pattern: "^\\d{4}-\\d{2}-\\d{2}$",
    },
  ],
  last_purchase_amount: [
    {
      id: "rule-last-purchase-numeric",
      fieldKey: "last_purchase_amount",
      type: "numeric",
      label: "Type: numeric",
    },
  ],
};

export const enumSuggestions: Record<string, string> = {
  loyalty_tier: "Gold, Silver, Platinum",
};

export const regexSuggestions: Record<string, string> = {
  renewal_date: "^\\d{4}-\\d{2}-\\d{2}$",
};

export const querySql = `SELECT first_name, tier, renewal_dt, last_purchase_amt
FROM customers c
JOIN loyalty_status l
  ON l.customer_id = c.id`;

export const runSizeOptions: RunSize[] = [
  { kind: "all", value: 42318, label: "All - 42,318 users" },
  { kind: "preset", value: 10000, label: "10,000" },
  { kind: "preset", value: 50000, label: "50,000" },
];

export const mockFailureGroups: FailureGroup[] = [
  {
    id: "failure-renewal-null",
    count: 804,
    reason: "renewal_date is null",
    impact: "Affects Email - Step 2",
  },
  {
    id: "failure-tier-legacy",
    count: 260,
    reason: 'loyalty_tier not in allowed enum - found "Legacy"',
    impact: "Affects Email - Step 2",
  },
  {
    id: "failure-combined",
    count: 48,
    reason: "both of the above",
    impact: "Affects Email - Step 2",
  },
];

export const mockValidationResults: ValidationResults = {
  passed: 41206,
  failed: 1112,
  passRate: "97.4%",
  failureGroups: mockFailureGroups,
};
