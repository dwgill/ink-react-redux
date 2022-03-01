import React, { ReactNode } from "react";

interface NarrativeLinesContainerProps {
  children: ReactNode;
}
export default function NarrativeLinesContainer({
  children,
}: NarrativeLinesContainerProps) {
  return <>{children}</>;
}
