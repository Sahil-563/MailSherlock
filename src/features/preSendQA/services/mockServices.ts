import { createMockMappings, mockValidationResults } from "../data/mockData";
import type { Mapping, ValidationResults } from "../types";

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

export const mockExportSegment = async (onStage: (stage: string, progress: number) => void) => {
  const stages = [
    { text: "Requesting export from Braze...", progress: 28 },
    { text: "Waiting for callback...", progress: 64 },
    { text: "Saving snapshot...", progress: 100 },
  ];

  for (const stage of stages) {
    onStage(stage.text, stage.progress);
    await delay(420);
  }
};

export const mockRefreshSnapshot = async () => {
  await delay(500);
  return "just now";
};

export const mockRunMapping = async (onStage: (stage: string, progress: number) => void): Promise<Mapping[]> => {
  const stages = [
    { text: "Running query...", progress: 34 },
    { text: "Analyzing columns...", progress: 68 },
    { text: "Generating mapping...", progress: 100 },
  ];

  for (const stage of stages) {
    onStage(stage.text, stage.progress);
    await delay(420);
  }

  return createMockMappings("query");
};

export const mockRunValidation = async (
  onProgress: (stage: string, progress: number) => void,
): Promise<ValidationResults> => {
  const stages = [
    { text: "Connecting to source...", progress: 22 },
    { text: "Fetching mapped fields...", progress: 48 },
    { text: "Applying rules...", progress: 76 },
    { text: "Aggregating results...", progress: 100 },
  ];

  for (const stage of stages) {
    onProgress(stage.text, stage.progress);
    await delay(520);
  }

  return mockValidationResults;
};
