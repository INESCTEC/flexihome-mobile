import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/Provider";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { Text, View, Image, SafeAreaView, ScrollView, Animated, Dimensions} from "react-native";
import { useTranslation } from "react-i18next";
import { styles, react_colors } from "../styles";

// import GraphButtons from "../components/GraphButtons";
import { RegisterAlert } from "../components/RegisterAlert";
import { InterBackground } from "../components/InterBackground";
// import PowerLast from "../components/PowerLast";

//DATA screen
const Producer = (props) => {
  const {
    authDispatch,
    authState: { data, userToken },
  } = useContext(GlobalContext);

  // console.log("USER DATA:", data, userToken);
  const auth = userToken;
  const userId = data.user?.user_id;
  const cpower = data.user?.contracted_power;
  const api_key = data.user?.api_key || null;

  const conf = {
    userId: userId,
    api_key: api_key,
    cpower: cpower?.split(" ")[0] || 0,
  };

  const { width, height } = Dimensions.get("screen");

  return (
    <SafeAreaView style={[styles.container, styles.global_color]}>
      <InterBackground />

      <ScrollView>
        {/* <GraphButtons userData={conf} token={userToken} /> */}
        <View style={styles.divider}></View>
        <View style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Image 
            source={require("../assets/load.png")}
            style={{
              width: width,
              height: 300,
              resizeMode: "contain",
              resizeMethod: "cover",
              marginHorizontal: 3,
              opacity: 1,
            }}
          />
        </View>
        {api_key && (
          <View
            style={{
              alignSelf: "center",
              // flex: 1,
              width: "97%",
              padding: 0,
              // backgroundColor: react_colors.chartreuse,
            }}
          >
            {/* <PowerLast userData={conf} token={userToken} /> */}
          </View>
        )}
        <View style={styles.divider}></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Producer;
