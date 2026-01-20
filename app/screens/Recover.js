import React, { useState } from "react";
import { View, SafeAreaView, StatusBar, Alert } from "react-native";
// import Toast from "react-native-root-toast";
import { useTranslation } from "react-i18next";
import axios from "axios";
import env from "../config/env";
import * as Crypto from "expo-crypto";
import { react_colors, styles } from "../styles";
import {
  ActivityIndicator,
  Button,
  TextInput,
  Text
} from "react-native-paper";
import { InterBackground } from "../components/InterBackground";

export const Recover = () => {
  const [t, i18n] = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(null);

  const URL_API = env.base_api_url;

  // const showToast = (message, type) => {
  //   Toast.show(message, {
  //     duration: Toast.durations.LONG,
  //     position: Toast.positions.BOTTOM,
  //     backgroundColor: type ? react_colors.gray : react_colors.lightcoral,
  //     opacity: 1,
  //   });
  // };
  const showAlert = (title, message) => {
    Alert.alert(title, message, [
      // { text: t("Modalcancel"), style: "cancel" },
      { text: t("Modalok"), style: "destructive" },
    ]);
  };

  const changeEmail = (val) => {
    setEmail(val?.trim());
    setIsLoading(false);
  };

  const recoverAccount = async () => {
    const uuid = Crypto.randomUUID();

    let headers = {
      "Content-Type": "application/json",
      "X-Correlation-ID": `${uuid}`,
    };

    if (email) {
      setIsLoading(true);

      try {
        let res = await axios.post(
          `${URL_API}/account/recover-account`,
          {
            email: email.toLowerCase(),
          },
          {
            headers,
          }
        );

        if (res.status === 200) {
          setIsLoading(false);
          // showToast(t("FORGOTrequestSucc"), true);
          showAlert(t("RECOVERtitle"), t("FORGOTrequestSucc"));
          setEmail(null);
        }
      } catch (error) {
        setIsLoading(false);
        // showToast(t("FORGOTrequestFail"), false);
        showAlert(t("RECOVERtitle"), t("FORGOTrequestFail"));
        setEmail(null);
      }
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.global_color, styles.container]}>
      <InterBackground />
      <View style={[styles.view_item, { marginTop: 15 }]}>
        <View>
          <TextInput
            activeUnderlineColor={react_colors.primarygreen}
            style={[styles.input]}
            onChangeText={(val) => changeEmail(val)}
            keyboardType="default"
            placeholder={t("LOGINinputEmail")}
          ></TextInput>
          <View style={{ height: 30 }}>
            {isLoading && <ActivityIndicator color={react_colors.black} />}
          </View>
          <Button
            mode="contained"
            buttonColor={react_colors.primarygreen}
            onPress={() => recoverAccount()}
            disabled={isLoading}
          >
            {t("RECOVERsubmit")}
          </Button>
        </View>
        <View style={{ height: 30 }}></View>
        <View
          style={{
            width: "100%",
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          <Text variant="titleMedium">{t("RECOVERdiscTitle")}</Text>
          <Text variant="bodyMedium" style={{ textAlign: "justify" }}>
            {t("RECOVERdiscl")}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
