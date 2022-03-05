import React, { ReactNode } from "react";
import "beercss";
import styles from "./App.module.css";
import { Provider } from "react-redux";
import { getStore } from "../../../state/redux/store";
import Game from "../../core/Game";

function App() {
  return (
    <Provider store={getStore()}>
      <Game />
    </Provider>
  );
}

export default App;
