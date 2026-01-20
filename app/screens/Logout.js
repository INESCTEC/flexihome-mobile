import React, { useContext, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GlobalContext } from "../context/Provider";
import { useFocusEffect } from "@react-navigation/native";

//TODO: if google logout too
const Logout = () => {
  const {
    authDispatch,
    authState: { error, loading, data },
  } = useContext(GlobalContext);

  const { navigate } = useNavigation();
  const [unsigned, setUnsigned] = React.useState(false);

  // useFocusEffect(
  //   useCallback(() => {
  //     return () => {
  // logoutUser()(authDispatch);

  //       if (data || error) {
  //         // console.log(error?.field, error?.message);
  //         // console.log("onCallback data >>", { ...data });
  //         clearAuthState()(authDispatch);
  //       }
  //     };
  //   }, [data, error])
  // );

  const logoutUser = () => (dispatch) => {
    // setUnsigned(true);
    AsyncStorage.removeItem("@token");
    AsyncStorage.removeItem("@firstname");
    AsyncStorage.removeItem("@userPrefs");
    AsyncStorage.clear();
    dispatch({
      type: "LOGOUT_USER",
    });
  };
  const clearAuthState = () => (dispatch) => {
    dispatch({
      type: "CLEAR_AUTH_STATE",
    });
  };

  useEffect(() => {
    logoutUser()(authDispatch);
    // (() => {
    //   // navigate("HomeScreen");
    // });
  }, []);

  return <ActivityIndicator />;
};

export default Logout;
