import { combineReducers } from "@reduxjs/toolkit";
import choicesSlice from "./choices";
import linesSlice from "./lines";
import miscSlice from "./misc";
import variablesSlice from "./variables";

const storyReducer = combineReducers({
  lines: linesSlice.reducer,
  variables: variablesSlice.reducer,
  misc: miscSlice.reducer,
  choices: choicesSlice.reducer,
});

export default storyReducer;
