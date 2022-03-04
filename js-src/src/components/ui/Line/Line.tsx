import React from "react";
import {
  Line as LineData, LineKind
} from "../../../state/redux/slices/story/lines";

interface LineProps {
  lineData: LineData;
  groupHeading: LineData | null;
}
export default function Line({ lineData, groupHeading }: LineProps) {
  if (lineData.kind === LineKind.Empty && groupHeading == null) {
    return <hr />;
  }
  if (lineData.kind === LineKind.Empty) {
    return null;
  }
  return <p id={lineData.id}>{lineData.text}</p>;
}
