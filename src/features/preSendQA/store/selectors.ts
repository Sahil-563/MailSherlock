import type { RootState } from "../../../store/store";
import type { DataSource, Mapping, WorkflowStep } from "../types";

export const selectPreSendQA = (state: RootState) => state.preSendQA;

export const selectScreen2Arrived = (state: RootState) => selectPreSendQA(state).screen2Arrived;

export const selectMaxUnlockedStep = (state: RootState) => selectPreSendQA(state).maxUnlockedStep;

export const selectSelectedCanvas = (state: RootState) => selectPreSendQA(state).selectedCanvas;

export const selectSelectedMessage = (state: RootState) => selectPreSendQA(state).selectedMessage;

export const selectExtractedFields = (state: RootState) => selectPreSendQA(state).extractedFields;

export const selectSupportedExtractedFields = (state: RootState) =>
  selectExtractedFields(state).filter((field) => field.supported);

export const selectCachedSources = (state: RootState) => selectPreSendQA(state).cachedSources;

export const selectSelectedCachedSource = (state: RootState): DataSource | null => {
  const workflow = selectPreSendQA(state);
  return workflow.cachedSources.find((source) => source.id === workflow.selectedCachedSourceId) ?? null;
};

export const selectMappings = (state: RootState): Mapping[] => selectPreSendQA(state).mapping;

export const selectMappingRevealed = (state: RootState) => selectPreSendQA(state).mappingRevealed;

export const selectAllMappingsConfirmed = (state: RootState) => {
  const mapping = selectMappings(state);
  return mapping.length > 0 && mapping.every((item) => item.confirmed);
};

export const selectRules = (state: RootState) => selectPreSendQA(state).rules;

export const selectAllFieldsHaveRules = (state: RootState) => {
  const mappings = selectMappings(state);
  const fieldKeys = mappings.length > 0 ? mappings.map((mapping) => mapping.mergeFieldKey) : [];

  return fieldKeys.length > 0 && fieldKeys.every((fieldKey) => (selectRules(state)[fieldKey] ?? []).length > 0);
};

export const selectRunSize = (state: RootState) => selectPreSendQA(state).runSize;

export const selectRunStatus = (state: RootState) => selectPreSendQA(state).runStatus;

export const selectRunProgress = (state: RootState) => selectPreSendQA(state).runProgress;

export const selectRunStage = (state: RootState) => selectPreSendQA(state).runStage;

export const selectValidationResults = (state: RootState) => selectPreSendQA(state).validationResults;

export const selectCanContinue = (state: RootState, step: WorkflowStep): boolean => {
  switch (step) {
    case 1:
      return true;
    case 2:
      return Boolean(selectSelectedCanvas(state));
    case 3:
      return Boolean(selectSelectedMessage(state));
    case 4:
      return true;
    case 5:
      return selectAllMappingsConfirmed(state);
    case 6:
      return selectAllFieldsHaveRules(state);
    case 7:
      return Boolean(selectRunSize(state));
    case 8:
      return selectRunStatus(state) === "completed";
  }
};

export const selectFirstIncompleteStep = (state: RootState): WorkflowStep => {
  for (const step of [2, 3, 5, 6, 7] as WorkflowStep[]) {
    if (!selectCanContinue(state, step)) {
      return step;
    }
  }

  return selectCanContinue(state, 8) ? 8 : 8;
};
