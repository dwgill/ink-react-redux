import { combineReducers } from '@reduxjs/toolkit'
import miscSlice from './misc';
import linesSlice from './lines';
import variablesSlice from './variables';
import choicesSlice from './choices';

const storyReducer = combineReducers({
    lines: linesSlice.reducer, 
    variables: variablesSlice.reducer,
    errors: miscSlice.reducer,
    choices: choicesSlice.reducer,
});

export default storyReducer;
