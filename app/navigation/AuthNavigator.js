import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { Login } from "../screens/Login";
import { Register } from "../screens/Register";
import { Privacy } from "../screens/Privacy";
import { Forgot } from "../screens/Forgot";

const AuthStack = createStackNavigator();

export default () => {
  return (
    <AuthStack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
      <AuthStack.Screen name="Forgot" component={Forgot} />
      <AuthStack.Screen
        name="Privacy"
        component={Privacy}
        options={{ headerTitle: "Privacy Policy" }}
      />
    </AuthStack.Navigator>
  );
};
