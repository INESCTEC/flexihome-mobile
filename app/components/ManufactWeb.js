import React, { useRef, useState, useEffect, useContext, useCallback } from "react";
import { GlobalContext } from "../context/Provider";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Card, Button, Divider, IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { WebView } from "react-native-webview";
import { react_colors, styles } from "../styles";
import * as Crypto from "expo-crypto";
// import Toast from "react-native-root-toast";

// const whirlpool = require("../assets/WhirlpoolCorp.png");
// const hotpoint = require("../assets/Hotpoint.png");
const daik = require("../assets/daikin-logo.png");
const mie = require("../assets/miele-logo.png");
const wallbox = require("../assets/wallbox-logo.png");
const victron = require("../assets/victron-logo.png");

import env from "../config/env";
// import jwt_decode from "jwt-decode";
import { InterBackground } from "./InterBackground";

export default ManufactView = () => {
  const webviewRef = useRef(null);
  const [window, setWindow] = useState(null);
  const [t, i18n] = useTranslation();
  const { navigate } = useNavigation();
  const [gaveToken, setGaveToken] = useState(false);
  const [correlationID, setCorrelationID] = useState(null);
  const [isWhirlp, setIsWhirlp] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [auth, setAuth] = useState(null);
  const [hubId, setHubId] = useState(null);
  const [userId, setUserId] = useState("");

  const URL_API = env.base_api_url;
  const DEVICES_API_URL = "https://hedge-iot-hems-dev.inesctec.pt/api/device"

  const {
    authDispatch,
    authState: { lang },
  } = useContext(GlobalContext);

  // let uuid = uuidv4();
  const uuid = Crypto.randomUUID();

  // const isFocused = useIsFocused();
  useEffect(() => {
    // console.log(uuid);
    setCorrelationID(uuid);
  }, []);

  useEffect(() => {
    getStorage();
  }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //     return async () => {
  //       //Do something when screen unfocused
  //       await getStorage();
  //     };
  //   }, [])
  // );

  const sendWPCallback = async () => {
    let wp_token = null;
    let wpdevs = null;
    let uuid = correlationID;

    let headers = {
      "Content-Type": "application/json",
      "X-Correlation-ID": `${uuid}`,
      Authorization: `Bearer ${auth}`,
    };

    if (isWhirlp) {
      setIsLoading(true);
      wp_token = await axios
        .get(
          `https://qa-api.whrcloud.com/service/v1/ic/logincallback?state=${correlationID}`
        )
        .then((res) => {
          // console.log(res.data.trim().length);
          if (res.data) {
            //validate jwt token
            try {
              // let decode = jwt_decode(res.data, { header: true });
              let decode = null;

              // console.log(decode);
              if (typeof decode === "object") {
                setIsLoading(false);
                return res.data;
              } else {
                throw "authentication failed";
              }
            } catch (err) {
              console.log("No valid jwt :", err);
            }
          } else throw "authentication failed";
        })
        .catch((err) => {
          // console.log("error on callback ", err.response);
          setIsLoading(false);
          return null;
        });

      if (wp_token) {
        //store WP_TOKEN
        await updateUserWPtoken(wp_token).catch((e) => {
          console.log("Error conecting to account manager:", e);
          return false;
        });
        // .then((res) => {
        //   if (!res) {
        //     showToast(t("ADDNEWresultfail"), false);
        //     setWindow({ html: errorHtml });
        //     return false;
        //   }
        // })

        //Register new wp devs
        wpdevs = await axios
          .get(`${URL_API}/device/get-user-wp-appliances`, {
            headers,
          })
          .then((res) => {
            if (res) return true;
          })
          .catch((e) => {
            console.log("Error conecting to device manager: ", e);
            return false;
          });

        if (wpdevs) {
          setTimeout(() => navigate("HomeScreen", { action: "add-app" }), 5000);
          setWindow({ html: successHtml });
          showToast(t("ADDNEWresultsuccess"), true);
        } else {
          setWindow({ html: errorHtml });
          showToast(t("ADDNEWresultfail"), false);
        }
        return;
      } else {
        setWindow({ html: errorHtml });
        showToast(t("ADDNEWresultfail"), false);
        return false;
      }
    }

    setIsWhirlp(false);
  };

  const showAlert = (title, message) => {
    Alert.alert(title, message, [
      // { text: t("Modalcancel"), style: "cancel" },
      { text: t("Modalok"), style: "destructive" },
    ]);
  };

  const showToast = (message, type) => {
    // Toast.show(<Text style={{ fontSize: 16 }}>{message}</Text>, {
    //   duration: 4000,
    //   position: -40,
    //   backgroundColor: type ? react_colors.gray : react_colors.lightcoral,
    // });
  };

  const storeData = async (key, val) => {
    try {
      // await AsyncStorage.clear();
      await AsyncStorage.setItem(key, val);
    } catch (err) {
      console.log("cant store key " + err);
    }
  };
  const getStorage = async () => {
    
    try {
      let token = "",
        decoded,
        json,
        hubId,
        cop = "[]";

      let id = await AsyncStorage.getItem("@userId");
      if (id) {
        // console.log("Using stored user id ", id);
        setUserId(id);
        // setUserId("ax9823ah7a");
      }

      token = await AsyncStorage.getItem("@token");
      if (token) {
        // console.log("Using stored auth token ", token);
        setAuth(token);
      }
      
      hubId = await AsyncStorage.getItem("@hubId");
      if (hubId) {
        // console.log("Using stored hub id ", hubId);
        setHubId(hubId);
      }
    } catch (e) {
      console.log("No stored prefs: " + e);
    }
  };

  const useHubIdForApplianceAssociation = async (hid) => {
    let uuid = correlationID;
    // console.log("generating this uuid: " + uuid);
    let headers = {
      "Content-Type": "application/json",
      "X-Correlation-ID": `${uuid}`,
      Authorization: `Bearer ${auth}`,
    };

    await axios
      .post(
        `${DEVICES_API_URL}/device`,
        { hub_id: hid },
        {
          headers,
        },
        { timeout: 10000 }
      )
      .then((res) => {
        showAlert(t("ADDNEWmanufsubtitle"), t("ADDNEWresultsuccess"));
        return true;
      })
      .catch((err) => {
        // console.log("Error adding appliances: ",
        //   err.response
        //     ? "Response: "+JSON.stringify(err.response)
        //     : err.request
        //     ? "Request: "+JSON.stringify(err.request)
        //     : err
        // );
        showAlert(t("ADDNEWmanufsubtitle"), t("ADDNEWresultfail"));
        return false;
      });
  };

  const updateUserWPtoken = async (tok) => {
    let uuid = correlationID;
    // console.log("generating this uuid: " + uuid);
    let headers = {
      "Content-Type": "application/json",
      "X-Correlation-ID": `${uuid}`,
      Authorization: `Bearer ${auth}`,
    };

    let data = {
      ...prefs,
      wp_token: tok,
    };

    let didSucceed = await axios
      .post(
        `${URL_API}/account/user`,
        data,
        {
          headers,
        },
        { timeout: 10000 }
      )
      .then((res) => {
        storeData("@userPrefs", JSON.stringify(res.data));
        return true;
      })
      .catch((err) => {
        console.log("Error adding appliances: ", err);
        return false;
      });
    return didSucceed;
  };
  const goBack_WV = async () => {
    // if (webviewRef.current) webviewRef.current.goBack();
    // webviewRef.current.injectJavaScript(`window.history.go(-1); return false;`);
    setWindow(null);
    setGaveToken(false);
  };

  const successHtml = lang.includes("pt")
    ? `<html>
  <body style="background-color: #abcabc; text-align: center; padding-top: 150px; font-size: 4em">
    <p>A associar os seus dispositivos...</p>
    <p>Pode voltar ao ecrã principal.</p>
  </body>
</html>`
    : `<html>
  <body style="background-color: #abcabc; text-align: center; padding-top: 150px; font-size: 4em">
    <p>Appliances are beeing processed...</p>
    <p>You can go back to home screen.</p>
  </body>
</html>`;

  const errorHtml = lang.includes("pt")
    ? `<html>
  <body style="background-color: #fff; text-align: center; padding-top: 150px; font-size: 4em; color: #dc143c">
    <p>Ocorreu um erro a contactar os serviços. Tente mais tarde.</p>
  </body>
</html>`
    : `<html>
  <body style="background-color: #fff; text-align: center; padding-top: 150px; font-size: 4em; color: #dc143c">
    <p>Error contacting servers. Try again later.</p>
  </body>
</html>`;

  return (
    <>
      {window != null ? (
        <>
          <WebView
            incognito
            ref={webviewRef}
            originWhitelist={["*"]}
            source={window}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              // console.warn(
              //   "WebView generic error: ",
              //   JSON.stringify(nativeEvent)
              // );
              setWindow({ html: errorHtml });
              setGaveToken(true);

              setTimeout(() => {
                setWindow(null);
                setGaveToken(false);
              }, 3000);
            }}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;

              setWindow({ html: errorHtml });
              setGaveToken(true);

              setTimeout(() => {
                setWindow(null);
                setGaveToken(false);
              }, 3000);
            }}
            onContentProcessDidTerminate={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.log("Content process terminated", nativeEvent);
            }}
            onNavigationStateChange={(navState) => {
              // console.log(navState);
              let respUrl = navState.url;
              let wvload = navState.loading;

              // follow WP redirects
              if (
                respUrl.includes(
                  "https://qa-api.whrcloud.com/service/v1/ic/thanks"
                )
              ) {
                if (respUrl.includes("success=1")) {
                  // console.log("WP success");
                  // send token in callback
                  sendWPCallback();

                  return;
                }

                if (respUrl.includes("success=0")) {
                  // console.log("WP failed");
                  setWindow({ html: errorHtml });
                  showToast(t("ADDNEWresultfail"), false);
                  return;
                }
              }
              //follow BSH redirects
              if (respUrl.includes("/device-success")) {
                setTimeout(
                  () => navigate("HomeScreen", { action: "add-app" }),
                  5000
                );
                setWindow({ html: successHtml });
                showToast(t("ADDNEWresultsuccess"), true);

                return;
              }
              if (respUrl.includes("/device-failure")) {
                setWindow({ html: errorHtml });
                showToast(t("ADDNEWresultfail"), false);
                return;
              }

              return;
            }}
            onMessage={(event) => {
              //receive results from webview
              console.log(event.nativeEvent.data);
            }}
            setBuiltInZoomControls={false}
            // injectedJavaScript={signInManuf}
            // injectedJavaScriptBeforeContentLoaded={runFirst}
          />
          <View style={styles.divider}></View>
          <View style={{ height: "10%" }}>
            <Button
              buttonColor={react_colors.primarygreen}
              mode={"contained"}
              onPress={goBack_WV}
              disabled={gaveToken}
            >
              <Text>{t("ADDNEWbackbtn")}</Text>
            </Button>
          </View>
        </>
      ) : (
        <SafeAreaView style={[styles.container, styles.global_color]}>
          {/* <InterBackground noNav /> */}
          <ScrollView>
            <View style={[styles.view_container, { paddingTop: 20 }]}>
              {/* MIELE */}
              <TouchableOpacity
                style={[
                  styles.row_container,
                  { width: "90%", height: "auto", alignItems: "center" },
                ]}
                onPress={() => useHubIdForApplianceAssociation(hubId)}
              >
                <Card.Title
                  style={[
                    styles.listNode,
                    styles.card,
                    {
                      width: "100%",
                      height: "100%",
                      backgroundColor: react_colors.antiflashwhite,
                    },
                  ]}
                  titleStyle={{ color: react_colors.dimgray }}
                  titleVariant="titleMedium"
                  title="Miele"
                  subtitle={t("ADDNEWmanufsubtitle")}
                  subtitleVariant="bodyMedium"
                  left={() => (
                    <Image
                      source={mie}
                      style={{
                        // flex: 1,
                        resizeMode: "contain",
                        width: 50,
                        height: 50,
                        // borderColor: "#000",
                      }}
                    />
                  )}
                  // onPress={() => {
                  //   if (!isLoading) {
                  //     setWindow({
                  //       uri: `https://interconnect-dev.inesctec.pt/spine-adapter/login/oauth2?token=${userId}&follow=${URL_API}/device/bsh-devices`,
                  //     });
                  //   }
                  // }}
                />
                {/* <View
                  style={{
                    width: "20%",
                    height: "100%",
                    borderRadius: 10,
                    backgroundColor: react_colors.antiflashwhite,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    icon="sync"
                    iconColor={react_colors.complementaryblue}
                    size={24}
                    onPress={() => {}}
                  />
                </View> */}
              </TouchableOpacity>

              <View style={{ height: 15 }} />
              {/* DAIKIN */}
              <TouchableOpacity
                style={[
                  styles.row_container,
                  { width: "90%", height: "auto", alignItems: "center" },
                ]}
                onPress={() => useHubIdForApplianceAssociation(hubId)}
              >
                <Card.Title
                  style={[
                    styles.listNode,
                    styles.card,
                    {
                      width: "100%",
                      height: "100%",
                      backgroundColor: react_colors.antiflashwhite,
                    },
                  ]}
                  titleStyle={{ color: react_colors.dimgray }}
                  titleVariant="titleMedium"
                  title="Daikin"
                  subtitle={t("ADDNEWmanufsubtitle")}
                  subtitleVariant="bodyMedium"
                  left={() => (
                    <Image
                      source={daik}
                      style={{
                        // flex: 1,
                        resizeMode: "contain",
                        width: 50,
                        height: 60,
                        // borderColor: "#000",
                        // borderWidth: 0.2,
                      }}
                    />
                  )}
                />
              </TouchableOpacity>
              <View style={{ height: 15 }} />

              {/* WALLBOX */}
              <TouchableOpacity
                style={[
                  styles.row_container,
                  { width: "90%", height: "auto", alignItems: "center" },
                ]}
                onPress={() => useHubIdForApplianceAssociation(hubId)}
              >
                <Card.Title
                  style={[
                    styles.listNode,
                    styles.card,
                    {
                      width: "100%",
                      height: "100%",
                      backgroundColor: react_colors.antiflashwhite,
                    },
                  ]}
                  titleStyle={{ color: react_colors.dimgray }}
                  titleVariant="titleMedium"
                  title="Wallbox"
                  subtitle={t("ADDNEWmanufsubtitle")}
                  subtitleVariant="bodyMedium"
                  left={() => (
                    <Image
                      source={wallbox}
                      style={{
                        // flex: 1,
                        resizeMode: "contain",
                        width: 50,
                        height: 60,
                        // borderColor: "#000",
                        // borderWidth: 0.2,
                      }}
                    />
                  )}
                />
              </TouchableOpacity>
              <View style={{ height: 15 }} />

              {/* VICTRON */}
              <TouchableOpacity
                style={[
                  styles.row_container,
                  { width: "90%", height: "auto", alignItems: "center" },
                ]}
                onPress={() => useHubIdForApplianceAssociation(hubId)}
              >
                <Card.Title
                  style={[
                    styles.listNode,
                    styles.card,
                    {
                      width: "100%",
                      height: "100%",
                      backgroundColor: react_colors.antiflashwhite,
                    },
                  ]}
                  titleStyle={{ color: react_colors.dimgray }}
                  titleVariant="titleMedium"
                  title="Victron Energy"
                  subtitle={t("ADDNEWmanufsubtitle")}
                  subtitleVariant="bodyMedium"
                  left={() => (
                    <Image
                      source={victron}
                      style={{
                        // flex: 1,
                        resizeMode: "contain",
                        width: 50,
                        height: 60,
                        // borderColor: "#000",
                        // borderWidth: 0.2,
                      }}
                    />
                  )}                  
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
};
