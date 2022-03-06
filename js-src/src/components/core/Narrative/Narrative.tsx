import { EntityId } from "@reduxjs/toolkit";
import React, { memo, ReactNode, useMemo } from "react";
import { getLine, getLineIds } from "../../../state/redux/selectors/story";
import { useSelector } from "../../../state/redux/store";
import { Line as LineData } from "../../../state/redux/types";
import arraysAreShallowEqual from "../../../util/arraysAreShallowEqual";
import groupEntityIds from "../../../util/groupEntityIds";

interface NarrativeProps {
  lineComponent?: React.ComponentType<LineProps>;
  lineGroupComponent?: React.ComponentType<LineGroupProps>;
}

export default memo(function Narrative({
  lineComponent: LineComponent = DefaultLine,
  lineGroupComponent: LineGroupComponent = DefaultLineGroup,
}: NarrativeProps) {
  const lineIds = useSelector(getLineIds);
  const lineGroupDefinitions = useSelector(
    (state) => state.story.lines.lineGroupDefinitions
  );

  const groupedLineIds = useMemo(
    () => groupEntityIds(lineIds, lineGroupDefinitions),
    [lineIds, lineGroupDefinitions]
  );

  return (
    <>
      {groupedLineIds.map((lineOrGroup, index) => {
        if (!Array.isArray(lineOrGroup)) {
          return (
            <LineWrapper
              lineId={lineOrGroup}
              groupHeadingId={null}
              lineComponent={LineComponent}
              key={lineOrGroup}
            />
          );
        }
        return (
          <LineGroupWrapper
            groupIndex={index}
            key={lineOrGroup[0]}
            lineIds={lineOrGroup}
            lineComponent={LineComponent}
            lineGroupComponent={LineGroupComponent}
          />
        );
      })}
    </>
  );
});


interface LineGroupWrapperProps {
  lineIds: EntityId[];
  groupIndex: number;
  lineComponent?: React.ComponentType<LineProps>;
  lineGroupComponent?: React.ComponentType<LineGroupProps>;
}

const LineGroupWrapper = memo(
  function LineGroupWrapper({
    lineIds,
    groupIndex,
    lineComponent: LineComponent,
    lineGroupComponent: LineGroupComponent = DefaultLineGroup,
  }: LineGroupWrapperProps) {
    const firstLine = useSelector((state) => getLine(state, lineIds[0]));
    if (!lineIds.length) {
      return null;
    }

    return (
      <LineGroupComponent firstLine={firstLine ?? null} groupIndex={groupIndex}>
        {lineIds.map((lineId) => (
          <LineWrapper
            key={lineId}
            lineId={lineId}
            groupHeadingId={firstLine?.id}
            lineComponent={LineComponent}
          />
        ))}
      </LineGroupComponent>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.groupIndex === nextProps.groupIndex &&
      prevProps.lineComponent === nextProps.lineComponent &&
      prevProps.lineGroupComponent === nextProps.lineGroupComponent &&
      arraysAreShallowEqual(prevProps.lineIds, nextProps.lineIds)
    );
  }
);

interface LineGroupProps {
  children: ReactNode;
  firstLine: LineData | null;
  groupIndex: number;
}

function DefaultLineGroup({ children }: LineGroupProps) {
  return <>{children}</>;
}


interface LineWrapperProps {
  lineId: EntityId;
  groupHeadingId?: EntityId | null;
  lineComponent?: React.ComponentType<LineProps>;
}

const LineWrapper = memo(function LineWrapper({
  lineId,
  groupHeadingId,
  lineComponent: LineComponent = DefaultLine,
}: LineWrapperProps) {
  const line = useSelector((state) => getLine(state, lineId));
  const groupHeading = useSelector((state) =>
    !groupHeadingId ? null : getLine(state, groupHeadingId) ?? null
  );

  if (line == null) {
    return null;
  }

  return <LineComponent line={line} groupHeading={groupHeading} />;
});

interface LineProps {
  line: LineData;
  groupHeading: LineData | null;
}

function DefaultLine({ line }: LineProps) {
  return <p>{line.text}</p>
}
