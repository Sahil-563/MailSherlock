import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import {
  createMockMappings,
  defaultRules,
  initialCachedSources,
  mockExtractedFields,
} from "../data/mockData";
import type {
  Canvas,
  DataSource,
  Mapping,
  Message,
  PreSendQAState,
  PrepChoice,
  RunSize,
  RunStatus,
  SourceTab,
  ValidationResults,
  ValidationRule,
  ValidationRuleType,
  WorkflowStep,
} from "../types";

const cloneDefaultRules = (): Record<string, ValidationRule[]> =>
  Object.fromEntries(
    Object.entries(defaultRules).map(([fieldKey, rules]) => [
      fieldKey,
      rules.map((rule) => ({ ...rule, values: rule.values ? [...rule.values] : undefined })),
    ]),
  );

const initialState: PreSendQAState = {
  screen2Arrived: false,
  maxUnlockedStep: 1,
  selectedPrepChoice: null,
  selectedSegmentForExport: null,
  cachedSources: initialCachedSources.map((source) => ({ ...source })),
  selectedCachedSourceId: null,
  selectedCanvas: null,
  selectedMessage: null,
  extractedFields: mockExtractedFields.map((field) => ({ ...field })),
  sourceTab: "cached",
  mapping: [],
  mappingRevealed: false,
  queryResultSaved: false,
  rules: cloneDefaultRules(),
  runSize: null,
  runStatus: "idle",
  runProgress: 0,
  runStage: null,
  validationResults: null,
};

const resetValidationRun = (state: PreSendQAState) => {
  state.runSize = null;
  state.runStatus = "idle";
  state.runProgress = 0;
  state.runStage = null;
  state.validationResults = null;
};

const resetMappingAndRules = (state: PreSendQAState) => {
  state.selectedCachedSourceId = null;
  state.sourceTab = "cached";
  state.mapping = [];
  state.mappingRevealed = false;
  state.queryResultSaved = false;
  state.rules = cloneDefaultRules();
  resetValidationRun(state);
};

const maybeSaveQuerySource = (state: PreSendQAState) => {
  if (state.sourceTab !== "query" || state.queryResultSaved) {
    return;
  }

  if (!state.mapping.length || !state.mapping.every((mapping) => mapping.confirmed)) {
    return;
  }

  const exists = state.cachedSources.some((source) => source.id === "src-query-result");

  if (!exists) {
    state.cachedSources.push({
      id: "src-query-result",
      type: "query",
      name: "Custom query result",
      lastRefreshed: "just now",
      userCount: 42318,
    });
  }

  state.queryResultSaved = true;
};

