import React, { useContext, useCallback, useState } from "react";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { react_colors, styles } from "../styles";
import { Text, View, Dimensions, ScrollView, SafeAreaView } from "react-native";
import { GlobalContext } from "../context/Provider";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Crypto from "expo-crypto";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { Chip } from "react-native-paper";
import { BarChart } from "react-native-gifted-charts";
import env from "../config/env";

const PricesChart = ({ dataArr }) => {
  const [en_width, setEn_width] = useState(0);

  return (
    <View
      style={{
        alignSelf: "center",
        width: "98%",
      }}
      onLayout={(event) => {
        var { x, y, width, height } = event.nativeEvent.layout;
        setEn_width(width);
      }}
    >
      <BarChart
        width={Dimensions.get("screen").width}
        height={Dimensions.get("screen").height / 2}
        spacing={50}
        initialSpacing={Dimensions.get("screen").width * 0.13}
        // horizontal
        // yAxisAtTop
        // intactTopLabel
        minValue={0}
        maxValue={24}
        noOfSections={8}
        stepValue={3}
        yAxisLabelSuffix={":00"}
        yAxisLabelWidth={Dimensions.get("screen").width * 0.15}
        xAxisLabelTextStyle={{
          fontSize: 12,
          textAlign: "center",
          marginBottom: -8,
          marginLeft: -25,
        }}
        xAxisTextNumberOfLines={2}
        labelsExtraHeight={35}
        barMarginBottom={5}
        labelWidth={65}
        // rotateLabel
        // yAxisLabelTexts={["24", "18", "12", "6", "0"]}
        xAxisColor={"gray"}
        yAxisThickness={0}
        xAxisThickness={0}
        stackData={dataArr}
      />
    </View>
  );
};

