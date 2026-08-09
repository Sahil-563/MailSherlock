import storage from "redux-persist/lib/storage";

export const persistConfig = {
  key: "pre-send-qa",
  storage,
  whitelist: ["preSendQA"],
};
