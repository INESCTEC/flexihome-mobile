import * as React from "react";
import { View, Platform, Image, useWindowDimensions, StatusBar } from "react-native";
import { GlobalContext } from "../context/Provider";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";

import HomeScreen from "../screens/HomeScreen";
import Details from "../screens/Details";
import Producer from "../screens/Producer";
// import Help from "../screens/Help";
import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import Settings from "../screens/Settings";

import Flexibility from "../screens/Flexibility";
import Logout from "../screens/Logout";
// import { AppAddNew, NewDevice } from "../screens/NewDevice";

// import Notifications from "../screens/Notifications";
import { Privacy } from "../screens/Privacy";
import ManufactView from "../components/ManufactWeb";
// import { CompleteNewUser } from "../screens/CompleteUserInfo";
// import { ScheduleCal } from "../screens/ScheduleCal";
// import { DemoBoard } from "../screens/DemoBoard";

import { Login } from "../screens/Login";
import { Register } from "../screens/Register";
import { Forgot } from "../screens/Forgot";
import { InfoUser } from "../screens/InfoUser";
import { react_colors } from "../styles";
import AppInfo from "../screens/modals/AppInfo";
import Incentives from "../screens/Incentives";
import FilterModal from "../screens/modals/FilterModal";
import HowToUse from "../screens/HowToUse";

import { Recover } from "../screens/Recover";
// import  HowToUse from "../screens/HowToUse";

const logo = require("../assets/splash-icon.png");

const AutomationButtons = ({ navigation }) => {
  // const { navigation, route } = props;
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
      }}
    >
      <Ionicons
        style={{
          padding: 8,
        }}
        name="notifications"
        onPress={() => {
          navigation.navigate("Notifications");
        }}
        color="#fff"
        size={30}
      />
      {/* <AutomationButtonPlus navigation={navigation} /> */}
    </View>
  );
};

//Importante ao usar Drawer ou Tab, se quiser ter status bars diferentes:
// https://reactnavigation.org/docs/status-bar

// https://reactnavigation.org/docs/custom-android-back-button-handling
// ANDOID BACKBUTTON

