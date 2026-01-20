import React, { useState, useEffect, useRef, useCallback } from "react";
import { react_colors, styles } from "../styles";
import {
  View,
  Text,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Card,
  Button,
  ToggleButton,
  Surface,
  Chip,
  Portal,
  Modal,
} from "react-native-paper";
import dayjs from "dayjs";

import { useFocusEffect } from "@react-navigation/native";

import { LineChart } from "react-native-gifted-charts";

import axios from "axios";
import * as Crypto from "expo-crypto";
import env from "../config/env";

import DateTimePicker from "react-native-ui-datepicker";

const EnerChart = ({ dataSet, cpower, agg, onAgg }) => {
  const [t, i18n] = useTranslation();
  const screenWidth = Dimensions.get("screen").width;
  const [dataEnergy, setDataEnergy] = useState([]);

  const activeProps = useRef(["real", "pred"]);
  useEffect(() => {
    setDataEnergy([]);
    if (dataSet) {
      let filtered = filterAreaData(activeProps.current, dataSet);
      // console.log("Data filtered:", JSON.stringify(filtered));
      setDataEnergy(filtered);
    } else {
      setDataEnergy([]);
    }
  }, [dataSet]);

  const isSelected = (prop) => {
    let statusArr = activeProps.current;
    let ar = [];
    let find = statusArr.indexOf(prop) == -1 ? false : true;
    // console.log(activeProps.current);

    return find;
  };

  const changeProp = (prop) => {
    let statusArr = activeProps.current;
    let ar = [];
    let find = statusArr.indexOf(prop);

    if (find == -1) {
      statusArr.push(prop);
      ar = statusArr;
    } else {
      ar = statusArr.splice(find, 1);
    }

    let filtered = filterAreaData(statusArr, dataSet);
    // console.log(JSON.stringify(filtered));
    setDataEnergy(filtered);
  };

  const filterAreaData = (actives, data) => {
    let newJson = { forecast: [], real: [], maxValue: 0 };
    if (actives.length >= 2) {
      return data;
    }

    for (var at in actives) {
      let ref = actives[at];

      if (ref === "real") {
        newJson.real = data.real;
        continue;
      }
      if (ref === "pred") {
        newJson.forecast = data.forecast;
        continue;
      }
    }

    newJson.maxValue = data.maxValue;

    return newJson;
  };
  const filterData = (actives) => {
    let newJson = [];

    if (actives.length >= 2) {
      return dataSet;
    }

    for (var at in actives) {
      let ref = actives[at];

      for (var a = 0; a < dataSet.length; a++) {
        let item = dataSet[a];
        let obj = item.stacks;
        let sta = null;

        for (var e = 0; e < obj.length; e++) {
          if (item.stacks[e].refs === ref) {
            let oo = item.stacks[e];
            sta = { value: oo.orig || oo.value, color: oo.color };
            break;
          }
        }

        newJson.push({
          stacks: sta ? [sta] : [{ value: 0, color: "#00ff7f" }],
          label: item.label,
          labelTextStyle: item.labelTextStyle,
        });
      }
    }

    return newJson;
  };

  return (
    <>
      {dataEnergy?.real && (
        <View>
          <View style={{ paddingVertical: 30 }}>
            <LineChart
              areaChart
              // curved
              width={screenWidth * 0.8}
              height={200}
              scrollAnimation={false}
              data={
                dataEnergy?.real.length > 0
                  ? dataEnergy?.real
                  : dataEnergy?.forecast || []
              }
              data2={dataEnergy?.forecast || []}
              //TODO: Add data points
              hideDataPoints
              spacing={40}
              color1={
                dataEnergy?.real.length > 0
                  ? react_colors.interconnect
                  : react_colors.black
              }
              color2={react_colors.black}
              startFillColor1={
                dataEnergy?.real.length > 0
                  ? react_colors.interconnect
                  : react_colors.black
              }
              startFillColor2={react_colors.black}
              endFillColor1={react_colors.white}
              endFillColor2={react_colors.black}
              startOpacity={0.9}
              endOpacity={0.2}
              initialSpacing={20}
              maxValue={dataEnergy?.maxValue}
              noOfSections={agg === "hourly" ? dataEnergy?.maxValue : 5}
              stepValue={1}
              yAxisColor="white"
              yAxisThickness={0}
              yAxisLabelWidth={45}
              rulesColor="gray"
              yAxisTextStyle={{ fontSize: 12 }}
              yAxisLabelSuffix="kWh"
              xAxisColor="lightgray"
              xAxisLabelTextStyle={{
                fontSize: 12,
                textAlign: "center",
                marginBottom: -15,
              }}
              labelsExtraHeight={5}
              rotateLabel
              showReferenceLine1={
                agg === "hourly"
                  ? dataEnergy?.maxValue > cpower ||
                    dataEnergy?.maxValue > cpower - 1
                  : false
              }
              referenceLine1Position={cpower} //contracted_pw
              referenceLine1Config={
                agg === "hourly"
                  ? {
                      color: "black",
                      dashWidth: 2,
                      dashGap: 3,
                      labelText: `${cpower} kVA`,
                      type: "solid", //solid, dash
                      labelTextStyle: {
                        fontWeight: "700",
                        left: screenWidth * 0.6,
                        top: -20,
                      },
                    }
                  : {}
              }
            />
          </View>
          <View style={{ ...styles.row_container, marginTop: 24 }}>
            <ToggleButton.Row
              value={agg}
              onValueChange={(value) => onAgg(value)}
            >
              <ToggleButton
                style={{ width: "50%" }}
                icon={() => <Text>{t("STATcategory1")}</Text>}
                value="hourly"
                disabled={agg === "hourly"}
              />
              <ToggleButton
                style={{ width: "50%" }}
                icon={() => <Text>{t("STATcategory2")}</Text>}
                value="daily"
                disabled={agg === "daily"}
              />
            </ToggleButton.Row>
          </View>
        </View>
      )}
      {dataEnergy.length == 0 && (
        <View
          style={{
            height: 400,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>{t("STATnothingfound")}</Text>
        </View>
      )}
    </>
  );
};

const ModalPicker = ({ date, handlePage, isLoading }) => {
  const [day, setDay] = useState(date);
  const [show, setShow] = useState(false);

  const [t, i18n] = useTranslation();
  // console.log("LANG,", i18n.language);

  const handleShow = (value) => {
    setShow(value);
  };

  let label = date != undefined ? date.format("YYYY-MM-DD") : "Select date...";

  const onChangeDay = (value) => {
    if (value != undefined) {
      let n = dayjs(value).format("YYYY-MM-DD");

      setDay(n);
      setShow(false);
      handlePage(n);
    }
  };

  return (
    <View>
      <Portal>
        <Modal
          visible={show}
          onDismiss={() => handleShow(false)}
          contentContainerStyle={{ backgroundColor: react_colors.snow }}
        >
          <DateTimePicker
            value={day}
            mode={"date"}
            onValueChange={(value) => onChangeDay(value)}
            locale={
              i18n.language.includes("pt")
                ? require("dayjs/locale/pt")
                : require("dayjs/locale/en")
            }
            selectedItemColor={react_colors.goldenrod}
            headerButtonColor={react_colors.goldenrod}
            minimumDate={dayjs("2023-01-01")}
            maximumDate={dayjs().add(1, "day")}
          />
        </Modal>
      </Portal>
      <Button
        color={react_colors.goldenrod}
        mode="contained"
        onPress={() => handleShow(true)}
        disabled={isLoading}
        icon={"calendar"}
        labelStyle={{ color: react_colors.whitesmoke, fontSize: 16 }}
      >
        <Text>{label}</Text>
      </Button>
    </View>
  );
};

const GraphButtons = ({ userData, token }) => {
  const [chart, setChart] = useState("daily");
  const [isLoading, setIsLoading] = useState(false);
  const [t, i18n] = useTranslation();

  const userId = userData.userId;
  const cpower = userData.cpower;

  const [energy, setEnergy] = useState(null);

  const [page, setPage] = useState(dayjs());

  const yLabelStyle = { width: 55, fontSize: 10 };

  const URL_API = env.base_api_url;

  const onPageChange = (value) => {
    if (value != undefined) setPage(dayjs(value));
  };

  async function loadStats() {
    setIsLoading(true);

    await getStatistics(chart, page).then((result) => {
      // console.log("Result:", JSON.stringify(result));
      setEnergy(null);
      if (result) {
        if (result.real.length == 0) {
          setEnergy([]);
        } else {
          setEnergy(result);
        }
      } else {
        setEnergy(null);
      }
    });
    setIsLoading(false);
  }
  useFocusEffect(
    useCallback(() => {
      // setIsLoading(true);
      if (token) {
        loadStats();
      }

      // setIsLoading(false);
    }, [chart, page, token])
  );
  async function handlePage(val) {
    setPage(val);
    await loadStats();
  }
  function encodeQueryData(data) {
    const ret = [];
    for (let d in data)
      ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
    return ret.join("&");
  }
  function pad(n) {
    return n < 10 ? "0" + n : n;
  }
  function sortArr(arr) {
    let r = arr.sort((a, b) => {
      let ant = new Date(a.timestamp);
      let the = new Date(b.timestamp);

      return ant - the;
    });
    return r;
  }
  const onAggregateChange = (agg) => {
    // console.log("Agg:", agg);
    setChart(agg);
  };
  //Data for area chart
  const computeAreasData = async (arr, agg) => {
    let real = sortArr(arr.real);
    // console.log("Sorted:", real);
    let dataSet = { real: [], maxValue: 0 };

    if (real && real.length > 0) {
      let max = 0;
      let aux = 0;
      for (let a = 0; a < real.length; a++) {
        let uni = real[a]?.units || "kWh";
        let f = real[a]?.energy ? Number(real[a].energy.toFixed(2)) : 0;
        f = f > 0 ? f : 0;
        let r = real[a]?.energy ? Number(real[a].energy.toFixed(2)) : 0;
        r = r > 0 ? r : 0;
        max = f;
        if (max > aux) aux = max;
        let t = real[a]?.timestamp ? real[a].timestamp.slice(11, 16) : 0;
        let t2 = real[a]?.timestamp ? real[a].timestamp.slice(5, 10) : 0;

        dataSet.maxValue = 1 + Math.ceil(aux);

        dataSet.real.push({
          value: r,
          label: agg === "hourly" ? t : t2,
          units: uni,
        });
      }
    }
    return dataSet;
  };
  //Data for stacked bar chart
  const computeData = async (arr) => {
    let forecast = sortArr(arr.forecast);
    let real = sortArr(arr.real);
    let dataSet = [];

    if (forecast.length > 0) {
      for (let a = 0; a < forecast.length; a++) {
        let stack_obj = { stacks: [], label: "", labelTextStyle: yLabelStyle };

        let uni = real[a]?.units || "kWH";
        let f = forecast[a]?.energy
          ? Number(forecast[a].energy.toFixed(2))
          : null;
        let r = real[a]?.energy ? Number(real[a].energy.toFixed(2)) : null;
        let t1 = forecast[a]?.timestamp
          ? forecast[a].timestamp.slice(11, 16)
          : null;
        let t2 = real[a]?.timestamp ? real[a].timestamp.slice(11, 16) : null;
        let dif = 0;

        if (f != null) {
          stack_obj.label = t1;
        }

        if (r == null) {
          stack_obj.stacks = [
            {
              value: f,
              color: "#4169e1",
              refs: "pred",
            },
          ];
          dataSet.push(stack_obj);

          continue;
        }
        if (f >= r) {
          dif = (f - r).toFixed(2);
          stack_obj.stacks = [
            { value: r, color: "#00ff7fbb", refs: "real" },
            {
              value: dif,
              orig: f,
              color: "#4169e1",
              refs: "pred",
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
            },
          ];
        } else {
          dif = (r - f).toFixed(2);
          stack_obj.stacks = [
            {
              value: f,
              color: "#4169e1bb",
              refs: "pred",
            },
            {
              value: dif,
              orig: r,
              color: "#00ff1f",
              refs: "real",
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
            },
          ];
        }

        dataSet.push(stack_obj);
      }
    }
    // console.log(JSON.stringify(dataSet));

    return dataSet;
  };
  const computeInterval = (filter) => {
    // let now = new Date(2022, 2, 25, 0, 0, 0);
    let now = new Date();

    let init = new Date(
      now.getFullYear(),
      pad(now.getMonth()),
      pad(now.getDate()),
      now.getHours(),
      now.getMinutes(),
      0
    ).getTime();
    let offit = init;

    switch (filter) {
      case "hourly":
        offit = new Date(init - 1 * 24 * 60 * 60 * 1000); //last day
        break;

      case "daily":
        offit = new Date(init - 7 * 24 * 60 * 60 * 1000); //last week
        break;

      case "weekly":
        offit = new Date(init - 30 * 24 * 60 * 60 * 1000); //last month
        break;

      default:
        offit = new Date(init - 1 * 24 * 60 * 60 * 1000);
        break;
    }

    let period = {
      time_interval: filter,
      end_timestamp: now.toISOString(),
      start_timestamp: offit.toISOString(),
    };

    // console.log(period);
    return encodeQueryData(period);

    // https://www.geeksforgeeks.org/how-to-create-query-parameters-in-javascript/
    // encodeURIComponent()
  };

  const getStatistics = async (per, date) => {
    // let uuid = uuidv4();
    const uuid = Crypto.randomUUID();

    let start = null;
    let end = null;

    let headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Correlation-ID": `${uuid}`,
      Authorization: `Bearer ${token}`,
    };

    // let period = computeInterval(intv);
    let today = date != undefined ? date : dayjs();
    // TODO: end date related to aggregate option
    if (per === "hourly") {
      start = today
        .hour(22)
        .minute(0)
        .second(0)
        .subtract(1, "day")
        .format("YYYY-MM-DDTHH:mm:ss[Z]");
      end = today
        .hour(23)
        .minute(59)
        .second(0)
        .format("YYYY-MM-DDTHH:mm:ss[Z]");
    } else {
      start = today
        .hour(0)
        .minute(0)
        .second(0)
        .subtract(1, "month")
        .format("YYYY-MM-DDTHH:mm:ss[Z]");
      end = today
        .hour(23)
        .minute(59)
        .second(0)
        .format("YYYY-MM-DDTHH:mm:ss[Z]");
    }

    let day = [];
    try {
      let dataRes = await axios
        .get(
          `${URL_API}/statistics/power-consumed-real?user_id=${userId}&start_date=${start}&end_date=${end}&group_by=${per}`,
          {
            headers,
          },
          { timeout: 10000 }
        )
        .catch((err) => {
          throw err;
        });

      day = await computeAreasData(dataRes.data[0], per);

      // day = computeData(dataRes.data[0]);
      return day;
      //TODO:agregate by time interval
    } catch (err) {
      // console.log(err);
      // err.response
      //   ? console.log(
      //       "Failed to get statistics. Response: ",
      //       JSON.stringify(err.response.status)
      //     )
      //   : err.request
      //   ? console.log(
      //       "Failed to get statistics. Request: ",
      //       JSON.stringify(err.request)
      //     )
      //   : console.log("Failed to get statistics.", err);

      return null;
    }
    return day;
  };

  return (
    <Card
      style={{
        alignSelf: "center",
        // flex: 1,
        width: "97%",
        padding: 0,
        // backgroundColor: react_colors.chartreuse,
      }}
    >
      <Card.Title title={t("DATAchartBtitle")} />
      <Card.Content>
        <View
          style={{
            marginTop: 4,
            marginBottom: 4,
            alignSelf: "center",
          }}
        >
          <Chip
            selectedColor={react_colors.dimgray}
            mode="flat"
            style={{
              width: "80%",
            }}
          >
            <Text>{`${t("REGISTERpower")}: ${cpower} kVA`}</Text>
          </Chip>
        </View>
        {energy && (
          <EnerChart
            cpower={cpower}
            dataSet={energy}
            agg={chart}
            onAgg={onAggregateChange}
          />
        )}
        <>
          {energy == null && (
            <View
              style={{
                height: 400,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text>{t("DETAILSloading")}</Text>
            </View>
          )}
          <ModalPicker
            date={page}
            handlePage={(value) => onPageChange(value)}
            isLoading={isLoading}
          />
        </>
      </Card.Content>
    </Card>
  );
};

export default React.memo(GraphButtons);
