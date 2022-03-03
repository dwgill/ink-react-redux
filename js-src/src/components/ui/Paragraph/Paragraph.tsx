import React, { ReactNode } from "react";
import { Line } from "../../../state/redux/slices/story/lines";

interface NarrativeLinesParagraphContainerProps {
  children: ReactNode;
  firstLine: Line | null;
}
export default function NarrativeLinesParagraphContainer({
  children,
}: NarrativeLinesParagraphContainerProps) {
  return <p>{children}</p>;
}
