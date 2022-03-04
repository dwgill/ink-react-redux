import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getStory } from "../../../story/core";
import { defaultConfig } from "../../../story/inkStoryConfig";

const boolVarNames = new Set(defaultConfig?.trackedVariables?.bool ?? []);
const intVarNames = new Set(defaultConfig?.trackedVariables?.int ?? []);
const floatVarNames: Set<string> = new Set(
  defaultConfig?.trackedVariables?.float ?? []
);

interface VariablesState {
  [varName: string]: boolean | number;
}

function getInitialState(): VariablesState {
  const story = getStory();
  const initState: any = {};
  for (const varName of boolVarNames) {
    initState[varName] = Boolean(story.variablesState.$(varName, undefined));
  }
  for (const varName of intVarNames) {
    initState[varName] = Math.floor(
      Number(story.variablesState.$(varName, undefined))
    );
  }
  for (const varName of floatVarNames) {
    initState[varName] = Number(story.variablesState.$(varName, undefined));
  }
  return initState;
}

const variablesSlice = createSlice({
  name: "story/variables",
  initialState: getInitialState,
  reducers: {
    setVariable(
      state,
      action: PayloadAction<{
        varName: string;
        varValue: number | boolean;
      }>
    ) {
      const {
        payload: { varValue, varName },
      } = action;
      if (boolVarNames.has(varName)) {
        state[varName] = Boolean(varValue);
      }
      if (intVarNames.has(varName)) {
        state[varName] = Math.floor(Number(varValue));
      }
      if (floatVarNames.has(varName)) {
        state[varName] = Number(varValue);
      }
    },
  },
});

export default variablesSlice;
