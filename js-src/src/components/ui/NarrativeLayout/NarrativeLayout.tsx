import React, { ReactNode } from "react";
import styles from "./NarrativeLayout.module.css";

interface NarrativeLayoutProps {
  renderNarrativeLines(): ReactNode;
  renderNarrativeChoices(): ReactNode;
}
export default function NarrativeLayout({
  renderNarrativeChoices,
  renderNarrativeLines,
}: NarrativeLayoutProps) {
  return (
    <div className={styles.container}>
      {renderNarrativeLines()}
      <div />
      {renderNarrativeChoices()}
    </div>
  );
}
