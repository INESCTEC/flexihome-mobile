import React, { useCallback, useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  Alert,
  SafeAreaView,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { GlobalContext } from "../context/Provider";
import { useFocusEffect } from "@react-navigation/native";
import { Button, Title, TouchableRipple, List } from "react-native-paper";
import { react_colors, styles } from "../styles";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import moment from "moment";
import axios from "axios";
import * as Crypto from "expo-crypto";
import env from "../config/env";

const Notifications = ({ navigation }) => {
  const [t, i18n] = useTranslation();

  const [notifications, setData] = useState(null);

  const { authDispatch, authState } = useContext(GlobalContext);

  const data = authState.data;

  const token = authState.userToken;

  const URL_API = env.base_api_url;

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () =>
          notifications && (
            <MaterialIcons
              name="clear-all"
              onPress={() => {
                let id = data.user?.user_id;
                Alert.alert(t("NOTIFdeleteTitle"), t("NOTIFconfirmText"), [
                  { text: t("Modalcancel"), style: "cancel" },
                  { text: t("Modalok"), onPress: () => dismissAll(id) },
                ]);
              }}
              size={32}
              color="#fff"
              style={{
                paddingVertical: 6,
                paddingHorizontal: 6,
              }}
            />
          ),
      });
    }, [notifications])
  );
  useEffect(() => {
    let id = data.user?.user_id;

    const loadData = async (id, token) => {
      let list = await getNotifications(id, token);

      return list;
    };
    // if(notifications)
    loadData(id, token).then((res) => {
      if (res !== null) {
        let slice = res.slice(0, 50);
        setData(slice);
      }
    });
  }, []);

  let row = [];
  let prevOpenedRow;
  // useCallback
  const renderItemRow = ({ item, index }, onDelete) => {
    const { id, title, message, datetime_sent } = item;
    let sent = new Date(datetime_sent).toLocaleString();

    return (
      <TouchableWithoutFeedback key={id}>
        <Swipeable
          renderRightActions={(progress, dragX) => renderRightView(onDelete)}
          onSwipeableOpen={() => closeRow(index)}
          ref={(ref) => (row[index] = ref)}
          rightOpenValue={-70}
          onSwipeableWillOpen={() => onDelete(item)}
        >
          <List.Item
            title={title}
            description={message}
            onPress={(e) => {
              Alert.alert(title, message, [], { cancelable: true }, () => {});
            }}
            right={(props) => (
              <View
                {...props}
                style={{
                  width: "30%",
                  marginVertical: 8,
                  alignItems: "flex-end",
                }}
              >
                <Text>{sent}</Text>
              </View>
            )}
            left={(props) => (
              <List.Icon
                {...props}
                style={{
                  width: "10%",
                  marginVertical: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                icon={() => (
                  <Ionicons
                    name="md-chatbubble-ellipses-outline"
                    size={24}
                    color="black"
                  />
                )}
              />
            )}
            style={{
              backgroundColor: react_colors.white,
              borderBottomColor: react_colors.gray,
              borderBottomWidth: 0.2,
              marginBottom: 2,
              height: 80,
            }}
          />
        </Swipeable>
      </TouchableWithoutFeedback>
    );
    // }, [notifications]);
  };

  const renderRightView = (onDeleteHandler) => {
    return (
      <View
        style={{
          width: "100%",
          height: 80,
          backgroundColor: react_colors.interconnect,
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <Ionicons
          name="trash-outline"
          size={24}
          style={{ marginRight: 20 }}
          color={react_colors.slategray}
        />
      </View>
    );
  };

  const dismissNotification = async (id, userId, token) => {
    const uuid = Crypto.randomUUID();

    let headers = {
      "Content-Type": "application/json",
      // Accept: "application/json",
      "X-Correlation-ID": `${uuid}`,
      Authorization: `Bearer ${token}`,
    };

    try {
      let res = await axios.post(`${URL_API}/notification/dismiss`, [], {
        params: { user_id: userId, notification_id: id },
        headers,
      });

      if (res.status === 200) {
        return true;
      }
      return false;
    } catch (err) {
      // err.response
      //   ? console.log(
      //       "Error deleting notifications. Response: ",
      //       JSON.stringify(err.response.data)
      //     )
      //   : err.request
      //   ? console.log(
      //       "Error deleting notifications. Request: ",
      //       JSON.stringify(err.request)
      //     )
      //   : console.log("Error requesting flexibitity", err);
      return false;
    }
  };

  const deleteItem = async (item) => {
    let userId = data.user?.user_id;

    try {
      let deleted = await dismissNotification(item.id, userId, token).then(
        (res) => {
          if (res) {
            return true;
          }
          return false;
        }
      );

      if (deleted) {
        await getNotifications(userId, token).then((res) => {
          if (res !== null) {
            if (res.length > 0) {
              let slice = res.slice(0, 50);
              setData(slice);
            }
          }
        });
      }
    } catch (err) {
      // console.log(err);
      return false;
    }
  };
  const closeRow = (index) => {
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  };

  const dismissAll = async (userId) => {
    const uuid = Crypto.randomUUID();

    let headers = {
      "Content-Type": "application/json",
      // Accept: "application/json",
      "X-Correlation-ID": `${uuid}`,
      Authorization: `Bearer ${token}`,
    };

    try {
      let res = await axios.post(`${URL_API}/notification/dismiss-all`, [], {
        params: {
          user_id: userId,
        },
        headers,
      });

      if (res.status === 200) {
        setData(null);
      } else {
        return null;
      }
    } catch (err) {
      // err.response
      //   ? console.log(
      //       "Error deleting all notifications. Response: ",
      //       JSON.stringify(err.response.data)
      //     )
      //   : err.request
      //   ? console.log(
      //       "Error deleting all notifications. Request: ",
      //       JSON.stringify(err.request)
      //     )
      //   : console.log("Error requesting flexibitity", err);
      return null;
    }
  };
  const getNotifications = async (userId, token) => {
    const uuid = Crypto.randomUUID();

    let headers = {
      "Content-Type": "application/json",
      // Accept: "application/json",
      "X-Correlation-ID": `${uuid}`,
      Authorization: `Bearer ${token}`,
    };

    // date 1 month earlier than today
    let start = moment().subtract(1, "months").toISOString();

    let end = moment()
      // .utc()
      .hours(23)
      .minutes(59)
      .seconds(59)
      .milliseconds(0)
      // .add(1, "days")
      .toISOString();

    try {
      let res = await axios.get(`${URL_API}/notification/list`, {
        params: {
          user_id: userId,
          start_date: start,
          end_date: end,
          dismissed: false,
        },
        headers,
      });

      if (res.status === 200) {
        return res.data;
      } else {
        return null;
      }
    } catch (err) {
      // err.response
      //   ? console.log(
      //       "Error obtaining list of notifications. Response: ",
      //       JSON.stringify(err.response.data)
      //     )
      //   : err.request
      //   ? console.log(
      //       "Error obtaining list of notifications. Request: ",
      //       JSON.stringify(err.request)
      //     )
      //   : console.log("Error requesting flexibitity", err);
      return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, styles.global_color]}>
      {(notifications == null || notifications?.length === 0) && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16 }}>{t("NOTIFempty")}</Text>
        </View>
      )}
      {notifications && notifications?.length > 0 && (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(v) =>
            renderItemRow(v, () => {
              deleteItem(v.item);
            })
          }
          enableOpenMultipleRows={false}
        />
      )}
    </SafeAreaView>
  );
};
export default React.memo(Notifications);
