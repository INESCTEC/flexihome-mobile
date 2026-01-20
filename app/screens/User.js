import React from "react";
import { SafeAreaView } from "react-native";
import { TouchableHighlight } from "react-native";
import { Text } from "react-native";
import { FlatList } from "react-native";
import { View } from "react-native";

import { Button, Title, TouchableRipple, Divider } from "react-native-paper";
import { react_colors, styles } from "../styles";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useTranslation } from "react-i18next";
// import ExternalData from "../components/ExternalData";

export const User = (props) => {
  const { navigation, route } = props;

  const [t, i18n] = useTranslation();
  // return (
  //   <ExternalData />
  // )
  return (
    <SafeAreaView
      style={
        (styles.container,
        styles.global_color,
        { marginTop: "40%", alignContent: "stretch" })
      }
    >
      {/* <Title>OPÇÃO 1</Title>
      <FlatList
        data={[
          { title: "Settings", key: "1", page: "Settings" },
          { title: "Help & Feedback", key: "2", page: "HelpFaq" },
          {
            title: "User Agreement & Privacy Policy",
            key: "3",
            page: "HelpFaq",
          },
        ]}
        renderItem={({ item, index }) => (
          <TouchableHighlight
            key={item.key}
            onPress={() => navigation.navigate(item.page)}
          >
            <View
              style={{
                backgroundColor: react_colors.ghostwhite,
                flexDirection: "row",
                // alignContent: "center",
                alignItems: "center",
                paddingLeft: 10,
              }}
            >
              <Title style={{ flex: 2 }}>{item.title}</Title>
              <Button
                          theme={{ color: "#000" }}
                          style={{ flex: 1 }}
                          icon={"chevron-forward"}
                        ></Button>
              <Ionicons
                name="chevron-forward"
                color={"#000"}
                size={20}
                style={{ paddingRight: 20 }}
              />
            </View>
          </TouchableHighlight>
        )}
      />
      <Divider></Divider>
      <View
        style={
          (styles.view_container, { marginTop: "40%", alignContent: "stretch" })
        }
      >
        <Title>OPÇÃO 2</Title> */}
      <TouchableRipple>
        <Button
          mode="contained"
          color={react_colors.ghostwhite}
          style={styles.prefs_btn}
          onPress={() => navigation.navigate("Settings")}
        >
          {t("USERsettingsBtn")}
        </Button>
      </TouchableRipple>
      <View style={styles.divider}></View>
      <TouchableRipple>
        <Button
          mode="contained"
          color={react_colors.ghostwhite}
          style={styles.prefs_btn}
          // onPress={() => navigation.navigate("HelpFaq")} //TODO:
        >
          {t("USERhelpBtn")}
        </Button>
      </TouchableRipple>
      <View style={styles.divider}></View>
      <TouchableRipple>
        <Button
          mode="contained"
          // disabled
          color={react_colors.ghostwhite}
          style={styles.prefs_btn}
          onPress={() => navigation.navigate("Privacy")} //TODO:
        >
          {t("USERprivacyBtn")}
        </Button>
      </TouchableRipple>
      {/* </View> */}
    </SafeAreaView>
  );
};
