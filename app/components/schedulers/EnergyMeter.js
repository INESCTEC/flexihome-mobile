import React, { useContext, useState } from "react";

import {
  Text,
  View,
  ImageBackground,
  FlatList,
  ScrollView,
  SafeAreaView,
} from "react-native";
import {
  Title,
  TextInput,
  Subheading,
  Paragraph,
  Headline,
  Caption,
  Button,
  Switch,
  Divider,
  ActivityIndicator,
  List,
  Dialog,
  Portal,
  RadioButton,
} from "react-native-paper";

import { styles, color_status, react_colors } from "../../styles";
// import MyKnob from "../MyKnob";

export const Emeter = (conf) => {
  // const special = useContext(ApplianceContext);
  const {
    applid,
    temperature,
    baths,
    start,
    style,
    mode,
    swing,
    week,
    next_ativations,
    program,
    e_consumption,
    e_consumption_total,
    e_generation,
    e_generation_total,
    contrated_power,
    p_consumption,
    p_consumption_total,
    p_generation,
    p_generation_total,
    ch_soc,
    status,
  } = conf;
  const powerData = {
    paramA: `${e_consumption}(${e_consumption_total}) kWh`,
    paramB: `${e_generation}(${e_generation_total}) kWh`,
    paramC: `${contrated_power}`,
    paramD: `${p_consumption}(${p_consumption_total}) kW`,
    paramE: `${p_generation}(${p_generation_total}) kW`,
    paramF: ch_soc,
    paramG: status,
  };

  const [isSwitchOn, setIsSwitchOn] = useState(true);

  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  return (
    <>
      <View style={{ height: 20 }}></View>
      <View
        style={[
          styles.row_container,
          { borderBottomColor: "#000", borderBottomWidth: 0.5 },
        ]}
      >
        <View style={{ width: "45%", marginLeft: 4 }}>
          <Text style={{ fontSize: 16, fontWeight: "normal" }}>
            {"Energy consumption"}
          </Text>
          <View style={{ height: 20 }}></View>
          <Text style={{ fontSize: 16, fontWeight: "normal" }}>
            {"Energy generation"}
          </Text>
          <View style={{ height: 20 }}></View>
          <Text style={{ fontSize: 16, fontWeight: "normal" }}>
            {"Contracted power"}
          </Text>
          <View style={{ height: 20 }}></View>
          <Text style={{ fontSize: 16, fontWeight: "normal" }}>
            {"Power consumption"}
          </Text>
          <View style={{ height: 20 }}></View>
          <Text style={{ fontSize: 16, fontWeight: "normal" }}>
            {"Power generation"}
          </Text>
          <View style={{ height: 20 }}></View>
        </View>
        <View style={{ width: "45%", marginRight: 4 }}>
          <Text
            style={{ fontSize: 16, fontWeight: "bold", textAlign: "right" }}
          >
            {powerData.paramA}
          </Text>
          <View style={{ height: 20 }}></View>
          <Text
            style={{ fontSize: 16, fontWeight: "bold", textAlign: "right" }}
          >
            {powerData.paramB}
          </Text>
          <View style={{ height: 20 }}></View>
          <Text
            style={{ fontSize: 16, fontWeight: "bold", textAlign: "right" }}
          >
            {powerData.paramC}
          </Text>
          <View style={{ height: 20 }}></View>
          <Text
            style={{ fontSize: 16, fontWeight: "bold", textAlign: "right" }}
          >
            {powerData.paramD}
          </Text>
          <View style={{ height: 20 }}></View>
          <Text
            style={{ fontSize: 16, fontWeight: "bold", textAlign: "right" }}
          >
            {powerData.paramE}
          </Text>
          <View style={{ height: 20 }}></View>
        </View>
      </View>
      <View
        style={{
          borderBottomColor: "#000",
          borderBottomWidth: 0.5,
          //   backgroundColor: react_colors.palegoldenrod,
        }}
      >
        <View style={{ height: 20 }}></View>

        <View
          style={[
            styles.row_container,
            { height: 50, justifyContent: "center" },
          ]}
        >
          <View
            style={{
              width: "27%",
              //   backgroundColor: "#fff",
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                fontWeight: !isSwitchOn ? "bold" : "200",
              }}
            >
              {"energy"}
            </Text>
          </View>
          <View
            style={{
              width: "17%",
              //   backgroundColor: "#fff",
              alignSelf: "center",
            }}
          >
            <Switch
              color={react_colors.skyblue}
              value={isSwitchOn}
              onValueChange={onToggleSwitch}
            />
          </View>
          <View
            style={{
              width: "27%",
              //   backgroundColor: "#fff",
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                fontWeight: isSwitchOn ? "bold" : "200",
              }}
            >
              {"max power"}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};
