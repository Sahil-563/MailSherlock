import { combineReducers } from "@reduxjs/toolkit";
import preSendQAReducer from "../features/preSendQA/store/preSendQASlice";

export const rootReducer = combineReducers({
  preSendQA: preSendQAReducer,
});
