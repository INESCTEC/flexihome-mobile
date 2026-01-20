import React from "react";
import { useTranslation } from "react-i18next";

import { View, Text, SafeAreaView, TouchableOpacity, TouchableHighlight, Image, Linking} from "react-native";
import { styles, react_colors } from "../../styles";

import { MaterialIcons } from "@expo/vector-icons";

// import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function AppInfo({ navigation }) {

    const [t, i18n] = useTranslation();
    const finLang = i18n.language.includes("pt") ? "pt" : "en";
    
    const handleUrlPress = (url) => {
        // open url in browser
        Linking.openURL(url);
    };

    return (
      <SafeAreaView
        style={[styles.container, {alignContent: "flex-start", backgroundColor: react_colors.antiflashwhite }]}
      >
        <View
          style={{
            height: "90%",
            width: "90%",
            marginVertical: "5%",
            marginLeft: "5%",
            backgroundColor: react_colors.white,
            borderRadius: 10,
          }}
        >
          <View style={{ alignItems: "flex-end" }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ padding: 10 }}
            >
              <Text
                style={{
                  fontSize: 24,
                  color: react_colors.black,
                  fontWeight: "bold",
                }}
              >
                {"X"}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.view_container,
              {
                justifyContent: "flex-start",
              },
            ]}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: react_colors.primarygreen,
                textAlign: "center",
                marginTop: 10,
                marginBottom: 20,
              }}
            >
              {t("APPINFOtitle")}
            </Text>
            
            <TouchableOpacity
              style={{
                width: "90%",
                height: 80,
                padding: 6,
                backgroundColor: react_colors.white,
                elevation: 9,
                shadowColor: react_colors.black,
                marginBottom: 30,
              }}
              onPress={() => {
                // navigation.navigate("Privacy", {});
                handleUrlPress(`https://hedge-iot-hems-dev.inesctec.pt/privacy-policy/#${finLang}`);
              }}
            >
              <View
                style={[
                  styles.row_container,
                  {
                    justifyContent: "flex-start",
                    alignItems: "center",
                    padding: 6,
                    // marginHorizontal: 10,
                    // marginVertical: 10,
                  },
                ]}
              >
                <View style={{ height: 50, alignItems: "center", justifyContent: "center", marginHorizontal: 10 }}>
                  <MaterialIcons name="policy" size={32} color="black" />
                </View>
                <View style={{ height: 50, alignItems: "center", justifyContent: "center", }}>
                  <Text style={{ fontSize: 22, fontStyle: "italic" }}>
                    {t("APPINFObutton1")}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={{height: 10}}></View>
           
           <TouchableOpacity
              style={{
                width: "90%",
                height: 80,
                padding: 6,
                backgroundColor: react_colors.white,
                elevation: 9,
                shadowColor: react_colors.black,
                marginBottom: 30,
              }}
              onPress={() => {
                handleUrlPress("https://hedgeiot.eu/");
              }}
            >
              <View
                style={[
                  styles.row_container,
                  {
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    padding: 6,
                    // marginHorizontal: 10,
                    // marginVertical: 10,
                  },
                ]}
              >
                <Image
                  source={require("../../assets/icon.png")}
                  style={{ width: 50, height: 50, marginHorizontal: 10 }}
                  resizeMode="contain"
                />
                <View style={{ height: 50, alignItems: "center", justifyContent: "center", }}>
                  <Text style={{ fontSize: 22, fontStyle: "italic" }}>
                    {t("APPINFObutton2")}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
           
          </View>
        </View>
      </SafeAreaView>
    );
}