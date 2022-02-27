import { configureStore } from '@reduxjs/toolkit'
import reducer from './reducer'

export const store = configureStore({
  reducer,
});

export type Store = typeof store;
export type Dispatch = Store['dispatch'];
export type ReduxState = ReturnType<Store['getState']>;
