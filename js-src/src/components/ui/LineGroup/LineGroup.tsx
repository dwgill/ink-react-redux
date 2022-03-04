import React, { ReactNode } from "react";
import { Line } from "../../../state/redux/slices/story/lines";

interface LineGroupProps {
  children: ReactNode;
  firstLine: Line | null;
}
export default function LineGroup({
  children,
}: LineGroupProps) {
  return <div style={{outline: 'dotted grey'}}>{children}</div>;
}
