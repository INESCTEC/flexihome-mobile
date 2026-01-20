import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { react_colors, styles } from "../styles";
import { Card, ActivityIndicator, Button, FAB } from "react-native-paper";
// import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GlobalContext } from "../context/Provider";
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  useWindowDimensions
} from "react-native";
// import dayjs from "dayjs";
// import VersionCheck from "react-native-version-check-expo";
// import Toast from "react-native-root-toast";
import Devices from "../components/Devices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useTranslation } from "react-i18next";
import * as Crypto from "expo-crypto";
// import logoutUser from "../context/actions/auth/logoutUser";
import env from "../config/env";
import { InterBackground } from "../components/InterBackground";
// import * as Linking from "expo-linking"; // needed for opening links in browser
// import NotificationSlider from "../components/NotificationSlider";

const HomeScreen = (props) => {
  const { route, navigation } = props;
  const [userName, setUserName] = useState(null);
  const [acceptedPolicy, setAcceptedPolicy] = useState(true);
  const { navigate } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [t, i18n] = useTranslation();

  const { width, height, scale } = useWindowDimensions();
  const [isMock, setIsMock] = useState([]);

  const [count, setCount] = useState(1);

  const URL_API = env.base_api_url;
  const POLICY_VERSION = env.app_policy_version;
  const DEVICES_API_URL = "https://hedge-iot-hems-dev.inesctec.pt/api/device"

  const {
    authDispatch,
    authState: { data, userToken, lang },
  } = useContext(GlobalContext);
  // console.log("USER DATA:", data);
  // console.log("USER TOKEN:", userToken);

  const { isIncomplete, message, user } = data;

  const [auth, setAuth] = useState(null);

  const devs_pt = [
    {applid: "1234567890", name: "Bomba de calor Daikin", status: true, type: "hpump", serial: "12345", style: {}},
    {applid: "0987654321", name: "Carregador VE", status: true, type: "evcharger", serial: "67890", style: {}},
    {applid: "1122334455", name: "Máquina de lavar Miele", status: true, type: "washer", serial: "11223", style: {}},
  ]

  const devs_en = [
    {applid: "1234567890", name: "Daikin Heat Pump", status: true, type: "hpump", serial: "12345", style: {}},
    {applid: "0987654321", name: "EV Charger", status: true, type: "evcharger", serial: "67890", style: {}},
    {applid: "1122334455", name: "Miele Washing Machine", status: true, type: "washer", serial: "11223", style: {}},
  ]

  const [devices, setDevices] = useState(null);
  const [endTime, setEndTime] = useState({hh: 0, mm: 0, ss: 0});

  // useFocusEffect(
  //   useCallback(() => {
  //     updateDeadline();
  //     const interval = setInterval(() => {
  //       updateDeadline();
  //     }, 1000);

  //     return () => clearInterval(interval);
  //   }, [])
  // );

  useEffect(() => {
    getStorage().then((res) => {

      setAuth(res);

      //get devices
      updateDevices();

    });
  }, []);

  const useAppVersion = () => {
    const [needUpdate, setNeedUpdate] = useState(false);

    useEffect(() => {
      //device is ios
      const getAppleStoreBuildNr = async () => {
        let currentVersion = await VersionCheck.getCurrentVersion(); //ios installed version
        // let currentBuildNr = await VersionCheck.getCurrentBuildNumber() //ios installed build nr

        let buildNr = await VersionCheck.getLatestVersion({
          provider: "appStore", // for iOS
        }).then((latestVersion) => {
          if (latestVersion) {
            // console.log("IOS latest version", latestVersion);
            return latestVersion;
          }
          return false;
        });

        buildNr = buildNr ? !buildNr.includes(currentVersion) : false;

        return buildNr;
      };
      //device is android
      const getPlayStoreBuildNr = async (token) => {
        let currentBuildNr = await VersionCheck.getCurrentBuildNumber(); //android installed build nr
        const uuid = Crypto.randomUUID();

        let headers = {
          "Content-Type": "application/json",
          // Accept: "application/json",
          "X-Correlation-ID": `${uuid}`,
          Authorization: `Bearer ${token}`,
        };

        try {
          let buildNr = await axios
            .get(
              `${URL_API}/account/app/version?package_name=pt.inesctec.interconnect.hems`,
              { headers },
              { timeout: 10000 }
            )
            .then((res) => {
              if (res.status == 200) {
                return res.data.build_version;
              }
              return 0;
            })
            .catch((err) => {
              return 0;
            });

          let vers = !isNaN(buildNr) ? parseInt(buildNr) : 0;

          if (vers > currentBuildNr) return true;
          else return false;
        } catch (err) {
          // console.log("Error getting app version!", err);
          return 0;
        }
      };

      if (userToken) {
        if (Platform.OS === "android") {
          getPlayStoreBuildNr(userToken).then((res) => {
            // "Need update?
            if (res) {
              setNeedUpdate(res);
            }
            return null;
          });
        }

        if (Platform.OS === "ios") {
          getAppleStoreBuildNr().then((res) => {
            if (res) {
              setNeedUpdate(res);
            }
            return null;
          });
        }
      }
    }, [userToken]);

    return needUpdate;
  };

  const need_update = false;

const updateDeadline = () => {
  // const deadline = new Date("2024-03-18T22:00:00");
  const deadline = dayjs().hour(22).minute(0).second(0);
  let now = dayjs();
  if (now.isBefore(deadline, "second")) {
    let hh = deadline.diff(now, "hour");
    let mm = deadline.diff(now, "minute") % 60;
    let ss = deadline.diff(now, "second") % 60;
    // console.log({hh, mm, ss});
    setEndTime({ hh, mm, ss});
  }
};
  //get system status
  const getBackendStatus = async (lang) => {
    let uuid = Crypto.randomUUID();
    let headers = {
      "Content-Type": "application/json",
      // Accept: "application/json",
      "X-Correlation-ID": `${uuid}`,
      Authorization: `Bearer ${userToken}`,
    };

    let finLang = lang.includes("pt") ? "pt-PT" : "en-GB";

    try {
      let result = await axios
        .get(`${URL_API}/account/app/info?system_language=${finLang}`, {
          headers,
        })
        .then((res) => {
          if (res.status == 200) {
            return res.data;
          }
          return null;
        })
        .catch((err) => {
          return null;
        });

      return result;
    } catch (err) {
      console.log("Error getting system status!", err);
      return null;
    }
  };

  const canOpen = async (url) => {
    let able = await Linking.canOpenURL(url)
      .then((res) => {
        if (res) {
          return true;
        }
        // return false;
      })
      .catch((err) => {
        return false;
      });

    return able;
  };
  const handleUpdate = async () => {
    let supported = await canOpen(
      "market://details?id=pt.inesctec.interconnect.hems"
    );

    if (supported) {
      await Linking.openURL(
        "market://details?id=pt.inesctec.interconnect.hems"
      );
    } else {
      await Linking.openURL(
        "https://play.google.com/store/apps/details?id=pt.inesctec.interconnect.hems"
      );
    }
  };

  const updateDevices = async () => {
    setDevices(null);
    setRefreshing(true);

    await getDevicesList(auth).then(function (response) {
      setRefreshing(false);

      if (response != null) {
        setDevices(response);
      }
    });
  };


  //GET USER DEVICES
  // useEffect(() => {
  //   if (route.params?.action === "del-app") {
  //     // console.log(route.params);
  //     updateDevices();
  //   }

  //   if (route.params?.action === "add-app") {
  //     updateDevices();
  //   }

  //   if (route.params?.acceptedPolicy === true) {
  //     setAcceptedPolicy(true);
  //   }
  // }, [route]);

  
  const showToast = (result) => {
    if (!result) {
      Toast.show(t("CMPtitle"), {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        backgroundColor: react_colors.gray,
      });
    }
  };

  const addPolicyNotification = (accepted, oldArr, newArr) => {
    let policyNotif = {
      icon: "privacy-tip",
      description: `${t("HOMEprivacyNotice")}`,
      button: true,
      label: `${t("HOMEbannerRead")}`,
    };

    if (accepted) {
      if (newArr) {
        return newArr.length > 0 ? [...newArr] : [];
      }
    }

    //add notif to list at index 0
    if (!accepted) {
      if (newArr) {
        return newArr.length > 0 ? [policyNotif, ...newArr] : [policyNotif];
      } else {
        return [policyNotif];
      }
    }

    return oldArr;
  };

  const getStorage = async () => {
    try {
      let token = "",
        decoded,
        json = {},
        uName,
        acceptedVer,
        ppver;
      // await AsyncStorage.clear();
      // let keys = await AsyncStorage.getAllKeys();
      // console.log("Storage: " + keys);
      uName = await AsyncStorage.getItem("@firstname");
      if (uName) setUserName(uName);
      token = await AsyncStorage.getItem("@token");
      // if (token) setAuth(token);

      acceptedVer = await AsyncStorage.getItem("@policy_version");

      if (!acceptedVer || acceptedVer !== POLICY_VERSION) {
        setAcceptedPolicy(false);
      }

      // const { user } = data;
      // console.log(JSON.stringify(user));
      const authToken = userToken ? userToken : token;
      // setAuth(authToken);

      // return uName;
      // accepted = await AsyncStorage.getItem("@accepted");

      // ppver = await AsyncStorage.getItem("@ppversion");

      // if (token) {
      //   //decode token
      //   let pic = token.split(".")[1];
      //   decoded = base64.decode(pic);

      //   json = JSON.parse(decoded);
      // }
      return authToken;
      // return { ...json, uName, accepted, ppver };
    } catch (e) {
      console.log("No stored prefs:\n " + e);
      return null;
    }
  };

  const computeData = (arr) => {
    let list = arr[0].devices.map((item, index) => {
      let dev = item;
      return {
        applid: dev.device_common_data.serial_number,
        name: dev.device_common_data.name,
        brand: dev.device_common_data.brand,
        // ssa: dev.device_ssa,
        status: dev.ev_connection_status || false, //TODO: adjust status for other devices
        serial: dev.device_common_data.serial_number,
        type: dev.battery_capacity
          ? "inverter"
          : dev.ev_connection_status
          ? "evcharger"
          : dev.heat_pump_capacity
          ? "hpump"
          : "unknown",
        style:
          index + 1 == arr[0].devices.length && arr[0].devices.length % 2 > 0
            ? { width: "45%", marginRight: "47.8%" }
            : { width: "45%" },
        state: dev.ev_connection_status //"evcharger"
          ? {
              cable_max_current: dev.cable_max_current,
              ev_connection_status: dev.ev_connection_status,
              desired_state_of_charge: dev.user_input?.desired_state_of_charge || "",
              departure_time: dev.user_input?.departure_time.toString().slice(11, 16) || "",

            }
          : dev.battery_capacity //"inverter"
          ? {
              battery_capacity: dev.battery_capacity,
              battery_state_of_charge: dev.battery_state_of_charge,
              reserve_capacity: dev.user_input?.reserve_capacity || "",
            }
          : dev.heat_pump_capacity //"hpump"
          ? {
              operation_mode: dev.operation_mode,
              heat_pump_capacity: dev.heat_pump_capacity,
              desired_leaving_water_temperature:
                dev.user_input?.desired_leaving_water_temperature || "",
              minimum_leaving_water_temperature:
                dev.user_input?.minimum_leaving_water_temperature || "",
            }
          : {},
      };

    });
    // console.log(list);
    return list;
  };

  const getDevicesList = async (token) => {
    // setIsLoading(true);

    // let uuid = uuidv4();
    const uuid = Crypto.randomUUID();
    // console.log("generating this uuid: " + uuid);
    let headers = {
      "Content-Type": "application/json",
      // Accept: "application/json",
      "X-Correlation-ID": `${uuid}`,
      Authorization: `Bearer ${userToken}`,
    };
    // console.log(headers);

    try {
      let secived;
      let res = await axios.get(
        `${DEVICES_API_URL}/device`,
        {
          headers,
        },
        { timeout: 10000 }
      );
      // .then((res) => {
      // console.log("Got appliances-ok", JSON.stringify(res.data));
      if (res.data.length > 0) {
        secived = computeData(res.data);
      } else {
        secived = null;
      }
      // console.log(secived);
      // setDevices(secived);
      return secived;
    } catch (err) {
      // err.response: client received an error response (5xx, 4xx)
      // err.request: client never received a response, or request never left
      // err.response
      //   ? console.log(
      //       "Error getting appliances. Response: ",
      //       JSON.stringify(err.response.data)
      //     )
      //   : err.request
      //   ? console.log(
      //       "Error getting appliances. Request:",
      //       JSON.stringify(err.request)
      //     )
      //   : console.log("Error processing appliances.", err);
      if (
        err.response &&
        (err.response.status > 400) & (err.response.status < 500)
      ) {
        logoutUser()(authDispatch);
      } else {
        Toast.show(t("HOMEdevlistFail"), {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          backgroundColor: react_colors.gray,
        });
      }
      setIsLoading(false);
    }
    return null;
    // return Promise.reject(err);
  };
  return (
    <>
      <SafeAreaView style={[styles.container, styles.global_color]}>
        <InterBackground />
        {/* <View style={{ height: StatusBar.currentHeight, backgroundColor: react_colors.coral }}></View> */}
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={updateDevices} />
          }
        >
          {/* WELCOME BANNER */}
          {/* {userName && (
            <View>
              <Card>
                <Card.Content>
                  <Card.Title
                    title={t("HOMEwelcome") + `, ${userName}!`}
                    subtitle={t("HOMEaddApplianc")}
                  />
                </Card.Content>
              </Card>
              <View style={{ width: "100%", paddingVertical: 6, alignSelf: "center", alignItems: "center", backgroundColor: react_colors.primarygreen, marginHorizontal: 8 }}>
                <Text style={{textAlign: "center", fontSize: 16, color: react_colors.white, padding: 3 }}>{t("HOMEbenefitText1")}</Text>
                <View style={{flexDirection: "row", alignContent: "flex-start", alignItems: "center"}}>
                  <Text style={{textAlign: "center", fontSize: 16, color: react_colors.white, padding: 3 }}>{t("HOMEbenefitText2")}</Text>
                  <Text style={{fontSize: 20, fontWeight: "800", color: react_colors.white}}>
                    {`${endTime.hh < 10 ? '0'+endTime.hh : endTime.hh }h:${endTime.mm < 10 ? '0'+endTime.mm : endTime.mm}m:${endTime.ss < 10 ? '0'+endTime.ss : endTime.ss}s`}
                  </Text>
                  <TouchableOpacity style={{ width: 40, padding: 4, alignItems: "center"}}
                    onPress={() => navigate("Disclaimer")}
                  >
                    <MaterialCommunityIcons name="information-outline" size={22} color={react_colors.white} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )} */}
          {/* Notifications card */}
          {/* {isMock.length > 0 && (
            <NotificationSlider data={isMock} navigate={navigate} />
          )} */}
          {/* APP UPDATE BANNER */}
          {need_update && (
            <>
              <View style={{ height: 10 }}></View>
              <Card
                style={{
                  ...styles.card,
                  width: "95%",
                  borderRadius: 10,
                  alignSelf: "center",
                }}
              >
                <Card.Content>
                  <View
                    style={{
                      width: "95%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{ fontSize: 16, color: react_colors.slategray }}
                    >
                      {t("HOMEupdateAppMsg")}
                    </Text>
                  </View>
                </Card.Content>
                <Card.Actions style={{ justifyContent: "flex-end" }}>
                  <Button
                    onPress={() => {
                      if (Platform.OS === "ios") {
                        Linking.openURL(
                          "itms-apps://apps.apple.com/PT/app/id1609106145"
                        );
                      }
                      if (Platform.OS === "android") {
                        handleUpdate();
                      }
                    }}
                    mode="text"
                    buttonColor="#daa520"
                  >
                    {t("HOMEupdateAppBtn")}
                  </Button>
                </Card.Actions>
              </Card>
            </>
          )}
          {isLoading && (
            <View style={styles.view_container}>
              <Text
                variant="bodyMedium"
                style={{
                  fontSize: 16,
                  color: react_colors.slategray,
                }}
              >
                {t("HOMEload")}
              </Text>
              <ActivityIndicator size={"large"} color={react_colors.primarygreen} />
            </View>
          )}
          {/* LIST OF DEVICES */}
          {devices && (
            <View style={[styles.view_container, { width: width }]}>
              <View style={{ height: 20 }}></View>
                <Devices {...props} list={devices} />
              <View style={{ height: 20 }}></View>
            </View>
          )}
          {/* NO DEVICES FOUND */}
          {!devices && (
            <View
              style={{
                height: 300,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 16, color: react_colors.complementarygray }}>
                {t("HOMEaddApplianc")}
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      <View
        style={{
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          position: "absolute",
          bottom: 40,
          right: 10,
          // zIndex: 1000,
          height: 43,
          borderRadius: 22,
          backgroundColor: react_colors.shadowblue,
        }}
      >
        <FAB
          style={{
            height: 40,
            alignSelf: "center",
            alignContent: "center",
            justifyContent: "center",
            backgroundColor: react_colors.primarygreen,
          }}
          variant="surface"
          mode="elevated"
          uppercase={false}
          size="medium"
          // animated
          label={t("MENUaddDevice")}
          icon={"plus-circle"}
          color={react_colors.ghostwhite}
          onPress={() => navigate("AddDevice")}
        />
      </View>
    </>
  );
};

export default React.memo(HomeScreen);
