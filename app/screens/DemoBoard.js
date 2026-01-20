import { useState, useEffect, useCallback, useContext } from "react";
import {
  Text,
  View,
  Animated,
  Dimensions,
  ScrollView,
  SafeAreaView,
  TouchableHighlight,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-root-toast";
import { CalendarUtils } from "react-native-calendars";
import {
  Button,
  ActivityIndicator,
  IconButton,
  Title,
  Caption,
} from "react-native-paper";
// import {
//   Tabs,
//   TabScreen,
//   useTabIndex,
//   useTabNavigation,
// } from "react-native-paper-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Crypto from "expo-crypto";
import moment from "moment";
import groupBy from "lodash/groupBy";
import { styles, react_colors } from "../styles";
import logoutUser from "../context/actions/auth/logoutUser";
import { GlobalContext } from "../context/Provider";
import env from "../config/env";

export const DemoBoard = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [auth, setAuth] = useState(null);
  const [userId, setUserID] = useState(null);
  const { authDispatch, authState } = useContext(GlobalContext);

  const [eventsByDate, setEventsByDate] = useState({});
  //   const [date, setDate] = useState(getDate());

  const URL_API = env.base_api_url;

  useFocusEffect(
    useCallback(() => {
      const getData = async () => {
        setIsLoading(true);
        await getStorage()
          .then((res) => {
            const { prefs, id, token } = res;

            if (token) getSchedule(id, token);
            // setIsLoading(false);
          })
          .catch((err) => {
            console.log("Error loading prefs.", err);
          });
        setIsLoading(false);
        // setIsLoading(false);
      };

      setTimeout(() => {
        getData();
      }, 500);
    }, [])
  );

  const logout = () => {
    logoutUser()(authDispatch);
  };

  const showToast = (message, type) => {
    Toast.show(message, {
      duration: 3000,
      position: -40,
      backgroundColor: type ? react_colors.gray : react_colors.lightcoral,
    });
  };

  const storeData = async (key, val) => {
    try {
      // await AsyncStorage.clear();
      await AsyncStorage.setItem(key, val);
    } catch (err) {
      console.log("cant store key " + err);
    }
  };

  const invalidateToken = (oldToken) => {
    let newToken = oldToken.split(".");
    let slice = newToken[1].slice(0, 100);

    let newAuth = `${newToken[0]}.${slice}.${newToken[2]}`;
    // console.log("After :", newAuth.length);
    storeData("@token", newAuth);
    authDispatch({
      type: "RESTORE_TOKEN",
      payload: newAuth,
    });
  };

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

  const groupEvents = (evs) => {
    let sortedEvs = groupBy(evs, (e) => {
      return [CalendarUtils.getCalendarDateString(e.start)];
    });

    // console.log(JSON.stringify(sortedEvs));
    // setEventsByDate(sortedEvs);
    return sortedEvs;
  };

  const removeBeforeToday = (day) => {
    let hoje = new Date();
    let that = new Date(day.scheduled_start_time);
    return that.getTime() > hoje.getTime();
  };

  const computeSchedule = (arr) => {
    let schedule = [];
    let progs = {};

    for (let i = 0; i < arr.cycles.length; ++i) {
      let sch = arr.cycles[i];

      let dev = sch.serial_number;
      //TODO: maybe sort by date not needed
      if (sch.cycles.length > 0) {
        let cyc = sch.cycles.sort((a, b) => {
          let ant = new Date(a.scheduled_start_time);
          let the = new Date(b.scheduled_start_time);

          return ant - the;
        });
        let next_shedules = cyc.filter(removeBeforeToday);

        for (let c = 0; c < next_shedules.length; ++c) {
          let item = cyc[c];

          schedule.push({
            id: `${i}-${c}`,
            title: dev,
            start: new Date(item.scheduled_start_time),
            end: new Date(item.expected_end_time),
            summary: `${item.program} ${item.is_optimized ? "(optim)" : ""}`,
            color: item.is_optimized
              ? react_colors.skyblue
              : react_colors.lightcyan,
            seq_id: item.sequence_id,
          });
        }
      }
    }

    return schedule;
  };

  const getSchedule = async (id, token) => {
    // let uuid = uuidv4();
    const uuid = Crypto.randomUUID();

    // console.log("generating this uuid: " + uuid);
    let headers = {
      "Content-Type": "application/json",
      // Accept: "application/json",
      "X-Correlation-ID": `${uuid}`,
      Authorization: `Bearer ${token}`,
    };
    // console.log(headers);

    let today = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString();
    // let yesterday = moment()
    //   .subtract(1, "days")
    //   .hours(0)
    //   .minutes(0)
    //   .seconds(0)
    //   .milliseconds(0)
    //   .toISOString();

    // let tomorrow = moment()
    //   .add(1, "days")
    //   .hours(23)
    //   .minutes(59)
    //   .seconds(0)
    //   .milliseconds(0)
    //   .toISOString();
    try {
      let res = await axios.get(
        `${URL_API}/device/schedule-cycle-by-user?user_ids=${id}&start_timestamp=${today}`,
        {
          headers,
        }
        // { timeout: 10000 }
      );
      // .then((res) => {
      // console.log("Success: ", JSON.stringify(res.request.responseURL));
      // setIsLoading(false);
      // console.log("Success: ", JSON.stringify(res.data[0].cycles));
      if (res.data[0].cycles.length > 0) {
        let hcSdroaB = computeSchedule(res.data[0]);
        // console.log(JSON.stringify(hcSdroaB));
        let timeLine = groupEvents(hcSdroaB);

        //TODO: set marks obj corretly
        // let marks = [];
        // let obj = { marked: true, dotColor: "#f00" };

        // Object.keys(timeLine).forEach((item, index) => {
        //   marks.push({ [item]: { marked: true, dotColor: "#f00" } });
        // });

        //   .map((key, item) => {
        //     return {
        //       [key]: obj,
        //     };
        //   });

        // console.log(JSON.stringify(marks));

        // setMarked(marks);

        // console.log(JSON.stringify(timeLine));
        setEventsByDate(timeLine);

        // setBoardSch(timeline);
        // storeData("@next_schedule", JSON.stringify(timeLine));
      }
    } catch (err) {
      err.response
        ? err.response.status > 400
          ? logout()
          : console.log(
              "Error obtaining current schedule. Response: ",
              err.response.data
            )
        : err.request
        ? console.log(
            "Error obtaining current schedule. Request: ",
            err.request
          )
        : console.log("Error processing demo shedule", err);

      // setIsLoading(false);
      // setNewDeviceId(null);
    }
    // .finally((error) => {
    //   if (error) {
    //     return Promise.reject("error");
    //   }
    //   return Promise.resolve();
    // });
  };

  //schedule demo
  const scheduleDemo = () => {
    // let uuid = uuidv4();
    const uuid = Crypto.randomUUID();

    // console.log("generating this uuid: " + uuid);
    let headers = {
      "Content-Type": "application/json",
      // Accept: "application/json",
      "X-Correlation-ID": `${uuid}`,
      Authorization: `Bearer ${auth}`,
    };

    // return;
    axios
      .get(`${URL_API}/energy_manager_service/schedule`, {
        params: { user_id: userId },
        headers,
      })
      .then((res) => {
        // console.log("Delay succeded" + res.data);
        showToast("Delay succeded.", true);
      })
      .catch((e) => {
        console.log(
          "Error delaying cycle: " + JSON.stringify(e.response.status)
        );
        showToast("Delay failed!", false);
      });
  };

  //call delay for demonstration purposes
  const delaySchedule = async (sequenceId, ho) => {
    // setIsLoading(true);
    // let uuid = uuidv4();
    const uuid = Crypto.randomUUID();

    // console.log("generating this uuid: " + uuid);
    let headers = {
      "Content-Type": "application/json",
      // Accept: "application/json",
      "X-Correlation-ID": `${uuid}`,
      Authorization: `Bearer ${auth}`,
    };

    let next_start = moment()
      // .utc()
      // .add(1, "hours")
      .add(2, "minutes") // 4-WP
      .format("YYYY-MM-DD HH:mm:ss");

    // sequence_id:"<http://example.org/spine-ssa/devices/BOSCH-WTX87M40-68A40E90850B/powerSequences/1>",
    const data = [
      {
        sequence_id: sequenceId,
        serial_number: ho,
        new_start_time: next_start,
      },
    ];
    // console.log(data);
    // return;
    await axios
      .post(
        `${URL_API}/device/request-delay-by-cycle`,
        data,
        { params: { "user-id": userId }, headers }
        // { timeout: 10000 }
      )
      .then((res) => {
        // console.log("Delay succeded" + res.data);
        //TODO: show toast message
        showToast("Delay succeded", true);
      })
      .catch((e) => {
        console.log(
          "Error delaying cycle: " + JSON.stringify(e.response.status)
        );
        showToast("Delay failed!", false);
      });

    // setIsLoading(false);
  };
  let days = Object.keys(eventsByDate);
  return (
    <SafeAreaView style={{ ...styles.container }}>
      <ScrollView>
        <View style={{ ...styles.view_item }}>
          <Title>{"Start scheduler"}</Title>
          <Button
            mode="contained"
            labelStyle={{ color: "#fff" }}
            contentStyle={{ marginBottom: 3 }}
            color={react_colors.red}
            onPress={() => scheduleDemo()}
          >
            {"submit"}
          </Button>
        </View>
        <View style={{ ...styles.divider }}></View>
        <View style={{ ...styles.view_item }}>
          <Title>{"Demo schedule"}</Title>
          {isLoading ? (
            <View style={{ ...styles.view_container }}>
              <Text
                style={{
                  fontSize: 18,
                  color: react_colors.black,
                }}
              >
                {"Loading..."}
              </Text>
              <ActivityIndicator size={"small"} color={react_colors.gold} />
            </View>
          ) : null}

          {eventsByDate &&
            days.map((item, index) => {
              let day = item;
              return (
                <View key={index}>
                  <View style={{ ...styles.divider }}></View>
                  <View style={{ width: "100%" }}>
                    <Caption>{day}</Caption>
                    {eventsByDate[day].map((item, index) => {
                      const { id, title, start, end, summary, color, seq_id } =
                        item;
                      return (
                        <View
                          key={index}
                          style={{
                            ...styles.row_container,
                            alignContent: "stretch",
                            backgroundColor: react_colors.gainsboro,
                          }}
                        >
                          <View
                            style={{
                              width: "100%",
                              alignItems: "center",
                            }}
                          >
                            <Text>{title}</Text>
                          </View>
                          <View style={{ width: "80%" }}>
                            <Text>{summary}</Text>
                            <Text>{`Start: ${start.toLocaleTimeString()}`}</Text>
                            <Text>{`End: ${end.toLocaleTimeString()}`}</Text>
                          </View>
                          <View
                            style={{
                              backgroundColor: react_colors.lightblue,
                              alignItems: "center",
                              width: "20%",
                              height: 50,
                              borderRadius: 15,
                            }}
                          >
                            <IconButton
                              icon={"timer"}
                              size={24}
                              color={react_colors.black}
                              onPress={() => delaySchedule(seq_id, title)}
                              disabled={false}
                            ></IconButton>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          {Object.keys(eventsByDate).length == 0 && (
            <Text>{"Nothing to show."}</Text>
          )}
        </View>
        <View style={{ ...styles.divider }}></View>
        <View style={{ ...styles.view_item }}>
          <Button
            mode="contained"
            color="#fa22f1"
            loading={isLoading}
            disabled={isLoading}
            onPress={() => logout()}
          >
            Logout
          </Button>
        </View>
        <View style={{ ...styles.divider }}></View>
        <View style={{ ...styles.view_item }}>
          <Button
            mode="contained"
            color="#e37713"
            loading={isLoading}
            disabled={isLoading}
            onPress={() => invalidateToken(auth)}
          >
            Invalidate Token
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
