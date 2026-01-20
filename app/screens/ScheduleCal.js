import { useState, useEffect, useCallback, useContext } from "react";
import {
  Text,
  View,
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { GlobalContext } from "../context/Provider";

import {
  LocaleConfig,
  CalendarProvider,
  CalendarUtils,
  AgendaList,
} from "react-native-calendars";
import { Button, ActivityIndicator } from "react-native-paper";
import {
  Tabs,
  TabScreen,
  useTabIndex,
  useTabNavigation,
} from "react-native-paper-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Crypto from "expo-crypto";
import moment from "moment";
import groupBy from "lodash/groupBy";
import { styles, react_colors } from "../styles";
import { PricesHeat } from "./PricesHeat";
import { useTranslation } from "react-i18next";
import logoutUser from "../context/actions/auth/logoutUser";
import { RegisterAlert } from "../components/RegisterAlert";
import env from "../config/env";
import { Carbon } from "../components/Carbon";
import { InterBackground } from "../components/InterBackground";

const today = new Date();
const screenHeight = Dimensions.get("screen").height;
const INITIAL_TIME = { hour: today.getHours(), minutes: today.getMinutes() };
const EVENT_COLOR = "#ffc0cb";
const getDate = (offset = 0) =>
  CalendarUtils.getCalendarDateString(today.setDate(today.getDate() + offset));

// const nextImg = require("../assets/arrow_right.png");
// const previousImg = require("../assets/arrow_left.png");
const timeLineProps = {
  format24h: true,
  scrollToFirst: true,
  // onBackgroundLongPress: this.createNewEvent,
  // onBackgroundLongPressOut: this.approveNewEvent,
  // start: 0,
  // end: 24,
  unavailableHours: [
    { start: 0, end: 6 },
    { start: 22, end: 24 },
  ],
  overlapEventsSpacing: 4,
  rightEdgeSpacing: 15,
  timelineLeftInset: 15,
  theme: {
    todayTextColor: "#daa520",
    timelineContainer: { maxHeight: screenHeight },
    // weekVerticalMargin: 15,
    eventTitle: { fontWeight: "bold" },
    timeLabel: { fontWeight: "bold" },
    // nowIndicatorKnob: { backgroundColor: "#b0c4de" },
    // nowIndicatorLine: { backgroundColor: "#b0c4de" },
    // contentStyle: { marginLeft: 42 },
    // timelineContainer: { width: "33%" },
    // event: { width: "33%" },
    // line: { height: 4 },
    // timeLabel: { fontSize: 18 },
  },
};
LocaleConfig.locales.en = LocaleConfig.locales[""];
LocaleConfig.locales["pt"] = {
  today: "Hoje",
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthNamesShort: [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ],
  dayNames: [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
};

export const ScheduleCal = ({ route, navigation }) => {
  const [t, i18n] = useTranslation();
  const [tab, setTab] = useState(0);
  // const window = Dimensions.get("window");
  const [isLoading, setIsLoading] = useState(false);
  const [auth, setAuth] = useState(null);
  const [userId, setUserID] = useState(null);
  const { authDispatch, authState } = useContext(GlobalContext);
  const [isGuest, setGuest] = useState(false);
  const { navigate } = useNavigation();

  const URL_API = env.base_api_url;

  const data = authState.data;

  const [date, setDate] = useState(getDate());

  // const [timeProps, setTimeProps] = useState(timeLineProps);
  // // const [events, setEvents] = useState([]);
  const [marked, setMarked] = useState({
    [date]: {
      marked: true,
      dotColor: "#fff",
      // selected: true,
      selectedColor: "#daa520",
    },
  });

  const [eventsByDate, setEventsByDate] = useState({
    [date]: {
      start: ``,
      end: ``,
      title: "",
      summary: "",
    },
  });

  const onDateChanged = (d) => {
    // setDate(d);
    setMarked({
      [d]: {
        marked: true,
        dotColor: "#fff",
        // selected: true,
        selectedColor: "#daa520",
      },
    });
  };

  const renderItem = useCallback(({ item }) => {
    return (
      <TouchableOpacity
        // onPress={() => Alert.alert(item.title)}
        style={styles.calItem}
      >
        <View style={styles.calItemButtonContainer}>
          <Text style={styles.calItemHourText}>{item.hour}</Text>
          <Text style={styles.calItemDurationText} numberOfLines={1}>
            {item.duration}
          </Text>
        </View>
        <View style={styles.calItemButtonContainer2}>
          <Text
            style={styles.calItemTitleText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>
          <Text style={{ ...styles.calItemTitleText, color: "grey" }}>
            {item.prog}
          </Text>
        </View>
        {/* <View style={styles.calItemButtonContainer}>
          <Button
            color={"grey"}
            title={"Info"}
            onPress={() => Alert.alert("Info pressed.")}
          />
        </View> */}
      </TouchableOpacity>
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      const { isIncomplete, user } = data;

      if (authState.lang === "pt") {
        LocaleConfig.defaultLocale = "pt";
      } else {
        LocaleConfig.defaultLocale = "en";
      }

      const getData = async () => {
        let id = user.user_id;
        let token = user.api;

        if (token == null || token == undefined) {
          await getStorage().then((res) => {
            id = res.id;
            token = res.token;
          });
        }

        await getSchedule(id, token);
      };

      if (tab === 0) {
        setTimeout(() => {
          getData();
          // if (isIncomplete) {
          //   setGuest(true);
          //   RegisterAlert(navigate, user);
          // } else {
          //   getData();
          //   setGuest(false);
          // }
        }, 500);
      }

      setIsLoading(false);
    }, [tab])
  );

  const getStorage = async () => {
    try {
      // let prefs = await AsyncStorage.getItem("@userPrefs");
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
      return { id, token };
    } catch (e) {
      console.log("No stored prefs:\n " + e);
    }
  };

  const diff_hours = (dt2, dt1) => {
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
  };

  const computeSchedule = (arr) => {
    let schedule = [];
    for (let i = 0; i < arr.cycles.length; ++i) {
      let sch = arr.cycles[i];

      let dev = sch.serial_number;
      if (sch.cycles.length > 0) {
        let cyc = sch.cycles.sort((a, b) => {
          let ant = new Date(a.scheduled_start_time);
          let the = new Date(b.scheduled_start_time);

          return ant - the;
        });

        for (let c = 0; c < cyc.length; ++c) {
          let item = cyc[c];
          let item_title = item.scheduled_start_time.slice(0, 10);
          let item_data = {
            hour: new Date(item.scheduled_start_time)
              .toTimeString()
              .slice(0, 5),
            duration:
              diff_hours(
                new Date(item.expected_end_time),
                new Date(item.scheduled_start_time)
              ) + "min",
            title: dev,
            prog: `${item.program} ${item.is_optimized ? "(optim)" : ""}`,
          };

          if (schedule.length > 0) {
            let exists = schedule.find((el) => el.date === item_title);
            if (exists) {
              let idx = schedule.findIndex((el) => el.date === item_title);
              schedule[idx].data.push(item_data);
            } else {
              schedule.push({
                title: new Date(item.scheduled_start_time),
                data: [item_data],
                date: item_title,
              });
            }
          }
          if (schedule.length === 0) {
            schedule.push({
              title: new Date(item.scheduled_start_time),
              data: [item_data],
              date: item_title,
            });
          }
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

    let midnight = moment()
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .toISOString();

    // let today = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString();
    // let tomorrow = moment()
    //   .add(1, "days")
    //   .hours(23)
    //   .minutes(59)
    //   .seconds(0)
    //   .milliseconds(0)
    //   .toISOString();

    await axios
      .get(
        `${URL_API}/device/schedule-cycle-by-user?user_ids=${id}&start_timestamp=${midnight}`,
        {
          headers,
        }
        // { timeout: 10000 }
      )
      .then((res) => {
        // console.log("Success: ", JSON.stringify(res.request.responseURL));
        // setIsLoading(false);
        if (res.data[0].cycles.length > 0) {
          let hcSdroaB = computeSchedule(res.data[0]);
          // console.log(JSON.stringify(hcSdroaB));
          // let timeLine = groupEvents(hcSdroaB);

          //TODO: set marks obj corretly
          // let marks = [];
          // let obj = { marked: true, dotColor: "#f00" };

          // marks = Object.keys(timeLine).map((key, item) => {
          //   return {
          //     [key]: obj,
          //   };
          // });

          // console.log(JSON.stringify(marks));

          // setMarked(marks);
          if (hcSdroaB.length > 0) {
            setEventsByDate(hcSdroaB);
          } else {
            setEventsByDate(null);
          }
          // setEventsByDate(timeLine);
          // console.log(JSON.stringify(timeLine));

          // setBoardSch(timeline);
          // storeData("@next_schedule", JSON.stringify(timeLine));
        } else {
          setEventsByDate(null);
        }
      })
      .catch((err) => {
        // err.response
        //   ? console.log(
        //       "Error obtaining current schedule. Response:",
        //       JSON.stringify(err.response)
        //     )
        //   : err.request
        //   ? console.log(
        //       "Error obtaining current schedule. Request:",
        //       err.request
        //     )
        //   : console.log("Error obtaining current schedule. ", err);

        return null;
        // setNewDeviceId(null);
        // setIsLoading(false);
      });
  };

  const onTabChange = (tab) => {
    setTab(tab);
  };
  return (
    <SafeAreaView style={{ flex: 1, ...styles.global_color }}>
      <InterBackground />
      {!isGuest ? (
        <Animated.View style={{ flex: 1 }}>
          <Tabs
            uppercase={false}
            showIcons={false}
            mode="scrollable"
            showLeadingSpace={false}
            disableSwipe={true}
            style={{
              backgroundColor: react_colors.white,
            }}
            theme={{ colors: { primary: react_colors.goldenrod } }}
            onChangeIndex={(v) => onTabChange(v)}
          >
            <TabScreen label={t("SCHEDtitle1")}>
              <CalendarProvider
                style={{ paddingTop: 4 }}
                date={date}
                // showTodayButton
                disabledOpacity={0.6}
                theme={{
                  todayButtonTextColor: react_colors.gold,
                }}
                onDateChanged={(d) => {
                  onDateChanged(d);
                }}
                //   onMonthChange={() => {}}
                refreshing={isLoading}
              >
                {!eventsByDate && (
                  <View
                    style={{
                      width: "100%",
                      height: 45,
                      backgroundColor: react_colors.goldenrod,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 14, color: "#000" }}>
                      {t("SCHEDnoEvents")}
                    </Text>
                  </View>
                )}
                {eventsByDate && eventsByDate.length > 0 && (
                  <AgendaList
                    sections={eventsByDate}
                    avoidDateUpdates
                    renderItem={renderItem}
                    sectionStyle={{
                      color: "#000",
                      fontSize: 14,
                      backgroundColor: "#daa520",
                    }}
                  />
                )}
              </CalendarProvider>
            </TabScreen>
            <TabScreen label={t("SCHEDtitle2")}>
              <PricesHeat tab={tab} />
            </TabScreen>
            <TabScreen label={t("SCHEDtitle3")}>
              <Carbon tab={tab} />
            </TabScreen>
          </Tabs>
        </Animated.View>
      ) : null}
    </SafeAreaView>
  );
};
