import React, { useEffect, useContext, useState, useCallback } from "react";
import { styles, react_colors } from "../styles";
import {
  View,
  FlatList,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { GlobalContext } from "../context/Provider";
import axios from "axios";
import * as Crypto from "expo-crypto";
import { SwitchComp } from "../components/SwitchComp";
import {
  Text,
  Card,
  Button,
  Divider,
  Dialog,
  Portal,
  ActivityIndicator,
  IconButton,
  Chip,
  TextInput,
} from "react-native-paper";
import { useTranslation } from "react-i18next";
// import { AirConditioner } from "../components/schedulers/AirConditioner";
// import { EWH } from "../components/schedulers/EWH";
// import { WashingMachine } from "../components/schedulers/WashingMachine";
// import EVChargerComp from "../components/schedulers/EVChargerComp";
// import { Emeter } from "../components/schedulers/EnergyMeter";
// import Toast from "react-native-root-toast";
import env from "../config/env";

// import { SwitchComp } from "../components/SwitchComp";
import { Popable } from "react-native-popable";
import { Foundation, AntDesign} from "@expo/vector-icons";
import { InterBackground } from "../components/InterBackground";

const TemperatureModal = ({ title, value, onValueChange, onClose }) => {
  const [isDialog, setDialog] = React.useState(false);
  const [t, i18n] = useTranslation();
  const toggleDialog = (prev) => setDialog(prev);

  return (
    <TouchableOpacity
      onPress={() => toggleDialog(!isDialog)}
      style={[
        styles.card,
        {
          justifyContent: "center",
          alignItems: "center",
        },
        {
          paddingHorizontal: 4,
          width: "12%",
          borderRadius: 8,
          height: 25,
          backgroundColor: react_colors.tiffanyblue,
        },
      ]}
    >
      <Text variant="labelMedium" style={{ color: react_colors.black }}>
        {`${value}`}
      </Text>
      <Portal>
        <Dialog visible={isDialog} onDismiss={() => toggleDialog(!isDialog)}>
          {/* <Dialog.Content style={{position: "absolute", right: 30, top: 50, width: "50%", backgroundColor: react_colors.white}}> */}
          <Dialog.Content>
            <View style={{alignItems: "center"}}>
            <Text variant="titleSmall">{title}</Text>
            <TextInput
              mode="outlined"
              value={value.toString()}
              type="number"
              // placeholder="1-100"
              // onChangeText={onValueChange}
              activeUnderlineColor={react_colors.primarygreen}
              keyboardType="numeric"
              style={[styles.input, { marginTop: 12, width: "70%", textAlign: "center" }]}
              theme={{ colors: { primary: react_colors.black } }}
              right={<TextInput.Icon icon="plus" onPress={() => onValueChange(value + 1)} />}
              left={<TextInput.Icon icon="minus" onPress={() => onValueChange(value - 1)} />}
              editable={false}
            /></View>
          </Dialog.Content>
          <Divider></Divider>
          <Dialog.Actions>
            <Button
              mode="text"
              onPress={() => {
                onClose();
                toggleDialog(!isDialog);
              }}
              theme={{ colors: { primary: react_colors.primarygreen } }}
            >
              {t("Modalok")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </TouchableOpacity>
  );
};

// TODO: import picker lib
const TimePickerModal = ({ title, value, onValueChange }) => {
  const [isDialog, setDialog] = React.useState(false);
  const [t, i18n] = useTranslation();
  const toggleDialog = (prev) => setDialog(prev);
  return (
    <TouchableOpacity
      onPress={() => toggleDialog(!isDialog)}
      style={[
        styles.card,
        {
          justifyContent: "center",
          alignItems: "center",
        },
        {
          paddingHorizontal: 1,
          width: "13%",
          borderRadius: 8,
          height: 25,
          backgroundColor: react_colors.tiffanyblue,
        },
      ]}
    >
      <Text variant="labelMedium" style={{ color: react_colors.black }}>
        {`${value}`}
      </Text>
      <Portal>
        <Dialog visible={isDialog} onDismiss={() => toggleDialog(!isDialog)}>
          <Dialog.Content>
            <View style={{ alignItems: "center" }}>
              <Text variant="titleSmall">{title}</Text>
            </View>
          </Dialog.Content>
          <Divider></Divider>
        </Dialog>
      </Portal>
    </TouchableOpacity>
  );};

const HeatPumpComp = ({section, data, onChange}) => {
  const [t, i18n] = useTranslation();

  const [desired_temperature, setDesiredTemperature] = useState(data.desired_leaving_water_temperature);
  const [min_temperature, setMinTemperature] = useState(data.minimum_leaving_water_temperature);

  const updateDesiredTemperature = (value) => {
    if (0 <= value && value <= 100) {
      setDesiredTemperature(parseInt(value));
      // console.log("New desired temperature: ", value);
    }
  };

  const updateMinTemperature = (value) => {
    if (0 <= value && value <= 100) {
      setMinTemperature(parseInt(value));
      // console.log("New min temperature: ", value);
    }
  };

  // TODO: call onChange when modal is closed
  // onChange({
  //   desired_leaving_water_temperature: desired_temperature,
  //   minimum_leaving_water_temperature: min_temperature,
  // });

  return (
    <>
      {section === "A" && (
        <>
          <View
            style={[
              styles.row_container,
              {
                width: "100%",
                height: 30,
                alignItems: "center",
                justifyContent: "space-between",
                alignContent: "center",
                backgroundColor: react_colors.tiffanyblue,
                borderRadius: 8,
                paddingHorizontal: 6,
              },
            ]}
          >
            <Text variant="bodySmall" style={{ color: react_colors.white }}>
              {t("Operation mode")}
            </Text>

            <View
              style={[
                {
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "flex-end",
                },
                {
                  width: "25%",
                  backgroundColor: react_colors.white,
                  borderRadius: 8,
                  height: 25,
                },
              ]}
            >
              <Text
                variant="labelSmall"
                style={{
                  color: react_colors.black,

                  verticalAlign: "middle",
                }}
              >
                {data.operation_mode}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />
          <View
            style={[
              styles.row_container,
              {
                width: "100%",
                height: 30,
                alignItems: "center",
                justifyContent: "space-between",
                alignContent: "center",
                backgroundColor: react_colors.tiffanyblue,
                borderRadius: 8,
                paddingHorizontal: 6,
              },
            ]}
          >
            <Text variant="bodySmall" style={{ color: react_colors.white }}>
              {t("Maximum capacity (Ah)")}
            </Text>

            <View
              style={[
                {
                  justifyContent: "center",
                  alignItems: "center",
                },
                {
                  width: "25%",
                  backgroundColor: react_colors.white,
                  borderRadius: 8,
                  height: 25,
                },
              ]}
            >
              <Text
                variant="labelSmall"
                style={{
                  color: react_colors.black,
                  verticalAlign: "middle",
                }}
              >
                {data.heat_pump_capacity}
              </Text>
            </View>
          </View>
        </>
      )}
      {section === "B" && (
        <>
          <View
            style={[
              styles.row_container,
              { width: "100%", justifyContent: "space-between" },
            ]}
          >
            <Text
              variant="bodyLarge"
              style={{
                color: react_colors.dimgray,
                textAlign: "left",
              }}
            >
              {t("DETAILSidealtemp")}
            </Text>
            <TemperatureModal
              value={desired_temperature}
              onValueChange={(value) => updateDesiredTemperature(value)}
              title={t("DETAILSidealtemp")}
              onClose={() => onChange({ desired_leaving_water_temperature: desired_temperature, minimum_leaving_water_temperature: min_temperature })}
            />
            
          </View>
          <View style={styles.divider} />

          <View
            style={[
              styles.row_container,
              { width: "100%", justifyContent: "space-between" },
            ]}
          >
            <Text
              variant="bodyLarge"
              style={{
                color: react_colors.dimgray,
                textAlign: "left",
              }}
            >
              {t("DETAILSmintemp")}
            </Text>
            <TemperatureModal
              value={min_temperature}
              onValueChange={(value) => updateMinTemperature(value)}
              title={t("DETAILSmintemp")}
              onClose={() => onChange({ desired_leaving_water_temperature: desired_temperature, minimum_leaving_water_temperature: min_temperature })}
            />
          </View>
        </>
      )}
    </>
  );
};

const InverterComp = ({ section, data, onChange }) => {
  const [t, i18n] = useTranslation();
  
  const [reserveCapacity, setReserveCapacity] = useState(data.reserve_capacity);
  
  const updateReserveCapacity = (value) => {
    if (0 <= value && value <= 100) {
      setReserveCapacity(parseInt(value));
      // console.log("New reserve capacity: ", value);
    }
  };

  return (
    <>
      {section === "A" && (
        <>
          <View
            style={[
              styles.row_container,
              {
                width: "100%",
                height: 30,
                alignItems: "center",
                justifyContent: "space-between",
                alignContent: "center",
                backgroundColor: react_colors.tiffanyblue,
                borderRadius: 8,
                paddingHorizontal: 6,
              },
            ]}
          >
            <Text variant="bodySmall" style={{ color: react_colors.white }}>
              {t("Battery capacity (Ah)")}
            </Text>

            <View
              style={[
                {
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "flex-end",
                },
                {
                  width: "25%",
                  backgroundColor: react_colors.white,
                  borderRadius: 8,
                  height: 25,
                },
              ]}
            >
              <Text
                variant="labelSmall"
                style={{
                  color: react_colors.black,

                  verticalAlign: "middle",
                }}
              >
                {data.battery_capacity}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />
          <View
            style={[
              styles.row_container,
              {
                width: "100%",
                height: 30,
                alignItems: "center",
                justifyContent: "space-between",
                alignContent: "center",
                backgroundColor: react_colors.tiffanyblue,
                borderRadius: 8,
                paddingHorizontal: 6,
              },
            ]}
          >
            <Text variant="bodySmall" style={{ color: react_colors.white }}>
              {t("Battery state of charge (%)")}
            </Text>

            <View
              style={[
                {
                  justifyContent: "center",
                  alignItems: "center",
                },
                {
                  width: "25%",
                  backgroundColor: react_colors.white,
                  borderRadius: 8,
                  height: 25,
                },
              ]}
            >
              <Text
                variant="labelSmall"
                style={{
                  color: react_colors.black,
                  verticalAlign: "middle",
                }}
              >
                {data.battery_state_of_charge}
              </Text>
            </View>
          </View>
        </>
      )}
      {section === "B" && (
        <>
          <View
            style={[
              styles.row_container,
              { width: "100%", justifyContent: "space-between" },
            ]}
          >
            <Text
              variant="bodyLarge"
              style={{
                color: react_colors.dimgray,
                textAlign: "left",
              }}
            >
              {t("DetailsreservecapacityInv")}
            </Text>
            <TemperatureModal
              value={reserveCapacity}
              onValueChange={(value) => updateReserveCapacity(value)}
              title={t("DetailsreservecapacityInv")}
              onClose={() => onChange({ reserve_capacity: reserveCapacity })}
            />
          </View>
          <View style={styles.divider} />
        </>
      )}
    </>
  );
};

const EVChargerComp = ({ section, data, onChange }) => {// SECTION B: settings
  const [t, i18n] = useTranslation();

  const [departure_time, setDepartureTime] = useState(data.departure_time);
  const updateDepartureTime = (value) => {
    setDepartureTime(value);
  };

  const [desired_state_of_charge, setDesiredStateOfCharge] = useState(
    data.desired_state_of_charge
  );
  const updateDesiredStateOfCharge = (value) => {
    setDesiredStateOfCharge(value);
  };

  return (
    <>
      <View
        style={[
          styles.row_container,
          { width: "100%", justifyContent: "space-between" },
        ]}
      >
        <Text
          variant="bodyLarge"
          style={{
            color: react_colors.dimgray,
            textAlign: "left",
          }}
        >
          {t("Desired state of charge (%)")}
        </Text>
        <TemperatureModal
          value={desired_state_of_charge}
          onValueChange={(value) => updateDesiredStateOfCharge(value)}
          title={t("Desired state of charge (%)")}
          onClose={() =>
            onChange({
              desired_state_of_charge: desired_state_of_charge,
              departure_time: departure_time,
            })
          }
        />
        {/* <View
              style={[
                styles.card,
                {
                  justifyContent: "center",
                  alignItems: "center",
                },
                {
                  paddingHorizontal: 4,
                  width: "15%",
                  borderRadius: 8,
                  height: 25,
                  backgroundColor: react_colors.tiffanyblue,
                },
              ]}
            >
              <TextInput
                variant="labelSmall"
                style={{
                  color: react_colors.white,
                  verticalAlign: "middle",
                }}
                value={deviceData.desired_state_of_charge}
              />
            </View> */}
      </View>
      <View style={styles.divider} />

      <View
        style={[
          styles.row_container,
          { width: "100%", justifyContent: "space-between" },
        ]}
      >
        <Text
          variant="bodyLarge"
          style={{
            color: react_colors.dimgray,
            textAlign: "left",
          }}
        >
          {t("Departure time (HH:MM)")}
        </Text>
        <TimePickerModal
          value={departure_time}
          onValueChange={(value) => updateDepartureTime(value)}
          title={t("Departure time (HH:MM)")}
          onClose={() =>
            onChange({
              desired_state_of_charge: desired_state_of_charge,
              departure_time: departure_time,
            })
          }
        />
        {/* <View
              style={[
                styles.card,
                {
                  justifyContent: "center",
                  alignItems: "center",
                },
                {
                  paddingHorizontal: 4,
                  width: "15%",
                  borderRadius: 8,
                  height: 25,
                  backgroundColor: react_colors.tiffanyblue,
                },
              ]}
            >
              <TextInput
                variant="labelSmall"
                style={{
                  color: react_colors.white,
                  verticalAlign: "middle",
                }}
                value={deviceData.departure_time}
              />
            </View> */}
      </View>
    </>
  );
};

const Details = ({ route, navigation }, props) => {
  const [t, i18n] = useTranslation();

  const { name, image, status, type, serial, state } = route.params;

  // console.log("Details: ", state, type);
  
  // const [current, setCurrent] = useState(null);
  // const [ev_status, setEvStatus] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // device data state sincronized every 5s
  const [deviceData, setData] = useState(state);

  const [inputData, setInputData] = useState({});

  const DEVICES_API_URL = "https://hedge-iot-hems-dev.inesctec.pt/api/device";

  const {
    authDispatch,
    authState: { data, userToken, lang },
  } = useContext(GlobalContext);

    useFocusEffect(
      useCallback(() => {
        syncStatus();
        const interval = setInterval(() => {
          syncStatus();
        }, 5000);

        return () => clearInterval(interval);
      }, [])
    );

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('blur', () => {
  //     // Do something when the screen blurs
  //     console.log("Details screen blurred");
  //   });

  //   return unsubscribe;
  // }, [navigation]);

    const onUpdateSettings = async (inputs) => {
      let devInput = {};
      
      // console.log("Received device settings: ", type, serial, inputs);

      if (type == "evcharger") {
        devInput = {
          desired_state_of_charge: inputs.desired_state_of_charge,
          departure_time: inputs.departure_time,
        };
      }
      if (type === "inverter") {
        devInput = {
          reserve_capacity: inputs.reserve_capacity,
        };
      }
      if (type === "hpump") {
        devInput = {
          desired_leaving_water_temperature:
          inputs.desired_leaving_water_temperature,
          minimum_leaving_water_temperature:
          inputs.minimum_leaving_water_temperature,
        };
      }

      console.log("Updating device settings: ", serial, devInput);
      return;
      

      // TODO
      await updateSettings(serial, devInput);
    };

    // set new settings to api
    const updateSettings = async (serial, data) => {
      setIsLoading(true);
      const uuid = Crypto.randomUUID();
      // console.log("generating this uuid: " + uuid);
      let headers = {
        "Content-Type": "application/json",
        // Accept: "application/json",
        "X-Correlation-ID": `${uuid}`,
        Authorization: `Bearer ${userToken}`,
      };
      // console.log(headers);

      try {
        let res = await axios.put(
          `${DEVICES_API_URL}/device/?serial_number=${serial}`,
          {
            ...data
          },
          {
            headers,
          },
          { timeout: 10000 }
        );

      } catch (err) {
        err.response
          ? console.log(
              "Error updating device settings. Response: ",
              JSON.stringify(err.response.data)
            )
          : err.request
          ? console.log(
              "Error updating device settings. Request:",
              JSON.stringify(err.request)
            )
          : console.log("Error processing device settings.", err);
        setIsLoading(false);
      }
    }
    // fetch latest device status from api
    const syncStatus = async () => {
      //fetch latest settings from api
      // let uuid = uuidv4();
      const uuid = Crypto.randomUUID();
      // console.log("generating this uuid: " + uuid);
      let headers = {
        "Content-Type": "application/json",
        // Accept: "application/json",
        "X-Correlation-ID": `${uuid}`,
        Authorization: `Bearer ${userToken}`,
      };
      // console.log(headers);

      try {
        let res = await axios.get(
          `${DEVICES_API_URL}/device`,
          {
            headers,
          },
          { timeout: 10000 }
        );
        // .then((res) => {
        // console.log("Got appliances-ok", JSON.stringify(res.data));
        let secived = computeData(res.data); // treat data to card type
        // console.log(secived);
        
        return secived;
      } catch (err) {
        // err.response: client received an error response (5xx, 4xx)
        // err.request: client never received a response, or request never left
        err.response
          ? console.log(
              "Error getting appliances. Response: ",
              JSON.stringify(err.response.data)
            )
          : err.request
          ? console.log(
              "Error getting appliances. Request:",
              JSON.stringify(err.request)
            )
          : console.log("Error processing appliances.", err);
        // if (
        //   err.response &&
        //   (err.response.status > 400) & (err.response.status < 500)
        // ) {
        //   logoutUser()(authDispatch);
        // } else {
        //   Toast.show(t("HOMEdevlistFail"), {
        //     duration: Toast.durations.LONG,
        //     position: Toast.positions.BOTTOM,
        //     backgroundColor: react_colors.gray,
        //   });
        // }
      }
        // setIsLoading(false);

      return null;
    };

    const computeData = (arr) => {
      let list = arr[0].devices.map((item, index) => {
        let dev = item;
        let type = dev.battery_capacity
          ? "inverter"
          : dev.ev_connection_status
          ? "evcharger"
          : dev.heat_pump_capacity
          ? "hpump"
          : "unknown";

        if (type == "evcharger") {
          setData((prev) => ({
            ...prev,
            cable_max_current: dev.cable_max_current,
            ev_connection_status: dev.ev_connection_status,
            // desired_state_of_charge: dev.ev_state_of_charge || "",
            // departure_time: dev.departure_time || "",
          }));
        }

        if (type === "inverter") {
          setData((prev) => ({
            ...prev,
            battery_capacity: dev.battery_capacity,
            battery_state_of_charge: dev.battery_state_of_charge,
            // reserve_capacity: dev.reserve_capacity || "",
          }));
        }

        if (type === "hpump") {
          setData((prev) => ({
            ...prev,
            operation_mode: dev.operation_mode,
            heat_pump_capacity: dev.heat_pump_capacity,
            // desired_leaving_water_temperature: dev.desired_leaving_water_temperature || "",
            // minimum_leaving_water_temperature: dev.minimum_leaving_water_temperature || "",
          }));
        }
        // setCurrent(dev.cable_max_current);
        // setEvStatus(dev.ev_connection_status);
      });

      return list;
    };
    
    return (
      <SafeAreaView style={[styles.container, styles.global_color]}>
        <InterBackground />
        <ScrollView>
          <View style={{ marginTop: 20 }}>
            <Card
              style={[
                styles.card,
                {
                  backgroundColor: react_colors.white,
                  width: "95%",
                  marginHorizontal: "2.5%",
                },
              ]}
            >
              <Card.Cover
                style={styles.card_img}
                source={image}
                resizeMode={"contain"}
              />
              <Card.Title
                title={<Text variant="titleMedium">{name}</Text>}
                right={() => (
                  <Foundation
                    name="rss"
                    size={16}
                    color={
                      status ? react_colors.primarygreen : react_colors.gray
                    }
                  />
                )}
                rightStyle={{ marginRight: 10, marginTop: 5 }}
                // subtitle={<Text variant="labelSmall">{serial}</Text>}
              />
              <Card.Content style={{ justifyContent: "flex-end" }}>
                <ScrollView
                  style={{ maxHeight: Dimensions.get("screen").height * 0.4 }}
                >
                  <View
                    style={[
                      styles.view_container,
                      { alignItems: "flex-start" },
                    ]}
                  >
                    <Text
                      variant="bodyLarge"
                      style={{ color: react_colors.dimgray, textAlign: "left" }}
                    >
                      {t("DETAILSsecATitle")}
                      <Popable
                        content={t("DETAILSsecA0")}
                        strictPosition={true}
                        position="right"
                      >
                        <AntDesign
                          name="questioncircle"
                          size={14}
                          color="black"
                          style={{ padding: 4 }}
                        />
                      </Popable>
                    </Text>
                    <View style={{ height: 14 }} />

                    {type === "inverter" && <InverterComp section="A" data={deviceData} />}
                    {type === "hpump" && <HeatPumpComp section="A" data={deviceData} />}
                    {type == "evcharger" && (
                      <>
                        <View
                          style={[
                            styles.row_container,
                            {
                              width: "100%",
                              height: 30,
                              alignItems: "center",
                              justifyContent: "space-between",
                              alignContent: "center",
                              backgroundColor: react_colors.tiffanyblue,
                              borderRadius: 8,
                              paddingHorizontal: 6,
                            },
                          ]}
                        >
                          <Text
                            variant="bodySmall"
                            style={{ color: react_colors.white }}
                          >
                            {t("EV Connection status")}
                          </Text>

                          <View
                            style={[
                              {
                                justifyContent: "center",
                                alignItems: "center",
                                alignContent: "flex-end",
                              },
                              {
                                width: "25%",
                                backgroundColor: react_colors.white,
                                borderRadius: 8,
                                height: 25,
                              },
                            ]}
                          >
                            <Text
                              variant="labelSmall"
                              style={{
                                color: react_colors.black,

                                verticalAlign: "middle",
                              }}
                            >
                              {deviceData.ev_connection_status}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.divider} />
                        <View
                          style={[
                            styles.row_container,
                            {
                              width: "100%",
                              height: 30,
                              alignItems: "center",
                              justifyContent: "space-between",
                              alignContent: "center",
                              backgroundColor: react_colors.tiffanyblue,
                              borderRadius: 8,
                              paddingHorizontal: 6,
                            },
                          ]}
                        >
                          <Text
                            variant="bodySmall"
                            style={{ color: react_colors.white }}
                          >
                            {t("Maximum current (A)")}
                          </Text>

                          <View
                            style={[
                              {
                                justifyContent: "center",
                                alignItems: "center",
                              },
                              {
                                width: "25%",
                                backgroundColor: react_colors.white,
                                borderRadius: 8,
                                height: 25,
                              },
                            ]}
                          >
                            <Text
                              variant="labelSmall"
                              style={{
                                color: react_colors.black,
                                verticalAlign: "middle",
                              }}
                            >
                              {deviceData.cable_max_current}
                            </Text>
                          </View>
                        </View>
                      </>
                    )}

                    <View style={styles.divider} />
                  </View>
                  <Divider />
                  {/* SHEDULING */}
                  {type == "evcharger" && (
                    <>
                      <View
                        style={[
                          {
                            width: "90%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            height: 50,
                            marginBottom: 6,
                          },
                        ]}
                      >
                        <Text
                          variant="bodyLarge"
                          style={{
                            color: react_colors.dimgray,
                            textAlign: "left",
                          }}
                        >
                          {"Scheduling:"}
                        </Text>
                        <View
                          style={{
                            width: "80%",
                            marginRight: 4,
                          }}
                        >
                          <SwitchComp
                            labelA={"smart"}
                            labelB={"user"}
                            value={true}
                            onToggle={() => {
                              // toggleAllow(!isSmartOn);
                            }}
                            disabled={false}
                          />
                        </View>
                      </View>
                      <View style={styles.divider} />
                      <Divider />
                    </>
                  )}

                  <View style={styles.divider} />

                  {/* SECTION Inputs */}
                  <View
                    style={[
                      styles.view_container,
                      { alignItems: "flex-start" },
                    ]}
                  >
                    <Text
                      variant="bodyLarge"
                      style={{ color: react_colors.dimgray, textAlign: "left" }}
                    >
                      {t("DETAILSsecBTitle")}
                    </Text>
                    <View style={styles.divider} />

                    {type === "inverter" && <InverterComp section="B" data={deviceData} onChange={(newval) => onUpdateSettings(newval)} />}
                    {type === "hpump" && <HeatPumpComp section="B" data={deviceData} onChange={(newval) => onUpdateSettings(newval)} />}
                    {type == "evcharger" && <EVChargerComp section="B" data={deviceData} onChange={(newval) => onUpdateSettings(newval)} />}
                    
                    <View style={styles.divider} />
                  </View>

                  <Divider />

                  <View style={styles.divider} />
                </ScrollView>
              </Card.Content>
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  marginBottom: 6,
                  height: 50,
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "nowrap",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <Button
                      style={{
                        width: "100%",
                        borderRadius: 8,
                      }}
                      mode="contained"
                      labelStyle={{ color: react_colors.white }}
                      buttonColor={react_colors.lightcoral}
                      // onPress={() => showAlert(applid)}
                    >
                      {t("DETAILSremoveA")}
                    </Button>
                  </View>
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
};

export default React.memo(Details);