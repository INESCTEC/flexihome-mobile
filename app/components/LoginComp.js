import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState, useEffect } from "react";

import {
  SafeAreaView,
  StatusBar,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Image,
  Keyboard,
  ScrollView,
} from "react-native";

import {
  Button,
  Text,
  IconButton,
  TextInput,
  TouchableRipple,
  HelperText,
  Snackbar,
  Divider,
} from "react-native-paper";
import { react_colors, styles } from "../styles";

import { useTranslation } from "react-i18next";
// import { GoogleLogin } from "./GoogleLogin";
// import { InterBackground } from "./InterBackground";
import { FontAwesome, FontAwesome5, Ionicons} from "@expo/vector-icons";

const logo = require("../assets/icon_solo_green.png");
const feu = require("../assets/co-funded-by-the-eu-positive.png")

const COLORS = {
  WHITE: "#FAFAFA",
  BLACK: "#000",
  BLUE: "#15A1F1",
  PURPLE: "#534FFF",
  PURPLE2: "#6320DE",
  ORANGE: "#FE8E4E",
  RED: "#FD696E",
  GREY: "#AFAFAF",
  DARK_GREY: "#90919E",
  GOOGLE: "#DC4E41",
  FACEBOOK: "#3A5896",
  GRADIENT: ["#15A1F1", "#FD696E", "#AFAFAF", "#534FFF"],
  // GRADIENT: ["#00BDD3", "#15A1F1", "#534FFF", "#6320DE"],
};

