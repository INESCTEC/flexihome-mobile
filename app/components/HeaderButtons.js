import React from "react";

import { View } from "react-native";
import { Button, Menu, Divider, Provider } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useTranslation } from "react-i18next";
//User profile Button
export const UserProfileButton = ({ navigation }) => {
  const [visible, setVisible] = React.useState(false);
  const [t, i18n] = useTranslation();
  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  return (
    <View>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        statusBarHeight={20}
        anchor={
          <Ionicons
            style={{
              padding: 2,
              paddingBottom: 0,
            }}
            name="person-circle-sharp"
            color="#fff"
            size={38}
            onPress={openMenu}
          />
        }
      >
        <Menu.Item
          onPress={() => {
            closeMenu();
            navigation.navigate("Info");
          }}
          title={t("MENUuserInfo")}
        />
        {/* <Menu.Item
          onPress={() => {
            closeMenu();
            navigation.navigate("Logout");
          }}
          title={t("MENUlogout")}
        /> */}
      </Menu>
    </View>
  );
};

//Automation Plus Btn
export const AutomationButtonPlus = ({ navigation }) => {
  const [visible, setVisible] = React.useState(false);
  const [t, i18n] = useTranslation();
  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  return (
    <View>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        statusBarHeight={20}
        // anchor={<Button onPress={openMenu}>Show menu</Button>}
        anchor={
          <Ionicons
            style={{
              padding: 8,
            }}
            name="add-circle"
            color="#fff"
            size={30}
            onPress={openMenu}
          />
        }
      >
        <Menu.Item
          onPress={() => {
            // navigation.navigate("HelpFaq");
          }}
          title={t("MENUfullSch")}
        />
        <Divider />
        <Menu.Item
          onPress={() => {
            // navigation.navigate("Schedule");
          }}
          title={t("MENUdevSch")}
        />
      </Menu>
    </View>
  );
};

//Home Plus Btn
export const HomeButtonPlus = ({ navigation }) => {
  //   const { navigation, route } = props;
  const [visible, setVisible] = React.useState(false);

  const [t, i18n] = useTranslation();
  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  return (
    <View>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        statusBarHeight={20}
        // anchor={<Button onPress={openMenu}>Show menu</Button>}
        anchor={
          <Ionicons
            style={{
              padding: 8,
            }}
            name="add-circle"
            color="#fff"
            size={30}
            onPress={openMenu}
          />
        }
      >
        <Menu.Item
          onPress={() => {
            navigation.navigate("AddDevice");
          }}
          title={t("MENUaddDevice")}
        />
      </Menu>
    </View>
  );
};
