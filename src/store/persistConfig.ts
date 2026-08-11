import { createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";
import type { PreSendQAState } from "../features/preSendQA/types";

const resetScreenArrivalFlags = createTransform<PreSendQAState, PreSendQAState>(
  (inboundState) => inboundState,
  (outboundState) => ({
    ...outboundState,
    screen2Arrived: false,
  }),
  { whitelist: ["preSendQA"] },
);

export const persistConfig = {
  key: "pre-send-qa",
  storage,
  transforms: [resetScreenArrivalFlags],
  whitelist: ["preSendQA"],
};
