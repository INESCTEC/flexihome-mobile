import React, { useCallback, useEffect } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { View, SafeAreaView, ScrollView, StatusBar, TouchableOpacity } from "react-native";
import { InterBackground } from "../components/InterBackground";

import {Text, Tooltip, IconButton} from "react-native-paper";
import { react_colors, styles } from "../styles";
import { Popable } from "react-native-popable";
import { useTranslation } from "react-i18next";

import { AntDesign } from "@expo/vector-icons";

// import { GlobalContext } from "../context/Provider";

const Incentives = ({ navigation }) => {

  const [t, i18n] = useTranslation();

  
  return (
    <SafeAreaView style={[styles.container, styles.global_color]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ebf5f3" />
      <InterBackground />
      {/* <View style={{ height: "5%" }}></View> */}
      <ScrollView>
        <View
          style={[
            styles.view_container,
            {
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: "20%",
            },
          ]}
        >
          <View
            style={[
              // styles.row_container,
              {
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "10%",
                width: "90%",
              },
            ]}
          >
            <View style={{ width: "90%" }}>
              <Text style={{ textAlign: "center" }} variant="headlineLarge">
                {t("INCENTmainTitle")}
                <Popable
                  content={t("BENEFDesc")}
                  strictPosition={true}
                  position="left"
                >
                  <AntDesign
                    name="questioncircle"
                    size={30}
                    color="black"
                    style={{ padding: 6 }}
                  />
                </Popable>
              </Text>
            </View>
          </View>
          <View style={[styles.row_container, { justifyContent: "center", alignItems: "flex-start", marginTop: 20 }]}>
            <Text
              variant="displayMedium"
              style={{ textAlign: "left"}}
            >
              {"20"}
            </Text>
            <Text
              variant="displayMedium">{","}</Text>
            <Text variant="headlineSmall" style={{ verticalAlign: "top" }}>
              {"00€"}
            </Text>
          </View>
        </View>
        <View style={[styles.row_container, { height: 100 }]}>
          <View
            style={{
              flex: 1,
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Text variant="titleMedium">{t("INCENTtitle2")}</Text>
            <Text variant="headlineMedium">117,00 €</Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Text variant="titleMedium">{t("INCENTtitle3")}</Text>
            <Text variant="headlineMedium">500 ppm</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default React.memo(Incentives);