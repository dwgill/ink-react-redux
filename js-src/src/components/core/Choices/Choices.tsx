import { EntityId } from "@reduxjs/toolkit";
import React, { memo } from "react";
import { useSelectChoiceId } from "../../../hooks/useSelectChoice";
import { getChoice, getChoiceIds } from "../../../state/redux/selectors/story";
import { Choice as ChoiceData } from "../../../state/redux/slices/story/choices";
import { useSelector } from "../../../state/redux/store";

interface ChoicesProps {
  choiceComponent?: React.ComponentType<ChoiceProps>;
  continueMaximally?: boolean;
}
export default function Choices({
  choiceComponent: ChoiceComponent = DefaultChoice,
}: ChoicesProps) {
  const choiceIds = useSelector(getChoiceIds);
  return (
    <>
      {choiceIds.map((choiceId) => (
        <ChoiceWrapper
          key={choiceId}
          choiceId={choiceId}
          choiceComponent={ChoiceComponent}
        />
      ))}
    </>
  );
}

interface ChoiceWrapperProps {
  choiceId: EntityId;
  choiceComponent: React.ComponentType<ChoiceProps>;
}
const ChoiceWrapper = memo(function ChoiceWrapper({
  choiceId,
  choiceComponent: ChoiceComponent,
}: ChoiceWrapperProps) {
  const choiceData = useSelector((state) => getChoice(state, choiceId));
  if (choiceData == null) {
    return null;
  }
  return <ChoiceComponent choiceData={choiceData} />;
});

interface ChoiceProps {
  choiceData: ChoiceData;
}
function DefaultChoice({ choiceData }: ChoiceProps) {
  const handleSelect = useSelectChoiceId(choiceData.id);
  return (
    <li>
      <button onClick={() => handleSelect()}>{choiceData.text}</button>
    </li>
  );
}
