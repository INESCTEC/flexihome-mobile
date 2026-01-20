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
// import Slider from "@react-native-community/slider";

import { styles, color_status, react_colors } from "../../styles";
import { SchedulerCommon } from "../SchedulerCommon";

export const EWH = (conf) => {
  // const { id, type, name, state, image } = device;
  //TODO: onSwitchTemp, onSwitchBaths, setToggleRepeat, setOnSmart
  const [temperature, setTemperature] = useState(conf.temperature);
  const [baths, setBaths] = useState(conf.baths);
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
              maximumTrackTintColor={react_colors.salmon}
              minimumTrackTintColor={react_colors.salmon}
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
          <Text style={{ fontSize: 16, fontWeight: "300" }}>{"Baths"}</Text>
          <View style={{ height: 20 }}></View>
        </View>

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
                {baths}
              </Text>
            </View>
            {/* <Slider
              // style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
              thumbTintColor={react_colors.whitesmoke}
              maximumTrackTintColor={react_colors.salmon}
              minimumTrackTintColor={react_colors.salmon}
              maximumValue={5}
              minimumValue={1}
              step={1}
              value={baths}
              onValueChange={(val) => setBaths(val)}
            ></Slider> */}
          </View>
        </View>
      </View>
      <View style={{ height: 20 }}></View>
    </>
  );
};
