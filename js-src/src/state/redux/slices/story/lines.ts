import {
  createEntityAdapter,
  createSlice,
  nanoid,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { ReduxState } from "../../store";

const BASIC_LINE = "c/story/line/basicLine";

export const lineKinds = {
  BASIC_LINE,
} as const;

export interface BasicLine {
  readonly id: string;
  readonly lineKind: typeof BASIC_LINE;
  readonly index: number;
  readonly tags: string[];
  readonly text: string;
  readonly endBreak: boolean;
  readonly startBreak: boolean;
  readonly meta: Record<string, any>;
}

export type Line = BasicLine;

// When inserting a new line, the `index` must not be present & the `meta` is optional.
type NewLineValue = Omit<Line, "index" | "meta" | "tags" | 'endBreak' | 'startBreak'> &
  Partial<Pick<Line, "meta" | "tags"| 'endBreak' | 'startBreak'>>;

const linesCollectionAdapter = createEntityAdapter<Line>({
  selectId: (line) => line.id,
  sortComparer: (a, b) => a.index - b.index,
});

export const nonGlobalLinesSelectors = linesCollectionAdapter.getSelectors();

const startBreakRE = /^\s*\n/;
const endBreakRE = /\n\s*$/

const linesSlice = createSlice({
  name: "story/lines",
  initialState: linesCollectionAdapter.getInitialState(),
  reducers: {
    addLine: {
      reducer(state, { payload: newLine }: PayloadAction<NewLineValue>) {
        if (newLine == null) return;
        linesCollectionAdapter.addOne(state, {
          ...newLine,
          text: newLine.text.trim(),
          index: nonGlobalLinesSelectors.selectTotal(state),
          meta: newLine.meta == null ? {} : newLine.meta,
          tags: newLine.tags == null ? [] : newLine.tags,
          startBreak: newLine.startBreak ?? (startBreakRE.test(newLine.text)),
          endBreak: newLine.endBreak ?? (endBreakRE.test(newLine.text))
        });
      },
      prepare(
        newLine: Omit<NewLineValue, "id"> & Partial<Pick<NewLineValue, "id">>
      ) {
        if (newLine == null) {
          return {
            payload: null as any,
          };
        }
        return {
          payload: {
            ...newLine,
            id: newLine.id ?? nanoid(),
          },
        };
      },
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
