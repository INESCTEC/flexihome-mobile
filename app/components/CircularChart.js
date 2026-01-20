import React, { useState } from "react";

import { Text, View, SafeAreaView, ScrollView } from "react-native";
import { styles, react_colors } from "../styles";
import { PieChart } from "react-native-gifted-charts";

let focused = {};

//Power Data
const power_data = {
  data: [
    {
      id: 0,
      title: "Generat:",
      value: 1.87,
      percent: 37,
      color: react_colors.mediumseagreen,
    },
    {
      id: 1,
      title: "Deliv:",
      value: 5.03,
      percent: 63,
      color: react_colors.gold,
    },
  ],
};

const renderDot = (color) => {
  return (
    <View
      style={{
        height: 10,

        width: 10,

        borderRadius: 5,

        backgroundColor: color,

        marginRight: 10,
      }}
    />
  );
};

const CircularChart = ({ data }) => {
  return (
    <View
      style={{
        paddingLeft: 20,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        height: 180,
      }}
    >
      <PieChart
        semiCircle
        data={data}
        labelsPosition={"outward"}
        innerRadius={80}
        centerLabelComponent={() => {
          return (
            <View style={{ justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {data[0].value} {data[0].units}
              </Text>
              <View style={{ height: 3 }}></View>
              <Text
                style={{
                  fontSize: 12,
                  textAlign: "center",
                  color: react_colors.silver,
                }}
              >
                {data[0].title}
              </Text>
              <View style={{ height: 3 }}></View>
            </View>
          );
        }}
      />
    </View>
  );
  return (
    <View
      style={{
        // flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        flexWrap: "wrap",
        // alignItems: "stretch",
        // marginTop: 12,
      }}
    >
      <AnimatedCircularProgress
        // tintTransparency={false}
        size={250}
        width={40}
        fill={percent}
        arcSweepAngle={180}
        rotation={-90}
        tintColor={color}
        backgroundColor={react_colors.gainsboro}
        style={{
          paddingVertical: 20,
          alignSelf: "center",
          // shadowColor: "black",
          // elevation: 2,
          // backgroundColor: "lightblue",
        }}
        childrenContainerStyle={{ marginTop: -8 }}
      >
        {(fill) => (
          <View style={{ justifyContent: "center" }}>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", textAlign: "center" }}
            >
              <Text>
                {value} {units}
              </Text>
            </Text>
            <View style={{ height: 8 }}></View>
            <Text
              style={{
                fontSize: 12,
                textAlign: "center",
                color: react_colors.silver,
              }}
            >
              {title}
            </Text>
          </View>
        )}
      </AnimatedCircularProgress>
    </View>
  );
};

export default CircularChart;
