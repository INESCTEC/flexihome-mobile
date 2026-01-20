import React, { useState, useRef } from "react";
import { Button } from "react-native-paper";
import { Text, View, SafeAreaView, ScrollView, Animated } from "react-native";
import { react_colors, styles } from "../styles";
import { WebView } from "react-native-webview";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import env from "../config/env";

export const Privacy = ({ route, navigation }) => {
  // const [accepted, setAccepted] = useState(false);
  // TODO: mecanismo de aceitacao dos termos e adesao ao projeto
  const [enabled, setEnable] = useState(false);
  const webviewRef = useRef(null);
  const [t, i18n] = useTranslation();

  const { app_policy_version } = env;

  const screenname = route.params?.cameFrom;

  const finLang = i18n.language.includes("pt") ? "pt" : "en";

  const storeData = async (key, val) => {
    try {
      // await AsyncStorage.clear();
      await AsyncStorage.setItem(key, val);
    } catch (err) {
      console.log("cant store new key: " + err);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: react_colors.white }}>
      <WebView
        ref={webviewRef}
        originWhitelist={["*"]}
        source={{
          // uri: `https://interconnect-dev.inesctec.pt/api/privacy-policy/#${finLang}`,
          uri: `https://hedge-iot-hems-dev.inesctec.pt/privacy-policy/#${finLang}`,
        }}
        onScroll={(syntheticEvent) => {
          const { contentOffset, contentSize, layoutMeasurement } =
            syntheticEvent.nativeEvent;
          // console.table(contentOffset);
          if (!enabled) {
            if (
              layoutMeasurement.height + contentOffset.y >=
              contentSize.height - 100
            ) {
              setEnable(true);
            }
          }
        }}
      />
      {/* <View style={styles.divider}></View> */}

      <View style={[styles.view_item, { marginVertical: 15 }]}>
        <Button
          buttonColor={react_colors.primarygreen}
          mode="contained"
          onPress={() => {
            storeData("@policy_version", app_policy_version);
            navigation.navigate(screenname, { acceptedPolicy: true });
          }}
          disabled={!enabled}
          //TODO: onAccept, close wview or goback and update prefs
        >
          {t("PRIVaccept")}
        </Button>
        <View style={{ height: 20 }}></View>
      </View>
    </View>
  );

};
