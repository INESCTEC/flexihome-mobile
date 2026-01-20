import React, { useState, useEffect } from "react";
import { Text, View, Platform, Linking } from "react-native";
import { useTranslation } from "react-i18next";
import * as Application from "expo-application";
import VersionCheck from "react-native-version-check-expo";
import { Button } from "react-native-paper";
import axios from "axios";
import * as Crypto from "expo-crypto";

export default ({ navigation }) => {
  const [t, i18n] = useTranslation();
  const [appInstallTime, setAppInstallTime] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const app_native_version = Application.nativeBuildVersion; // "1.0.7";
  // Application.nativeApplicationVersion; // "1.0.7";

  const useAppVersion = () => {
    const [installVersion, setInstallVersion] = useState(null);
    // const [buildVersion, setBuildVersion] = useState(null);
    const [needUpdate, setNeedUpdate] = useState(false);

    useEffect(() => {
      //if device is ios
      const getAppleStoreBuildNr = async () => {
        //   let storeUrl = await VersionCheck.getAppStoreUrl({
        //     appID: "1609106145",
        //     ignoreErrors: true,
        //   }).then((url) => {
        //     if (url) {
        //       return url;
        //     }
        //   });
        //   console.log("STORE URL:", storeUrl);
        let currentVersion = await VersionCheck.getCurrentVersion(); //ios installed version
        // let currentBuildNr = await VersionCheck.getCurrentBuildNumber() //ios installed build nr
        let buildNr = await VersionCheck.getLatestVersion({
          provider: "appStore", // for iOS
        }).then((latestVersion) => {
          if (latestVersion) {
            // console.log("IOS latest version", latestVersion);
            return latestVersion;
          }
          return false;
        });

        // console.log(buildNr.includes(currentVersion));
        buildNr = buildNr ? !buildNr.includes(currentVersion) : false;

        return buildNr;
      };
      //if device is android
      const getPlayStoreBuildNr = async () => {
        // let currentVersion = await VersionCheck.getCurrentVersion(); //android installed version
        let currentBuildNr = await VersionCheck.getCurrentBuildNumber(); //android installed build nr
        const supported = await Linking.canOpenURL(
          "market://details?id=pt.inesctec.interconnect.hems"
        );
      };
      //TODO: FAZER APK E TESTAR
      if (Platform.OS === "android") {
        getPlayStoreBuildNr().then((res) => {
          // console.log("STORE BUILD NR:", res);
          if (res) {
            setNeedUpdate(res);
          }
          return null;
        });
      }

      if (Platform.OS === "ios") {
        getAppleStoreBuildNr().then((res) => {
          // console.log("STORE BUILD NR:", res);
          if (res) {
            setNeedUpdate(res);
          }
          return null;
        });
      }
    }, []);

    return needUpdate;
  };
  const need_update = useAppVersion();

  // useEffect(() => {
  //   async function getLastInstallTime() {
  //     // await Application.getInstallationTimeAsync()
  //     //   .then((time) => {
  //     //     if (time) {
  //     //       setAppInstallTime(time);
  //     //     }
  //     //   })
  //     //   .catch((err) => {
  //     //     console.log(err);
  //     //   });

  //     await Application.getLastUpdateTimeAsync()
  //       .then((time) => {
  //         if (time) {
  //           setLastUpdated(time);
  //         }
  //       })
  //       .catch((err) => {
  //         console.log("NO INSTALLATION DATE.", err);
  //       });
  //   }

  //   getLastInstallTime();
  // }, []);

  return (
    <View
      style={{
        width: "90%",
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 22,
      }}
    >
      <Text style={{ textAlign: "justify", fontSize: 16 }}>
        {`Local buid nr: ${app_native_version}`}
      </Text>
      <Text style={{ textAlign: "justify", fontSize: 16 }}>
        {`Need update: ${need_update}`}
      </Text>
      {appInstallTime && (
        <Text style={{ textAlign: "justify", fontSize: 14 }}>
          {`Install time: ${appInstallTime}`}
        </Text>
      )}
      {lastUpdated && (
        <Text style={{ textAlign: "justify", fontSize: 14 }}>
          {`Last updated: ${lastUpdated}`}
        </Text>
      )}
      <Button
        onPress={() => {
          if (Platform.OS === "android") {
            Linking.openURL(
              // "market://details?id=pt.inesctec.interconnect.hems"
              "https://play.google.com/store/apps/details?id=pt.inesctec.interconnect.hems"
            );
          }
          if (Platform.OS === "ios") {
            Linking.openURL("itms-apps://apps.apple.com/PT/app/id1609106145");
          }
        }}
        mode="text"
        color="#daa520"
      >
        {t("HOMEupdateAppBtn")}
      </Button>
      {/* <Button onPress={() => navigation.goBack()} title={t("HELPdismissBtn")} /> */}
    </View>
  );
};