// ecra 2
export const PricesHeat = ({ tab }) => {
  const [board, setBoardPrices] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserID] = useState(null);
  const [auth, setAuth] = useState(null);

  const {
    authDispatch,
    authState: { data, userToken },
  } = useContext(GlobalContext);

  const [legend, setLegend] = useState(null);
  const [t, i18n] = useTranslation();

  const URL_API = env.base_api_url;
  //TODO: refactor and remove AsyncStorage
  useFocusEffect(
    useCallback(() => {
      async function getData() {
        setIsLoading(true);

        await getStorage()
          .then((res) => {
            const { id, token } = res;
            // let userData = JSON.parse(prefs);
            // const { contracted_power } = userData;
            getPrices(token);

            setIsLoading(false);
          })
          .catch((err) => {
            console.log("Error loading prefs.", err);
            setIsLoading(false);
          });
      }

      if (tab == 1) {
        getData();
      }
    }, [tab])
  );

  const getStorage = async () => {
    try {
      let id = await AsyncStorage.getItem("@userId");
      if (id) {
        setUserID(id);
      }

      let token = await AsyncStorage.getItem("@token");
      if (token) {
        setAuth(token);
      }
      // console.log(token);
      // setAuth(token);
      return { id, token };
    } catch (e) {
      console.log("No stored prefs:\n " + e);
    }
  };

  const makeBar = (arrPrices, colorsSt) => {
    let size = 1;
    let height = 0;
    let t = 1;
    let p = 0;
    let prices = [];
    let bar_stack = [];
    let obj_color = {};
    let tariff = "";
    let tone = "";

    if (arrPrices.length > 0) {
      prices = arrPrices[0].prices;
      size = prices.length;
      tariff = arrPrices[0].tarif_type.toLowerCase();
      //sort prices by date
      let s_prices = prices.sort((a, b) => {
        let ant = new Date(a.timestamp);
        let the = new Date(b.timestamp);
        // return the - ant; //desc
        return ant - the; //asc
      });
      let stop = s_prices.length;

      obj_color =
        tariff === "tri-hourly"
          ? colorsSt.multi
          : tariff === "bi-hourly"
          ? colorsSt.bihour
          : [];

      //count price_type to make bar height
      for (let a = 0; a < stop; a++) {
        p = s_prices[a].price_type;

        // get colors
        if (typeof obj_color === "object" && obj_color.length > 0) {
          tone = obj_color.filter((it) => it.price === p);
        }
        height++;

        let st_obj = {
          value: ((24 / size) * height).toFixed(2),
          color: tone[0].color || react_colors.white,
          price: p,
          marginBottom: 2,
        };

        if (a === stop - 1 && height > 0) {
          bar_stack.push(st_obj);
          continue;
        }
        if (p !== t) {
          // get colors
          if (typeof obj_color === "object" && obj_color.length > 0) {
            tone = obj_color.filter((it) => it.price === t);
          }
          bar_stack.push({
            value: ((24 / size) * height).toFixed(2),
            color: tone[0].color || react_colors.white,
            price: t,
            marginBottom: 2,
          });

          t = p;
          height = 0;
        }
      }
      // console.log("final state", JSON.stringify(bar_stack));
    }

    return bar_stack;
  };

  const computeTarifs = (arr, colors) => {
    let stackArr = [];

    let multi = arr.filter((item) => {
      return item.tarif_type.toLowerCase() === "tri-hourly";
    });
    // console.log(JSON.stringify(multi));

    let bihour = arr.filter((item) => {
      return item.tarif_type.toLowerCase() === "bi-hourly";
    });
    let simple = arr.filter((item) => {
      return item.tarif_type.toLowerCase() === "simple";
    });

    //make stacks for graph
    if (simple.length > 0) {
      stackArr.push({
        label: t("DPtarifOp1"),
        stacks: [
          {
            value: 24,
            color: colors.simple.color,
          },
        ],
      });
    }

    let bihourbar = makeBar(bihour, colors);
    stackArr.push({ label: t("DPtarifOp2"), stacks: bihourbar });

    let trihourbar = makeBar(multi, colors);
    stackArr.push({ label: t("DPtarifOp3"), stacks: trihourbar });
    // console.log(JSON.stringify(trihourbar));
    return stackArr;
  };

  const processResponse = (arr) => {
    //serve as legend
    let tarifHeat = {
      multi: [
        {
          id: 0,
          color: react_colors.lemonchiffon,
          price: 1,
          label: t("PHEATempty"),
        },
        {
          id: 1,
          color: react_colors.interconnect,
          price: 2,
          label: t("PHEATfull"),
        },
        {
          id: 2,
          color: react_colors.black,
          price: 3,
          label: t("PHEATtip"),
        },
      ],
      bihour: [
        {
          id: 0,
          color: react_colors.lemonchiffon,
          price: 1,
          label: t("PHEATempty"),
        },
        {
          id: 1,
          color: react_colors.black,
          price: 2,
          label: t("PHEATtip"),
        },
      ],
      simple: {
        id: 0,
        color: react_colors.silver,
        price: 1,
      },
    };

    //compute prices
    let tarifs = computeTarifs(arr, tarifHeat);
    setLegend(tarifHeat);

    return tarifs;
  };

  const getPrices = async (token) => {
    // let uuid = uuidv4();
    const uuid = Crypto.randomUUID();

    // console.log("generating this uuid: " + uuid);
    let headers = {
      "Content-Type": "application/json",
      // Accept: "application/json",
      "X-Correlation-ID": `${uuid}`,
      Authorization: `Bearer ${token}`,
    };
    // let cpower = cp.split(" ")[0];

    let todayI = moment()
      // .utc()
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .toISOString();
    let todayF = moment()
      // .utc()
      .hours(23)
      .minutes(59)
      .seconds(59)
      .milliseconds(0)
      // .add(1, "days")
      .toISOString();

    let tri = `${URL_API}/energy-prices/tariff-periods-erse?start_timestamp=${todayI}&end_timestamp=${todayF}&tariff_type=tri-hourly-daily`;
    let bi = `${URL_API}/energy-prices/tariff-periods-erse?start_timestamp=${todayI}&end_timestamp=${todayF}&tariff_type=bi-hourly-daily`;
    let simple = `${URL_API}/energy-prices/tariff-periods-erse?start_timestamp=${todayI}&end_timestamp=${todayF}&tariff_type=simple`;

    const multi = axios.get(tri, {
      headers,
    });
    const dual = axios.get(bi, {
      headers,
    });
    const def = axios.get(simple, {
      headers,
    });
    Promise.all([def, dual, multi])
      .then((res) => {
        // console.log(JSON.stringify(res[0].request.responseURL));
        let allTarifs = [];

        allTarifs.push(
          { prices: res[0].data.tariffs, tarif_type: "simple" },
          { prices: res[1].data.tariffs, tarif_type: "bi-hourly" },
          { prices: res[2].data.tariffs, tarif_type: "tri-hourly" }
        );

        if (allTarifs[0].prices.length > 0) {
          let heats = processResponse(allTarifs);
          // console.log(JSON.stringify(heats));

          //store data
          setBoardPrices(heats);
          return heats;
        }
      })
      .catch((err) => {
        if (err.response) {
          // console.log("Error obtaining tarifs. ", err.response.status);
          if (400 < err.response.status < 500) {
            setTimeout(() => {
              // logoutUser()(authDispatch);
            }, 1000);
          }
        } else {
          console.log("Error obtaining tarifs. ", err); //err.request
        }

        setBoardPrices(null);
        setLegend(null);
        // setIsLoading(false);
        return null;
      });
  };

  return (
    <ScrollView>
      {board == null && (
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
      {board && <PricesChart dataArr={board} />}
      {legend && (
        <>
          <View
            style={{
              ...styles.view_container,
              width: "98%",
              paddingVertical: 5,
              alignSelf: "center",
              justifyContent: "flex-start",
              // alignItems: "center",
              // backgroundColor: react_colors.lightcoral,
            }}
          >
            <View style={styles.row_container}>
              {legend.multi.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      width: "33%",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 15,
                        height: 15,
                        backgroundColor: item.color,
                        marginLeft: 5,
                        marginRight: 5,
                      }}
                    ></View>
                    <Text
                      style={{ textAlign: "center" }}
                    >{`${item.label}`}</Text>
                  </View>
                );
              })}
            </View>
          </View>
          <View
            style={{
              // marginTop: 5,
              flex: 1,
              justifyContent: "center",
            }}
          >
            <Chip
              selectedColor={react_colors.dimgray}
              mode="flat"
              ellipsizeMode="head"
              style={{
                width: "95%",
                paddingLeft: 5,
                backgroundColor: react_colors.white,
              }}
            >
              <Text>{t("PHEATdiscl")}</Text>
            </Chip>
          </View>
          <View style={{ height: 20 }}></View>
        </>
      )}
    </ScrollView>
  );
};
