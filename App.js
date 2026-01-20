import "react-native-gesture-handler";
import * as React from "react";

import GlobalProvider from "./app/context/Provider";
// import { Dimensions } from "react-native";
import {
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
  Provider as PaperProvider,
} from "react-native-paper";

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";

const theme = { ...DefaultTheme };
const paperTheme = { ...PaperDefaultTheme };
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppContainer } from "./app/navigation";

export default function App() {
  // console.log(theme.colors);
  // const x = Dimensions.get("screen");
  // console.log(`App dim:\n ${JSON.stringify(x)}`);
  return (
    <PaperProvider theme={paperTheme}>
      <SafeAreaProvider>
        <GlobalProvider>
          <AppContainer />
        </GlobalProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
