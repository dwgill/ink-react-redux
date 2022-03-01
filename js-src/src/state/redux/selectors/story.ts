import { choicesSelectors } from "../slices/story/choices";
import { linesSelectors } from "../slices/story/lines";
import { ReduxState } from "../store";

export const getLine = linesSelectors.selectById;
export const getNumLines = linesSelectors.selectTotal; 
export const getLineIdByIndex = (state: ReduxState, index: number) => {
    const lineIds = linesSelectors.selectIds(state);
    return lineIds.at(index);
}
export const getLineByIndex = (state: ReduxState, index: number) => {
    const id = getLineIdByIndex(state, index);
    if (!id) return undefined;
    return getLine(state, id);
}
export const getLines = linesSelectors.selectAll;
export const getLineIds = linesSelectors.selectIds;

export const getChoice = choicesSelectors.selectById;
export const getChoices = choicesSelectors.selectAll;
export const getChoiceIds = choicesSelectors.selectIds;