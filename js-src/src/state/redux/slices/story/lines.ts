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
import { defaultConfig } from "../../../story/inkStoryConfig";
import type { ReduxState } from "../../store";
import { Line, LineOrigin, TextualLine } from "../../types";

type NewTextualLineValue = SomeOmitSomePartial<
  TextualLine,
  "index" | "meta" | "groupTags" | "ungroupTags",
  "tags" | "origin"
>;

function isEmptyLine(line: TextualLine) {
  if (line == null) return false;
  if (line.origin !== LineOrigin.Story) return false;
  if (line.text !== "") return false;
  if (line.tags && Object.keys(line.tags).length) return false;
  if (line.meta && Object.values(line.meta).length) return false;
  return true;
}

function evaluateLineGroupingNumber(line: Line | undefined | null) {
  if (line == null) return 0;
  if (line.groupTags?.length) return 1;
  if (line.ungroupTags?.length) return -1;
  return 0;
}

type NewLineValue = NewTextualLineValue;

const linesCollectionAdapter = createEntityAdapter<Line>({
  selectId: (line) => line.id,
  sortComparer: (a, b) => a.index - b.index,
});

const initialState = {
  lineEntities: linesCollectionAdapter.getInitialState(),
  lineGroupings: [] as number[],
};

const lineSelectors = linesCollectionAdapter.getSelectors(
  (state: typeof initialState) => state.lineEntities
);

const linesSlice = createSlice({
  name: "story/lines",
  initialState: initialState,
  reducers: {
    addLine: {
      reducer(state, { payload: newLines }: PayloadAction<NewLineValue[]>) {
        if (!newLines?.length) return;

        for (const partialNewLine of newLines) {
          const newLine: Line = {
            id: partialNewLine.id,
            kind: partialNewLine.kind,
            text: partialNewLine.text?.trim() ?? "",
            index: lineSelectors.selectTotal(state),
            origin: partialNewLine.origin ?? LineOrigin.Story,
            ...(partialNewLine.tags &&
              Object.keys(partialNewLine.tags).length && {
                tags: partialNewLine.tags,
                groupTags: defaultConfig.lineGrouping?.groupTags.filter(
                  (tag) => tag in partialNewLine.tags!
                ),
                ungroupTags: defaultConfig.lineGrouping?.grouplessTags.filter(
                  (tag) => tag in partialNewLine.tags!
                ),
              }),
          };
          if (!isEmptyLine(newLine)) {
            linesCollectionAdapter.addOne(state.lineEntities, newLine);
          }
        }

        const totalLinesNum = lineSelectors.selectTotal(state);
        if (state.lineGroupings.length > totalLinesNum) {
          state.lineGroupings = lineSelectors
            .selectAll(state)
            .map(evaluateLineGroupingNumber);
        }

        if (state.lineGroupings.length < totalLinesNum) {
          for (let i = state.lineGroupings.length; i < totalLinesNum; i++) {
            state.lineGroupings.push(
              evaluateLineGroupingNumber(getLineByIndex(state, i))
            );
          }
        }
      },
      prepare(newLine: DistributiveSomePartial<NewLineValue, "id">) {
        if (newLine == null) {
          return {
            payload: null as any,
          };
        }

        return {
          payload: [
            {
              ...newLine,
              id: newLine.id ?? nanoid(),
              text: newLine.text?.trim() ?? "",
            },
          ],
        };
      },
    },
    setLineMetadata(
      state,
      { payload }: PayloadAction<{ id: string; meta: Record<string, any> }>
    ) {
      const line = lineSelectors.selectById(state, payload.id);
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
      linesCollectionAdapter.updateOne(state.lineEntities, {
        id: payload.id,
        changes: {
          meta: Object.keys(newMeta).length ? newMeta : undefined,
        },
      });
    },
  },
});

type LinesSliceState = ReturnType<typeof linesSlice["reducer"]>;
function getLineIdByIndex(state: LinesSliceState, index: number) {
  if (index == null) return undefined;
  const lineIds = lineSelectors.selectIds(state);
  return lineIds.at(index);
}
function getLineByIndex(state: LinesSliceState, index: number) {
  const lineId = getLineIdByIndex(state, index);
  if (lineId == null) return undefined;
  return lineSelectors.selectById(state, lineId);
}

const globalLinesSelectors = {
  ...linesCollectionAdapter.getSelectors(
    (state: ReduxState) => state.story.lines.lineEntities
  ),
  getLineByIndex(state: ReduxState, index: number) {
    return getLineByIndex(state?.story?.lines, index);
  },
  getLineIdByIndex(state: ReduxState, index: number) {
    return getLineIdByIndex(state?.story?.lines, index);
  },
};

export {
  globalLinesSelectors as linesSelectors,
  lineSelectors as nonGlobalLinesSelectors,
};

export default linesSlice;
