import React, { createContext, useReducer, useMemo } from "react";
import authInitialState from "./initialStates/authState";
import auth from "./reducers/auth";
import "../utils/i18n";
export const GlobalContext = createContext({});

const GlobalProvider = ({ children }) => {
  const [authState, authDispatch] = useReducer(auth, authInitialState);

  const value = useMemo(
    () => ({ authState, authDispatch }),
    [authState, authDispatch]
  );

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export default GlobalProvider;
