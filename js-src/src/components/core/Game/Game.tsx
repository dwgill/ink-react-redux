import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { continueStory } from "../../../state/redux/actions/storyActions";
import { useSelector } from "../../../state/redux/store";
import Narrative from "../Narrative";

export default function Game() {
  const unstarted = useSelector((state) => {
    return (
      state.story.misc.canContinue &&
      state.story.lines.lineEntities.ids.length === 0 &&
      state.story.choices.ids.length === 0
    );
  });
  const dispatch = useDispatch();
  useEffect(() => {
    if (unstarted) {
      dispatch(continueStory({ maximally: true }));
    }
  }, [dispatch, unstarted]);
  return <Narrative />;
}
