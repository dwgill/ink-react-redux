import { createListenerMiddleware } from "@reduxjs/toolkit";
import type { ReduxState } from "./store";

const storyReduxMiddleware = createListenerMiddleware<ReduxState>()

export default storyReduxMiddleware;