export const preSendQASlice = createSlice({
  name: "preSendQA",
  initialState,
  reducers: {
    unlockStep(state, action: PayloadAction<WorkflowStep>) {
      if (action.payload > state.maxUnlockedStep) {
        state.maxUnlockedStep = action.payload;
      }
    },
    setScreen2Arrived(state, action: PayloadAction<boolean>) {
      state.screen2Arrived = action.payload;
    },
    setPrepChoice(state, action: PayloadAction<PrepChoice>) {
      state.selectedPrepChoice = action.payload;
    },
    setSelectedSegment(state, action: PayloadAction<string>) {
      state.selectedSegmentForExport = action.payload;
    },
    addCachedSource(state, action: PayloadAction<DataSource>) {
      const existing = state.cachedSources.find((source) => source.id === action.payload.id);

      if (existing) {
        existing.lastRefreshed = action.payload.lastRefreshed;
        existing.userCount = action.payload.userCount;
      } else {
        state.cachedSources.push(action.payload);
      }
    },
    refreshCachedSource(state, action: PayloadAction<{ sourceId: string; lastRefreshed: string }>) {
      const source = state.cachedSources.find((item) => item.id === action.payload.sourceId);

      if (source) {
        source.lastRefreshed = action.payload.lastRefreshed;
      }
    },
    setSelectedCanvas(state, action: PayloadAction<Canvas>) {
      state.selectedCanvas = action.payload;
      state.selectedMessage = null;
      state.extractedFields = mockExtractedFields.map((field) => ({ ...field }));
      resetMappingAndRules(state);
      state.maxUnlockedStep = state.maxUnlockedStep > 2 ? 2 : state.maxUnlockedStep;
    },
    setSelectedMessage(state, action: PayloadAction<Message>) {
      state.selectedMessage = action.payload;
      state.extractedFields = mockExtractedFields.map((field) => ({ ...field }));
      resetMappingAndRules(state);
      state.maxUnlockedStep = state.maxUnlockedStep > 3 ? 3 : state.maxUnlockedStep;
    },
    setExtractedFields(state, action: PayloadAction<PreSendQAState["extractedFields"]>) {
      state.extractedFields = action.payload;
    },
    setSourceTab(state, action: PayloadAction<SourceTab>) {
      if (state.sourceTab !== action.payload) {
        state.sourceTab = action.payload;
        state.selectedCachedSourceId = null;
        state.mapping = [];
        state.mappingRevealed = false;
        state.queryResultSaved = false;
        resetValidationRun(state);
      }
    },
    setSelectedCachedSource(state, action: PayloadAction<string>) {
      state.selectedCachedSourceId = action.payload;
      state.sourceTab = "cached";
      state.mapping = createMockMappings("cached");
      state.mappingRevealed = true;
      state.queryResultSaved = false;
      resetValidationRun(state);
    },
    setMappings(state, action: PayloadAction<Mapping[]>) {
      state.mapping = action.payload;
      state.mappingRevealed = true;
      resetValidationRun(state);
    },
    updateMapping(state, action: PayloadAction<{ mappingId: string; sourceField: string }>) {
      const mapping = state.mapping.find((item) => item.id === action.payload.mappingId);

      if (!mapping) {
        return;
      }

      if (mapping.sourceField !== action.payload.sourceField) {
        mapping.sourceField = action.payload.sourceField;
        mapping.manualOverride = mapping.sourceField !== mapping.originalSourceField;
        mapping.confirmed = false;
        resetValidationRun(state);
      }
    },
    editMapping(state, action: PayloadAction<{ mappingId: string; sourceField: string }>) {
      const mapping = state.mapping.find((item) => item.id === action.payload.mappingId);

      if (!mapping) {
        return;
      }

      mapping.sourceField = action.payload.sourceField;
      mapping.manualOverride = mapping.sourceField !== mapping.originalSourceField;
      mapping.confirmed = false;
      resetValidationRun(state);
    },
    confirmMapping(state, action: PayloadAction<string>) {
      const mapping = state.mapping.find((item) => item.id === action.payload);

      if (mapping) {
        mapping.confirmed = true;
        maybeSaveQuerySource(state);
      }
    },
    confirmAllMappings(state) {
      state.mapping.forEach((mapping) => {
        mapping.confirmed = true;
      });
      maybeSaveQuerySource(state);
    },
    addRule: {
      reducer(state, action: PayloadAction<ValidationRule>) {
        const rules = state.rules[action.payload.fieldKey] ?? [];
        const duplicate = rules.some((rule) => rule.label === action.payload.label);

        if (!duplicate) {
          state.rules[action.payload.fieldKey] = [...rules, action.payload];
          resetValidationRun(state);
        }
      },
      prepare(payload: {
        fieldKey: string;
        type: ValidationRuleType;
        label: string;
        values?: string[];
        pattern?: string;
      }) {
        return {
          payload: {
            id: `rule-${payload.fieldKey}-${nanoid(8)}`,
            ...payload,
          },
        };
      },
    },
    removeRule(state, action: PayloadAction<{ fieldKey: string; ruleId: string }>) {
      const existing = state.rules[action.payload.fieldKey] ?? [];
      state.rules[action.payload.fieldKey] = existing.filter((rule) => rule.id !== action.payload.ruleId);
      resetValidationRun(state);
    },
    updateRule(
      state,
      action: PayloadAction<{
        fieldKey: string;
        ruleId: string;
        label: string;
        values?: string[];
        pattern?: string;
      }>,
    ) {
      const rule = (state.rules[action.payload.fieldKey] ?? []).find(
        (item) => item.id === action.payload.ruleId,
      );

      if (rule) {
        rule.label = action.payload.label;
        rule.values = action.payload.values;
        rule.pattern = action.payload.pattern;
        resetValidationRun(state);
      }
    },
    setRunSize(state, action: PayloadAction<RunSize>) {
      state.runSize = action.payload;
      state.runStatus = "idle";
      state.runProgress = 0;
      state.runStage = null;
      state.validationResults = null;
    },
    setRunStatus(state, action: PayloadAction<RunStatus>) {
      state.runStatus = action.payload;
    },
    setRunProgress(state, action: PayloadAction<{ progress: number; stage: string }>) {
      state.runProgress = action.payload.progress;
      state.runStage = action.payload.stage;
    },
    setValidationResults(state, action: PayloadAction<ValidationResults>) {
      state.validationResults = action.payload;
      state.runStatus = "completed";
      state.runProgress = 100;
      state.runStage = "Validation complete.";
    },
    resetWorkflow() {
      return {
        ...initialState,
        cachedSources: initialCachedSources.map((source) => ({ ...source })),
        extractedFields: mockExtractedFields.map((field) => ({ ...field })),
        rules: cloneDefaultRules(),
      };
    },
  },
});

export const {
  addCachedSource,
  addRule,
  confirmAllMappings,
  confirmMapping,
  editMapping,
  refreshCachedSource,
  removeRule,
  resetWorkflow,
  setExtractedFields,
  setMappings,
  setPrepChoice,
  setScreen2Arrived,
  setRunProgress,
  setRunSize,
  setRunStatus,
  setSelectedCachedSource,
  setSelectedCanvas,
  setSelectedMessage,
  setSelectedSegment,
  setSourceTab,
  setValidationResults,
  unlockStep,
  updateMapping,
  updateRule,
} = preSendQASlice.actions;

export default preSendQASlice.reducer;
