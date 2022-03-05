import React, { ReactNode } from "react";
import styles from "./NarrativeLayout.module.css";

interface NarrativeLayoutProps {
  lines: ReactNode;
  choices: ReactNode;
}
export default function NarrativeLayout({
  lines,
  choices,
}: NarrativeLayoutProps) {
  return (
    <div className={styles.container}>
      {lines}
      <div />
      {choices}
    </div>
  );
}
