import React, { ReactNode } from "react";
import { Line } from "../../../state/redux/types";
import styles from "./LineGroup.module.css";

interface LineGroupProps {
  children: ReactNode;
  firstLine: Line | null;
  groupIndex: number;
}
export default function LineGroup({ children }: LineGroupProps) {
  return <div className={styles.group}>{children}</div>;
}
