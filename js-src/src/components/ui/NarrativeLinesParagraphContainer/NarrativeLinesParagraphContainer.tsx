import React, { ReactNode } from "react";

interface NarrativeLinesParagraphContainerProps {
  children: ReactNode;
}
export default function NarrativeLinesParagraphContainer({
  children,
}: NarrativeLinesParagraphContainerProps) {
  return <p style={{ border: '' }}>{children}</p>;
}
