import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { continueStory } from "../../../state/redux/actions/storyActions";
import { getStore } from "../../../state/redux/store";
import { StoryProvider } from "../../../state/story/storyContext";
import App from "../../ui/App";
import Narrative from "../Narrative";

export default function Game() {
  useEffect(() => {
    getStore().dispatch(continueStory());
  }, []);
  return (
    <StoryProvider>
      <Provider store={getStore()}>
        <App>
          <Narrative />
        </App>
      </Provider>
    </StoryProvider>
  );
}
