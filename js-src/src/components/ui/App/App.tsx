import React from "react";
import { Provider } from "react-redux";
import { getStore } from "../../../state/redux/store";
import Game from "../Game";

function App() {
  return (
    <Provider store={getStore()}>
      <Game />
    </Provider>
  );
}

export default App;
