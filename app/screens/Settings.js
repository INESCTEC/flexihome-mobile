import React, {
  useContext,
  useEffect,
  useCallback,
  useState,
  useRef,
} from "react";

import {
  View,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Linking,
  StatusBar,
} from "react-native";
import { GlobalContext } from "../context/Provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
// import * as Linking from "expo-linking"; // needed for opening links in browser
import * as Crypto from "expo-crypto";
import axios from "axios";
import logoutUser from "../context/actions/auth/logoutUser";
import { styles, react_colors } from "../styles";
import {
  Divider,
  Text,
  TextInput,
  HelperText,
  Button,
  List,
  Dialog,
  Portal,
  RadioButton,
} from "react-native-paper";
import { MaterialCommunityIcons as MaterialIcon } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { InterBackground } from "../components/InterBackground";
import env from "../config/env";


const SetLangComp = ({ language, onValueChange, onConfirm, onCancel }) => {
  const [isDialog, setDialog] = React.useState(false);
  const [t, i18n] = useTranslation();
  const toggleDialog = (prev) => setDialog(prev);
  let selLang = language;
  let descLang = language.includes("en") ? "English" : "Português";
  return (
    <TouchableOpacity onPress={() => toggleDialog(!isDialog)}>
      <List.Section>
        <List.Item
          style={{ paddingLeft: 10, paddingRight: 10 }}
          title={t("SETTINGSLanguage")}
          description={descLang}
        />
        <Portal>
          <Dialog
            visible={isDialog}
            onDismiss={() => {
              // onCancel("@lang");
              toggleDialog(!isDialog);
            }}
          >
            <Dialog.Title>{t("SETTINGSLangTitle")}</Dialog.Title>
            <Divider></Divider>
            <Dialog.Content>
              <RadioButton.Group
                value={language}
                onValueChange={(newLang) => {
                  selLang = newLang;
                  onValueChange(newLang);
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      width: "50%",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <RadioButton
                      value="en"
                      theme={{ colors: { primary: react_colors.primarygreen } }}
                    />
                    <Text style={{ width: "100%" }}>English</Text>
                  </View>
                  <View
                    style={{
                      width: "50%",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <RadioButton
                      value="pt"
                      theme={{ colors: { primary: react_colors.primarygreen } }}
                    />
                    <Text style={{ width: "100%" }}>Português</Text>
                  </View>
                </View>
              </RadioButton.Group>
            </Dialog.Content>
            <Divider></Divider>
            <Dialog.Actions>
              <Button
                mode="text"
                onPress={() => {
                  onCancel("@lang");
                  toggleDialog(!isDialog);
                }}
                theme={{ colors: { primary: react_colors.primarygreen } }}
              >
                {t("Modalcancel")}
              </Button>
              <Button
                mode="text"
                onPress={() => {
                  onConfirm("@lang", selLang);
                  toggleDialog(!isDialog);
                }}
                theme={{ colors: { primary: react_colors.primarygreen } }}
              >
                {t("Modalok")}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </List.Section>
    </TouchableOpacity>
  );
};


const Settings = ({ navigation }) => {
    const {
      authDispatch,
      authState: { data, userToken },
    } = useContext(GlobalContext);
    const [t, i18n] = useTranslation();

    const [error, setError] = useState({});
    const [form, setForm] = useState({});

    const [prefs, setPrefs] = useState(null);

    const [isChanged, setChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [auth, setAuth] = useState(null);

    const [currLang, setLang] = React.useState("en");
    const [isSecureEntry, setIsSecureEntry] = useState(true);
    const inpRef = useRef(null);
    const [isVisible, setVisible] = React.useState(false);

    const [isPowerDialog, togglePowerDialog] = useState(false);
    const [power, setPower] = useState(null);

    const [isOptimOn, setOptim] = useState(false);
    const URL_API = env.base_api_url;

    const feu = require("../assets/co-funded-by-the-eu-positive.png");

    const getSetting = async (key) => {
      const opt = await AsyncStorage.getItem(key);

      // if (key === "@theme") {
      //   themeChange(opt);
      // }
    };
    const onChange = ({ name, value }) => {
      setError({});

      setForm({ ...form, [name]: value });
    };

    // SECTION 2
    const toggleSecure = (prev) => {
      setIsSecureEntry(prev);
    };

    const toggleInputPasswd = (prev) => {
      setVisible(prev);
    };

    const languageChange = (change) => {
      setLang(change);
      // DropDownPicker.setLanguage(change.toUpperCase());
    };
    const saveSetting = async (key) => {
      if (key === "@theme") {
        await AsyncStorage.setItem(key, dark ? "DT" : "LT");
        console.log("Theme changed");
      }
      if (key === "@lang") {
        setLanguage(currLang)(authDispatch);
        await AsyncStorage.setItem(key, currLang);
        // console.log("Language changed");
        i18n.changeLanguage(currLang.toLowerCase());
      }
    };

    const storeData = async (key, val) => {
      try {
        // await AsyncStorage.clear();
        await AsyncStorage.setItem(key, val);
      } catch (err) {
        console.log("cant store key " + err);
      }
    };

    const setLanguage = (language) => (dispatch) => {
      dispatch({
        type: "UPDATE_LANGUAGE",
        payload: { lang: language },
      });
    };

    const finLang = i18n.language.includes("pt") ? "pt" : "en";
    const power_contr = [
      { label: "1.15 kVA", value: "1.15 kVA" },
      { label: "2.3 kVA", value: "2.3 kVA" },
      { label: "3.45 kVA", value: "3.45 kVA" },
      { label: "4.6 kVA", value: "4.6 kVA" },
      { label: "5.75 kVA", value: "5.75 kVA" },
      { label: "6.9 kVA", value: "6.9 kVA" },
      { label: "10.35 kVA", value: "10.35 kVA" },
      { label: "13.8 kVA", value: "13.8 kVA" },
      { label: "17.25 kVA", value: "17.25 kVA" },
      { label: "20.7 kVA", value: "20.7 kVA" },
      { label: "27.6 kVA", value: "27.6 kVA" },
      { label: "34.5 kVA", value: "34.5 kVA" },
      { label: "41.4 kVA", value: "41.4 kVA" },
    ].map((item, index) => {
      return {
        id: index,
        value: item.value,
        label: item.label,
      };
    });

    const getErrorField = (err) => {
      const varis = [
        "old_password",
        "new_password",
        "new_password_repeat",
        "invalid",
      ];
      let str = err.hasOwnProperty("detail")
        ? err.detail
        : err.hasOwnProperty("error")
        ? err.error
        : "invalid";
      let field = varis.filter((item) => {
        return str.includes(item);
      });

      //TODO: translate
      return {
        message: str.includes("credentials")
          ? t("ERRORinvalidcredentials")
          : str.includes("equal")
          ? t("ERRORsamepasswd")
          : str.includes("not")
          ? t("ERRORwrongpasswd")
          : str.includes("required")
          ? t("ERRORrequired")
          : str.includes("too short")
          ? t("ERRORvaluelength")
          : str.includes("invalid")
          ? t("ERRORrequestfail")
          : t("ERRORserveroffline"),
        field: field.length == 0 ? [] : field.pop(),
      };
    };

    const updatePrefs = () => async (dispatch) => {
      setIsLoading(true);
      // let uuid = uuidv4();
      const uuid = Crypto.randomUUID();

      // console.log("generating this uuid: " + uuid);
      let headers = {
        "Content-Type": "application/json",
        // Accept: "application/json",
        "X-Correlation-ID": `${uuid}`,
        Authorization: `Bearer ${userToken}`,
      };
      // console.log(auth);

      let data = {
        ...prefs,
        contracted_power: power,
      };

      // console.log("Using auth token: ", userToken);
      // console.log("Updating user preferences with data: ", data);
      // return;
      await axios
        .post(
          `${URL_API}/account/user`,

          data,

          {
            headers,
          },
          { timeout: 10000 }
        )
        .then((res) => {
          console.log("Preferences updated. Success. ", res.data);
          storeData("@userPrefs", JSON.stringify(res.data));
          // showToast(t("SETTINGSsaveSucc"), true);
          setIsLoading(false);
          dispatch({
            type: "UPDATE_REGISTER",
            payload: { user: { ...res.data } },
          });
        })
        .catch((err) => {
          console.log("Failed to update userSettings ", err.response);
          // showToast(t("SETTINGSsaveFail"), false);
          //TODO: set error message
          // setError(getErrorField(err.response.data));
          setIsLoading(false);
        });
    };

    const change_Pass = () => {
      if (form.old_password && form.new_password && form.new_password_repeat) {
        // console.log({ ...form });
        updatePassword();
      } else {
        let faulty = !form.old_password
          ? "old_password"
          : !form.new_password
          ? "new_password"
          : "new_password_repeat";
        setError({ field: faulty, message: "campo obrigatório" });
      }
    };

    const onSaveChanges = async () => {
      await updatePrefs()(authDispatch);
      setChanged(false);
    };

    const updatePassword = () => {
      setIsLoading(true);
      setError({});
      // let uuid = uuidv4();
      const uuid = Crypto.randomUUID();

      // console.log("generating this uuid: " + uuid);
      let headers = {
        "Content-Type": "application/json",
        // Accept: "application/json",
        "X-Correlation-ID": `${uuid}`,
        Authorization: `Bearer ${userToken}`,
      };

      axios
        .post(
          `${URL_API}/account/change-password`,
          { ...form },
          {
            headers,
          },
          { timeout: 10000 }
        )
        .then((res) => {
          // console.log("success >>>", res.status);
          toggleInputPasswd(isVisible);
          setIsLoading(false);
        })
        .catch((err) => {
          // console.log(
          //   "Error on change password..",
          //   err.response
          //     ? err.response.data
          //     : { bolas: "Error: " + JSON.stringify(err.request) } //err.message
          // );

          let reqErrors = err.response
            ? getErrorField(err.response.data)
            : {
                message: "Server is unreachable. Please try again later.",
                field: "server",
              };

          setError(reqErrors);
          setIsLoading(false);
        });
    };

    useFocusEffect(
      useCallback(() => {
        const loadStorage = async () => {
          const storedPrefs = await AsyncStorage.getItem("@userPrefs");
          let contracted = JSON.parse(storedPrefs).contracted_power ?? null;
          // console.log("Loaded user preferences from storage: ", contracted);
          if (storedPrefs) {
            setPrefs(JSON.parse(storedPrefs));
          }
          if (contracted) {
            setPower(contracted);
          }
        };
        loadStorage();
      }, [])
    );

    return (
      <>
        <SafeAreaView style={[styles.container, styles.global_color]}>
          <InterBackground />
          <View style={{ height: StatusBar.currentHeight }}></View>
          <ScrollView>
            <View style={[styles.container, { height: "auto" }]}>
              <List.AccordionGroup>
                {/* <Divider></Divider> */}
                <List.Accordion
                  style={styles.listNode}
                  title={
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                      }}
                    >
                      <MaterialIcon
                        name="account-cog"
                        size={20}
                        color="black"
                        style={{ paddingHorizontal: 4 }}
                      />
                      <Text style={{ textAlign: "right" }} variant="titleLarge">
                        {t("SETTINGSsection1title")}
                      </Text>
                    </View>
                  }
                  id="0"
                >
                  <List.Section
                    style={{ backgroundColor: react_colors.antiflashwhite }}
                  >
                    {/* {error && error.field === "server" && (
                      <HelperText type="error" visible={true}>
                        {t("HOMEdevlistFail")}
                      </HelperText>
                    )} */}

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Foundation name="key" size={20} color="black" />
                      <Button
                        theme={{
                          colors: { primary: react_colors.primarygreen },
                        }}
                        mode="text"
                        onPress={() => toggleInputPasswd(!isVisible)}
                      >
                        {t("SETTINGSchangePassword")}
                      </Button>
                    </View>
                    {/* CH PASSWD MODAL */}
                    <Portal>
                      <Dialog
                        visible={isVisible}
                        onDismiss={() => toggleInputPasswd(!isVisible)}
                        // style={{ maxHeight: "80%" }}
                      >
                        <Dialog.Title>
                          {t("SETTINGSchangePassword")}
                        </Dialog.Title>
                        <Divider />
                        <Dialog.ScrollArea>
                          <ScrollView
                            contentContainerStyle={{
                              paddingHorizontal: 2,
                            }}
                          >
                            {/* <View style={styles.view_item}> */}
                            <View style={styles.inputContainer}>
                              <Text variant="bodySmall">
                                {t("SETTINGSoldPassword")}
                              </Text>
                              <TextInput
                                style={[
                                  styles.input,
                                  error?.field == "old_password" && styles.erro,
                                ]}
                                textContentType={"password"}
                                autoCompleteType={"password"}
                                // keyboardType={"visible-password"}
                                secureTextEntry={isSecureEntry}
                                onEndEditing={() => setIsSecureEntry(true)}
                                onChangeText={(value) => {
                                  onChange({ name: "old_password", value });
                                }}
                                right={
                                  isSecureEntry ? (
                                    <TextInput.Icon
                                      icon="eye-off"
                                      forceTextInputFocus={false}
                                      onPress={() =>
                                        toggleSecure(!isSecureEntry)
                                      }
                                    />
                                  ) : (
                                    <TextInput.Icon
                                      icon="eye"
                                      forceTextInputFocus={false}
                                      onPress={() =>
                                        toggleSecure(!isSecureEntry)
                                      }
                                    />
                                  )
                                }
                                activeUnderlineColor={react_colors.primarygreen}
                                underlineColor={react_colors.darkblue}
                                keyboardType="default"
                              />
                              {error && error.field === "old_password" && (
                                <HelperText type="error" visible={true}>
                                  {error.message}
                                </HelperText>
                              )}
                            </View>

                            <View style={styles.inputContainer}>
                              <Text variant="bodySmall">
                                {t("SETTINGSnewPassword")}
                              </Text>
                              <TextInput
                                style={[
                                  styles.input,
                                  error?.field == "new_password" && styles.erro,
                                ]}
                                textContentType={"password"}
                                autoCompleteType={"password"}
                                // keyboardType={"visible-password"}
                                secureTextEntry={isSecureEntry}
                                onEndEditing={() => setIsSecureEntry(true)}
                                onChangeText={(value) => {
                                  onChange({ name: "new_password", value });
                                }}
                                right={
                                  isSecureEntry ? (
                                    <TextInput.Icon
                                      icon="eye-off"
                                      forceTextInputFocus={false}
                                      onPress={() =>
                                        toggleSecure(!isSecureEntry)
                                      }
                                    />
                                  ) : (
                                    <TextInput.Icon
                                      icon="eye"
                                      forceTextInputFocus={false}
                                      onPress={() =>
                                        toggleSecure(!isSecureEntry)
                                      }
                                    />
                                  )
                                }
                                activeUnderlineColor={react_colors.primarygreen}
                                underlineColor={react_colors.darkblue}
                                keyboardType="default"
                              />
                              {error && error.field === "new_password" && (
                                <HelperText type="error" visible={true}>
                                  {error.message}
                                </HelperText>
                              )}
                            </View>

                            <View style={styles.inputContainer}>
                              <Text variant="bodySmall">
                                {t("SETTINGSconfirmPassword")}
                              </Text>
                              <TextInput
                                ref={inpRef}
                                style={[
                                  styles.input,
                                  error?.field == "new_password_repeat" &&
                                    styles.erro,
                                ]}
                                textContentType={"password"}
                                autoCompleteType={"password"}
                                // keyboardType={"visible-password"}
                                secureTextEntry={isSecureEntry}
                                onEndEditing={() => setIsSecureEntry(true)}
                                onChangeText={(value) => {
                                  onChange({
                                    name: "new_password_repeat",
                                    value,
                                  });
                                }}
                                right={
                                  isSecureEntry ? (
                                    <TextInput.Icon
                                      icon="eye-off"
                                      forceTextInputFocus={false}
                                      onPress={() =>
                                        toggleSecure(!isSecureEntry)
                                      }
                                    />
                                  ) : (
                                    <TextInput.Icon
                                      icon="eye"
                                      forceTextInputFocus={false}
                                      onPress={() =>
                                        toggleSecure(!isSecureEntry)
                                      }
                                    />
                                  )
                                }
                                activeUnderlineColor={react_colors.primarygreen}
                                underlineColor={react_colors.darkblue}
                                keyboardType="default"
                              />
                              {error &&
                                error.field === "new_password_repeat" && (
                                  <HelperText type="error" visible={true}>
                                    {error.message}
                                  </HelperText>
                                )}
                            </View>
                            <Button
                              mode="contained"
                              disabled={isLoading}
                              buttonColor={react_colors.primarygreen}
                              onPress={() => change_Pass()}
                            >
                              {t("SETTINGScpSubmit")}
                            </Button>
                            {/* </View> */}
                          </ScrollView>
                          <Divider />
                        </Dialog.ScrollArea>
                      </Dialog>
                    </Portal>
                    <View style={styles.divider}></View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MaterialIcons name="policy" size={20} color="black" />
                      <Button
                        mode="text"
                        onPress={() =>
                          Linking.openURL(
                            `https://hedge-iot-hems-dev.inesctec.pt/privacy-policy/#${finLang}`
                          )
                        }
                        theme={{
                          colors: { primary: react_colors.primarygreen },
                        }}
                      >
                        {t("UPrivacyTitle")}
                      </Button>
                    </View>
                    <View style={styles.divider}></View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MaterialIcon
                        name="account-cancel"
                        size={20}
                        color="black"
                      />
                      <Button
                        mode="text"
                        theme={{
                          colors: { primary: react_colors.primarygreen },
                        }}
                        // icon={"delete-forever"}
                        onPress={() => navigation.navigate("Info")}
                      >
                        {t("MENUuserInfo")}
                      </Button>
                    </View>
                    <View style={styles.divider}></View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MaterialIcons name="logout" size={20} color="black" />
                      <Button
                        mode="text"
                        theme={{
                          colors: { primary: react_colors.primarygreen },
                        }}
                        onPress={() => logoutUser()(authDispatch)}
                      >
                        {t("MENUlogout")}
                      </Button>
                    </View>
                  </List.Section>
                </List.Accordion>
                {/* <Divider></Divider> */}
                <List.Accordion
                  style={styles.listNode}
                  title={
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                      }}
                    >
                      <MaterialIcons
                        name="flag"
                        size={20}
                        color="black"
                        style={{ paddingHorizontal: 4 }}
                      />
                      <Text style={{ textAlign: "right" }} variant="titleLarge">
                        {t("SETTINGSsection2title")}
                      </Text>
                    </View>
                  }
                  id="1"
                >
                  <List.Section
                    style={{ backgroundColor: react_colors.antiflashwhite }}
                  >
                    <SetLangComp
                      language={currLang}
                      onValueChange={languageChange}
                      onConfirm={saveSetting}
                      onCancel={getSetting}
                    />
                  </List.Section>
                </List.Accordion>
                {/* <Divider></Divider> */}
                <List.Accordion
                  style={styles.listNode}
                  title={
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                      }}
                    >
                      <MaterialIcons
                        name="settings-input-component"
                        size={20}
                        color="black"
                        style={{ paddingHorizontal: 4 }}
                      />
                      <Text style={{ textAlign: "right" }} variant="titleLarge">
                        {t("USERsettingsBtn")}
                      </Text>
                    </View>
                  }
                  id="4"
                >
                  <List.Section
                    style={{ backgroundColor: react_colors.antiflashwhite }}
                  >
                    <TouchableOpacity
                      onPress={() => togglePowerDialog(!isPowerDialog)}
                      style={{ marginLeft: 10 }}
                    >
                      {power && (
                        <Text variant="bodyMedium" style={{ padding: 10 }}>
                          {`${t("REGISTERpower")}: ${power}`}
                        </Text>
                      )}
                      {!power && (
                        <Text variant="bodyMedium" style={{ padding: 10 }}>
                          {t("SETTINGSpowerTitle")}
                        </Text>
                      )}
                      <Portal>
                        <Dialog
                          visible={isPowerDialog}
                          onDismiss={() => {
                            // onCancel("@power");
                            togglePowerDialog(!isPowerDialog);
                          }}
                          style={{ maxHeight: "80%" }}
                        >
                          <Dialog.Title>{t("USERsettingsBtn")}</Dialog.Title>
                          <Divider></Divider>
                          <Dialog.ScrollArea>
                            <RadioButton.Group
                              value={power}
                              onValueChange={(newPower) => {
                                setPower(newPower);
                              }}
                            >
                              <FlatList
                                data={power_contr}
                                keyExtractor={(item) => item.id.toString()}
                                persistentScrollbar={true}
                                contentContainerStyle={{
                                  width: "100%",
                                  flexDirection: "column",
                                }}
                                renderItem={({ item }) => (
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <RadioButton
                                      theme={{
                                        colors: {
                                          primary: react_colors.primarygreen,
                                        },
                                      }}
                                      value={item.value}
                                      status={
                                        power === item.value
                                          ? "checked"
                                          : "unchecked"
                                      }
                                    />
                                    <Text
                                      variant="labelLarge"
                                      style={{ color: react_colors.black }}
                                    >
                                      {item.label}
                                    </Text>
                                  </View>
                                )}
                              />
                            </RadioButton.Group>
                          </Dialog.ScrollArea>
                          <Divider></Divider>
                          <Dialog.Actions>
                            {/* <Button
                              mode="text"
                              onPress={() => {
                                selPower = oldPower;
                                onValueChange(selPower);
                                toggleDialog(!isDialog);
                              }}
                            >
                              {t("Modalcancel")}
                            </Button> */}
                            <Button
                              loading={isLoading}
                              mode="contained"
                              onPress={() => {
                                onSaveChanges();
                                togglePowerDialog(!isPowerDialog);
                              }}
                              theme={{
                                colors: { primary: react_colors.primarygreen },
                              }}
                            >
                              {t("SETTINGSsave")}
                            </Button>
                          </Dialog.Actions>
                        </Dialog>
                      </Portal>
                    </TouchableOpacity>
                  </List.Section>
                </List.Accordion>
                {/* <Divider></Divider> */}
                <List.Accordion
                  style={styles.listNode}
                  title={
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-arround",
                        alignItems: "center",
                      }}
                    >
                      <MaterialIcon
                        name="information-outline"
                        size={20}
                        color="black"
                        style={{ paddingHorizontal: 4 }}
                      />
                      <Text style={{ textAlign: "right" }} variant="titleLarge">
                        {t("SETTAPPabout")}
                      </Text>
                      {/* <>
                        <Button
                          onPress={() => {
                            if (Platform.OS === "android") {
                              Linking.openURL(
                                // "market://details?id=pt.inesctec.interconnect.hems"
                                "https://play.google.com/store/apps/details?id=pt.inesctec.interconnect.hems"
                              );
                            }
                            if (Platform.OS === "ios") {
                              Linking.openURL(
                                "itms-apps://apps.apple.com/PT/app/id1609106145"
                              );
                            }
                          }}
                          mode="text"
                          color="#daa520"
                        >
                          {t("HOMEupdateAppBtn")}
                        </Button>
                      </> */}
                    </View>
                  }
                  id="2"
                ></List.Accordion>
                {/* <Divider></Divider> */}
                <List.Accordion
                  style={styles.listNode}
                  title={
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={require("../assets/icon.png")}
                        style={{ width: 30, height: 30, marginRight: 2 }}
                        resizeMode="contain"
                      />
                      <Text style={{ textAlign: "right" }} variant="titleLarge">
                        {t("APPINFObutton2")}
                      </Text>
                    </View>
                  }
                  id="3"
                ></List.Accordion>
                {/* <Divider></Divider> */}
              </List.AccordionGroup>
            </View>
          </ScrollView>
        </SafeAreaView>

        {/* <View
          style={{
            position: "absolute",
            width: "100%",
            bottom: 35,
            right: 0,
            paddingBottom: 10,
          }}
        >
          {isChanged && (
            <Button
              loading={isLoading}
              mode="contained"
              labelStyle={{ color: react_colors.white }}
              buttonColor={react_colors.primarygreen}
              // onPress={() => {
              //   onPrefsChange();
              // }}
            >
              {t("SETTINGSsave")}
            </Button>
          )}
        </View> */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            position: "absolute",
            bottom: 0,
            width: "100%",
          }}
        >
          <View
            style={{
              width: "50%",
              height: 45,
              alignSelf: "flex-start",
              alignContent: "center",
              paddingLeft: 10,
            }}
          >
            <Image
              source={feu}
              style={{ width: 100, height: 45, alignSelf: "flex-start" }}
              resizeMode="contain"
            />
          </View>
          <Button
            style={{ alignSelf: "flex-end" }}
            icon={({ size, color }) => (
              <MaterialIcon name="comment-question" size={24} color="black" />
            )}
            mode="text"
            theme={{ colors: { primary: react_colors.black } }}
            compact
            contentStyle={{ height: 40 }}
            labelStyle={{ fontSize: 16 }}
            onPress={() =>
              Linking.openURL(
                "https://interconnectproject.eu/wp-content/uploads/2023/11/faq_v4.pdf"
              )
            }
          >
            {t("HELPtitle")}
          </Button>
        </View>
      </>
    );
};

export default React.memo(Settings);