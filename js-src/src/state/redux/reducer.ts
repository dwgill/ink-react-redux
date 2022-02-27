import { combineReducers } from '@reduxjs/toolkit'
import storyReducer from './slices/story';

const reducer = combineReducers({
    story: storyReducer,
});

export default reducer;
