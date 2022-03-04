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
  Text = "text",
  Empty = "empty",
}

export enum LineOrigin {
  Story = "story",
  Choice = "choice",
  NewLine = "new_line",
}

interface AbstractLine {
  readonly id: string;
  readonly kind: unknown;
  readonly origin: unknown;
  readonly index: number;
  readonly meta?: Record<string, any>;
  readonly tags?: string[];
}

export interface TextualLine extends AbstractLine {
  readonly kind: LineKind.Text;
  readonly text: string;
  readonly origin: LineOrigin.Story | LineOrigin.Choice;
}

export interface EmptyLine extends AbstractLine {
  readonly kind: LineKind.Empty;
  readonly origin: LineOrigin.Choice | LineOrigin.NewLine;
}

export type Line = TextualLine | EmptyLine;

type NewTextualLineValue = SomeOmitSomePartial<
  TextualLine,
  "index" | "meta",
  "tags" | "origin"
>;

type NewEmptyLineValue = SomeOmitSomePartial<
  EmptyLine,
  "index" | "meta",
  "tags" | "origin"
>;

export const featurelessNewLine = (): NewEmptyLineValue => ({
  id: nanoid(),
  kind: LineKind.Empty,
  origin: LineOrigin.NewLine,
});

function isFeaturelessNewline(line: EmptyLine) {
  if (line == null) return false;
  if (line.origin !== LineOrigin.NewLine) return false;
  if (line.tags?.length) return false;
  if (line.meta && Object.values(line.meta).length) return false;
  return true;
}

function isFeaturelessText(line: TextualLine) {
  if (line == null) return false;
  if (line.origin !== LineOrigin.Story) return false;
  if (line.text !== '') return false;
  if (line.tags?.length) return false;
  if (line.meta && Object.values(line.meta).length) return false;
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

        for (const partialNewLine of newLines) {
          let newLine: Line;
          if (partialNewLine.kind === LineKind.Text) {
            newLine = {
              ...partialNewLine,
              text: partialNewLine.text.trim(),
              index: selectors.selectTotal(state),
              origin: partialNewLine.origin ?? LineOrigin.Story,
            };
            if (isFeaturelessText(newLine)) {
              continue;
            }
          } else if (partialNewLine.kind === LineKind.Empty) {
            newLine = {
              ...partialNewLine,
              origin: partialNewLine.origin ?? LineOrigin.NewLine,
              index: selectors.selectTotal(state),
            };
          } else {
            continue;
          }

          const lastLine = getLineByIndex(state, -1);
          if (
            lastLine == null ||
            lastLine.kind !== LineKind.Empty ||
            newLine.kind !== LineKind.Empty
          ) {
            linesCollectionAdapter.addOne(state, newLine);
            continue;
          }

          if (isFeaturelessNewline(newLine)) {
            // This incoming line is an empty line with no distinguishing features
            // and the predecessor is also an empty line. This new line is redundant,
            // so let's skip inserting it. 
            continue;
          }

          if (isFeaturelessNewline(lastLine)) {
            // This incoming line is an empty line with some distinguishing features,
            // but the previous line is an empty line with no distinctions.
            // So the prev line should be replaced with the new line.
            linesCollectionAdapter.removeOne(state, lastLine.id); 
          }

          linesCollectionAdapter.addOne(state, newLine);
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
            ...(newLine.kind === LineKind.Text && {
              text: newLine.text.trim(),
            }),
          },
        ];

        if (newLine.kind === LineKind.Text) {
          if (startBreakRE.test(newLine.text)) {
            toInsert.unshift(featurelessNewLine());
          }
          if (endBreakRE.test(newLine.text)) {
            toInsert.push(featurelessNewLine());
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
