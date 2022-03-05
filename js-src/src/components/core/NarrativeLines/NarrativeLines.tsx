import { EntityId } from "@reduxjs/toolkit";
import React, { memo, useMemo } from "react";
import { getLine, getLineIds } from "../../../state/redux/selectors/story";
import { useSelector } from "../../../state/redux/store";
import arraysAreShallowEqual from "../../../util/arraysAreShallowEqual";
import groupEntityIds from "../../../util/groupEntityIds";
import Line from "../../ui/Line";
import LineGroup from "../../ui/LineGroup";

export default memo(function NarrativeLines() {
  const lineIds = useSelector(getLineIds);
  const lineIdsGroupings = useSelector(
    (state) => state.story.lines.lineGroupings
  );

  const groupedLineIds = useMemo(
    () => groupEntityIds(lineIds, lineIdsGroupings),
    [lineIds, lineIdsGroupings]
  );

  return (
    <>
      {groupedLineIds.map((lineOrGroup, index) => {
        if (!Array.isArray(lineOrGroup)) {
          return (
            <LineWrapper
              lineId={lineOrGroup}
              groupHeadingId={null}
              key={lineOrGroup}
            />
          );
        }
        return (
          <LineGroupWrapper
            groupIndex={index}
            key={lineOrGroup[0]}
            lineIds={lineOrGroup}
          />
        );
      })}
    </>
  );
});

interface LineGroupWrapperProps {
  lineIds: EntityId[];
  groupIndex: number;
}
const LineGroupWrapper = memo(
  function LineGroupWrapper({ lineIds, groupIndex }: LineGroupWrapperProps) {
    const firstLine = useSelector((state) => getLine(state, lineIds[0]));
    if (!lineIds.length) {
      return null;
    }

    return (
      <LineGroup firstLine={firstLine ?? null} groupIndex={groupIndex}>
        {lineIds.map((lineId) => (
          <LineWrapper
            key={lineId}
            lineId={lineId}
            groupHeadingId={firstLine?.id}
          />
        ))}
      </LineGroup>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.groupIndex === nextProps.groupIndex &&
      arraysAreShallowEqual(prevProps.lineIds, nextProps.lineIds)
    );
  }
);

interface LineWrapperProps {
  lineId: EntityId;
  groupHeadingId?: EntityId | null;
}
const LineWrapper = memo(function LineWrapper({
  lineId,
  groupHeadingId,
}: LineWrapperProps) {
  const line = useSelector((state) => getLine(state, lineId));
  const groupHeading = useSelector((state) =>
    !groupHeadingId ? null : getLine(state, groupHeadingId) ?? null
  );

  if (line == null) {
    return null;
  }
  return <Line lineData={line} groupHeading={groupHeading} />;
});
