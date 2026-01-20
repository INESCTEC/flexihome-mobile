import React from "react";
import { View, Dimensions, ImageBackground, StatusBar } from "react-native";
import { react_colors } from "../styles";

export const InterBackground = ({ noNav, opacity }) => {
  const x = Dimensions.get("screen");
  // const pic =
  //   x.width > 500
  //     ? require("../assets/background_XL.png")
  //     : require("../assets/background_sm.png");

  const pic = require("../assets/home.png");
  let extra = noNav ? StatusBar.currentHeight : 0;

  return (
    <View
      style={{
        paddingTop: 0,
      }}
    >
      <ImageBackground
        source={pic}
        style={{
          flex: 1,
          width: x.width * 1.5,
          height: x.height * 1.2,
          // backgroundColor: noNav ? "#fff" : "#dcdcdc",
          position: "absolute",
          top: noNav ? 95 : 150,
          right: 80,
          opacity: opacity ? 1 : 0.3,
        }}
        imageStyle={{
          resizeMode: "contain",
          alignSelf: "flex-start",
          // tintColor: react_colors.black,
        }}
      />
    </View>
  );
};
