import React, { useContext, useState, useCallback, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import {
  Button,
  Caption,
  HelperText,
  TextInput,
  Title,
  Checkbox,
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import DropDownPicker from "react-native-dropdown-picker";
import { react_colors, styles } from "../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Crypto from "expo-crypto";
import { GlobalContext } from "../context/Provider";
import Toast from "react-native-root-toast";
import env from "../config/env";

export const CompleteNewUser = ({
  route,
  navigation,
  onAccept,
  onSubmit,
  loading,
}) => {
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const {
    email,
    first_name,
    last_name,
    meter_id,
    postal_code,
    contracted_power,
    tarif_type,
    is_google_account,
  } = route.params;

  const { authDispatch } = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(false);
  const [auth, setAuth] = useState(null);

  const [t, i18n] = useTranslation();
  const [postalValue, setPostalValue] = useState(postal_code);

  const [tarif, setTarif] = useState(tarif_type);
  const [isTarifOpen, setTarifOpen] = useState(false);

  const [ctpower, setCtpower] = useState(contracted_power);
  const [isContractOpen, setContractOpen] = useState(false);

  const [isKeyboardOn, setKeyboard] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);

  const [error, setError] = useState(null);
  const [form, setForm] = useState({});

  const [prefs, setPrefs] = useState({});
  const URL_API = env.base_api_url;

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
  }, [tarif]);

  useEffect(() => {
    if (ctpower) {
      onChange({ name: "contracted_power", value: ctpower });
    }
  }, [ctpower]);

  useEffect(() => {
    getStorage();
  }, []);

  const onChange = ({ name, value }) => {
    setForm({ ...form, [name]: value });
  };

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

  const tarifL = [
    {
      label: "simple",
      value: "simple",
    },
    {
      label: "bi-hourly",
      value: "bi-hourly",
    },
    {
      label: "tri-hourly",
      value: "tri-hourly",
    },
  ];
  const [tarifList, setTarifList] = useState(tarifL);

  const contpw = [
    {
      label: "1.15 kVA",
      value: "1.15 kVA",
    },
    {
      label: "2.3 kVA",
      value: "2.3 kVA",
    },
    {
      label: "3.45 kVA",
      value: "3.45 kVA",
    },
    {
      label: "4.6 kVA",
      value: "4.6 kVA",
    },
    {
      label: "5.75 kVA",
      value: "5.75 kVA",
    },
    {
      label: "6.9 kVA",
      value: "6.9 kVA",
    },
    {
      label: "10.35 kVA",
      value: "10.35 kVA",
    },
    {
      label: "13.8 kVA",
      value: "13.8 kVA",
    },
    {
      label: "17.25 kVA",
      value: "17.25 kVA",
    },
    {
      label: "20.7 kVA",
      value: "20.7 kVA",
    },
    {
      label: "27.6 kVA",
      value: "27.6 kVA",
    },
    {
      label: "34.5 kVA",
      value: "34.5 kVA",
    },
    {
      label: "41.4 kVA",
      value: "41.4 kVA",
    },
  ];

  const [powerList, setPowerList] = useState(contpw);

  const onTarifOpen = useCallback(() => {
    setContractOpen(false);
  }, []);

  const onPowerOpen = useCallback(() => {
    setTarifOpen(false);
  }, []);

  const dismissR = (navigation) => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  const getStorage = async () => {
    try {
      let token = await AsyncStorage.getItem("@token");
      if (token) {
        setAuth(token);
      }

      let userPrefs = await AsyncStorage.getItem("@userPrefs");

      if (userPrefs) {
        let json = JSON.parse(userPrefs);
        setPrefs(json);
      }
    } catch (err) {
      console.log("No storage found.", err);
    }
  };

  const storeData = async (key, val) => {
    try {
      // await AsyncStorage.clear();
      await AsyncStorage.setItem(key, val);
    } catch (err) {
      console.log("cant store key ", err);
    }
  };

  const showToast = (message, type, data) => (dispatch) => {
    Toast.show(message, {
      duration: 9000,
      position: -40,
      backgroundColor: type ? react_colors.gray : react_colors.lightcoral,
    });

    let unfinished = true;

    const {
      email,
      first_name,
      last_name,
      meter_id,
      postal_code,
      contracted_power,
      tarif_type,
      country,
    } = data;

    // console.log(data);
    if (
      email != null &&
      email != "" &&
      first_name != null &&
      first_name != "" &&
      meter_id != null &&
      meter_id != "" &&
      postal_code != null &&
      postal_code != "" &&
      contracted_power != null &&
      contracted_power != "" &&
      tarif_type != null &&
      tarif_type != ""
    ) {
      unfinished = false;
    }
    dispatch({
      type: "UPDATE_REGISTER",
      payload: { isIncomplete: unfinished, user: data, message: message },
    });
  };
  const updateUser = async (obj) => {
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

    let data = {
      ...prefs,
      ...obj,
    };

    await axios
      .post(`${URL_API}/account/user`, data, {
        headers,
      })
      .then((res) => {
        // console.log("Preferences updated. Success. ", res.data);
        storeData("@userPrefs", JSON.stringify(res.data));

        showToast("Update success!", true, res.data)(authDispatch);
        navigation.navigate("HomeScreen");
      })
      .catch((err) => {
        // console.log("Failed to update userSettings ", err.response.data);
        showToast(
          "Server error. Try again later!",
          false,
          route.params
        )(authDispatch);
        navigation.popToTop();
      });
  };
  return (
    <SafeAreaView
      style={
        (styles.global_color,
        {
          flex: 1,
          paddingTop: StatusBar.currentHeight,
        })
      }
      // style={[styles.container, { backgroundColor: react_colors.snow }]}
    >
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
      <ScrollView>
        <View
          style={[
            styles.view_item,
            {
              backgroundColor: react_colors.khaki,
              padding: 5,
              borderRadius: 10,
            },
          ]}
        >
          <Text
            style={{ textAlign: "justify", fontSize: 16, fontWeight: "600" }}
          >
            {t("CMPRegisterDiscl")}
          </Text>
        </View>
        {/* <View styles={styles.view_item}> */}
        <View style={styles.divider}></View>

        <View style={styles.view_item}>
          <Title>{t("REGISTERtitle")}</Title>
          <Caption>{t("REGISTERusername")}</Caption>
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
            placeholder={first_name}
            // right={<TextInput.Icon name="eye" />}
            // underlineColor={react_colors.darkblue}
            keyboardType="default"
          />
          {error?.field === "first_name" && (
            <HelperText type="error" visible={true}>
              {error.message}
            </HelperText>
          )}

          {/* LAST */}
          <Caption>{t("REGISTERlastname")}</Caption>
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
            placeholder={last_name}
            // right={<TextInput.Icon name="eye" />}
            // underlineColor={react_colors.darkblue}
            keyboardType="default"
          />
          {error?.field === "last_name" && (
            <HelperText type="error" visible={true}>
              {error.message}
            </HelperText>
          )}

          {/* api_key */}
          <Caption>{t("REGISTERapi_key")}</Caption>
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
            // underlineColor={react_colors.darkblue}
            keyboardType="default"
            maxLength={16}
          />
          {error?.field === "api_key" && (
            <HelperText type="error" visible={true}>
              {error.message}
            </HelperText>
          )}

          {/* cpe */}
          {/* <Caption>{t("REGISTERcpe")}</Caption>
            <TextInput
              style={[styles.input, error?.field == "cpe" && styles.erro]}
              onFocus={() => setSnackVisible(true)}
              onBlur={() => setSnackVisible(false)}
              onChangeText={(value) => {
                onChange({ name: "cpe", value });
              }}
              placeholder={cpe ? cpe : t("REGISTERinputCPE")}
              // right={<TextInput.Icon name="eye" />}
              // underlineColor={react_colors.darkblue}
              keyboardType="default"
            />
            {error?.field === "cpe" && (
              <HelperText type="error" visible={true}>
                {error.message}
              </HelperText>
            )} */}
          {/* METERID */}
          <Caption>{t("REGISTERmeter")}</Caption>
          <TextInput
            // mode= 'flat' | 'outlined'
            // error={true}
            style={[
              styles.input,
              error?.field === "meterId" ? styles.erro : {},
            ]}
            onChangeText={(value) => {
              onChange({ name: "meter_id", value });
            }}
            placeholder={meter_id ? meter_id : t("REGISTERinputMeter")}
            // right={<TextInput.Icon name="eye" />}
            // underlineColor={react_colors.darkblue}
            keyboardType="default"
          />
          {error?.field === "meter_id" && (
            <HelperText type="error" visible={true}>
              {error.message}
            </HelperText>
          )}

          {/* tarif_type */}
          <Caption>{t("REGISTERtarif")}</Caption>
          <DropDownPicker
            style={[styles.input, error?.field == "tarif" && styles.erro]}
            // zIndex={2000}
            modalContentContainerStyle={{ marginLeft: 20 }}
            items={tarifList}
            listMode="MODAL"
            value={tarif}
            open={isTarifOpen}
            onOpen={onTarifOpen}
            setOpen={setTarifOpen}
            setValue={setTarif}
          />
          {error?.field === "tarif" && (
            <HelperText type="error" visible={true}>
              {error.message}
            </HelperText>
          )}

          {/* contracted_power */}
          <Caption>{t("REGISTERpower")}</Caption>
          <DropDownPicker
            style={[styles.input, error?.field == "power" && styles.erro]}
            // zIndex={1000}
            modalContentContainerStyle={{ marginLeft: 20 }}
            items={powerList}
            listMode="MODAL"
            value={ctpower}
            open={isContractOpen}
            onOpen={onPowerOpen}
            setOpen={setContractOpen}
            setValue={setCtpower}
          />
          {error?.field === "power" && (
            <HelperText type="error" visible={true}>
              {error.message}
            </HelperText>
          )}

          {/*POSTAL CODE*/}
          <Caption>{t("REGISTERpostal")}</Caption>
          <TextInput
            // mode= 'flat' | 'outlined'
            // error={true}
            style={[styles.input, error?.field === "postal" ? styles.erro : {}]}
            onChangeText={(value) => {
              handlePostal(value);
              onChange({ name: "postal_code", value });
            }}
            value={postalValue}
            placeholder={postalValue ? postalValue : t("REGISTERinputPostal")}
            // right={<TextInput.Icon name="eye" />}
            // underlineColor={react_colors.darkblue}
            keyboardType="numeric"
            maxLength={8}
          />
          {error?.field === "postal" && (
            <HelperText type="error" visible={true}>
              {error.message}
            </HelperText>
          )}
          {/* COUNTRY */}
          <Caption>{t("REGISTERcountry")}</Caption>
          <TextInput
            // mode= 'flat' | 'outlined'
            // error={true}
            style={[
              styles.input,
              error?.field === "country" ? styles.erro : {},
            ]}
            onChangeText={(value) => {
              onChange({ name: "country", value });
            }}
            placeholder={"PT"}
            editable={false}
            // placeholder={t("REGISTERinputCountry")}
            // right={<TextInput.Icon name="eye" />}
            // underlineColor={react_colors.darkblue}
            keyboardType="default"
          />
          {error?.field === "country" && (
            <HelperText type="error" visible={true}>
              {error.message}
            </HelperText>
          )}
          {/* EMAIL */}
          <Caption>{t("REGISTERemail")}</Caption>
          <TextInput
            // mode= 'flat' | 'outlined'
            // error={true}
            style={[styles.input, error?.field === "email" ? styles.erro : {}]}
            //   value={form.username || null}
            editable={false}
            // disabled={true}
            onChangeText={(value) => {
              onChange({ name: "email", value });
            }}
            placeholder={email}
            value={email}
            // right={<TextInput.Icon name="eye" />}
            // underlineColor={react_colors.darkblue}
            keyboardType="default"
          />
          {error?.field === "email" && (
            <HelperText type="error" visible={true}>
              {error.message}
            </HelperText>
          )}
          <View style={styles.divider}></View>
        </View>
        {isKeyboardOn && <View style={{ height: 100 }}></View>}

        {error && error.message.includes("server") && (
          <View
            style={{
              height: 60,
              width: "90%",
              alignSelf: "center",
              alignItems: "center",
              borderRadius: 6,
              backgroundColor: react_colors.pink,
              opacity: 30,
            }}
          >
            <Text
              style={{
                paddingTop: 15,
                alignContent: "center",
                color: react_colors.red,
              }}
            >
              {error.message}
            </Text>
          </View>
        )}
        {/* </View> */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "baseline",
            alignSelf: "center",
            height: 50,
          }}
        >
          <View style={styles.checkbox}>
            <Checkbox
              status={acceptedPolicy ? "checked" : "unchecked"}
              onPress={() => {
                setAcceptedPolicy(!acceptedPolicy);
                // onAccept(acceptedPolicy);
              }}
              color={react_colors.slateblue}
            ></Checkbox>
          </View>
          {/* <Text style={{ fontSize: 17, color: react_colors.black }}>
          {`Read and accepted `}
        </Text> */}
          <TouchableOpacity onPress={() => navigation.navigate("Privacy")}>
            <Text style={{ fontSize: 17, color: react_colors.mediumslateblue }}>
              {t("UPrivacyTitle")}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.view_item, { marginTop: 15 }]}>
          <Button
            mode="contained"
            color={react_colors.slateblue}
            disabled={isLoading || !acceptedPolicy}
            onPress={() => updateUser(form)}
            // onPress={onSubmit}
            // onPress={() => pre_register(form)}
          >
            <Text>{"submit"}</Text>
          </Button>
          <View style={styles.divider}></View>
          <Button
            mode="contained"
            color={react_colors.lavender}
            onPress={() => dismissR(navigation)}
          >
            {"Later"}
          </Button>
        </View>
        <View style={{ height: 20 }}></View>
      </ScrollView>
    </SafeAreaView>
  );
};
