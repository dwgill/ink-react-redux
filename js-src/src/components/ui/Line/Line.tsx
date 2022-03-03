import React from "react";
import {
  Line as LineData,
  LineBreakLevel,
  LineKind
} from "../../../state/redux/slices/story/lines";

interface LineProps {
  lineData: LineData;
  outsideParagraph: boolean;
}
export default function Line({ lineData, outsideParagraph }: LineProps) {
  if (lineData.lineKind === LineKind.Empty) {
    return (
      <>
        {outsideParagraph &&
          lineData.breakLevel === LineBreakLevel.ChoiceSelection && <hr />}
      </>
    );
  }
  return (
    <span id={lineData.id}>
      {lineData.text}
    </span>
  );
}
