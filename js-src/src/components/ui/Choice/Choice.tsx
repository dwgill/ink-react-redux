import React from "react";
import { Choice as ChoiceData } from "../../../state/redux/slices/story/choices";

interface ChoiceProps {
  choiceData: ChoiceData;
}
export default function Choice({
  choiceData: { text },
}: ChoiceProps) {
  return <li>{text}</li>;
}
