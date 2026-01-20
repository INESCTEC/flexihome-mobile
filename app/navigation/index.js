import React, { useContext, useReducer, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { GlobalContext } from "../context/Provider";
// import { Login } from "../screens/Login";
// import { Register } from "../screens/Register";
// import HomeScreen from "../screens/HomeScreen";
// import Settings from "../screens/Settings";
// import { FlexibilityPlan } from "../screens/Flexibility";
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import Drawer from "./Drawer";

const Stack = createNativeStackNavigator();
export const AppContainer = () => {
  const { t } = useTranslation();
  const {
    authDispatch,
    authState: { isLoggedIn, data, userToken },
  } = useContext(GlobalContext);
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn);
  const [authLoaded, setAuthLoaded] = useState(false);


  return (
    <NavigationContainer>
      <ActionSheetProvider>
        <Drawer {...data} />
      </ActionSheetProvider>
    </NavigationContainer>
  );

};
