import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { continueStory } from "../../../state/redux/actions/storyActions";
import { getStore } from "../../../state/redux/store";
import { StoryProvider } from "../../../state/story/storyContext";
import App from "../../ui/App";

export default function Game() {
  useEffect(() => {
    getStore().dispatch(continueStory());
  }, [])
  return (
    <StoryProvider>
      <Provider store={getStore()}>
        <App>
            content!
        </App>
      </Provider>
    </StoryProvider>
  );
}
