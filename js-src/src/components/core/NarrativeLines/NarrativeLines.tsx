import { EntityId } from "@reduxjs/toolkit";
import React, { memo } from "react";
import { getLine, getLineIds } from "../../../state/redux/selectors/story";
import {
  LineBreakLevel,
  LineKind,
} from "../../../state/redux/slices/story/lines";
import { useSelector } from "../../../state/redux/store";
import splitArray from "../../../util/splitArray";
import Line from "../../ui/Line";
import NarrativeLinesContainer from "../../ui/NarrativeLinesContainer";
import NarrativeLinesParagraphContainer from "../../ui/NarrativeLinesParagraphContainer";
import NewParagraph from "../NewParagraph";
import {
  paragraphRegistryContext,
  useParagraphIndexMap,
} from "../NewParagraph/paragraphRegistry";

export default memo(function NarrativeLines() {
  const lineIds = useSelector(getLineIds);
  const [pIndexMap, pRegistry] = useParagraphIndexMap();

  const linesByParagraph = splitArray(
    lineIds,
    (_, index) => index in pIndexMap,
    /**
     * It's imperative that we actually render delimiters.
     * They may render something to the DOM (such as an hr)
     * but since they notify the registry about existing in
     * the first place, we'll immediately forget they're
     * delimiters if we fail to render them. This causes an
     * infinite loop of rendering:
     * 1: recognize that they're delimiters
     * 2: stop rendering them because they're delimiters
     * 3: stop recognizing them as delimiters
     * 4: render them because we think they're normal text
     * 5: repeat
     */
    "start"
  );

  return (
    <NarrativeLinesContainer>
      <paragraphRegistryContext.Provider value={pRegistry}>
        {linesByParagraph.map((paragraphOfLineIds, pIndex) => {
          const isFirstParagraph = pIndex === 0;
          const [firstLineId, ...lineIds] = paragraphOfLineIds;
          return (
            <React.Fragment key={paragraphOfLineIds[0]}>
              {!isFirstParagraph && (
                <LineWrapper
                  key={firstLineId}
                  lineId={firstLineId}
                  outsideParagraph
                />
              )}
              {(isFirstParagraph || !!lineIds.length) && (
                <NarrativeLinesParagraphContainer>
                  {isFirstParagraph && (
                    <LineWrapper key={firstLineId} lineId={firstLineId} />
                  )}
                  {lineIds.map((lineId) => (
                    <LineWrapper key={lineId} lineId={lineId} />
                  ))}
                </NarrativeLinesParagraphContainer>
              )}
            </React.Fragment>
          );
        })}
      </paragraphRegistryContext.Provider>
    </NarrativeLinesContainer>
  );
});

interface LineWrapperProps {
  lineId: EntityId;
  outsideParagraph?: boolean;
}
const LineWrapper = memo(function LineWrapper({
  lineId,
  outsideParagraph = false,
}: LineWrapperProps) {
  const line = useSelector((state) => getLine(state, lineId));
  if (line == null) {
    return null;
  }
  return (
    <>
      {line.lineKind === LineKind.Empty &&
        line.breakLevel !== LineBreakLevel.None && (
          <NewParagraph index={line.index} />
        )}
      <Line lineData={line} outsideParagraph={outsideParagraph} />
    </>
  );
});
