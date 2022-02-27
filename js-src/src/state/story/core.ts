import storyJson from "./inkStory.json";
import { Story } from "inkjs";

let story: InstanceType<typeof Story> = null as any;

export function getStory() {
  if (story == null) {
    story = new Story(storyJson);
    if (process.env.NODE_ENV === "development") {
      (window as any).story = story;
    }
  }

  return story;
}
