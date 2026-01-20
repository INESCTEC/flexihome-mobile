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

import {
  Title,
  TextInput,
  Subheading,
  Paragraph,
  Headline,
  Caption,
  Button,
  Divider,
  ActivityIndicator,
  List,
  Dialog,
  Portal,
  RadioButton,
} from "react-native-paper";

import DropDownPicker from "react-native-dropdown-picker";
// import Slider from "@react-native-community/slider";

import { styles, color_status, react_colors } from "../../styles";
import { SchedulerCommon } from "../SchedulerCommon";

export const AirConditioner = (conf) => {
  // const { id, type, name, state, image } = device;
  const [swingOpt, setSwingOpt] = useState(conf.swing);

  const [mode, setMode] = useState(conf.program);
  const [isVisMode, setVisMode] = useState(false);

  const [temperature, setTemperature] = useState(conf.temperature);

  return (
    <>
      <View style={{ height: 20 }}></View>
      <SchedulerCommon {...conf}></SchedulerCommon>
      <View style={{ height: 20 }}></View>
      <View
        style={[
          styles.row_container,
          { borderBottomColor: "#000", borderBottomWidth: 0.5 },
        ]}
      >
        <View style={{ width: "45%", marginLeft: 4 }}>
          <Text style={{ fontSize: 16, fontWeight: "300" }}>
            {"Temperature"}
          </Text>
          <View style={{ height: 20 }}></View>
        </View>
        {/* SLIDER PICKER <TextInput
                label={""}
                value={String(hh)}
                onChangeText={(hrs) => {
                  // console.log(hh, minutes)
                  onTimeChange(hrs, "hours");
                  // onChangeText(hrs, "hours");
                }}
                keyboardType="numeric"
              ></TextInput>
              <TextInput
                label={""}
                value={String(mm)}
                onChangeText={(min) => {
                  onTimeChange(min, "minutes");
                  // onChangeText(min, "minutes");
                }}
                keyboardType="numeric"
              ></TextInput> */}
        <View style={{ width: "45%", marginRight: 4 }}>
          <View
            style={{
              width: "75%",
              // height: 30,
              borderRadius: 4,
              alignSelf: "center",
              backgroundColor: react_colors.skyblue,
            }}
          >
            <View
              style={{
                alignItems: "center",
                backgroundColor: react_colors.skyblue,
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: "bold", color: "#fff" }}>
                {temperature}
                {"ºC"}
              </Text>
            </View>
            {/* <Slider
              // style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
              thumbTintColor={react_colors.whitesmoke}
              maximumTrackTintColor={react_colors.blueviolet}
              minimumTrackTintColor={react_colors.blueviolet}
              maximumValue={30}
              minimumValue={0}
              step={1}
              value={temperature}
              onValueChange={(val) => setTemperature(val)}
            ></Slider> */}
          </View>
        </View>
      </View>
      <View style={{ height: 20 }}></View>
      <View
        style={[
          styles.row_container,
          { borderBottomColor: "#000", borderBottomWidth: 0.5 },
        ]}
      >
        <View style={{ width: "45%", marginLeft: 4 }}>
          <Text style={{ fontSize: 16, fontWeight: "300" }}>{"Mode"}</Text>
          <View style={{ height: 20 }}></View>
        </View>

        <View style={{ width: "45%", marginRight: 4, paddingBottom: 4 }}>
          <View
            style={{
              // maxWidth: 120,
              maxWidth: "75%",
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
              // mode="DEFAULT"
              // renderListItem={(props) => {
              //   <List.Item
              //     id={props.label}
              //     title={props.label}
              //     description={props.value}
              //     {...props}
              //   />;
              // }}
              items={conf.program_modes}
              value={mode}
              open={isVisMode} //State variable that specifies whether the picker is open.
              setOpen={setVisMode} //State callback that is called when the user presses the picker.
              setValue={(val) => {
                setMode(val);
              }}
              // onChangeValue={(value) => {
              //   console.log(mode);
              // }}
            ></DropDownPicker>
          </View>
        </View>
      </View>
      <View style={{ height: 20 }}></View>
      <View
        style={[
          styles.row_container,
          { borderBottomColor: "#000", borderBottomWidth: 0.5 },
        ]}
      >
        <View style={{ width: "45%", marginLeft: 4 }}>
          <Text style={{ fontSize: 16, fontWeight: "300" }}>{"Swing"}</Text>
          <View style={{ height: 20 }}></View>
        </View>

        <View style={{ width: "45%", marginRight: 4 }}>
          <View
            style={{
              width: 60,
              height: 30,
              // backgroundColor: "#14e",
              alignSelf: "center",
            }}
          >
            <Switch
              thumbColor={react_colors.white}
              trackColor={{
                false: react_colors.darkgray,
                true: react_colors.lightskyblue,
              }}
              value={swingOpt}
              onValueChange={(value) => {
                setSwingOpt(value);
              }}
            />
          </View>
        </View>
      </View>
      <View style={{ height: 20 }}></View>
    </>
  );
};
