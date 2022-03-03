import { ListenerEffectAPI } from "@reduxjs/toolkit";
import type { Story } from "inkjs";
import storyConfig from "../story/inkStoryConfig.json";
import { continueStory, selectChoice } from "./actions/storyActions";
import { getChoice } from "./selectors/story";
import choicesSlice from "./slices/story/choices";
import linesSlice, { LineBreakLevel, LineKind } from "./slices/story/lines";
import miscSlice from "./slices/story/misc";
import variablesSlice from "./slices/story/variables";
import type { Dispatch, ReduxState, Store } from "./store";
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
  function handleStoryStep(
    listenerApi: ListenerEffectAPI<ReduxState, Dispatch>
  ) {
    const canContinue = story.canContinue;
    const currentText = story.currentText;
    const currentTags = story.currentTags;
    const currentErrors = story.currentErrors;
    const currentChoices = story.currentChoices;

    if (currentText?.trim() || currentTags?.length) {
      listenerApi.dispatch(
        linesSlice.actions.addLine({
          lineKind: LineKind.Text,
          text: currentText ?? "",
          tags: [...(currentTags ?? [])],
        })
      );
    }

    listenerApi.dispatch(miscSlice.actions.setErrors(currentErrors ?? []));
    listenerApi.dispatch(miscSlice.actions.setCanContinue(canContinue));
    listenerApi.dispatch(choicesSlice.actions.replaceChoices(currentChoices));
    return { canContinue };
  }

  const stopListeningContinue = storyReduxMiddleware.startListening({
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
        story.Continue();
        const output = handleStoryStep(listenerApi);
        canContinue = output.canContinue;
        if (!maximally) {
          return;
        }
      }
    },
  });

  const stopListeningSelectChoice = storyReduxMiddleware.startListening({
    actionCreator: selectChoice,
    effect({ payload: { choiceId, maximally } }, listenerApi) {
      const choice = getChoice(listenerApi.getState(), choiceId);
      if (choice == null) {
        if (process.env.NODE_ENV === "development") {
          alert(`Tried to select non-existant choice ${choiceId}.`);
        }
        return;
      }

      story.ChooseChoiceIndex(choice.index);
      if (storyConfig?.persistChoiceText && !choice.isInvisibleDefault) {
        listenerApi.dispatch(
          linesSlice.actions.addLine({
            lineKind: LineKind.Text,
            text: choice.text,
            persistedChoice: true,
          })
        );
      }
      listenerApi.dispatch(
        linesSlice.actions.addLine({
          lineKind: LineKind.Empty,
          breakLevel: LineBreakLevel.ChoiceSelection,
        })
      );
      listenerApi.dispatch(continueStory({ maximally }));
    },
  });

  return function stopStoryReduxMiddlewareListening() {
    stopListeningContinue();
    stopListeningSelectChoice();
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
