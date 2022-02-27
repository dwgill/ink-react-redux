import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
  current,
} from "@reduxjs/toolkit";
import type { ReduxState } from "../../store";

const BASIC_LINE = "c/story/line/basicLine";

export interface BasicLine {
  readonly lineKind: typeof BASIC_LINE;
  readonly id: string;
  readonly index: number;
  readonly tags: string[];
  readonly text: string;
  readonly meta: Record<string, any>;
}

type Line = BasicLine;

// When inserting a new line, the `index` must not be present & the `meta` is optional.
type NewLineValue = Omit<Line, "index" | "meta" | "tags"> &
  Partial<Pick<Line, "meta" | "tags">>;

const linesCollectionAdapter = createEntityAdapter<Line>({
  selectId: (line) => line.id,
  sortComparer: (a, b) => a.index - b.index,
});

export const nonGlobalLinesSelectors = linesCollectionAdapter.getSelectors();

// TODO: add tests around this
const linesSlice = createSlice({
  name: "story/lines",
  initialState: linesCollectionAdapter.getInitialState(),
  reducers: {
    addLine(state, { payload: newLine }: PayloadAction<NewLineValue>) {
      if (newLine == null) return;
      linesCollectionAdapter.addOne(state, {
        ...newLine,
        index: nonGlobalLinesSelectors.selectTotal(state),
        meta: newLine.meta == null ? {} : newLine.meta,
        tags: newLine.tags == null ? [] : newLine.tags,
      });
    },
    setLineMetadata(
      state,
      { payload }: PayloadAction<{ id: string; meta: Record<string, any> }>
    ) {
      const line = nonGlobalLinesSelectors.selectById(state, payload.id);
      if (line == null) {
        return;
      }
      const metaEntries = Object.entries(payload.meta);
      if (metaEntries.length === 0) {
        return;
      }
      const newMeta = { ...line.meta };
      for (const [key, value] of metaEntries) {
        if (value == null) {
          delete newMeta[key];
        } else {
          newMeta[key] = value;
        }
      }
      linesCollectionAdapter.updateOne(state, {
        id: payload.id,
        changes: {
          meta: newMeta,
        },
      });
    },
  },
});

const globalLinesSelectors = linesCollectionAdapter.getSelectors(
  (state: ReduxState) => state.story.lines
);

export { globalLinesSelectors as linesSelectors };

export default linesSlice;
