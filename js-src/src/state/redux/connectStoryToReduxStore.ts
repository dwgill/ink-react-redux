import type { Story } from "inkjs";
import variablesSlice from "./slices/story/variables";
import type { Store } from "./store";
import storyConfig from "../story/inkStoryConfig.json";

export default function connectStoryToReduxStore(
  story: InstanceType<typeof Story>,
  store: Store
) {
  // Register observers for any tracked variables.
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

  return function disconnectStoryFromReduxStore() {
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
