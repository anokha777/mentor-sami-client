import React, { useReducer, useContext } from "react";
import { initialState, authReducer } from "./auth";
import { messageReducer, messageInitialState } from "./message";

const AppStoreContext = React.createContext();

const store = {
  message: messageInitialState,
  auth: initialState,
};

const reducers = (store, action) => ({
  message: messageReducer(store.message, action),
  auth: authReducer(store.auth, action),
});

export const AppStoreProvider = ({ children }) => (
  <AppStoreContext.Provider value={useReducer(reducers, store)}>
    {children}
  </AppStoreContext.Provider>
);

export const useStore = () => useContext(AppStoreContext);