const SIZES = {
  BASE: 6,
  FONT: 12,
  TITLE: 32,
  SUBTITLE: 11,
  LABEL: 12,
  PADDING: 12,
  GRADIENT: [0, 0.34, 0.74, 1],
};
export const LoginComp = ({
  error,
  form,
  justSignedUp,
  onChange,
  loading,
  onSubmit,
  onGgl,
}) => {
  const [t, i18n] = useTranslation();

  const [isSecureEntry, setIsSecureEntry] = useState(true);
  const { navigate } = useNavigation();
  const [snackVisible, setSnackVisible] = useState(true);
  
  const [isKeyboardOn, setKeyboard] = useState(false);

  const toggleSecure = (prev) => {
    setIsSecureEntry(!prev);
  };

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () => {
      setKeyboard(true);
    });

    Keyboard.addListener("keyboardDidHide", () => {
      setKeyboard(false);
    });

    return () => {
      Keyboard.removeAllListeners("keyboardDidShow");
      Keyboard.removeAllListeners("keyboardDidHide");
    };
  }, [isKeyboardOn]);

  // useFocusEffect(
  //   useCallback(() => {
  //     return () => {
  //       if (justSignedUp) {
  //         setSnackVisible(true);
  //       }
  //     };
  //   }, [justSignedUp])
  // );

  return (
    <SafeAreaView style={[styles.global_color, styles.container]}>
      <StatusBar
        // translucent
        barStyle="dark-content"
        backgroundColor="#ebf5f3"
      ></StatusBar>

      <ScrollView>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View
            style={[
              styles.view_container,
              {
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 20,
                flex: 1,
              },
            ]}
          >
            <View
              style={[
                styles.row_container,
                {
                  justifyContent: "flex-start",
                  marginHorizontal: 10,
                  marginTop: 10,
                  height: 75,
                  flex: 0,
                },
              ]}
            >
              <View style={{ width: "50%", height: 75 }}>
                <Image source={logo} style={{ width: 75, height: 75 }} />
              </View>

              <TouchableOpacity
                onPress={() => navigate("AppInfo")}
                style={{
                  width: "50%",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  height: 75,
                }}
              >
                <Ionicons name="menu-outline" size={42} color="black" />
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.view_container,
                {
                  width: "100%",
                  justifyContent: "flex-end",
                  height: "60%",
                  alignContent: "center",
                  alignItems: "center",
                  paddingBottom: "10%",
                },
              ]}
            >
              <View style={[styles.inputContainer, { marginTop: 12 * 2 }]}>
                <Text variant="bodySmall">{t("LOGINemail")}</Text>
                <TextInput
                  // mode= 'flat' | 'outlined'
                  // error={true}
                  style={[
                    styles.input,
                    error && error.field === "email" ? styles.erro : {},
                  ]}
                  placeholderTextColor={COLORS.BLACK}
                  // value={form.username || null}
                  onChangeText={(value) => {
                    onChange({ name: "email", value });
                  }}
                  placeholder={t("LOGINinputEmail")}
                  // right={<TextInput.Icon name="eye" />}
                  // underlineColor={react_colors.darkblue}
                  activeUnderlineColor={react_colors.primarygreen}
                  keyboardType="default"
                  value={form?.email}
                />
                {error && error.field === "email" && (
                  <HelperText type="error" visible={true}>
                    {error.message}
                  </HelperText>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text variant="bodySmall">{t("LOGINpassword")}</Text>
                <TextInput
                  style={[
                    styles.input,
                    error && error.field === "password" ? styles.erro : {},
                  ]}
                  placeholderTextColor={COLORS.BLACK}
                  textContentType={"password"}
                  autoCompleteType={"password"}
                  // keyboardType={"visible-password"}
                  secureTextEntry={isSecureEntry}
                  //   value={passwd}
                  onChangeText={(value) => {
                    onChange({ name: "password", value });
                  }}
                  onEndEditing={() => setIsSecureEntry(true)}
                  placeholder={t("LOGINinputPassword")}
                  right={
                    isSecureEntry ? (
                      <TextInput.Icon
                        icon="eye-off"
                        forceTextInputFocus={false}
                        onPress={() => toggleSecure(isSecureEntry)}
                      />
                    ) : (
                      <TextInput.Icon
                        icon="eye"
                        forceTextInputFocus={false}
                        onPress={() => toggleSecure(isSecureEntry)}
                      />
                    )
                  }
                  // underlineColor={react_colors.darkblue}
                  activeUnderlineColor={react_colors.primarygreen}
                  keyboardType="default"
                />
                {error && error.field === "password" && (
                  <HelperText type="error" visible={true}>
                    {error.message}
                  </HelperText>
                )}
              </View>
              <View
                style={{
                  width: "100%",
                  justifyContent: "flex-end",
                  alignContent: "flex-end",
                  alignItems: "flex-end",
                  paddingRight: 10,
                }}
              >
                <TouchableOpacity onPress={() => navigate("Forgot")}>
                  <Text
                    variant="bodyMedium"
                    style={{
                      textDecorationLine: "underline",
                      paddingTop: 4,
                      // fontSize: 14,
                      color: react_colors.black,
                    }}
                  >
                    {t("FORGOTpassword")}
                  </Text>
                </TouchableOpacity>
                <Divider style={{ marginVertical: 6 }} />
                <TouchableOpacity
                  onPress={() => navigate("Recover")}
                  disabled={loading}
                >
                  <Text
                    variant="bodyMedium"
                    style={{
                      textDecorationLine: "underline",
                      paddingTop: 4,
                      // fontSize: 14,
                      color: react_colors.black,
                    }}
                  >
                    {t("LOGINrecoverAccount")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>

      {error && (error.field === "server" || error.field === "invalid") && (
        <View
          style={{
            height: 60,
            width: "90%",
            alignSelf: "center",
            borderRadius: 6,
            backgroundColor: react_colors.complementarygray,
            opacity: 30,
            justifyContent: "center",
            marginVertical: 5,
          }}
        >
          <Text
            variant="bodyMedium"
            style={{
              paddingHorizontal: 24,
              textAlign: "center",
              color: react_colors.darkred,
            }}
          >
            {error.message}
          </Text>
        </View>
      )}
      {justSignedUp && (
        <View
          style={{
            height: 60,
            width: "90%",
            alignSelf: "center",
            borderRadius: 6,
            backgroundColor: react_colors.black,
            opacity: 30,
            justifyContent: "center",
            marginVertical: 5,
          }}
        >
          <Text
            variant="bodyMedium"
            style={{
              textAlign: "center",
              color: react_colors.white,
            }}
          >
            {t("REGISTERrequestSucc")}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.view_item,
          {
            flexDirection: "column",
            justifyContent: "flex-end",
            alignContent: "flex-end",
            marginBottom: "4%",
          },
        ]}
      >
        <Button
          buttonColor={react_colors.primarygreen}
          mode="contained"
          onPress={onSubmit}
          disabled={loading}
        >
          {t("LOGINsubmit")}
        </Button>

        {loading && (
          <ActivityIndicator color={react_colors.complementarynavy} />
        )}

        <View style={{ alignItems: "flex-start" }}>
          <TouchableOpacity
            style={{ padding: 5, paddingLeft: 0 }}
            onPress={() => navigate("Register")}
            disabled={loading}
          >
            <Text
              variant="bodyMedium"
              style={{
                // fontSize: 17,
                color: react_colors.black,
              }}
            >
              {t("LOGINnewAccount")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          width: "50%",
          height: 45,
          justifyContent: "flex-start",
          paddingLeft: 10,
        }}
      >
        <Image
          source={feu}
          style={{ width: 100, height: 45 }}
          resizeMode="contain"
        />
      </View>
      {/* <View style={{ flex: 1, justifyContent: "flex-end", paddingRight: 10 }}> */}
      <View style={{ position: "absolute", bottom: 10, right: 10 }}>
        <Text
          variant="bodyMedium"
          style={{
            // fontSize: 14,
            fontWeight: "bold",
            textAlign: "right",
            color: react_colors.black,
          }}
        >
          Powered by INESCTEC
        </Text>
      </View>
      {/* </LinearGradient> */}
    </SafeAreaView>
  );
};
