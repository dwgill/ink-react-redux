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
      if (state.errors.length === 0 && action.payload.length === 0) {
        return;
      }
      state.errors = [...action.payload];
    },
    setCanContinue(state, action: PayloadAction<boolean>) {
      state.canContinue = !!action.payload;
    },
  },
});

export default miscSlice;
