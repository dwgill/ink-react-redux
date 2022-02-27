import { combineReducers } from '@reduxjs/toolkit'
import linesSlice from './lines';
import variablesSlice from './variables';

const storyReducer = combineReducers({
    lines: linesSlice.reducer, 
    variables: variablesSlice.reducer,
});

export default storyReducer;
