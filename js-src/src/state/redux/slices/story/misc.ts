import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getStory } from "../../../story/core";

interface MiscState {
  readonly errors: string[];
  readonly canContinue: boolean;
}

const miscSlice = createSlice({
  initialState: (): MiscState => ({
    canContinue: !!getStory().canContinue,
    errors: [...(getStory().currentErrors ?? [])],
  }),
  name: "story/misc",
  reducers: {
    setErrors(state, action: PayloadAction<string[]>) {
      state.errors = [...action.payload];
    },
    setCanContinue(state, action: PayloadAction<boolean>) {
      state.canContinue = !!action.payload;
    },
  },
});

export default miscSlice;
