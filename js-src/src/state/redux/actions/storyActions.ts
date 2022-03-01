import { createAction } from "@reduxjs/toolkit";

interface ContinueStoryArgs {
  maximally?: boolean;
}
export const continueStory = createAction(
  "story/actions/continueStory",
  ({ maximally = false }: ContinueStoryArgs = {}) => ({
    payload: {
      maximally,
    },
  })
);
