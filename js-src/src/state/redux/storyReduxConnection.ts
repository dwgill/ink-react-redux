import type { Story } from "inkjs";
import storyConfig from "../story/inkStoryConfig.json";
import { continueStory } from "./actions/storyActions";
import choicesSlice from "./slices/story/choices";
import linesSlice, { lineKinds } from "./slices/story/lines";
import miscSlice from "./slices/story/misc";
import variablesSlice from "./slices/story/variables";
import type { Store } from "./store";
import storyReduxMiddleware from "./storyReduxMiddleware";

function addVariableObservers(story: InstanceType<typeof Story>, store: Store) {
  // Add observers for any tracked variables.
  type VarObserverCallback = Parameters<typeof story["ObserveVariable"]>[1];
  const onVariableChange: VarObserverCallback = (variableName, newValue) => {
    store.dispatch(
      variablesSlice.actions.setVariable({
        varName: variableName,
        varValue: newValue,
      })
    );
  };

  for (const varNamePool of Object.values(
    storyConfig?.trackedVariables ?? {}
  )) {
    for (const varName of varNamePool ?? []) {
      story.ObserveVariable(varName, onVariableChange);
    }
  }

  return function removeVariableObservers() {
    // Remove observers for any tracked story variables.
    for (const varNamePool of Object.values(
      storyConfig?.trackedVariables ?? {}
    )) {
      for (const varName of varNamePool ?? []) {
        story.RemoveVariableObserver(onVariableChange, varName);
      }
    }
  };
}

function startStoryReduxMiddlewareListening(
  story: InstanceType<typeof Story>,
  store: Store
) {
  const stopListening = storyReduxMiddleware.startListening({
    actionCreator: continueStory,
    effect({ payload: { maximally } }, listenerApi) {
      let canContinue = story.canContinue;

      if (!story.canContinue) {
        if (process.env.NODE_ENV === "development") {
          alert("Tried to continue non-continuable story.");
        }
        return;
      }

      while (canContinue) {
        const currentText = story.Continue();
        canContinue = story.canContinue;
        const currentTags = story.currentTags;
        const currentErrors = story.currentErrors;
        const currentChoices = story.currentChoices;

        if (currentText || currentTags?.length) {
          listenerApi.dispatch(
            linesSlice.actions.addLine({
              lineKind: lineKinds.BASIC_LINE,
              text: currentText ?? "",
              tags: [...(currentTags ?? [])],
            })
          );
        }

        listenerApi.dispatch(miscSlice.actions.setErrors(currentErrors ?? []));
        listenerApi.dispatch(miscSlice.actions.setCanContinue(canContinue));
        listenerApi.dispatch(
          choicesSlice.actions.replaceChoices(currentChoices)
        );

        if (!maximally) {
          return;
        }
      }
    },
  });

  return function stopStoryReduxMiddlewareListening() {
    stopListening();
  };
}

export function connectStoryToReduxStore(
  story: InstanceType<typeof Story>,
  store: Store
) {
  const removeVariableObservers = addVariableObservers(story, store);
  const stopStoryReduxMiddlewareListening = startStoryReduxMiddlewareListening(
    story,
    store
  );

  return function disconnectStoryFromReduxStore() {
    removeVariableObservers();
    stopStoryReduxMiddlewareListening();
  };
}
