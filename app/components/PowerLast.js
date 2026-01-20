import React, { useState, useCallback } from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";

import { styles, react_colors } from "../styles";
import { Card, Title } from "react-native-paper";
import CircularChart from "../components/CircularChart";

import axios from "axios";
import * as Crypto from "expo-crypto";
import env from "../config/env";

const PowerLast = ({ userData, token }) => {
  const [power, setPower] = useState(null);
  const URL_API = env.base_api_url;
  const userId = userData.userId;
  const cpower = userData.cpower;
  const api_key = userData.api_key;

  const [t, i18n] = useTranslation();

  async function loadData() {
    // setPower(null);
    await getLastPower().then((res) => {
      let eotData = null;

      if (res && res.length > 0) {
        if (!Number.isNaN(res[0].value)) {
          let data = res[0];
          let v = data.value !== null ? parseFloat(data.value) : 0;
          let perc = Math.round((v / (cpower * 10)) * 100) / 100;
          eotData = [
            {
              value: v,
              units: data.units,
              title: `${perc} ${t("STATconsump3")} ${cpower} kVA`,
              color: react_colors.interconnect,
              // gradientCenterColor: "#006DFF",
              // percent: perc,
            },
            {
              value: parseFloat(cpower) * 1000 - v,
              units: data.units,
              title: `${perc} ${t("STATconsump3")} ${cpower} kVA`,
              color: react_colors.gainsboro,
            },
          ];
        }
      }
      // console.log("EOT DATA:", eotData);
      setPower(eotData);
    });
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
      let repeater = setInterval(() => {
        loadData();
      }, 60000);

      return () => clearInterval(repeater);
    }, [])
  );

  //get last power consumption
  const getLastPower = async () => {
    let power = null;
    // let uuid = uuidv4();
    const uuid = Crypto.randomUUID();

    let headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Correlation-ID": `${uuid}`,
      Authorization: `Bearer ${token}`,
    };

    try {
      let latest = await axios
        .get(
          `${URL_API}/statistics/power-consumption-last?user_ids=${userId}`,
          {
            headers,
          },
          { timeout: 10000 }
        )
        .then((res) => {
          let json = JSON.parse(JSON.stringify(res.data));
          return json;
        })
        .catch((err) => {
          throw err;
        });

      if (latest) {
        return latest;
      }
    } catch (err) {
      // console.log(err);
      return null;
    }

  };

  return (
    <View>
      <Card>
        <Card.Title title={t("DATAchartAtitle")} />
        <Card.Content>
          {power && <CircularChart data={power} />}
          {!power && (
            <View
              style={{
                height: 300,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text>{t("STATnothingfound2")}</Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

export default React.memo(PowerLast);
