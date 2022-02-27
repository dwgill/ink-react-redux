import { Story } from "inkjs";
import { createContext, memo } from "react";
import { getStory } from "./core";

export const storyContext = createContext<InstanceType<typeof Story>>(null as any);

export const StoryProvider = memo(function StoryProvider({ children }) {
  return (
    <storyContext.Provider value={getStory()}>
      {children}
    </storyContext.Provider>
  );
});
