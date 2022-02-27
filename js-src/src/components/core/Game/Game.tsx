import React from "react";
import { ReduxStoreProvider } from "../../../state/redux/reduxContext";
import { StoryProvider } from "../../../state/story/storyContext";
import App from "../../ui/App";

export default function Game() {
  return (
    <StoryProvider>
      <ReduxStoreProvider>
        <App>
            content!
        </App>
      </ReduxStoreProvider>
    </StoryProvider>
  );
}
