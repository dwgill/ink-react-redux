import React, { memo, useContext, useEffect } from "react";
import { Provider } from "react-redux";
import { storyContext } from "../story/storyContext";
import connectStoryToReduxStore from "./connectStoryToReduxStore";
import { store } from "./store";

export const ReduxStoreProvider = memo(function ReduxStoreProvider({
  children,
}) {
  const story = useContext(storyContext);

  useEffect(() => {
    const disconnect = connectStoryToReduxStore(story, store);
    return () => {
      disconnect();
    };
  }, [story]);

  return <Provider store={store}>{children}</Provider>;
});
