import React from "react";
import NarrativeLayout from "../../ui/NarrativeLayout";
import NarrativeChoices from "../NarrativeChoices";
import NarrativeLines from "../NarrativeLines";

export default function Narrative() {
  return (
    <NarrativeLayout
      choices={<NarrativeChoices />}
      lines={<NarrativeLines />}
    />
  );
}
