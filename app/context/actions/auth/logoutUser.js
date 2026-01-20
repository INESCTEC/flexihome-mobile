import AsyncStorage from "@react-native-async-storage/async-storage";

export default () => (dispatch) => {
  // setUnsigned(true);
  //   AsyncStorage.removeItem("@token");
  //   AsyncStorage.removeItem("@firstname");
  //   AsyncStorage.removeItem("@userPrefs");
  AsyncStorage.clear();
  dispatch({
    type: "LOGOUT_USER",
  });
};
