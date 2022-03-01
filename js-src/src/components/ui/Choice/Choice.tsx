import React from "react";
import { useDispatch } from "react-redux";
import { selectChoice } from "../../../state/redux/actions/storyActions";
import { Choice as ChoiceData } from "../../../state/redux/slices/story/choices";
import styles from "./Choice.module.css";

interface ChoiceProps {
  choiceData: ChoiceData;
}
export default function Choice({ choiceData: { text, id } }: ChoiceProps) {
  const dispatch = useDispatch();
  return (
    <li className={styles.item}>
      <button
        className={styles.btn}
        type="button"
        onClick={() => dispatch(selectChoice({ choiceId: id, maximally: true }))}
      >
        {text}
      </button>
    </li>
  );
}
