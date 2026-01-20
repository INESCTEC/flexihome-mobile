import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ImageBackground,
  FlatList,
  ScrollView,
  SafeAreaView,
  Switch,
} from "react-native";

import {
  Title,
  TextInput,
  Subheading,
  Paragraph,
  Headline,
  Caption,
  Divider,
  ActivityIndicator,
  List,
  Button,
  Dialog,
  Portal,
  Snackbar,
} from "react-native-paper";
// import DatePicker from "react-native-modern-datepicker";
// import { getToday, getFormatedDate } from "react-native-modern-datepicker";
import { useTranslation } from "react-i18next";
import { styles, react_colors, color_status } from "../styles";

const DialogTimer = ({ idx, hh, mm, onTimeChange }) => {
  const [isVisible, setTimerVisible] = useState(false);
  const toggleDialog = (prev) => {
    setTimerVisible(prev);
  };
  const [hours, setHours] = useState(hh);
  const [minutes, setMinutes] = useState(mm);

  const onChangeText = (v, t) => {
    // console.log(`internal ${t}: ${v}`);
    if (t == "minutes") {
      setMinutes(v);
    } else {
      setHours(v);
    }
  };
  const handleTimeChange = (item) => {
    const { hours, minutes } = item;
    setHours(item.hours);
    setMinutes(item.minutes);
  };

  return (
    <Button
      style={{
        borderRadius: 4,
        // width: "45%",
        backgroundColor: react_colors.skyblue,
      }}
      onPress={() => {
        toggleDialog(!isVisible);
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: "800",
          textAlign: "center",
          color: "#fff",
        }}
      >
        {hours < 10 ? ("0" + Number(hours)).slice(-2) : hours}:
        {minutes < 10 ? ("0" + Number(minutes)).slice(-2) : minutes}
      </Text>

      <Portal>
        <Dialog
          visible={isVisible}
          onDismiss={() => {
            handleTimeChange({ hours: hh, minutes: mm });
            toggleDialog(!isVisible);
          }}
        >
          <Dialog.Content>
            <View
              style={{
                width: "100%",
                backgroundColor: react_colors.lightgray,
              }}
            >
              {/* <TimePicker
                zeroPadding={true}
                minutesInterval={5}
                hoursUnit="hr"
                minutesUnit="min"
                textColor={react_colors.blue}
                value={{ hours, minutes }}
                onChange={handleTimeChange}
              /> */}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                onTimeChange({ hours: hours, minutes: minutes }, idx);
                toggleDialog(!isVisible);
              }}
            >
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Button>
  );
};

// const TimeArray = ({ arr, onAdd }) => {
//   const [times, setTimes] = useState(arr);

//   const handleTimeChange = (item, index) => {
//     //TODO: set array of time starts
//     const { hours, minutes } = item;
//     // console.log("time changed?");
//     // console.log("new: " + hours + ":" + minutes);
//     // console.log("position: " + index);
//     times[index] = hours + ":" + minutes;
//     setTimes((prev) => times);
//     // onChange((prev) => times);
//     // console.log(times);
//     // setHours(item.hours);
//     // setMinutes(item.minutes);
//   };

//   useEffect(() => {
//     // onChange(setTimes(arr));
//     // console.log(" TIMEs :" + times);
//   });
//   return (
//     <>
//       {times.map((item, index) => {
//         // console.log("rendering " + item);
//         let actHours = item.split(":")[0];
//         let actMinutes = item.split(":")[1];
//         return (
//           <View key={index}>
//             <DialogTimer
//               idx={index}
//               hh={Number(actHours)}
//               mm={Number(actMinutes)}
//               // onTimeChange={(it, id) => handleTimeChange(it, id)}
//               onTimeChange={handleTimeChange}
//             />
//           </View>
//         );
//       })}
//       {times.length < 5 && (
//         <Button
//           mode="text"
//           // onPress={() => setTimeArr(() => Array.from([...timeArr, "23:59"]))}
//           onPress={() => {
//             setTimes((prev) => [...times, "23:59"]);
//             onAdd(times);
//           }}
//         >
//           {"Add more"}
//         </Button>
//       )}
//     </>
//   );
// };
export const SchedulerCommon = ({ conf, onChangeWeek }) => {
  const { next_ativation_date, start, end, program } = conf[0].progs[0];
  // console.log("CONF:", conf[0].progs[0]);

  const [t, i18n] = useTranslation();
  const [alertVisible, setAlertVisible] = useState(false);

  //get user flexibility preferences
  const [isFlexible, setIsFlexible] = useState(true);

  // const onToggleSmart = () => {
  //   setIsmartOn(!isSmartOn);
  //   onChange(isSmartOn);
  //   // if (isSmartOn && !isFlexible) setAlertVisible(true);
  //   // else setIsmartOn(!isSmartOn);
  // };

  let activation_date = next_ativation_date
    ? new Date(next_ativation_date)
    : "";
  let nextActiveDay =
    typeof activation_date === "object"
      ? `${activation_date.toISOString().slice(0, 10)}`
      : "";

  return (
    <View>
      {next_ativation_date && (
        <View style={{ marginLeft: 15 }}>
          <View
            style={{
              alignItems: "flex-start",
            }}
          >
            <View style={{ width: "90%", alignContent: "flex-start" }}>
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                {t("CONSUMERactivationsTitle")}
              </Text>
              {/* <View style={{ height: 20 }}></View> */}
            </View>
            <View style={{ width: "90%", alignContent: "flex-start" }}>
              <Text style={{ fontSize: 16, fontWeight: "300" }}>
                {nextActiveDay}, {start}
              </Text>
              <View style={{ height: 20 }}></View>
            </View>
          </View>
          {/* <View style={{ height: 20 }}></View> */}
          <View
            style={{
              alignItems: "flex-start",
            }}
          >
            <View style={{ width: "90%", alignContent: "flex-start" }}>
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                {t("CONSUMERactivationsTitle2")}
              </Text>
              {/* <View style={{ height: 20 }}></View> */}
            </View>
            <View style={{ width: "90%", alignContent: "flex-start" }}>
              <Text style={{ fontSize: 16, fontWeight: "300" }}>
                {nextActiveDay}, {end}
              </Text>
            </View>
          </View>
          <View style={{ height: 20 }}></View>
        </View>
      )}
      {program && (
        <View
          style={{
            alignItems: "flex-start",
            marginLeft: 15,
          }}
        >
          <View style={{ width: "90%", alignContent: "flex-start" }}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              {t("CONSUMERactivationsProgram")}
            </Text>
          </View>

          <View style={{ width: "90%", alignContent: "flex-start" }}>
            <Text style={{ fontSize: 16, fontWeight: "300" }}>{program}</Text>
          </View>
          <View style={{ height: 20 }}></View>
        </View>
      )}

      <View style={{ width: "100%", marginLeft: 4 }}>
        <Snackbar
          visible={alertVisible}
          onDismiss={() => setAlertVisible(!alertVisible)}
          action={{
            label: "Ok",
            // onPress: () => {
            //TODO: go to settings screen
            // setIsFlexible(!isFlexible);
            // },
          }}
        >
          <Text
            style={{
              color: react_colors.orangered,
              textAlign: "left",
              fontSize: 16,
            }}
          >
            {t("CONSUMERglobalDiscl")}
          </Text>
        </Snackbar>
      </View>
    </View>
  );
};
