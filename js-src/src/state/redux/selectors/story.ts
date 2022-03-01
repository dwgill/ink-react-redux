import { choicesSelectors } from "../slices/story/choices";
import { linesSelectors } from "../slices/story/lines";

export const getLine = linesSelectors.selectById;
export const getLines = linesSelectors.selectAll;
export const getLineIds = linesSelectors.selectIds;

export const getChoice = choicesSelectors.selectById;
export const getChoices = choicesSelectors.selectAll;
export const getChoiceIds = choicesSelectors.selectIds;