const HomeButtons = ({ route, navigation }) => {
  const [count, setCount] = React.useState(0);
  const _data = require("../utils/global-state.json");
  const isGuest = route.params.isIncomplete;

  const demoData = _data[3].appliances; //TODO: review demo data
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
      }}
    >
      <Ionicons
        style={{
          padding: 8,
        }}
        name="egg"
        onPress={() => {
          if (count < 5) {
            setCount(count + 1);
          }
          if (count == 4) {
            // console.log("Activa demo mode");
            navigation.navigate("HomeScreen", { ...route, demoData });
          }
        }}
        color={count < 5 ? "#000" : "#f00"}
        size={30}
      />
      <Ionicons
        style={{
          padding: 8,
        }}
        name="notifications"
        onPress={() => {
          navigation.navigate("Notifications");
        }}
        color="#fff"
        size={30}
      />
      <Ionicons
        style={{
          padding: 8,
        }}
        name="add-circle"
        color={"#fff"}
        size={30}
        onPress={() => {
          isGuest
            ? navigation.navigate("CompleteInfo", { ...route.params })
            : navigation.navigate("AddDevice");
        }}
        // title={t("MENUaddDevice")}
      />

      {/* <HomeButtonPlus navigation={navigation} /> */}
    </View>
  );
};
//Test modal screen
function ModalScreen({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: react_colors.blanchedalmond,
      }}
    ></View>
  );
}
// const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const [t, i18n] = useTranslation();

  return (
    <Stack.Navigator
      initialRouteName="Login"
    >
      <Stack.Screen
        name="Login"
        component={Login}
        // screenOptions={{ headerShown: false }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerTitle: t("REGISTERtitle") }}
      />
      <Stack.Screen
        name="Forgot"
        component={Forgot}
        options={{ headerTitle: t("FORGOTtitle") }}
      />
      <Stack.Screen
        name="Recover"
        component={Recover}
        options={{ headerTitle: t("RECOVERtitle") }}
      />
      <Stack.Screen
        name="Privacy"
        component={Privacy}
        options={{ headerTitle: t("UPrivacyTitle") }}
      />
      <Stack.Screen
        name="AppInfo"
        component={AppInfo}
        options={{ presentation: "transparentModal", headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const HomeStack = (props) => {
  const { navigation, route } = props;
  const [t, i18n] = useTranslation();
  
  // TODO: Test if this is compatible with New Architecture
  // React.useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => <HomeButtons navigation={navigation} />,
  //   });
  // }, [navigation]);

  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener("tabPress", (e) => {
  //     // e.preventDefault();
  //     console.log("TAB CHANGED: ", props);
  //     console.log({ ...props });
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  return (
    <Stack.Navigator
      // screenOptions={{
      // headerShown: false,
      //   headerStyle: { backgroundColor: "#000" },
      //   headerTintColor: "#fff",
      // }}
    >
      <Stack.Screen
        name="DevScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddDevice"
        component={ManufactView}
        options={{ headerTitle: t("MENUaddDevice") }}
      />
      <Stack.Screen
        name="Details"
        component={Details}
        options={{ presentation: "modal", headerShown: false }}
      />
      {/* <Stack.Screen
        name="DemoBoard"
        component={DemoBoard}
        options={{ presentation: "modal", headerTitle: t("Demo mode") }}
      /> */}
      
      {/* <Stack.Screen
        name="AddDevice2"
        component={AppAddNew}
        options={{ presentation: "modal", headerTitle: t("MENUaddDevice") }}
      />
      <Stack.Screen
        name="Privacy"
        component={Privacy}
        options={{ presentation: "modal", headerTitle: t("UPrivacyTitle") }}
      />
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{ presentation: "modal", headerTitle: t("NAVnotifs") }}
      />
      <Stack.Screen
        name="CompleteInfo"
        component={CompleteNewUser}
        options={{
          presentation: "modal",
          headerTitle: t("USERcompleteInfoTITLE"),
        }}
      />
      <Stack.Screen
        name="Disclaimer"
        component={HowToUse}
        options={{presentation: "modal", headerTitle: t("HOMEbenefit"),}}
      /> */}
    </Stack.Navigator>
  );
};

const UserStack = (props) => {
  const { navigation, route } = props;
  const [t, i18n] = useTranslation();

  // TODO: Test if this is compatible with New Architecture
  // React.useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => <UserProfileButton navigation={navigation} />,
  //   });
  // }, [navigation]);

  return (
    <Stack.Navigator
      // screenOptions={{
      //   headerStyle: { backgroundColor: "#000" },
      //   headerTintColor: "#fff",
      // }}
    >
      <Stack.Screen
        name="SettingsScreen"
        component={Settings}
        options={{
          headerShown: false,
          // headerTitle: t("NAVuser"),
          // headerRight: () => <UserProfileButton navigation={navigation} />,
        }}
      />
      <Stack.Screen
        name="Privacy"
        component={Privacy}
        options={{ headerTitle: t("UPrivacyTitle") }}
      />
      <Stack.Screen
        name="Info"
        component={InfoUser}
        options={{
          headerShown: false,
        }}
        // options={{ presentation: "modal", headerTitle: t("MENUuserInfo") }}
      />
      <Stack.Screen
        name="Logout"
        component={Logout}
        options={{ presentation: "modal", headerTitle: t("MENUlogout") }}
      />
      {/* <Stack.Screen
        name="HelpFaq"
        component={Help}
        options={{ presentation: "modal", headerTitle: t("HELPtitle") }}
      /> */}
    </Stack.Navigator>
  );
};

const FlexibleStack = (props) => {
  const { navigation, route } = props;
  const [t, i18n] = useTranslation();

  return (
    <Stack.Navigator
    // screenOptions={{
    //   headerStyle: { backgroundColor: "#000" },
    //   headerTintColor: "#fff",
    // }}
    >
      <Stack.Screen
        name="FlexScreen"
        component={Flexibility}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FlexFilter"
        component={FilterModal}
        options={{ presentation: "modal", headerTitle: t("FILTERtitle") }}
      />
      {/* <Stack.Screen
        name="CompleteInfo"
        component={CompleteNewUser}
        options={{
          presentation: "modal",
          headerTitle: t("USERcompleteInfoTITLE"),
        }}
      /> */}
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

export default (props) => {
  const [t, i18n] = useTranslation();

  const {
    authDispatch,
    authState: { isLoggedIn, data, userToken },
  } = React.useContext(GlobalContext);

  const [hasToken, setHasToken] = React.useState(false);

  // TODO: assert this hasToken condition
  React.useEffect(() => {
    if (userToken) {
      // console.log(userToken);
      setHasToken(true);
    } else {
      setHasToken(false);
    }
  }, [userToken]);

  // TODO: restore token condition
  return hasToken ? (
    <Tab.Navigator
      initialRouteName={"HomeScreen"}
      screenOptions={{
        headerStyle: { backgroundColor: "#fff" },
        headerTintColor: "#000",
        tabBarActiveTintColor: react_colors.primarygreen,
        tabBarInactiveTintColor: react_colors.complementarygray,
        tabBarLabelPosition: "below-icon",
        tabBarStyle: {
          backgroundColor: react_colors.ghostwhite,
          height: 55,
          paddingTop: 1,
          paddingBottom: 6,
        },
        // tabBarItemStyle: { justifyContent: "center"},
        // tabBarIconStyle: { alignSelf: "center" },
        tabBarLabelStyle: { color: react_colors.complementarygray },
      }}
    >
      <Tab.Screen
        name={"HomeScreen"} //DISPOSITIVOS
        component={HomeStack}
        initialParams={{ ...props }}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            return <FontAwesome5 name="home" size={size} color={color} style={{ padding: 5 }} />;
          },
          tabBarLabel: t("DEVICEShomeTitle"),
        }}
        // options={{ title: "My home" }}
        // options={({ route }) => ({ title: route.params.name })}
      />
      <Tab.Screen
        // component={Producer} //TBD
        component={HowToUse}
        name={"HelpInfo"} //AJUDA E INFORMAÇÃO
        initialParams={{ ...props }}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            return <FontAwesome5 name="readme" size={size} color={color} style={{ padding: 5 }} />;
          },
          tabBarLabel: t("NAVhelpInfo")
        }}
      />
      {/* <Tab.Screen
        name={t("NAVuser")}
        component={UserStack}
        initialParams={{ ...props }}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            return <FontAwesome name="sliders" size={32} color={color} />;
          },
        }}
      /> */}
      <Tab.Screen
        name={"NAVhome"}
        component={Incentives}
        options={{
          headerShown: false,
          // headerStyle: { backgroundColor: "#000" },
          // headerTintColor: "#fff",
          // headerTitle: t("FLEXtitle"),
          tabBarLabelStyle: { color: react_colors.complementarygray },
          tabBarIcon: ({ color, size, focused }) => {
            return (
              <View
                style={[
                  Platform.OS === "ios" && {
                    shadowColor: react_colors.black,
                    shadowOffset: {
                      width: -3,
                      height: 6,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 6,
                  },
                  {
                    width: 56,
                    height: 56,
                    marginBottom: 30,
                    backgroundColor: focused
                      ? react_colors.complementaryblue
                      : react_colors.complementarygray,
                      // : "#c7c2ccff",

                    borderRadius: 22,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  Platform.OS === "android" && {
                    elevation: 6,
                    shadowColor: react_colors.black,
                  },
                ]}
              >
                {/* <AntDesign name="dashboard" size={42} color={focused ? react_colors.primaryyellow : color} /> */}
                <Image
                  source={logo}
                  style={{
                    flex: 1,
                    resizeMode: "contain",
                    width: 66,
                    height: 66,
                    right: 0,
                    // backgroundColor: react_colors.black,
                    // marginHorizontal: 5,
                    // borderColor: "#000",
                    // borderWidth: 0.2,
                  }}
                />
              </View>
            );
          },
          tabBarLabel: t("NAVhome"),
        }}
      />
      <Tab.Screen
        name={t("NAVFlexibility")}
        // component={React.memo(() => <View />)}
        component={FlexibleStack} //FLEXIBILIDADE
        initialParams={{ ...props }}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="leaf-sharp" size={size} color={color} style={{ padding: 5 }} />;
          },
          tabBarLabel: t("NAVFlexibility"),
        }}
      />
      <Tab.Screen
        name={"Settings"}
        component={UserStack} //CONTA
        initialParams={{ ...props }}
        options={{
          headerShown: false,
          // headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
          tabBarIcon: ({ color, size }) => {
            return <FontAwesome5 name="user-alt" size={size} color={color} style={{ padding: 5 }} />;
          },
          tabBarLabel: t("SETTINGSmainTitle"),
        }}
      />
    </Tab.Navigator>
  ) : (
    <AuthStack />
  );
};
