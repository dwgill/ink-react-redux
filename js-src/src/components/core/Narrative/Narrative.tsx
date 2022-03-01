import React from "react";
import NarrativeLayout from "../../ui/NarrativeLayout";
import NarrativeChoices from "../NarrativeChoices";
import NarrativeLines from "../NarrativeLines";

const renderNarrativeLines = () => <NarrativeLines />;
const renderNarrativeChoices = () => <NarrativeChoices />;

export default function Narrative() {
  return (
    <NarrativeLayout
      renderNarrativeChoices={renderNarrativeChoices}
      renderNarrativeLines={renderNarrativeLines}
    />
  );
}
