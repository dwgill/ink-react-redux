import React, { useEffect } from "react";
import { useContinueStory } from "../../../hooks/useContinueStory";
import Choices from "../../core/Choices";
import Narrative from "../../core/Narrative";

export default function Game() {
  const handleContinue = useContinueStory();
  useEffect(() => {
    handleContinue();
  }, [handleContinue])
  return (
    <>
      <div>
        <Narrative />
      </div>
      <hr />
      <menu>
        <Choices />
      </menu>
    </>
  );
}
