import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { continueStory } from "../state/redux/actions/storyActions";

interface ContinueStoryOptions {
  continueMaximally?: boolean;
}
export function useContinueStory(
  { continueMaximally: outerMax }: ContinueStoryOptions = {}
) {
  const dispatch = useDispatch();
  return useCallback(
    ({ continueMaximally: innerMax = outerMax }: ContinueStoryOptions = {}) => {
      dispatch(
        continueStory({
          maximally: innerMax ?? true,
        })
      );
    },
    [outerMax, dispatch]
  );
}
