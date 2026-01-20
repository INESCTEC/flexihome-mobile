import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useRef, useCallback, useEffect } from "react";

import {
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
  Platform,
  Keyboard,
  FlatList,
} from "react-native";
import { useTranslation } from "react-i18next";

import {
  Text,
  Button,
  TextInput,
  HelperText,
  Snackbar,
  Checkbox,
  Portal,
  Dialog,
  Divider,
  RadioButton,
} from "react-native-paper";

// import { useActionSheet } from "@expo/react-native-action-sheet";

import { styles, react_colors, color_status } from "../styles";
import { InterBackground } from "./InterBackground";

const RegisterComp = ({
  onSubmit,
  onChange,
  form,
  loading,
  error,
  errors,
  language,
  accepted,
}) => {
  const { navigate } = useNavigation();
  const [isSecureEntry, setIsSecureEntry] = useState(true);
  const divErr = useRef(null);
  // const [acceptedPolicy, setAcceptedPolicy] = useState(false);

  const [snackVisible, setSnackVisible] = useState(false);
  const [t, i18n] = useTranslation();

  const [postalValue, setPostalValue] = useState(null);

  const [tarif, setTarif] = useState(null);
  const [isTarifOpen, setTarifOpen] = useState(false);

  const [ctpower, setCtpower] = useState(null);
  const [isContractOpen, setContractOpen] = useState(false);

  const [isKeyboardOn, setKeyboard] = useState(false);

  // const { showActionSheetWithOptions } = useActionSheet();
  const [isDialog, setDialog] = useState(false);
  const [isPowerOpen, setPowerOpen] = useState(false);

  const toggleDialog = (prev) => setDialog(prev);
  const togglePower = (prev) => setPowerOpen(prev);

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

  useEffect(() => {
    if (tarif) {
      onChange({ name: "tarif_type", value: tarif });
    }
    if (ctpower) {
      onChange({ name: "contracted_power", value: ctpower });
    }
  }, [tarif, ctpower]);

  const handlePostal = (v) => {
    let final_postal = formatPostalInput(v);
    setPostalValue(final_postal);
  };
  const formatPostalInput = (val) => {
    if (!val) return val;

    const postal = val.replace(/[^\d]/g, "").slice(0, 7);
    const postal_len = postal.length;
    // console.log(postal_len);
    if (postal_len < 4) return postal;

    if (postal_len < 5) return postal + "-";

    if (postal_len < 8) return postal.slice(0, 4) + "-" + postal.slice(4, 7);
  };

  // const tarifL = [ "simple", "bi-hourly", "tri-hourly" ];
  
  // const onMenu = () => {
  //   const options = [ "simple", "bi-hourly", "tri-hourly", "Cancelar" ];
  //   const cancelButtonIndex = options.length - 1;

  //   showActionSheetWithOptions({
  //     options,
  //     cancelButtonIndex,
  //     tintColor: react_colors.mediumseagreen,
  //   }, (selectedIndex) => {
  //     if (selectedIndex < 3){
  //     setTarif(tarifL[selectedIndex]);
  //   }
  //   });
  // }

  const tarifL = [
    { id: 0, label: t("DPtarifOp1"), value: "simple" },
    { id: 1, label: t("DPtarifOp2"), value: "bi-hourly" },
    { id: 2, label: t("DPtarifOp3"), value: "tri-hourly" },
  ];
  // const [tarifList, setTarifList] = useState(tarifL);

  const contpw = [
    {
      id: 0,
      label: "1.15 kVA",
      value: "1.15 kVA",
    },
    {
      id: 1,
      label: "2.3 kVA",
      value: "2.3 kVA",
    },
    {
      id: 2,
      label: "3.45 kVA",
      value: "3.45 kVA",
    },
    {
      id: 3,
      label: "4.6 kVA",
      value: "4.6 kVA",
    },
    {
      id: 4,
      label: "5.75 kVA",
      value: "5.75 kVA",
    },
    {
      id: 5,
      label: "6.9 kVA",
      value: "6.9 kVA",
    },
    {
      id: 6,
      label: "10.35 kVA",
      value: "10.35 kVA",
    },
    {
      id: 7,
      label: "13.8 kVA",
      value: "13.8 kVA",
    },
    {
      id: 8,
      label: "17.25 kVA",
      value: "17.25 kVA",
    },
    {
      id: 9,
      label: "20.7 kVA",
      value: "20.7 kVA",
    },
    {
      id: 10,
      label: "27.6 kVA",
      value: "27.6 kVA",
    },
    {
      id: 11,
      label: "34.5 kVA",
      value: "34.5 kVA",
    },
    {
      id: 12,
      label: "41.4 kVA",
      value: "41.4 kVA",
    },
  ];

  // const [powerList, setPowerList] = useState(contpw);

  const onClickOutside = useCallback(() => {
    if (isTarifOpen) setTarifOpen(false);
    if (isContractOpen) setContractOpen(false);
  }, [isTarifOpen, isContractOpen]);

  const onTarifOpen = useCallback(() => {
    setContractOpen(false);
  }, []);

  const onPowerOpen = useCallback(() => {
    setTarifOpen(false);
  }, []);

  const toggleSecure = (prev) => {
    setIsSecureEntry(!prev);
  };

  return (
    <SafeAreaView style={[styles.global_color, styles.container]}>
      <InterBackground noNav />
      {/* <Snackbar
        // wrapperStyle={{ color: react_colors.yellowgreen }}
        visible={snackVisible}
        duration={4000}
        onDismiss={() => setSnackVisible(false)}
      >
        {"Find your CPE in your retailer's invoice."}
      </Snackbar> */}
      {/* {snackVisible && (
        <View
          style={{
            height: 60,
            width: "90%",
            alignSelf: "center",
            alignItems: "center",
            borderRadius: 6,
            backgroundColor: react_colors.black,
            opacity: 30,
          }}
        >
          <Text
            style={{
              paddingTop: 15,
              alignContent: "center",
              color: react_colors.white,
            }}
          >
            {"Find your CPE in your retailer's invoice."}
          </Text>
        </View>
      )} */}
      {/* <View style={{ height: "5%" }}></View> */}
      <ScrollView ref={divErr}>
        <TouchableWithoutFeedback
          onPress={() => {
            onClickOutside();
          }}
        >
          <View style={{ maxHeight: "100%" }}>
            <View style={[styles.view_item, { paddingTop: 20 }]}>
              <Text variant="bodySmall">{t("REGISTERusername")}</Text>
              <TextInput
                // mode= 'flat' | 'outlined'
                // error={true}
                style={[
                  styles.input,
                  error?.field === "first_name" ? styles.erro : {},
                ]}
                onChangeText={(value) => {
                  onChange({ name: "first_name", value });
                }}
                onFocus={() => onClickOutside()}
                placeholder={t("REGISTERinputUsername")}
                // right={<TextInput.Icon name="eye" />}
                activeUnderlineColor={react_colors.primarygreen}
                underlineColor={react_colors.darkblue}
                keyboardType="default"
              />
              {error?.field === "first_name" && (
                <HelperText type="error" visible={true}>
                  {error.message}
                </HelperText>
              )}

              {/* LAST */}
              <Text variant="bodySmall">{t("REGISTERlastname")}</Text>
              <TextInput
                // mode= 'flat' | 'outlined'
                // error={true}
                style={[
                  styles.input,
                  error?.field === "last_name" ? styles.erro : {},
                ]}
                onChangeText={(value) => {
                  onChange({ name: "last_name", value });
                }}
                onFocus={() => onClickOutside()}
                placeholder={t("REGISTERinputLastname")}
                // right={<TextInput.Icon name="eye" />}
                activeUnderlineColor={react_colors.primarygreen}
                underlineColor={react_colors.darkblue}
                keyboardType="default"
              />
              {error?.field === "last_name" && (
                <HelperText type="error" visible={true}>
                  {error.message}
                </HelperText>
              )}
              {/* api_key */}
              {/* <Text variant="bodySmall">{t("REGISTERapi_key")}</Text>
                <TextInput
                  // mode= 'flat' | 'outlined'
                  // error={true}
                  style={[
                    styles.input,
                    error?.field === "api_key" ? styles.erro : {},
                  ]}
                  onChangeText={(value) => {
                    onChange({ name: "api_key", value });
                  }}
                  placeholder={t("REGISTERinputApi_key")}
                  // right={<TextInput.Icon name="eye" />}
                  activeUnderlineColor={react_colors.primarygreen}
                  // underlineColor={react_colors.darkblue}
                  keyboardType="default"
                  maxLength={16}
                />
                {error?.field === "api_key" && (
                  <HelperText type="error" visible={true}>
                    {error.message}
                  </HelperText>
                )} */}
              {/* cpe */}
              {/* <Text variant="bodySmall">{t("REGISTERcpe")}</Text>
              <TextInput
                style={[styles.input, error?.field == "cpe" && styles.erro]}
                onFocus={() => setSnackVisible(true)}
                onBlur={() => setSnackVisible(false)}
                onChangeText={(value) => {
                  onChange({ name: "cpe", value });
                }}
                placeholder={t("REGISTERinputCPE")}
                // right={<TextInput.Icon name="eye" />}
                activeUnderlineColor={react_colors.primarygreen}
                underlineColor={react_colors.darkblue}
                keyboardType="default"
              />
              {error?.field === "cpe" && (
                <HelperText type="error" visible={true}>
                  {error.message}
                </HelperText>
              )} */}
              {/* HUBID */}
              <Text variant="bodySmall">{t("REGISTERmeter")}</Text>
              <TextInput
                // mode= 'flat' | 'outlined'
                // error={true}
                style={[
                  styles.input,
                  error?.field === "meterId" ? styles.erro : {},
                ]}
                onChangeText={(value) => {
                  onChange({
                    name: "hub_id",
                    value: value.trim().toUpperCase(),
                  });
                }}
                onFocus={() => onClickOutside()}
                placeholder={t("REGISTERinputMeter")}
                // right={<TextInput.Icon name="eye" />}
                activeUnderlineColor={react_colors.primarygreen}
                underlineColor={react_colors.darkblue}
                keyboardType="default"
              />
              {error?.field === "meterId" && (
                <HelperText type="error" visible={true}>
                  {error.message}
                </HelperText>
              )}

              {/* tarif_type */}
              <View zIndex={3000} style={[styles.inputContainer]}>
                <Text variant="bodySmall">{t("REGISTERtarif")}</Text>
                <TouchableOpacity
                  style={[styles.input, { width: "110%" }]}
                  onPress={() => toggleDialog(!isDialog)}
                >
                  <TextInput
                    style={[styles.input]}
                    editable={false}
                    value={
                      tarifL.find((item) => item.value === tarif)?.label || ""
                    }
                    placeholder={t("REGISTERinputTarif")}
                    activeUnderlineColor={react_colors.primarygreen}
                    underlineColor={react_colors.darkblue}
                  />
                  {/* <Text variant="bodyLarge">{tarifL.find((item) => item.value === tarif)?.label}</Text> */}
                  <Portal>
                    <Dialog
                      visible={isDialog}
                      onDismiss={() => toggleDialog(!isDialog)}
                    >
                      <Dialog.Title>{t("SETTINGStarifTitle")}</Dialog.Title>
                      <Divider />
                      <Dialog.Content>
                        <RadioButton.Group
                          value={tarif}
                          onValueChange={(newTariff) => {
                            setTarif(newTariff);
                          }}
                        >
                          <FlatList
                            data={tarifL}
                            keyExtractor={(item) => item.id.toString()}
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
                                  value={item.value}
                                  status={
                                    tarif === item.value
                                      ? "checked"
                                      : "unchecked"
                                  }
                                  theme={{
                                    colors: {
                                      primary: react_colors.primarygreen,
                                    },
                                  }}
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
                      </Dialog.Content>
                      <Divider />
                      <Dialog.Actions>
                        <Button
                          mode="text"
                          onPress={() => toggleDialog(!isDialog)}
                          theme={{
                            colors: { primary: react_colors.primarygreen },
                          }}
                        >
                          {t("Modalok")}
                        </Button>
                      </Dialog.Actions>
                    </Dialog>
                  </Portal>
                </TouchableOpacity>
                {/* <Picker
                  id="tarif_picker"
                  data={tarifL}
                  label={t("escolher")}
                  searchable={false}
                  // setSelected={setTarif}
                /> */}
                {/* <DropDownPicker
                  style={[
                    styles.input,
                    error?.field === "tarif" && styles.erro,
                  ]}
                  // zIndex={3000}
                  modalContentContainerStyle={{ marginLeft: 20 }}
                  items={tarifList}
                  listMode="SCROLLVIEW"
                  value={tarif}
                  open={isTarifOpen}
                  onOpen={onTarifOpen}
                  setOpen={setTarifOpen}
                  setValue={setTarif}
                /> */}
              </View>
              {error?.field === "tarif" && (
                <HelperText type="error" visible={true}>
                  {error.message}
                </HelperText>
              )}

              {/* contracted_power */}
              <View zIndex={2000} style={[styles.inputContainer]}>
                <Text variant="bodySmall">{t("REGISTERpower")}</Text>
                <TouchableOpacity
                  style={[styles.input, { width: "110%" }]}
                  onPress={() => togglePower(!isPowerOpen)}
                >
                  <TextInput
                    style={[styles.input]}
                    editable={false}
                    value={
                      contpw.find((item) => item.value === ctpower)?.label || ""
                    }
                    placeholder={t("REGISTERinputPower")}
                    activeUnderlineColor={react_colors.primarygreen}
                    underlineColor={react_colors.darkblue}
                  />
                  <Portal>
                    <Dialog
                      visible={isPowerOpen}
                      onDismiss={() => togglePower(!isPowerOpen)}
                      style={{ maxHeight: "80%" }}
                    >
                      <Dialog.Title>{t("SETTINGSpowerTitle")}</Dialog.Title>
                      <Divider />
                      <Dialog.ScrollArea>
                        <RadioButton.Group
                          value={ctpower}
                          onValueChange={(newPower) => {
                            setCtpower(newPower);
                          }}
                        >
                          <FlatList
                            data={contpw}
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
                                  value={item.value}
                                  theme={{
                                    colors: {
                                      primary: react_colors.primarygreen,
                                    },
                                  }}
                                  status={
                                    ctpower === item.value
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
                      <Divider />
                      <Dialog.Actions>
                        <Button
                          mode="text"
                          onPress={() => togglePower(!isPowerOpen)}
                          theme={{
                            colors: { primary: react_colors.primarygreen },
                          }}
                        >
                          {t("Modalok")}
                        </Button>
                      </Dialog.Actions>
                    </Dialog>
                  </Portal>
                </TouchableOpacity>
              </View>
              {error?.field === "power" && (
                <HelperText type="error" visible={true}>
                  {error.message}
                </HelperText>
              )}

              {/*POSTAL CODE*/}
              <Text variant="bodySmall">{t("REGISTERpostal")}</Text>
              <TextInput
                // mode= 'flat' | 'outlined'
                // error={true}
                style={[
                  styles.input,
                  error?.field === "postal" ? styles.erro : {},
                ]}
                onChangeText={(value) => {
                  handlePostal(value);
                  onChange({ name: "postal_code", value });
                }}
                onFocus={() => onClickOutside()}
                value={postalValue}
                placeholder={t("REGISTERinputPostal")}
                // right={<TextInput.Icon name="eye" />}
                activeUnderlineColor={react_colors.primarygreen}
                underlineColor={react_colors.darkblue}
                keyboardType="numeric"
                maxLength={8}
              />
              {error?.field === "postal" && (
                <HelperText type="error" visible={true}>
                  {error.message}
                </HelperText>
              )}

              {/* EMAIL */}
              <Text variant="bodySmall">{t("REGISTERemail")}</Text>
              <TextInput
                // mode= 'flat' | 'outlined'
                // error={true}
                style={[
                  styles.input,
                  error?.field === "email" ? styles.erro : {},
                ]}
                //   value={form.username || null}
                onChangeText={(value) => {
                  onChange({
                    name: "email",
                    value: value.trim().toLowerCase(),
                  });
                }}
                onFocus={() => onClickOutside()}
                placeholder={t("REGISTERinputEmail")}
                // right={<TextInput.Icon name="eye" />}
                activeUnderlineColor={react_colors.primarygreen}
                underlineColor={react_colors.darkblue}
                keyboardType="default"
              />
              {error?.field === "email" && (
                <HelperText type="error" visible={true}>
                  {error.message}
                </HelperText>
              )}

              {/* PASSWD */}
              <Text variant="bodySmall">{t("LOGINpassword")}</Text>
              <TextInput
                style={[
                  styles.input,
                  error?.field === "password" ? styles.erro : {},
                ]}
                textContentType={"password"}
                autoCompleteType={"password"}
                // keyboardType={"visible-password"}
                secureTextEntry={isSecureEntry}
                //   value={passwd}
                onChangeText={(value) => {
                  onChange({ name: "password", value });
                }}
                onEndEditing={() => setIsSecureEntry(true)}
                onFocus={() => onClickOutside()}
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
                activeUnderlineColor={react_colors.primarygreen}
                underlineColor={react_colors.darkblue}
                keyboardType="default"
              />
              {error?.field === "password" && (
                <HelperText type="error" visible={true}>
                  {error.message}
                </HelperText>
              )}
              {/* C.PASSWD */}
              <Text variant="bodySmall">{t("REGISTERconfirmPassword")}</Text>
              <TextInput
                style={[
                  styles.input,
                  error?.field === "password_repeat" ? styles.erro : {},
                ]}
                textContentType={"password"}
                autoCompleteType={"password"}
                // keyboardType={"visible-password"}
                secureTextEntry={isSecureEntry}
                //   value={passwd}
                onChangeText={(value) => {
                  onChange({ name: "password_repeat", value });
                }}
                onEndEditing={() => setIsSecureEntry(true)}
                onFocus={() => onClickOutside()}
                placeholder={t("REGISTERrepeatPassword")}
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
                activeUnderlineColor={react_colors.primarygreen}
                underlineColor={react_colors.darkblue}
                keyboardType="default"
              />
              {error?.field === "password_repeat" && (
                <HelperText type="error" visible={true}>
                  {error.message}
                </HelperText>
              )}
            </View>
            {/* <View style={{ paddingRight: 4 }}>
              <Text style={{ textAlign: "right", fontSize: 14 }}>
                {t("REGISTERrequired")}
              </Text>
            </View> */}

            {error && (error.field === "server" || error.field === "error") && (
              <View
                style={{
                  height: 60,
                  width: "90%",
                  alignSelf: "center",
                  borderRadius: 6,
                  backgroundColor: react_colors.pink,
                  opacity: 30,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    paddingHorizontal: 24,
                    textAlign: "center",
                    color: react_colors.red,
                  }}
                >
                  {error.message}
                </Text>
              </View>
            )}
            {isKeyboardOn && <View style={{ height: 30 }}></View>}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      {/* <View style={{ alignItems: "center" }}>
        
        <View style={styles.checkbox}>
          <Checkbox
            status={acceptedPolicy ? "checked" : "unchecked"}
            onPress={() => {
              setAcceptedPolicy(!acceptedPolicy);
              onAccept(acceptedPolicy);
            }}
            color={react_colors.slateblue}
          ></Checkbox>
        </View>
        <Text style={{ fontSize: 17, color: react_colors.black }}>
          {`Read and accepted `}
        </Text>
        <TouchableOpacity onPress={() => navigate("Privacy")}>
          <Text style={{ fontSize: 17, color: react_colors.mediumslateblue }}>
            {`Privacy Policy Terms`}
          </Text>
        </TouchableOpacity>
      </View> */}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // behavior="height"
        // style={{ backgroundColor: react_colors.ghostwhite }}
      >
        {accepted && (
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              alignContent: "center",
              marginTop: 15,
              // marginBottom: 15,
            }}
          >
            <Text variant="bodyLarge" style={{ color: react_colors.dimgray }}>
              {t("APPINFObutton1")}
            </Text>
            <View
              style={{
                width: "15%",
                justifyContent: "flex-start",
                // alignContent: "flex-start",
                // alignItems: "center",
              }}
            >
              <View style={{ marginHorizontal: 4 }}>
                <Checkbox.Android
                  status={accepted ? "checked" : "unchecked"}
                  disabled
                  color={react_colors.primarygreen}
                ></Checkbox.Android>
              </View>
            </View>
          </View>
        )}
        {/* <>VIEW TO REMOVE</>
          <View
            style={{
              width: "85%",
              justifyContent: "center",
              // alignContent: "flex-start",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigate("Privacy", { cameFrom: "Register" });
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: react_colors.black,
                  textAlign: "center",
                }}
              >
                {`${t("REGISTERprivacyread").slice(0, 16)}`}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  color: react_colors.primarygreen,
                  textAlign: "left",
                }}
              >
                {`${t("REGISTERprivacyread").slice(16)}`}
              </Text>
            </TouchableOpacity>
          </View> */}
        <View style={[styles.view_item, { marginVertical: 15 }]}>
          <Button
            buttonColor={react_colors.primarygreen}
            mode="contained"
            onPress={
              accepted
                ? onSubmit
                : () => {
                    navigate("Privacy", {
                      cameFrom: "Register",
                    });
                  }
            }
            disabled={loading}
          >
            {t("REGISTERbutton")}
          </Button>

          {/* <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignContent: "center",
            }}
          >
            <Text
              style={{
                paddingTop: 15,
                fontSize: 17,
                color: react_colors.black,
              }}
            >
              {t("REGISTERback")}
            </Text>
            <TouchableOpacity
              onPress={() => navigate("Login")}
              style={{
                justifyContent: "flex-end",
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  color: react_colors.primarygreen,
                }}
              >
                {t("REGISTERgotoLogin")}
              </Text>
            </TouchableOpacity>
          </View> */}
          <View style={{ height: 20 }}></View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterComp;
