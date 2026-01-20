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

// import {
//   Title,
//   TextInput,
//   Subheading,
//   Paragraph,
//   Headline,
//   Caption,
//   Button,
//   Divider,
//   ActivityIndicator,
//   List,
//   Dialog,
//   Portal,
//   RadioButton,
// } from "react-native-paper";
// import DropDownPicker from "react-native-dropdown-picker";

// import { styles, color_status, react_colors } from "../../styles";
import { SchedulerCommon } from "../SchedulerCommon";

export const WashingMachine = ({ detail, onChange }) => {
  // const { id, type, name, state, image } = device;

  const [prog, setProg] = useState(detail.program);
  const [isVisProg, setVisProg] = useState(false);

  // console.log("WM settings: ", { ...detail });
  //TODO: setOnProgram, setToggleRepeat, setOnSmart
  return (
    <>
      <View style={{ height: 20 }}></View>
      <SchedulerCommon conf={detail} onChangeWeek={onChange}></SchedulerCommon>
      <View style={{ height: 20 }}></View>

      {/* <View
        style={[
          styles.row_container,
          { borderBottomColor: "#000", borderBottomWidth: 0.5 },
        ]}
      >
        <View style={{ width: "90%", marginLeft: 4 }}>
          <Text style={{ fontSize: 16, fontWeight: "500" }}>
            {"Selected Program:"}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            {detail.program}
          </Text>
          <View style={{ height: 20 }}></View>
        </View>

        <View style={{ width: "45%", marginRight: 4 }}>
          {/* <View
            style={{
              // width: 120,
              maxWidth: "75%",
              height: 30,
              borderRadius: 4,
              alignSelf: "center",
              backgroundColor: react_colors.skyblue,
            }}
          >
            <DropDownPicker
              style={{
                height: 30,
                backgroundColor: react_colors.skyblue,
                borderColor: react_colors.skyblue,
              }}
              placeholderStyle={{
                color: react_colors.skyblue,
                fontSize: 5,
              }}
              arrowIconContainerStyle={{
                marginLeft: 0,
              }}
              modalContentContainerStyle={{
                backgroundColor: react_colors.skyblue,
                maxHeight: 300,
              }}
              textStyle={{
                color: "#000",
                fontSize: 18,
              }}
              labelStyle={{
                color: "#fff",
                fontSize: 22,
              }}
              modalProps={{ animationType: "fade" }}
              listMode="MODAL"
              // mode="BADGE"
              items={conf.program_modes}
              //  items={[
              //     //TODO: receive modes, programs from conf
              //     { label: "Quick", value: 1 },
              //     { label: "Cotton", value: 2 },
              //     { label: "Eficient", value: 3 },
              //     { label: "Whites", value: 4 },
              //     { label: "Super Clean", value: 5 },
              //   ]}
              value={prog}
              open={isVisProg} //State variable that specifies whether the picker is open.
              setOpen={setVisProg} //State callback that is called when the user presses the picker.
              setValue={(val) => {
                setProg(val);
              }}
              // onChangeValue={(value) => {
              //   console.log(mode);
              // }}
            ></DropDownPicker>
          </View>
        </View>
      </View> */}
    </>
  );
};
