import { EntityId } from "@reduxjs/toolkit";
import React, { memo } from "react";
import { getLine, getLineIds } from "../../../state/redux/selectors/story";
import { useSelector } from "../../../state/redux/store";
import Line from "../../ui/Line";
import NarrativeLinesContainer from "../../ui/NarrativeLinesContainer";

export default memo(function NarrativeLines() {
  const lineIds = useSelector(getLineIds);

  return (
    <NarrativeLinesContainer>
      {lineIds.map((lineId) => (
        <LineWrapper key={lineId} lineId={lineId} />
      ))}
    </NarrativeLinesContainer>
  );
});

interface LineWrapperProps {
  lineId: EntityId;
}
const LineWrapper = memo(function LineWrapper({ lineId }: LineWrapperProps) {
  const line = useSelector((state) => getLine(state, lineId));
  if (line == null) {
    return null;
  }
  return <Line lineData={line} />;
});
