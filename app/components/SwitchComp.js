import React, { useState } from "react";
import { View, Switch } from "react-native";
import { Text } from "react-native-paper";
import { styles, react_colors, color_status } from "../styles";
export const SwitchComp = ({ labelA, labelB, value, onToggle, disabled }) => {
  return (
    <View
      style={{
        ...styles.row_container,
        height: 50,
        alignContent: "center",
        justifyContent: "flex-start",
      }}
    >
      {labelA && (
        <View
          style={{
            width: "35%",
            alignSelf: "center",
          }}
        >
          <Text
            variant="bodyLarge"
            style={{
              textAlign: "center",
              // fontSize: 16,
              fontWeight: !value ? "800" : "200",
            }}
          >
            {labelA}
          </Text>
        </View>
      )}
      <View
        style={{
          width: "20%",
          alignSelf: "center",
        }}
      >
        <Switch
          thumbColor={react_colors.tiffanyblue}
          trackColor={{
            false: disabled ? react_colors.gainsboro : react_colors.darkgray,
            true: disabled ? react_colors.gainsboro : react_colors.lightgray,
          }}
          value={value}
          onChange={onToggle}
          disabled={disabled}
        />
      </View>
      {labelB && (
        <View
          style={{
            width: "35%",
            alignSelf: "center",
          }}
        >
          <Text
            variant="bodyLarge"
            style={{
              textAlign: "center",
              // fontSize: 18,
              fontWeight: value ? "800" : "200",
            }}
          >
            {labelB}
          </Text>
        </View>
      )}
    </View>
  );
};
