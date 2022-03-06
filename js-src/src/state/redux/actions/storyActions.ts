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

interface SelectChoiceIdArgs {
  choiceId: EntityId;
  maximally?: boolean;
}
interface SelectChoiceIndexArgs {
  choiceIndex: number;
  maximally?: boolean;
}
export const selectChoice = createAction(
  "story/actions/selectChoice",
  (args: SelectChoiceIdArgs | SelectChoiceIndexArgs) => {
    if ("choiceId" in args) {
      return {
        payload: {
          choiceId: args.choiceId,
          maximally: args.maximally ?? false,
        },
      };
    }

    return {
      payload: {
        choiceIndex: args.choiceIndex,
        maximally: args.maximally ?? false,
      },
    };
  }
);
