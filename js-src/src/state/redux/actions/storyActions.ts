import { createAction, EntityId } from "@reduxjs/toolkit";

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

interface SelectChoiceArgs {
  choiceId: EntityId;
  maximally?: boolean;
}
export const selectChoice = createAction(
  "story/actions/selectChoice",
  ({ choiceId, maximally = false }: SelectChoiceArgs) => ({
    payload: {
      choiceId,
      maximally,
    },
  })
);
