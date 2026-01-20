import React, {useEffect} from 'react';
import { useTranslation } from "react-i18next";

import { View, SafeAreaView, TouchableOpacity, TouchableHighlight, Image, Touchable } from "react-native";
import { styles, react_colors } from "../../styles";
import { SegmentedButtons, Text, Icon, Button} from 'react-native-paper';

// import { MaterialIcons } from "@expo/vector-icons";
// import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { InterBackground } from '../../components/InterBackground';
import DatePicker from './DatePicker';
import dayjs from 'dayjs';

const FilterModal = ({ navigation, route }) => {
    const [t, i18n] = useTranslation();

    const { filter } = route.params || { filter: "last30" };

    const [value, setValue] = React.useState(filter);

    const [selected, setSelected] = React.useState({ start: "", end: "" });

    const onChange = (value) => {
        if (value != undefined) {
          // check if start is more than 60 days before today
          const { start, end } = value;
          let init = null;
          if (dayjs(start).isBefore(dayjs().subtract(60, 'day'))) {
            // handle case where start is more than 60 days before today
            init = dayjs().subtract(60, 'day').toDate();
          }
          // console.log("start", dayjs(start).format("YYYY-MM-DD, HH:mm:ss"));
          // console.log("end", dayjs(end).format("YYYY-MM-DD, HH:mm:ss"));
          setSelected({ start: init != null ? init : start, end: end });
          setValue("custom");
        }
    };
    
    let init = selected.start ? dayjs(selected.start).format("YYYY-MM-DD") : "";
    let end = selected.end ? dayjs(selected.end).format("YYYY-MM-DD") : "";
    
    const [isPicker, setPicker] = React.useState(false);

    const togglePicker = (prev) => {
        setPicker(prev);
    };

  useEffect(() => {
    if (value === "last7") {
      setSelected({
        start: dayjs().subtract(7, 'day').toDate(),
        end: dayjs().toDate()
      });
    } else if (value === "last30") {
      setSelected({
        start: dayjs().subtract(30, 'day').toDate(),
        end: dayjs().toDate()
      });
    } else if (value === "last60") {
      setSelected({
        start: dayjs().subtract(60, 'day').toDate(),
        end: dayjs().toDate()
      });
    }
  }, [value]);

  return (
    <SafeAreaView style={[styles.container, styles.global_color]}>
      <InterBackground noNav={true} />
      <SegmentedButtons
        theme={{
          colors: {
            secondaryContainer: react_colors.white,
            onSecondaryContainer: react_colors.primarygreen,
            primary: react_colors.fuchsia,
            onSurface: react_colors.black,
            outline: react_colors.complementarygray,
          },
        }}
        style={{
          margin: 3,
          marginHorizontal: 20,
          height: 50,
          alignItems: "center",
        }}
        value={value}
        onValueChange={(value) => setValue(value)}
        density="regular"
        buttons={[
          {
            value: "last7",
            label: t("FILTERopt1"),
            // icon: "calendar-today",
            // checkedColor: react_colors.primaryblue,
            // labelStyle: {fontSize: 14, textTransform: "lowercase", flexWrap: "nowrap"},
          },
          {
            value: "last30",
            label: t("FILTERopt2"),
            // icon: "calendar-month",
            // checkedColor: react_colors.primaryblue,
            // labelStyle: {fontSize: 14, textTransform: "lowercase", flexWrap: "nowrap"},
          },
          {
            value: "last60",
            label: t("FILTERopt3"),
            // icon: "calendar",
            // checkedColor: react_colors.primaryblue,
            // labelStyle: {fontSize: 14, textTransform: "lowercase", flexWrap: "nowrap"},
          },
        ]}
      />

      <TouchableOpacity
        onPress={() => togglePicker(!isPicker)}
        style={[
          styles.row_container,
          {
            flex: 0,
            height: "15%",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            alignContent: "center",
            marginTop: 20,
          },
        ]}
      >
        <View style={[styles.view_container, { width: "50%" }]}>
          <Text
            variant="labelLarge"
            style={{
              color: react_colors.black,
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            {t("FLEXnewStart")}
          </Text>
          <View
            style={[
              styles.row_container,
              {
                width: "60%",
                maxHeight: 30,
                alignContent: "center",
                alignItems: "center",
                borderColor: react_colors.black,
                borderWidth: 2,
                borderRadius: 12,
              },
            ]}
          >
            <Text>{init.toString() || "Select date..."}</Text>
            <Icon source="calendar" size={18} color={react_colors.black} />
          </View>
        </View>

        <View style={[styles.view_container, { width: "50%" }]}>
          <Text
            variant="labelLarge"
            style={{
              color: react_colors.black,
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            {t("FLEXnewEnd")}
          </Text>
          <View
            style={[
              styles.row_container,
              {
                width: "60%",
                maxHeight: 30,
                alignContent: "center",
                alignItems: "center",
                borderColor: react_colors.black,
                borderWidth: 2,
                borderRadius: 12,
              },
            ]}
          >
            <Text>{end.toString() || "Select date..."}</Text>
            <Icon source="calendar" size={18} color={react_colors.black} />
          </View>
        </View>

        <DatePicker
          init_date={selected.start}
          end_date={selected.end}
          handleRange={({ startDate, endDate }) =>
            onChange({ start: startDate, end: endDate })
          }
          showPicker={isPicker}
          toggle={() => togglePicker(!isPicker)}
        />
      </TouchableOpacity>

      <View
        style={[
          styles.view_item,
          {
            flex: 1,
            justifyContent: "center",
            alignContent: "flex-end",
          },
        ]}
      >
        <Button
          mode="contained"
          labelStyle={{ color: react_colors.white }}
          buttonColor={react_colors.primarygreen}
          onPress={() => navigation.push("FlexScreen", { filter: value })}
        >
          {t("FILTERbutton")}
        </Button>
      </View>
    </SafeAreaView>
  );
}

export default FilterModal;