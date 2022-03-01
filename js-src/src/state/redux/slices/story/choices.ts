import {
  createEntityAdapter,
  createSlice,
  nanoid,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { ReduxState } from "../../store";

export interface Choice {
  readonly id: string;
  readonly index: number;
  readonly text: string;
  readonly isInvisibleDefault: boolean;
  readonly originalThreadIndex: number;
}

type NewChoiceValue = Omit<Choice, "id"> & Partial<Pick<Choice, "id">>;

const choicesCollectionAdapter = createEntityAdapter<Choice>({
  selectId: (choice) => choice.id,
  sortComparer: (a, b) => a.index - b.index,
});

export const nonGlobalChoicesSelectors =
  choicesCollectionAdapter.getSelectors();

const choicesSlice = createSlice({
  name: "story/choices",
  initialState: choicesCollectionAdapter.getInitialState(),
  reducers: {
    replaceChoices: {
      reducer(state, action: PayloadAction<{ choices: Choice[] }>) {
        choicesCollectionAdapter.removeAll(state);
        choicesCollectionAdapter.addMany(state, action.payload.choices);
      },
      prepare(choices: NewChoiceValue[] | null = null) {
        return {
          payload: {
            choices:
              choices?.map(
                ({
                  index,
                  isInvisibleDefault,
                  originalThreadIndex,
                  text,
                  id,
                }) => ({
                  index,
                  isInvisibleDefault,
                  originalThreadIndex,
                  text,
                  id: id ?? nanoid(),
                })
              ) ?? [],
          },
        };
      },
    },
  },
});

const globalChoicesSelectors = choicesCollectionAdapter.getSelectors(
  (state: ReduxState) => state.story.choices
);

export { globalChoicesSelectors as choicesSelectors };

export default choicesSlice;
