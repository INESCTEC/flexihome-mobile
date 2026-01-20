import React, { useState } from "react";
import { View, SafeAreaView, StatusBar, Alert, ScrollView } from "react-native";
// import Toast from "react-native-root-toast";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { ActivityIndicator, Button, TextInput, Text } from "react-native-paper";
import * as Crypto from "expo-crypto";
import { react_colors, styles } from "../styles";
import env from "../config/env";
import { InterBackground } from "../components/InterBackground";

export const Forgot = () => {
  const [email, setEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [t, i18n] = useTranslation();

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
  const forgotPass = async () => {
    //Precisa de ser arranjado no backend
    // let uuid = uuidv4();
    const uuid = Crypto.randomUUID();

    // console.log("generating this uuid: " + uuid);
    let headers = {
      "Content-Type": "application/json",
      // Accept: "application/json",
      "X-Correlation-ID": `${uuid}`,
    };
    if (email) {
      // email = email?.trim();
      setIsLoading(true);

      try {
        let res = await axios
          .post(
            `${URL_API}/account/forgot-password`,
            {
              email: email.toLowerCase(),
            },
            {
              headers,
            },
            { timeout: 15000 }
          )
          .then((res) => {
            // console.log(res.status);
            // if (res.status > 499) {
            //   showToast(t("FORGOTrequestFail"), false);
            //   return false;
            // } else {
            // showToast(t("FORGOTrequestSucc"), true);
            showAlert(t("FORGOTtitle"), t("FORGOTrequestSucc"));
            return true;
          });
      } catch (err) {
        // console.log(err);
        // showToast(t("FORGOTrequestFail"), false);
        showAlert(t("FORGOTtitle"), t("FORGOTrequestFail"));
        setIsLoading(false);
        setEmail(null);
        return null;
      }
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.global_color, styles.container]}>
      <InterBackground noNav />
      <ScrollView>      
      <View style={{ ...styles.view_item, marginTop: 55 }}>
        {/* <Title>{t("FORGOTtitle")}</Title> */}
        <View
          style={{
            width: "100%",
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          <Text variant="bodyMedium" style={{ textAlign: "left" }}>
            {t("FORGOTdiscl")}
          </Text>
        </View>
        <View style={{ height: 30 }}></View>
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
          <View
            style={{
              flexDirection: "column",
              justifyContent: "flex-end",
              alignContent: "flex-end",
              marginTop: "40%",
            }}
          >
            <Button
              buttonColor={react_colors.primarygreen}
              mode="contained"
              onPress={() => forgotPass()}
              disabled={isLoading}
            >
              {t("FORGOTsubmit")}
            </Button>
          </View>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};
