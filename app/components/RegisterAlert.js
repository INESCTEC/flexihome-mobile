import React, { useContext, useState, useEffect, useCallback } from "react";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { GlobalContext } from "../context/Provider";
import { useTranslation } from "react-i18next";

import { Alert } from "react-native";
// const Alerta = () => {
// const [t, i18n] = useTranslation();

//   return <Text>{t("REGISTERinputEmail")}</Text>;
// };

export const RegisterAlert = (navigate, available) => {
  Alert.alert(
    "Atention",
    "To continue using HEMS app please complete your registration.",
    [
      {
        text: "Later",
        // onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => navigate("CompleteInfo", { ...available }),
      },
    ]
  );
};
