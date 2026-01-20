import React, { useState, useEffect } from "react";

import { SafeAreaView } from "react-native";
import { ImageBackground } from "react-native";
import { View, Text, TouchableOpacity, FlatList } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Crypto from "expo-crypto";

import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styles, react_colors } from "../styles";
import {
  List,
  Divider,
  Dialog,
  Portal,
  Button,
  Title,
  TextInput,
  HelperText,
  ActivityIndicator,
} from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";

const devices = [
  {
    title: "Washing Machine",
    key: "1",
    icon: "washing-machine",
    name: "washing-machine",
  },
  {
    title: "Dish Washer",
    key: "2",
    icon: "dishwasher",
    name: "washer",
  },
  {
    title: "Dryer",
    key: "3",
    icon: "tumble-dryer",
    name: "dryer",
  },
  {
    title: "Water Heater",
    key: "6",
    uri: "https://img.icons8.com/ios-glyphs/48/000000/water-heater.png",
    name: "water_heater",
  },
  // {
  //   title: "Air conditioner",
  //   key: "3",
  //   // icon: "air-conditioner",
  //   uri: "https://img.icons8.com/material-rounded/24/000000/air-conditioner.png",
  //   name: "air-cond",
  // },
  // {
  //   title: "EV Charging station",
  //   key: "4",
  //   icon: "ev-station",
  //   name: "ev-station",
  // },
  // {
  //   title: "Heat Pump",
  //   key: "5",
  //   uri: "https://img.icons8.com/ios-glyphs/32/000000/heating-room.png",
  //   name: "pump",
  // },
];

