import { createBrowserRouter, Navigate } from "react-router-dom";
import {
  WorkflowLayout,
  WorkflowRouteGuard,
} from "../features/preSendQA/components/WorkflowLayout";
import type { WorkflowStep } from "../features/preSendQA/types";
import { PrepareDataScreen } from "../features/preSendQA/screens/PrepareDataScreen";
import { SelectCanvasScreen } from "../features/preSendQA/screens/SelectCanvasScreen";
import { SelectMessageScreen } from "../features/preSendQA/screens/SelectMessageScreen";
import { ReviewFieldsScreen } from "../features/preSendQA/screens/ReviewFieldsScreen";
import { MappingScreen } from "../features/preSendQA/screens/MappingScreen";
import { ValidationRulesScreen } from "../features/preSendQA/screens/ValidationRulesScreen";
import { RunSizeScreen } from "../features/preSendQA/screens/RunSizeScreen";
import { RunValidationScreen } from "../features/preSendQA/screens/RunValidationScreen";

const StepScreen = ({ step }: { step: WorkflowStep }) => {
  switch (step) {
    case 1:
      return <div>Will Develop it soon</div>;
    //<PrepareDataScreen />
    case 2:
      return <SelectCanvasScreen />;
    case 3:
      return <SelectMessageScreen />;
    case 4:
      return <div>Will Develop it soon</div>;
    // return <ReviewFieldsScreen />;
    case 5:
      return <div>Will Develop it soon</div>;

    // return <MappingScreen />;
    case 6:
      return <div>Will Develop it soon</div>;

    // return <ValidationRulesScreen />;
    case 7:
      return <div>Will Develop it soon</div>;

    // return <RunSizeScreen />;
    case 8:
      return <div>Will Develop it soon</div>;

    // return <RunValidationScreen />;
  }
};

const WorkflowRoute = () => (
  <WorkflowRouteGuard>
    {(step) => (
      <WorkflowLayout currentStep={step}>
        <StepScreen step={step} />
      </WorkflowLayout>
    )}
  </WorkflowRouteGuard>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/pre-send-qa/step/1" replace />,
  },
  {
    path: "/pre-send-qa/step/:stepId",
    element: <WorkflowRoute />,
  },
  {
    path: "*",
    element: <Navigate to="/pre-send-qa/step/1" replace />,
  },
]);
