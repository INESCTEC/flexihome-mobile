import React, { useEffect, useState } from "react";
import { View, Alert, SafeAreaView } from "react-native";
import { Button, Text, TouchableRipple } from "react-native-paper";
import { react_colors, styles } from "../styles";
import { useTranslation } from "react-i18next";

// import Toast from "react-native-root-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Crypto from "expo-crypto";
import env from "../config/env";
import { InterBackground } from "../components/InterBackground";

// Delete account
export const InfoUser = ({ navigation }) => {
  const [t, i18n] = useTranslation();
  const [auth, setAuth] = useState(null);
  const [userId, setUserID] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const URL_API = env.base_api_url;

  useEffect(() => {
    async function loadStorage() {
      let token, id;
      try {
        token = await AsyncStorage.getItem("@token");
        if (token) {
          setAuth(token);
        }

        id = await AsyncStorage.getItem("@userId");
        if (id) {
          setUserID(id);
          setIsLoading(false);
        }
      } catch (err) {
        console.log("No token!", err);
        return null;
      }
    }
    loadStorage();
    // console.log(token, id);
  }, []);

  // const showToast = (message, type) => {
  //   Toast.show(message, {
  //     duration: Toast.durations.LONG,
  //     position: Toast.positions.BOTTOM,
  //     backgroundColor: type ? react_colors.gray : react_colors.lightcoral,
  //     opacity: 1,
  //   });
  // };
  const showAlert = ({title, message, id}) => {
    Alert.alert(title, message, [
      { text: t("Modalcancel"), style: "cancel" },
      id ? { text: t("Modalok"), onPress: () => requestDeletion(id) } : null,
    ]);
  };
  const requestDeletion = async (id) => {
    setIsLoading(true);
    // let uuid = uuidv4();
    const uuid = Crypto.randomUUID();

    // console.log("generating this uuid: " + uuid);
    let headers = {
      "Content-Type": "application/json",
      // Accept: "application/json",
      "X-Correlation-ID": `${uuid}`,
      Authorization: `Bearer ${auth}`,
    };

    // console.log(auth, id, uuid);
    // showToast("Could not delete account...!", false);
    // navigation.navigate("Logout");

    // return;
    await axios
      .delete(`${URL_API}/account/user?user-id=${id}&delete_type=soft`, {
        headers,
      })
      .then((res) => {
        // if (res.status == 200) {
        // showToast(t("USERaccountDelsucc"), true);
        showAlert({title: t("USERaccountDeletion"), message: t("USERaccountDelsucc")});
        setIsLoading(false);
        navigation.navigate("Logout");
        // } else throw "fail";
      })
      .catch((err) => {
        // showToast(t("USERaccountDelfail"), false);
        showAlert({title: t("USERaccountDeletion"), message: t("USERaccountDelfail")});
        setIsLoading(false);
        // navigation.navigate("HomeScreen");
      });
  };
  return (
    <SafeAreaView style={[styles.container, styles.global_color]}>
      <InterBackground />
      <View style={[styles.view_item, { padding: 20 }]}>
        <Text variant="titleLarge">{t("USERaccountDeletion")}</Text>
        <View style={{ marginVertical: 10 }}>
          <Text variant="bodyLarge" style={{ textAlign: "justify" }}>
            {t("USERaccountMsg")}
          </Text>
          <View style={{ paddingVertical: 10 }}>
            <Button
              mode="contained"
              buttonColor={react_colors.lightcoral}
              onPress={() => showAlert({title: t("USERaccountDeletion"), message: t("USERalertitle2"), id: userId})}
              disabled={isLoading}
            >
              {t("USERsubmit")}
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
