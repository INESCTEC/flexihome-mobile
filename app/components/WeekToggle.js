import React, { useState } from "react";
import {
  Text,
  View,
  ImageBackground,
  FlatList,
  ScrollView,
  SafeAreaView,
  Switch,
} from "react-native";
import Toast from "react-native-root-toast";
// import { TimePicker } from "react-native-simple-time-picker";
import { Button, Caption, Dialog, Portal, Title } from "react-native-paper";
import { react_colors } from "../styles";

export const WeekToggle = ({ weekDays, isRepeated, onChange }) => {
  // const [repeat, setRepeat] = useState(false);
  const [week, setWeekdays] = useState(weekDays);
  // const [periodic, setPeriodic] = useState(isRepeated);

  const onLong = () => {
    //reset all week
    console.log(week);
  };
  const onChangeDay = (day, time, faulty) => {
    // change day record
    //evaluate if start is before end
    const { start, end } = time;
    // console.log("Changed to > ", start, end);
    // console.log("Is error? ", faulty);

    // let obj = { id: day, time: time, value: val };

    let interm = week;

    // console.log("This is the week? : ", interm);
    if (!faulty) {
      setWeekdays(interm);
      onChange(interm);
    }
  };
  const daysEn = ["S", "M", "T", "W", "T", "F", "S"];
  const daysPt = ["D", "S", "T", "Q", "Q", "S", "S"];

  // let days = Array.from(week);
  // console.log(days)
  return (
    <>
      {week.map((item, index) => {
        const { id, value, time } = item;
        // console.log(item);
        return (
          <Day
            key={index}
            day={id}
            sched={time}
            inactive={isRepeated ? false : true}
            enabled={value}
            onChange={(d, v, e) => onChangeDay(d, v, e)}
            onLong={onLong}
          />
        );
      })}
    </>
  );
};

const Day = ({ day, sched, inactive, enabled, onChange, onLong }) => {
  const [selected, setSelected] = useState(enabled);
  const [times, setTimes] = useState(sched);
  const [isVisible, setTimerVisible] = useState(false);
  const [isError, setIsError] = useState(false);

  const [start, setStart] = useState({ hours: 0, minutes: 0 });
  // const start = times[0];
  const [end, setEnd] = useState({ hours: 0, minutes: 0 });
  // const end = times[1];

  const onCancel = () => {
    setSelected(false);
    setTimes([null, null]);
  };

  const resetTimer = (d) => {
    times[d] = [];
  };
  const showToast = (msg, state) => {
    Toast.show(msg, {
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM,
      backgroundColor: state ? react_colors.gray : react_colors.salmon,
      opacity: 1,
    });
  };

  const toggleDialog = (prev) => {
    setTimerVisible(prev);
  };

  const handleStartTime = (item) => {
    const { hours, minutes } = item;
    setStart({ hours: hours ? hours : 0, minutes: minutes ? minutes : 0 });
  };
  const handleEndTime = (item) => {
    const { hours, minutes } = item;
    setEnd({ hours: hours ? hours : 0, minutes: minutes ? minutes : 0 });
  };

  const handleTimeChange = (item, index) => {
    // console.log(item, index);
    const { hours, minutes } = item;

    let init,
      offit = null;
    let midnight = new Date(2021, 0, 1, 0, 0, 0);
    index == 0 ? handleStartTime(item) : handleEndTime(item);

    let date = new Date(2021, 0, 1, hours, minutes, 0);

    if (index == 0) {
      if (end) {
        offit = new Date(2021, 0, 1, end.hours, end.minutes, 0);

        diff = offit.getTime() - date.getTime();
        // console.log("end: ", offit.toISOString());
      }
    } else {
      if (start) {
        init = new Date(2021, 0, 1, start.hours, start.minutes, 0);

        diff = date.getTime() - init.getTime();
        // console.log("start: ", init.toISOString());
      }
    }

    if (diff > 0) {
      setIsError(false);
      setSelected(true);
      // console.log("start is before finish!");
    } else {
      showToast("Check timers: end is before start!", false);
      setIsError(true);
      setSelected(false);
      // console.log("Wrong : start is after end!");
    }

    times[index] =
      (hours < 10 ? ("0" + Number(hours)).slice(-2) : hours) +
      ":" +
      (minutes < 10 ? ("0" + Number(minutes)).slice(-2) : minutes);
  };

  return (
    <>
      <Button
        compact={true}
        disabled={false}
        onPress={() => {
          toggleDialog(!isVisible);
        }}
        onLongPress={onLong}
        style={{
          // heigth: 60,
          width: 40,
          backgroundColor: selected ? react_colors.skyblue : react_colors.gray,
          borderRadius: 4,
          marginRight: 5,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
            color: "#fff",
          }}
        >
          {day[0]}
        </Text>
        <Portal>
          <Dialog
            visible={isVisible}
            onDismiss={() => {
              // handleTimeChange({ hours: hh, minutes: mm }, idx);
              // toggleDialog(!isVisible);
            }}
            dismissable={false}
          >
            <Dialog.Content>
              <View
                style={{
                  width: "100%",
                  backgroundColor: react_colors.lightgray,
                }}
              >
                <Title>{day.toUpperCase()}</Title>
                {times.map((item, index) => {
                  // console.log("rendering " + item);
                  let actHours = item?.split(":")[0];
                  let actMinutes = item?.split(":")[1];
                  return (
                    <View key={index}>
                      {index == 0 ? (
                        <Caption>{"start"}</Caption>
                      ) : (
                        <Caption>{"end"}</Caption>
                      )}
                      {/* <TimePicker
                        key={index}
                        zeroPadding={true}
                        minutesInterval={5}
                        hoursUnit="hr"
                        minutesUnit="min"
                        textColor={react_colors.black}
                        value={{
                          hours: Number(actHours || 0),
                          minutes: Number(actMinutes || 0),
                        }}
                        // onChange={handleTimeChange}
                        onChange={(it) => handleTimeChange(it, index)}
                      /> */}
                    </View>
                  );
                })}
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  onCancel(day);
                  toggleDialog(!isVisible);
                }}
              >
                Cancel
              </Button>
              <Button
                onPress={() => {
                  // handleTimeChange({ hours: hours, minutes: minutes });
                  if (isError) setTimes([null, null]);
                  !isError && toggleDialog(!isVisible);
                  onChange(day, { start, end }, isError);
                }}
              >
                Ok
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </Button>
    </>
  );
};
