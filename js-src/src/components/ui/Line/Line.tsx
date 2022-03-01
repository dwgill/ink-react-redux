import React from "react";
import { Line as LineData } from "../../../state/redux/slices/story/lines";

interface LineProps {
  lineData: LineData;
}
export default function Line({ lineData }: LineProps) {
  return (
    <>
      {lineData.startBreak && <br />}
      <span id={lineData.id} style={{ display: "inline" }}>
        {lineData.text}
      </span>
      {lineData.endBreak && <br />}
    </>
  );
}
