import React, { useContext, useEffect, useState } from "react";
import { react_colors, styles } from "../styles";
import {
  View,
  Text,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { GlobalContext } from "../context/Provider";
import { Chip } from "react-native-paper";
import axios from "axios";
import * as Crypto from "expo-crypto";
import moment from "moment";
import { useTranslation } from "react-i18next";
import env from "../config/env";
import { BarChart } from "react-native-gifted-charts";

export const Carbon = ({ tab }) => {
  const [carb, setCarb] = useState(null);
  const [t, i18n] = useTranslation();
  const [isChip, setChip] = useState(true);

  const screenWidth = Dimensions.get("screen").width;
  const URL_API = env.base_api_url;

  const {
    authDispatch,
    authState: { data, userToken },
  } = useContext(GlobalContext);

  useEffect(() => {
    async function getData() {
      await getCarbon().then((res) => {
        // console.log("INTENSITY:", JSON.stringify(res));
        if (res) {
          setCarb(res);
        } else {
          setCarb(null);
        }
      });
    }

    if (tab == 2) {
      getData();
    }
  }, [tab]);

  const sortCarbon = (obj) => {
    let dataSet = { data: [], maxValue: 0, receivedAt: null };
    let sorted = [];
    let max = 0;
    let predictedDate = null;

    if (obj && obj.length > 0) {
      // sort by datetime prop date ascending
      sorted = obj.sort((a, b) => {
        return new Date(a.datetime) - new Date(b.datetime);
      });

      for (let item of sorted) {
        max = item.value > max ? Math.ceil(item.value) : max;
        predictedDate = item.datetime.slice(0, 10);
        dataSet.data.push({
          value: Number(item.value.toFixed(2)) || null,
          label: item.datetime.slice(11, 16),
          labelTextStyle: { fontSize: 12 },
        });
      }
      dataSet.maxValue = max;
      dataSet.receivedAt = predictedDate;
    }
    return dataSet;
  };

  const getCarbon = async () => {
    let result = [];
    // let uuid = uuidv4();
    const uuid = Crypto.randomUUID();

    let headers = {
      "Content-Type": "application/json",
      // Accept: "application/json",
      "X-Correlation-ID": `${uuid}`,
      Authorization: `Bearer ${userToken}`,
    };

    let start = moment()
      .utc()
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .add(1, "days")
      .toISOString();

    let qp = {
      start_date: start,
    };

    let params = `forecast_day=${qp.start_date}`;
    try {
      let intensity = await axios
        .get(`${URL_API}/statistics/ecosignal-forecast?${params}`, { headers })
        .then((res) => {
          if (res && res.data.length > 0) {
            result = sortCarbon(res.data);
            // console.log("INTENSITY:", JSON.stringify(result));
          } else {
            result = null;
          }

          return result;
        })
        .catch((err) => {
          throw err;
        });

      return intensity;
    } catch (err) {
      // err.response
      //   ? console.log(
      //       "Failed to get carbon intensity. Response: ",
      //       JSON.stringify(err.response.status)
      //     )
      //   : err.request
      //   ? console.log(
      //       "Failed to get carbon intensity. Request: ",
      //       JSON.stringify(err.request)
      //     )
      //   : console.log("Failed to get carbon intensity.", err);

      return null;
    }
  };

  return (
    <View
      style={{
        marginTop: 25,
        width: "97%",
        alignSelf: "center",
      }}
    >
      {carb && (
        <>
          <View
            style={{
              marginVertical: 10,
            }}
          >
            <Text>{"gCO₂/kWh *"}</Text>
            <BarChart
              width={screenWidth * 0.85}
              height={250}
              spacing={2}
              initialSpacing={10}
              minValue={0}
              maxValue={carb?.maxValue}
              noOfSections={5}
              stepValue={Math.round(carb?.maxValue / 5)}
              barWidth={20}
              leftShiftForLastIndexTooltip={15}
              leftShiftForTooltip={15}
              // backgroundColor={react_colors.gainsboro}
              frontColor={react_colors.dimgray}
              // hideYAxisText
              // yAxisLabelSuffix={"gCO₂/kWh"}
              labelWidth={50}
              barBorderRadius={4}
              yAxisThickness={0}
              xAxisThickness={0}
              // yAxisLabelContainerStyle={{
              //   maxWidth: 35,
              //   backgroundColor: "#23ad88",
              // }}
              yAxisLabelWidth={45}
              // showYAxisIndices
              // yAxisIndicesWidth={0.5}
              // yAxisIndicesHeight={1}
              // showFractionalValues
              // rulesType={"dashed"}
              labelsExtraHeight={35}
              yAxisTextStyle={{ fontSize: 12 }}
              rotateLabel
              data={carb?.data}
              isAnimated={true}
              rulesLength={screenWidth * 0.8}
              rulesColor={react_colors.dimgray}
              renderTooltip={(item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      ...styles.view_container,
                      backgroundColor: "#000",
                      borderRadius: 4,
                      width: "auto",
                      padding: 5,
                      marginBottom: 40,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 12 }}>
                      {item.value}
                    </Text>
                  </View>
                );
              }}
            />
          </View>
          {carb.receivedAt && (
            <View style={{ width: "100%", justifyContent: "center" }}>
              <Text style={{ fontSize: 12, color: react_colors.dimgray }}>
                {`${t("STATcarboninfo")} ${carb.receivedAt}`}
              </Text>

              {isChip && (
                <View
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    alignSelf: "center",
                  }}
                >
                  <Chip
                    style={{
                      width: "80%",
                      alignSelf: "center",
                    }}
                    textStyle={{ color: react_colors.dimgray }}
                    mode="outlined"
                    ellipsizeMode="tail"
                    onClose={() => {
                      setChip(false);
                    }}
                  >
                    {t("STATsideScroll")}
                  </Chip>
                </View>
              )}
            </View>
          )}
        </>
      )}
      {!carb && (
        <View
          style={{
            height: 300,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 16, color: react_colors.dimgray }}>
            {t("STATnothingfound2")}
          </Text>
        </View>
      )}
    </View>
  );
};
