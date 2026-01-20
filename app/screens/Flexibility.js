import React, { useEffect } from "react";
import { Card, Button, Text, Divider,  } from "react-native-paper";
import { View, Image, ScrollView, SafeAreaView, TouchableOpacity} from "react-native";
import { InterBackground } from "../components/InterBackground";
import { styles, react_colors } from "../styles";
import { useTranslation } from "react-i18next";

import { Feather, AntDesign, Foundation } from '@expo/vector-icons/';
import { Popable } from "react-native-popable";

const heatpump = require("../assets/icons/hpump.png");
const charger = require("../assets/icons/charging-station.png");

const Flexibility = ({ navigation, route}) => {
    const [t, i18n] = useTranslation();
    const [filtered, setFiltered] = React.useState(route.params?.filter);
    // const filtered = route.params?.filter || "last30";
    
    useEffect(() => {
        if (filtered) {
          // console.log("filtered is", filtered);
          setFiltered(filtered);
        }

    }, [filtered]);


    return (
      <SafeAreaView style={[styles.container, styles.global_color]}>
        <InterBackground />
        <ScrollView>
          <View
            style={{
              alignItems: "center",
            }}
          >
            <View
              style={[
                styles.row_container,
                {
                  width: "90%",
                  alignItems: "center",
                  justifyContent: "space-around",
                },
              ]}
            >
              <View style={{ width: "90%" }}>
                <Text variant="titleLarge">
                  {t("FLEXtitle")}
                  <Popable
                    content={t("FLEXtitlePop")}
                    strictPosition={false}
                    position="bottom"
                  >
                    <AntDesign
                      name="questioncircle"
                      size={14}
                      color="black"
                      style={{ padding: 4 }}
                    />
                  </Popable>
                </Text>
              </View>
              <View style={{ width: "10%" }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("FlexFilter", { filter: filtered })
                  }
                >
                  <Feather
                    name="filter"
                    size={36}
                    color={react_colors.black}
                    style={{ marginVertical: 10 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* schedules */}
          {filtered && (
            <>
              <View
                style={[
                  styles.row_container,
                  { paddingTop: 10, height: "15%", alignItems: "flex-start" },
                ]}
              >
                <View
                  style={[
                    styles.view_container,
                    {
                      flex: 2,
                      alignItems: "flex-start",
                      paddingHorizontal: 10,
                      // backgroundColor: react_colors.palegoldenrod,
                    },
                  ]}
                >
                  <Text
                    variant="titleLarge"
                    style={{ color: react_colors.primarygreen }}
                  >
                    {t("Today, 27 Jun")}
                  </Text>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Text variant="bodyMedium">{t("13:00 - 16:00")}</Text>
                  </View>

                  <View
                    style={[
                      styles.row_container,
                      {
                        justifyContent: "center",
                        //   backgroundColor: react_colors.teal,
                      },
                    ]}
                  >
                    <View
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                        width: "20%",
                        paddingHorizontal: 3,
                      }}
                    >
                      <Image
                        source={heatpump}
                        style={{ width: 50, height: 50 }}
                        // resizeMode="cover"
                      />
                    </View>
                    <View
                      style={{
                        justifyContent: "center",
                        width: "79%",
                        paddingHorizontal: 5,
                        paddingLeft: 10,
                          // backgroundColor: react_colors.lavender,
                      }}
                    >
                      <Text
                        variant="bodyMedium"
                        style={{ color: react_colors.black }}
                      >
                        {t("FLEXdescA")}
                      </Text>
                    </View>
                  </View>
                  <View style={{ height: 20 }} />
                </View>

                <View
                  style={[
                    styles.view_container,
                    {
                      flex: 1,
                      alignItems: "flex-end",
                      paddingHorizontal: 10,
                      // backgroundColor: react_colors.slateblue,
                    },
                  ]}
                >
                  <View style={{ height: "33.33%" }}>
                    <Text variant="titleLarge">{t("2025")}</Text>
                  </View>
                  <View style={{ height: "33.333%", justifyContent: "center" }}>
                    <Text variant="bodyMedium" style={{ fontWeight: "bold" }}>
                      {t("+1,2€")}
                      <Popable
                        content={t("FLEXitemA")}
                        strictPosition={false}
                        position="left"
                      >
                        <AntDesign
                          name="questioncircle"
                          size={12}
                          color="black"
                          style={{ padding: 2 }}
                        />
                      </Popable>
                    </Text>
                  </View>
                  <View style={{ height: "33.333%", justifyContent: "center" }}>
                    <Text variant="bodyMedium">
                      {`-10${String.fromCharCode(176)}C`}
                      <Popable
                        content={t("FLEXitemB")}
                        strictPosition={false}
                        position="left"
                      >
                        <AntDesign
                          name="questioncircle"
                          size={12}
                          color="black"
                          style={{ padding: 2 }}
                        />
                      </Popable>
                    </Text>
                  </View>
                </View>

                {/* <View style={{ height: 20 }} /> */}
              </View>

              <Divider style={{ width: "100%" }} />

              <View
                style={[
                  styles.row_container,
                  { paddingTop: 10, height: "15%", alignItems: "flex-start" },
                ]}
              >
                <View
                  style={[
                    styles.view_container,
                    {
                      flex: 2,
                      alignItems: "flex-start",
                      paddingHorizontal: 10,
                      // backgroundColor: react_colors.palegoldenrod,
                    },
                  ]}
                >
                  <Text
                    variant="titleLarge"
                    style={{ color: react_colors.primarygreen }}
                  >
                    {t("Yesterday, 26 Jun")}
                  </Text>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Text variant="bodyMedium">{"00:00 - 07:00"}</Text>
                  </View>

                  <View
                    style={[
                      styles.row_container,
                      {
                        justifyContent: "center",
                        // backgroundColor: react_colors.teal,
                      },
                    ]}
                  >
                    <View
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                        width: "20%",
                        paddingHorizontal: 3,
                        // backgroundColor: react_colors.complementaryblue,
                      }}
                    >
                      <Image
                        source={charger}
                        style={{ width: 50, height: 50 }}
                        // resizeMode="cover"
                      />
                    </View>
                    <View
                      style={{
                        justifyContent: "center",
                        width: "79%",
                        paddingHorizontal: 5,
                        paddingLeft: 10,
                        // backgroundColor: react_colors.yellow,
                      }}
                    >
                      <Text
                        variant="bodyMedium"
                        style={{ color: react_colors.black }}
                      >
                        {t("FLEXdescB")}
                      </Text>
                    </View>
                  </View>
                  <View style={{ height: 20 }} />
                </View>

                <View
                  style={[
                    styles.view_container,
                    {
                      flex: 1,
                      alignItems: "flex-end",
                      paddingHorizontal: 10,
                      // backgroundColor: react_colors.slateblue,
                    },
                  ]}
                >
                  <View style={{ height: "33.33%" }}>
                    <Text variant="titleLarge">{t("2025")}</Text>
                  </View>
                  <View style={{ height: "33.333%", justifyContent: "center" }}>
                    <Text variant="bodyMedium" style={{ fontWeight: "bold" }}>
                      {t("+0,7€")}
                    </Text>
                  </View>
                  <View style={{ height: "33.333%", justifyContent: "center" }}>
                    <Text variant="bodyMedium">{"-50%"}</Text>
                  </View>
                </View>

                <View style={{ height: 20 }} />
              </View>

              {/* <View style={{ height: 20 }} /> */}

              <Divider bold />
            </>
          )}

          {!filtered && (
            <View
              style={{
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  alignContent: "center",
                  marginVertical: "50%",
                  marginHorizontal: "10%",
                }}
              >
                <Text variant="bodyMedium" style={{ textAlign: "center" }}>
                  {t("FLEXnothing")}
                </Text>
                <Button
                  mode="text"
                  onPress={() =>
                    navigation.navigate("FlexFilter", { filter: "last7" })
                  }
                  theme={{ colors: { primary: react_colors.primarygreen } }}
                >
                  {t("FLEXfilter")}
                </Button>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
};

export default React.memo(Flexibility);