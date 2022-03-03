import {
  createEntityAdapter,
  createSlice,
  nanoid,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  DistributiveSomePartial,
  SomeOmitSomePartial,
} from "../../../../util/types";
import type { ReduxState } from "../../store";

export enum LineKind {
  Text,
  Empty,
}

interface AbstractLine {
  readonly id: string;
  readonly lineKind: unknown;
  readonly index: number;
  readonly meta?: Record<string, any>;
  readonly tags?: string[];
}

export interface TextualLine extends AbstractLine {
  readonly lineKind: LineKind.Text;
  readonly text: string;
  readonly persistedChoice?: boolean;
}

export enum LineBreakLevel {
  None,
  LineBreak,
  ChoiceSelection,
}

export interface EmptyLine extends AbstractLine {
  readonly breakLevel: LineBreakLevel;
  readonly lineKind: LineKind.Empty;
}

export type Line = TextualLine | EmptyLine;

type NewTextualLineValue = SomeOmitSomePartial<
  TextualLine,
  "index",
  "meta" | "tags"
>;

type NewEmptyLineValue = SomeOmitSomePartial<
  EmptyLine,
  "index",
  "meta" | "tags" | "breakLevel"
>;

export const newBasicLineBreak = (): NewEmptyLineValue => ({
  id: nanoid(),
  lineKind: LineKind.Empty,
  breakLevel: LineBreakLevel.LineBreak,
});

function lineIsWhitespace(line: Line) {
  if (line == null) return false;
  return line.lineKind === LineKind.Empty || line.text === "";
}
function lineIsMinimalWhitespace(line: Line) {
  if (line == null) {
    return false;
  }
  if (line.tags?.length) {
    return false;
  }

  if (line.lineKind === LineKind.Text && line.text !== "") {
    return false;
  }

  if (
    line.lineKind === LineKind.Empty &&
    line.breakLevel === LineBreakLevel.ChoiceSelection
  ) {
    return false;
  }

  if (line.meta && Object.keys(line.meta).length > 0) {
    return false;
  }

  return true;
}

type NewLineValue = NewTextualLineValue | NewEmptyLineValue;

const linesCollectionAdapter = createEntityAdapter<Line>({
  selectId: (line) => line.id,
  sortComparer: (a, b) => a.index - b.index,
});

const selectors = linesCollectionAdapter.getSelectors();

const startBreakRE = /^\s*\n/;
const endBreakRE = /\n\s*$/;

const linesSlice = createSlice({
  name: "story/lines",
  initialState: linesCollectionAdapter.getInitialState(),
  reducers: {
    addLine: {
      reducer(state, { payload: newLines }: PayloadAction<NewLineValue[]>) {
        if (!newLines?.length) return;

        for (const newLine of newLines) {
          let newCompleteLine: Line;
          if (newLine.lineKind === LineKind.Text && newLine.text === "") {
            continue;
            // newCompleteLine = {
            //   id: newLine.id,
            //   lineKind: LineKind.EMPTY_LINE,
            //   breakKind: "line_break",
            //   index: selectors.selectTotal(state),
            //   meta: newLine.meta ?? {},
            //   tags: newLine.tags ?? [],
            // };
          } else if (newLine.lineKind === LineKind.Text) {
            newCompleteLine = {
              ...newLine,
              text: newLine.text,
              index: selectors.selectTotal(state),
            };
          } else if (newLine.lineKind === LineKind.Empty) {
            newCompleteLine = {
              ...newLine,
              breakLevel: newLine.breakLevel ?? LineBreakLevel.LineBreak,
              index: selectors.selectTotal(state),
            };
          } else {
            continue;
          }

          const lastLine = getLineByIndex(state, -1);
          if (lastLine == null) {
            linesCollectionAdapter.addOne(state, newCompleteLine);
            continue;
          }

          const lastLineIsWhiteSpace = lineIsWhitespace(lastLine);
          const newLineIsMinWhite = lineIsMinimalWhitespace(newCompleteLine);
          if (lastLineIsWhiteSpace && newLineIsMinWhite) {
            continue;
          }

          if (
            lastLineIsWhiteSpace &&
            lineIsMinimalWhitespace(lastLine) &&
            newCompleteLine.lineKind === LineKind.Empty &&
            newCompleteLine.breakLevel === LineBreakLevel.ChoiceSelection
          ) {
            linesCollectionAdapter.removeOne(state, lastLine.id);
          }
          linesCollectionAdapter.addOne(state, newCompleteLine);
        }
      },
      prepare(newLine: DistributiveSomePartial<NewLineValue, "id">) {
        if (newLine == null) {
          return {
            payload: null as any,
          };
        }
        const toInsert: NewLineValue[] = [
          {
            ...newLine,
            id: newLine.id ?? nanoid(),
            ...(newLine.lineKind === LineKind.Text && {
              text: newLine.text.trim(),
            }),
          },
        ];

        if (newLine.lineKind === LineKind.Text) {
          if (startBreakRE.test(newLine.text)) {
            toInsert.unshift(newBasicLineBreak());
          }
          if (endBreakRE.test(newLine.text)) {
            toInsert.push(newBasicLineBreak());
          }
        }
        return {
          payload: toInsert,
        };
      },
    },
    setLineMetadata(
      state,
      { payload }: PayloadAction<{ id: string; meta: Record<string, any> }>
    ) {
      const line = selectors.selectById(state, payload.id);
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

type LinesSliceState = ReturnType<typeof linesSlice["reducer"]>;
function getLineIdByIndex(state: LinesSliceState, index: number) {
  const lineIds = selectors.selectIds(state);
  return lineIds.at(index);
}
function getLineByIndex(state: LinesSliceState, index: number) {
  const lineId = getLineIdByIndex(state, index);
  if (lineId == null) return undefined;
  return selectors.selectById(state, lineId);
}

const globalLinesSelectors = linesCollectionAdapter.getSelectors(
  (state: ReduxState) => state.story.lines
);

export {
  globalLinesSelectors as linesSelectors,
  selectors as nonGlobalLinesSelectors,
};

export default linesSlice;
