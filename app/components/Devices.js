import React, { useState, useContext, useCallback } from "react";
import { styles, color_status, react_colors } from "../styles";
import { View, TouchableHighlight } from "react-native";
import { Card, Text } from "react-native-paper";
// import { useFocusEffect } from "@react-navigation/native";

import heatpump from "../assets/icons/hpump-fill.png";
import charger from "../assets/icons/charging-station-fill.png";
import inverter from "../assets/icons/solar-inverter-fill.png";

import unknown from "../assets/icons/unknown.png";
import { Foundation } from "@expo/vector-icons";

const _data = require("../utils/global-state.json");
const asset = {
  hpump: heatpump,
  evcharger: charger,
  inverter: inverter,
  unknown: unknown,
};

// memo prevents triggering the re-render that useState does when updating props
const Devices = ({ route, navigation, list }) => {
  //   state = {};
  // const [devices, setDevices] = useState(_data[2].appliances);
  const [devices, setDevices] = useState(list);

  // useEffect(() => {
  //   console.log("Available appliances: ", devices);
  // }, [devices]);

  // useFocusEffect(
  //   //APP DEMO MODE
  //   useCallback(() => {
  //     const unsubscribe = navigation.addListener("focus", () => {
  //       const data = route.params?.demoData;
  //       // console.log(route.params?.demoData);
  //       // console.log("Focuses");
  //       if (data) {
  //         setDevices(data);
  //       }
  //       // console.log("Lis of devices: ", devices);
  //     });

  //     return () => unsubscribe;
  //   }, [route.params])
  // );

  return (
    <>
      {devices == null ? (
        <View
          style={{
            height: 100,
            width: "90%",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <Text>{"Please add an appliance, using the button above."}</Text>
        </View>
      ) : null}
      {devices &&
        devices.map((card) => {
          const { applid, name, status, type, serial, style } = card;

          let image = asset[type];

          return (
            <View key={applid} style={[styles.view_item, { marginBottom: 20 }]}>
              <TouchableHighlight
                onPress={() =>
                  navigation.navigate("Details", { ...card, image })
                }
              >
                <Card
                  style={[styles.card, { backgroundColor: react_colors.white }]}
                >
                  <Card.Cover
                    style={styles.card_img}
                    source={image}
                    resizeMode={"contain"}
                  />
                  <Card.Title
                    title={<Text variant="titleMedium">{name}</Text>}
                    subtitle={serial}
                    right={() => (
                      <Foundation
                        name="rss"
                        size={16}
                        color={
                          status ? react_colors.primarygreen : react_colors.gray
                        }
                      />
                    )}
                    rightStyle={{ marginRight: 10, marginTop: 5 }}
                    // titleNumberOfLines={3}
                  />
                </Card>
              </TouchableHighlight>

              {/* <View style={{ height: "5%" }}></View> */}
            </View>
          );
        })}
    </>
  );
};

export default React.memo(Devices);
