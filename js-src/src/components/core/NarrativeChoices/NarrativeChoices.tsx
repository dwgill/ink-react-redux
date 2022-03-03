import { EntityId } from "@reduxjs/toolkit";
import React, { memo } from "react";
import { getChoice, getChoiceIds } from "../../../state/redux/selectors/story";
import { useSelector } from "../../../state/redux/store";
import Choice from "../../ui/Choice";
import ChoicesBox from "../../ui/ChoicesBox";

export default function NarrativeChoices() {
  const choiceIds = useSelector(getChoiceIds);
  return (
    <ChoicesBox>
      {choiceIds.map((choiceId) => (
        <ChoiceWrapper key={choiceId} choiceId={choiceId} />
      ))}
    </ChoicesBox>
  );
}

interface ChoiceWrapperProps {
  choiceId: EntityId;
}
const ChoiceWrapper = memo(function ChoiceWrapper({ choiceId }: ChoiceWrapperProps) {
  const choiceData = useSelector((state) => getChoice(state, choiceId));
  if (choiceData == null) {
    return null;
  }

  return <Choice choiceData={choiceData} />;
})
