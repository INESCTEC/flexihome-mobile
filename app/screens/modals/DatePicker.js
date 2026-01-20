import React, {useState} from "react";
import { useTranslation } from "react-i18next";

import { Appearance } from "react-native";
import { react_colors } from "../../styles";
import { Portal, Modal } from "react-native-paper";

import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";
import dayjs from "dayjs";
import "dayjs/locale/pt"; // Import Portuguese locale


const DatePicker = ({ init_date, end_date, handleRange, showPicker, toggle }) => {
  const [t, i18n] = useTranslation();

  const defaultStyles = useDefaultStyles();
  const colorScheme = Appearance.getColorScheme();
  const dark = colorScheme === "dark";
  return (
    // <View style={{width: "80%", height: 200, justifyContent: "center", alignItems: "center"}}>
    <Portal>
      <Modal
        visible={showPicker}
        onDismiss={toggle}
        contentContainerStyle={{
          backgroundColor: react_colors.snow,
          height: "50%",
          width: "80%",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          borderRadius: 18,
        }}
      >
        {/*NEW  */}
        <DateTimePicker
          timeZone="WET"
          // timeZone="WEST"
          calendar="gregorian"
          locale={
            i18n.language.includes("pt")
              ? require("dayjs/locale/pt")
              : require("dayjs/locale/en")
          }
          mode="range"
          minDate={new Date("2015-01-01")} //TODO: 60 days before today
          maxDate={new Date("2030-09-01")} // tomorrow and onwards
          // enabledDates={(date) => dayjs(date).day().subtract(60, 'da')} // Enable only Mondays (takes precedence over disabledDates)
          disabledDates={(date) => {
            return date > dayjs();
          }} // Disable days after today
          startDate={init_date}
          endDate={end_date}
          // onChange={({startDate, endDate}) => handleRange({start: startDate, end: endDate})}
          onChange={handleRange}
          min={1}
          max={60}
          style={
            //style for the calendar container.
            {
              height: "100%",
              width: "100%",
              backgroundColor: !dark
                ? react_colors.antiflashwhite
                : react_colors.black,
              borderRadius: 18,
              padding: 5,
              elevation: 5,
            }
          }
          styles={{
            ...defaultStyles,
            day_cell: { padding: 0 },
            day_label: {
              color: !dark ? react_colors.black : react_colors.white,
            },
            month_label: {
              color: !dark ? react_colors.black : react_colors.white,
            },
            year_label: {
              color: !dark ? react_colors.black : react_colors.white,
            },
            today: {
              borderColor: react_colors.complementarynavy,
              borderWidth: 1,
              borderRadius: 18,
            },
            selected: {
              backgroundColor: !dark
                ? react_colors.darkslategrey
                : react_colors.gray,
              borderRadius: 18,
            },
            selected_label: {
              color: !dark
                ? react_colors.navajowhite
                : react_colors.complementarynavy,
            },
            range_middle: {
              backgroundColor: !dark
                ? react_colors.darkslategrey
                : react_colors.dimgray,
              borderRadius: 18,
            },
            range_start_label: { color: react_colors.primaryyellow },
            range_end_label: { color: react_colors.primaryyellow },
            range_middle_label: { color: react_colors.white },
            disabled_label: {
              color: !dark ? react_colors.lightgray : react_colors.darkgray,
            },
          }}
          showOutsideDays={false}
          disableYearPicker={true}
          // containerHeight={200}
          weekdaysHeight={35}
          weekdaysFormat="min"
          monthsFormat="short"
        />
      </Modal>
    </Portal>
    // </View>
  );
};

export default DatePicker;