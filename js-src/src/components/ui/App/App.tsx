import React, { ReactNode } from 'react';
import 'beercss';
import styles from './App.module.css';

interface AppProps {
  children: ReactNode;
}

function App({ children }: AppProps) {
  return (
    <div className={styles.app}>
      {children}
    </div>
  );
}

export default App;
