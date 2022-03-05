import React from "react";
import {
} from "../../../state/redux/slices/story/lines";
import { Line as LineData } from "../../../state/redux/types";

interface LineProps {
  lineData: LineData;
  groupHeading: LineData | null;
}
export default function Line({ lineData, groupHeading }: LineProps) {
  if (!lineData.text) return null;
  return <p id={lineData.id}>{lineData.text}</p>;
}
