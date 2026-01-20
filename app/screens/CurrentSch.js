import React, { useContext, useCallback, useEffect, useState } from "react";
import { GlobalContext } from "../context/Provider";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { react_colors, styles } from "../styles";
import {
  Text,
  View,
  ImageBackground,
  FlatList,
  ScrollView,
  SafeAreaView,
  TouchableHighlight,
  RefreshControl,
} from "react-native";
import {
  Card,
  Button,
  Divider,
  Title,
  List,
  ActivityIndicator,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Crypto from "expo-crypto";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { getCurrentDate } from "../utils/currentDate";
import { color_status } from "../styles";
import { RegisterAlert } from "../components/RegisterAlert";
import env from "../config/env";

const list = {
  icons: [
    {
      "air-cond":
        "https://img.icons8.com/material-rounded/24/000000/air-conditioner.png",
      "washing-machine": "washing-machine",
    },
  ],
};
const board_sch = [];
// let today_date = getCurrentDate();

//Screen inicial do Automation
const Current = ({ route, navigation }) => {
  const [board, setBoardSch] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserID] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { navigate } = useNavigation();
  const appState = useContext(GlobalContext);
  const [isGuest, setGuest] = useState(false);

  const URL_API = env.base_api_url;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // console.log(userId);
    // console.log(auth);

    if (!isGuest) {
      await getStorage()
        .then((res) => {
          const { prefs, id, token } = res;

          getSchedule(id, token);
          setRefreshing(false);
        })
        .catch((err) => {
          console.log("Error loading prefs.", err);
          setRefreshing(false);
        });
    }
  }, []);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);

      if (!isGuest) {
        await getStorage()
          .then((res) => {
            const { prefs, id, token } = res;

            getSchedule(id, token);

            setIsLoading(false);
          })
          .catch((err) => {
            console.log("Error loading prefs.", err);
            setIsLoading(false);
          });
      }
    }

    getData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const data = appState.authState.data;
      const { isIncomplete } = data;

      if (isIncomplete) {
        setGuest(true);
        // RegisterAlert(navigate, { ...data.user });
      }
    }, [appState])
  );

  const getStorage = async () => {
    try {
      let prefs = await AsyncStorage.getItem("@userPrefs");
      // console.log(prefs);
      // let userPrefs = JSON.parse(prefs);
      // setPreferens(userPrefs);

      let id = await AsyncStorage.getItem("@userId");
      if (id) {
        setUserID(id);
      }
      // console.log(id);
      // setUserID(id);

      let token = await AsyncStorage.getItem("@token");
      if (token) {
        setAuth(token);
      }
      // console.log(token);
      // setAuth(token);
      return { prefs, id, token };
    } catch (e) {
      console.log("No stored prefs:\n " + e);
    }
  };
  const storeData = async (key, val) => {
    try {
      // await AsyncStorage.clear();
      await AsyncStorage.setItem(key, val);
    } catch (err) {
      console.log("cant store new key: " + err);
    }
  };
  const computeSchedule = (arr) => {
    let schedule = [];
    for (let i = 0; i < arr.cycles.length; ++i) {
      let sch = arr.cycles[i];

      let dev = `${sch.device_id.split("_")[0]} ${sch.device_id.split("_")[1]}`;
      let cyc = sch.cycles.sort((a, b) => {
        let ant = new Date(a.scheduled_start_time);
        let the = new Date(b.scheduled_start_time);

        return ant - the;
      });

      let dev_sch = {};
      let progs = {};
      // schedule.push(dev);

      // if(cyc.length > 0)
      progs = cyc.map((item, index) => {
        return {
          id: `${i}-${index}`,
          type:
            "WashingMachine" == "WashingMachine" ? "washing-machine" : "meter", //TODO: add type in response,
          name: dev,
          // time: new Date(item.scheduled_start_time).toLocaleTimeString()+ " - " + new Date(item.expected_end_time).toLocaleTimeString(),
          previous:
            new Date(item.latest_start_time).toDateString() +
            ", " +
            new Date(item.latest_start_time).toLocaleTimeString(),
          start: new Date(item.scheduled_start_time).toLocaleTimeString(),
          end: new Date(item.expected_end_time).toLocaleTimeString(),
          date_start: new Date(item.scheduled_start_time).toLocaleDateString(),
          date_end: new Date(item.expected_end_time).toLocaleDateString(),
          program: item.program,
          status: item.is_active ? `on` : item.is_scheduled ? `set` : `off`,
        };
      });

      if (progs && progs.length > 0) {
        dev_sch = { appliance: dev, progs };
        schedule.push(dev_sch);
      }
    }

    return schedule;
  };

  const getSchedule = async (id, token) => {
    // {
    //   setIsLoading(true);
    //   let hcSdroaB = computeSchedule([])
    //   // console.log(JSON.stringify(hcSdroaB));
    //   setBoardSch(hcSdroaB);
    //   setIsLoading(false);
    //   return;
    // }
    // let uuid = uuidv4();
    const uuid = Crypto.randomUUID();

    // console.log("generating this uuid: " + uuid);
    let headers = {
      "Content-Type": "application/json",
      // Accept: "application/json",
      "X-Correlation-ID": `${uuid}`,
      Authorization: `Bearer ${token}`,
    };

    let today = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString();
    await axios
      .get(
        `${URL_API}/device/schedule-cycle-by-user?user_ids=${id}&start_timestamp=${today}`,
        {
          headers,
        },
        { timeout: 10000 }
      )
      .then((res) => {
        // console.log("Success: ", JSON.stringify(res.data[0]));
        setIsLoading(false);

        if (res.data[0].cycles[0].cycles.length > 0) {
          let hcSdroaB = computeSchedule(res.data[0]);
          setBoardSch(hcSdroaB);
          // console.log(JSON.stringify(hcSdroaB));
          // storeData("@next_schedule", JSON.stringify(hcSdroaB));
        }
      })
      .catch((err) => {
        err.response
          ? console.log("Error obtaining current schedule. ", err.response)
          : console.log("Error obtaining current schedule. ", err); //err.request);

        setIsLoading(false);
        // setNewDeviceId(null);
      });
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {isLoading && (
        <View style={styles.view_container}>
          <Text
            style={{
              fontSize: 18,
              color: react_colors.black,
            }}
          >
            {"Loading..."}
          </Text>
          <ActivityIndicator size={"large"} color={react_colors.skyblue} />
        </View>
      )}
      {board &&
        board.map((item, index) => {
          // let device = item.appliance;
          return (
            <View key={index}>
              <Text
                style={{
                  alignSelf: "center",
                  fontWeight: "bold",
                  fontSize: 18,
                  color: react_colors.darkslategrey,
                }}
              >
                {item.appliance}
              </Text>

              {item.progs.map((dev) => {
                const { id, type, name, start, date_start, status, program } =
                  dev;
                return (
                  <View key={id}>
                    <List.Item
                      title={program.toLowerCase()}
                      description={`Start: ${date_start}, ${start}`}
                      descriptionNumberOfLines={2}
                      descriptionEllipsizeMode={"clip"}
                      left={(props) => (
                        <List.Icon
                          icon={
                            list.icons[0][type].indexOf("https") > -1
                              ? { uri: list.icons[0][type] }
                              : list.icons[0][type]
                          }
                          color={
                            status == "off"
                              ? color_status.off
                              : status == "on"
                              ? color_status.on
                              : color_status.other
                          }
                          // style={{ paddingRight: 20 }}
                        />
                      )}
                      // onPress={() => navigation.navigate("ManualSCH", { ...dev })}
                    />
                    <Divider />
                  </View>
                );
              })}
            </View>
          );
        })}
      {!board && (
        <View
          style={{
            height: 100,
            width: "90%",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <Text>{"Nothing scheduled yet..."}</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default Current;