const manufacturers = [
  {
    apptype: "washing-machine",
    appliances: [
      {
        manufacturer: "Whirlpool",
        models: ["944IKDJ67", "AUIQ8734"],
      },
      {
        manufacturer: "Miele",
        models: ["944IKDJ67", "AUIQ8734"],
      },
    ],
  },
  {
    apptype: "air-cond",
    appliances: [
      {
        manufacturer: "Bosch",
        models: ["KJFF783J"],
      },
    ],
  },
  {
    apptype: "water_heater",
    appliances: [
      {
        manufacturer: "Thermovault",
        models: ["OKDJD7622"],
      },
    ],
  },
  {
    apptype: "washer",
    appliances: [
      {
        manufacturer: "Miele",
        models: ["LAKF879S"],
      },
    ],
  },
  {
    apptype: "dryer",
    appliances: [
      {
        manufacturer: "Bosch",
        models: ["LAKF879S"],
      },
    ],
  },
  {
    apptype: "pump",
    appliances: [
      {
        manufacturer: "Daikin",
        models: ["LAKF879S"],
      },
    ],
  },
  {
    apptype: "ev-station",
    appliances: [
      {
        manufacturer: "Whirlpool",
        models: ["LAKF879S"],
      },
    ],
  },
];
const __AppAddNew = ({ visible, selItem, toggle }) => {
  const [vis, setVis] = useState(visible);
  const [openPicker, setOpenPicker] = useState(false);
  const [pickerValue, setPickerValue] = useState("");

  useEffect(() => {
    // console.log("AppAdd is visible " + vis);
  });
  // let device = devices.filter((item) => {
  //   item.id == id;
  // });
  const { key, title, icon, name, uri } = selItem;
  // console.log(name);
  return (
    <Portal>
      <Dialog
        visible={vis}
        // onDismiss={}
      >
        <Dialog.Title>{`Add new ${title}`}</Dialog.Title>
        <Divider></Divider>
        <Dialog.Content>
          <View style={styles.view_item}>
            {/* <TextInput placeholder="put mac address here"></TextInput> */}
            <DropDownPicker //manufact
              listMode="SCROLLVIEW"
              dropDownDirection="BOTTOM"
              value={pickerValue}
              setValue={(v) => setPickerValue(v)}
              open={openPicker}
              setOpen={setOpenPicker}
              // items={[
              //   { id: 0, value: "Whirlpool", label: "Whirlpool" },
              //   { id: 0, value: "Bosh", label: "Bosh" },
              // ]}
              items={manufacturers
                .filter((item) => {
                  // console.log(item);
                  return item.apptype == name;
                })
                .map((item, index) => {
                  // console.log("rendering " + item.appliances);
                  let manuf = item.appliances;
                  // console.log(manuf);
                  // return manuf.map((item, index) => {
                  return {
                    key: index,
                    // apptype: item.apptype,
                    value: manuf.manufacturer,
                    label: manuf.manufacturer,
                  };
                  // });
                })}
            ></DropDownPicker>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              setVis(false);
              toggle(!vis);
            }}
          >
            {"Cancel"}
          </Button>
          <Button
            onPress={() => {
              setVis(false);
              toggle(!vis);
            }}
          >
            {"OK"}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export const AppAddNew = ({ route, navigation }) => {
  const { key, title, icon, name, uri } = route.params;
  const [models, setModels] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [auth, setAuth] = useState(null);
  const [userId, setUserID] = useState(null);

  const [result, setResult] = useState(null);

  useEffect(async () => {
    try {
      let id = await AsyncStorage.getItem("@userId");
      setUserID(id);

      let token = await AsyncStorage.getItem("@token");
      // console.log(token);
      setAuth(token);
    } catch (e) {
      console.log("No stored prefs:\n " + e);
    }
    // console.log("EFFECT " + models);
  }, []);

  let makers = manufacturers
    .filter((item) => item.apptype == name)
    .map((item, index) => {
      // return item.appliances.filter((item) => Object.keys(item));
      return {
        id: index,
        makers: item.appliances.map((item, index) => {
          return {
            id: index,
            manufacturer: item.manufacturer,
            models: item.models,
          };
        }),
      };
    });
  // console.log(makers[0]);
  // let mod = makers[0].makers
  //   .filter((item) => item.manufacturer == "Bosch")
  //   .map((item, index) => {
  //     console.log("-----------");
  //     console.log(item.models);
  //     return item.models;
  //   });
  // console.log(mod);
  const getModels = (val) => {
    //get models array
    // if (val != null)
    const mod = makers[0].makers.filter((item) => item.manufacturer == val);
    // let mod = makers[0].makers
    //   .filter((item) => item.manufacturer == val)
    //   .map((item, index) => {
    //     console.log("-----------");
    //     console.log(item.models);
    //     return item.models;
    //   });
    // return item
    //   .filter((item) => item.manufacturer == val)
    //   .map((item, index) => {
    //     return {
    //       key: index,
    //       models: item.models,
    //     };
    //   });
    //   // let manuf = item.appliances;
    //   // console.log({ ...item });
    //   return {
    //     key: index,
    //     label: item,
    //     value: index + "-" + item,
    //   };
    console.log(mod);
    //set state models
    // setModels(mod);
  };
  // const [vis, setVis] = useState(visible);
  const [openPicker, setOpenPicker] = useState(false);
  const [pickerValue, setPickerValue] = useState(0);

  const [newDeviceId, setNewDeviceId] = useState(null);

  const checkMatch = (v) => {
    let mac = v.match(/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/g);

    if (mac) return true;
    else return false;
  };

  const handleMac = (value) => {
    //TODO:
    // let trimed = value.match(/\w{2}/g) ? value + ":" : value;
    // let trimed = value.replace(/\d(?=(?:\d{3})+$)/g, "$&,");
    value = value.toUpperCase();
    // let trimed = value.match(/(.{2}:)/g);
    // console.log(trimed);
    // console.log(trimed.length);
    // let col = ":";
    // if ((trimed.length - 1) % 2 > 0) {
    //   value = value + col;
    // }
    setNewDeviceId(value);
  };

  const registerDevice = async () => {
    // console.log("ADD NEW DEVICE");
    setIsLoading(true);
    // let uuid = uuidv4();
    const uuid = Crypto.randomUUID();

    // console.log("generating this uuid: " + uuid);
    let headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Correlation-ID": `${uuid}`,
      Authorization: `Bearer ${auth}`,
    };

    await axios
      .post(
        `https://interconnect-dev.inesctec.pt/api/device/device?brand=${pickerValue}`,
        { mac_address: newDeviceId },
        { headers }
      )
      .then((res) => {
        console.log("Success: ", res.data);
        setIsLoading(false);
        setNewDeviceId(null);
        setResult({ field: "success", message: "New appliance added!" });
      })
      .catch((err) => {
        console.log("Error registering appliance. ", err.request);
        setIsLoading(false);
        setNewDeviceId(null);
        setResult({
          field: "error",
          message: "Something went wrong. Try again.",
        });
      });
  };
  return (
    <View key={key} style={{ alignItems: "center" }}>
      <Title>{`Add new ${title}`}</Title>
      <View style={styles.view_item}>
        {/* <TextInput placeholder="put mac address here"></TextInput> */}
        <DropDownPicker //manufact
          zIndex={10000}
          listMode="SCROLLVIEW"
          dropDownDirection="BOTTOM"
          value={pickerValue}
          setValue={(v) => setPickerValue(v)}
          open={openPicker}
          setOpen={setOpenPicker}
          onChangeValue={(item) => setModels(item)}
          // items={[
          //   { id: 0, value: "Whirlpool", label: "Whirlpool" },
          //   { id: 0, value: "Bosh", label: "Bosh" },
          // ]}
          items={makers[0].makers.map((item, index) => {
            const { manufacturer } = item;
            // let manuf = item.appliances;
            // console.log({ ...item });
            return {
              key: index,
              label: manufacturer,
              value: manufacturer,
            };
          })}
        ></DropDownPicker>
        <Divider></Divider>

        <View style={{ height: 20 }}></View>

        <View style={styles.view_item}>
          <TextInput
            placeholder="insert reference"
            value={newDeviceId}
            onChangeText={(val) => handleMac(val)}
            maxLength={17}
          ></TextInput>
          {result && result.field === "error" && (
            <HelperText type="error" visible={true}>
              {result.message}
            </HelperText>
          )}
          {result && result.field === "success" && (
            <HelperText type="info" visible={true}>
              {result.message}
            </HelperText>
          )}
          <View style={{ height: 20 }}></View>
          {isLoading && (
            <View
              style={{
                height: 300,
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <ActivityIndicator
                size={"medium"}
                color={react_colors.slateblue}
              />
            </View>
          )}
          <Button
            style={{
              backgroundColor: react_colors.slateblue,
              width: 100,
              alignSelf: "center",
              // height: 60,
            }}
            disabled={isLoading || !newDeviceId}
            mode={"contained"}
            onPress={() => {
              if (checkMatch(newDeviceId)) {
                registerDevice();
              } else {
                // console.log("Inserted invalid reference.");
                setResult({
                  field: "error",
                  message: "Insert a valid reference",
                });
              }
            }}
          >
            <Text>{"Add"}</Text>
          </Button>
          <Divider></Divider>
        </View>
      </View>
    </View>
  );
};
export const NewDevice = ({ navigation, route }) => {
  const [isVisible, setVisible] = useState(false);

  const [selected, setSelected] = useState(null);

  const toggleSelected = (val, vis) => {
    // const { key, title, icon, name, uri } = val;
    // console.log(vis);
    setVisible(vis);
    setSelected(val);
  };
  const toggleVisible = (vis) => {
    // console.log("SET MODAL: " + vis);
    setSelected(null);
    setVisible(vis);
  };
  // const openForm = (item) => {
  //   toggleVisible(!isVisible);
  // };
  useEffect(() => {
    // console.log("Modal is visible: " + isVisible);
  });
  return (
    <SafeAreaView style={(styles.container, styles.global_color)}>
      {devices.map((item, index) => {
        const { key, title, icon, name, uri } = item;
        return (
          <List.Section key={key}>
            <List.Item
              title={title}
              // description={name}
              left={() => (
                <>
                  <List.Icon
                    icon={uri != null ? { uri: uri } : icon}
                    color={"#000"}
                    // size={20}
                    // style={{ paddingRight: 20 }}
                  />
                  {/* <MaterialCommunityIcons name={icon} size={24} color="black" /> */}
                </>
              )}
              right={() => (
                <TouchableOpacity
                  onPress={() => {
                    toggleSelected(item, !isVisible);
                    navigation.navigate("AddDevice2", { ...item });
                  }}
                >
                  <Ionicons
                    name="add"
                    color={"#f00"}
                    size={30}
                    style={{ paddingRight: 20 }}
                  />
                </TouchableOpacity>
              )}
              onPress={() => {
                toggleSelected(item, !isVisible);
                navigation.navigate("AddDevice2", { ...item });
              }}
            />
          </List.Section>
        );
      })}
      {/* {selected && (
        <AppAddNew
          visible={isVisible}
          selItem={selected}
          toggle={(val) => toggleVisible(val)}
        ></AppAddNew>
      )} */}
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={(styles.container, styles.global_color)}>
      <FlatList
        // vertical
        // pagingEnabled
        // scrollEnabled
        // showsHorizontalScrollIndicator={false}
        // decelerationRate={0}
        // scrollEventThrottle={16}
        // snapToAlignment="center"
        data={devices}
        renderItem={({ item, index, separators }) => (
          <View
            key={item.key}
            style={{
              backgroundColor: react_colors.ghostwhite,
              flexDirection: "row",
              // alignContent: "center",
              alignItems: "center",
              paddingLeft: 10,
              // height: 70,
            }}
          >
            <List.Icon
              icon={item.uri != null ? { uri: item.uri } : item.icon}
              color={"#000"}
              // size={20}
              // style={{ paddingRight: 20 }}
            />
            <Title style={{ flex: 2 }}>{item.title}</Title>
            <TouchableOpacity
              onPress={() => openForm(item)}
              onShowUnderlay={separators.highlight}
            >
              <Ionicons
                name="add"
                color={"#000"}
                size={30}
                style={{ paddingRight: 20 }}
              />
            </TouchableOpacity>
            <Portal>
              <Dialog
                visible={isVisible}
                // onDismiss={}
              >
                <Dialog.Title>{`Add new ${item.title}`}</Dialog.Title>
                <Divider></Divider>
                <Dialog.Content>
                  <View style={styles.view_item}>
                    <TextInput placeholder="put mac address here"></TextInput>
                  </View>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button
                    onPress={() => {
                      toggleVisible(!isVisible);
                    }}
                  >
                    {"Cancel"}
                  </Button>
                  <Button
                    onPress={() => {
                      toggleVisible(!isVisible);
                    }}
                  >
                    {"OK"}
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
            {/* <AppAddNew visible={isVisible} data={item} /> */}
          </View>
        )}
        // ListFooterComponent={

        //   <View>
        //     <Title>{`Add new ${item.title}`}</Title>

        //     <View style={styles.view_item}>
        //       <TextInput placeholder="put mac address here"></TextInput>
        //     </View>
        //   </View>
        // }
      />
    </SafeAreaView>
  );
};
