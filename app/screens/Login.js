import React, { useState, useContext, useEffect } from "react";
// import { Platform } from "react-native";
// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
// import { fetch } from "react-native-ssl-pinning";
import { LoginComp } from "../components/LoginComp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalContext } from "../context/Provider";
// import axiosInstance from "../utils/axiosInterceptor";
import * as Crypto from "expo-crypto";
var base64 = require("base-64");
import env from "../config/env";
import { useTranslation } from "react-i18next";

export const Login = () => {
  // const { route, navigation } = props;
  // console.log("EXPO: " + { ...route });
  const [form, setForm] = useState({});
  const [justSignedUp, setJustSignedUp] = useState(false);
  const { params } = useRoute();
  const [t, i18n] = useTranslation();
  const [userExists, setUserExists] = useState(false);
  const [isIncomplete, setIncomplete] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notification, setNotification] = useState(false);

  const URL_API = env.base_api_url;

  // let uuid = uuidv4();
  const uuid = Crypto.randomUUID();

  const notificationListener = React.useRef();
  const responseListener = React.useRef();
  // LogBox.ignoreLogs(["EventEmitter.removeListener"]);

  useEffect(() => {
    if (params?.data) {
      setForm({ ...form, email: params.data.email });
      // console.log("Just signed up? >> ", params.data);
      storeData("@userId", params.data.userid);
      storeData("@email", params.data.email);
      storeData("@firstname", params.data.userName);

      setJustSignedUp(true);
    }
  }, [params]);

  const {
    authDispatch,
    authState: { error, loading },
  } = useContext(GlobalContext);

  const storeData = async (key, val) => {
    try {
      // await AsyncStorage.clear();
      await AsyncStorage.setItem(key, val);
    } catch (err) {
      console.log("cant store key " + err);
    }
  };
  // getAllKeys();

  let headers = {
    "Content-Type": "application/json",
    // Accept: "application/json",
    "X-Correlation-ID": `${uuid}`,
  };

  //TODO: move to actions folder
  const loginUser = async ({ password, email }) => {
    startLogin()(authDispatch);

    if (expoPushToken) {
      headers = {
        ...headers,
        "expo-token": `${expoPushToken}`,
      };
    }
    // console.log(headers);

    email = email?.trim().toLowerCase();
    let token,
      decoded,
      json = {},
      user_id,
      user_data,
      result;

    let ok = await axios
      .post(
        `${URL_API}/account/login`,
        {
          email,
          password,
        },
        {
          headers,
        },
        { timeout: 10000 }
      )
      .then((res) => {
        // console.log("success >>>", res);
        token = res.headers.authorization.split(" ")[1];
        // console.log(token);
        storeData("@token", token);
        // storeData("@lang", "pt");
        return token;
      })
      .catch((err) => {
        // console.log(
        //   "Error on login..",
        //   err.response
        //     ? "Response: "+JSON.stringify(err.response)
        //     : err.request
        //     ? "Request: "+JSON.stringify(err.request)
        //     : err
        // );
        let fail = "";
        err.response
          ? err.response.status > 499
            ? (fail = { message: t("ERRORserveroffline"), field: "server" })
            : (fail =
                err.response.data !== ""
                  ? getErrorField(err.response.data)
                  : { message: t("ERRORserveroffline"), field: "server" })
          : (fail = { message: t("ERRORserveroffline"), field: "server" });
        
        loginFail(fail)(authDispatch);

        return null;
      });

    if (ok) {
      let pic = ok.split(".")[1];
      decoded = base64.decode(pic);

      json = JSON.parse(decoded);
      user_id = json.sub;
      storeData("@userId", user_id);
      user_data = await getNormalUser(user_id, ok).then((res) => {
        // console.log("User pre-data: ", res);
        loginSuccess(res)(authDispatch);
      });
    }
  };

  const getErrorField = (rre) => {
    const varis = [
      "server",
      "email",
      "password",
      "invalid",
      "first_name",
      "last_name",
      "postal",
      "power",
      "tarif",
      "meterId",
    ];
    let str = rre.hasOwnProperty("detail")
      ? rre.detail
      : rre.hasOwnProperty("error")
      ? rre.error
      : "invalid";
    let field = varis.filter((item) => {
      return str.includes(item);
    });

    return {
      message: str.includes("credentials")
        ? t("ERRORinvalidcredentials")
        : str.includes("email")
        ? t("ERRORinvalidvalue")
        : str.includes("not")
        ? t("ERRORwrongpasswd")
        : str.includes("required")
        ? t("ERRORrequired")
        : str.includes("too short")
        ? t("ERRORvaluelength")
        : str.includes("invalid")
        ? t("ERRORrequestfail")
        : t("ERRORserveroffline"),
      field: field.length > 0 ? field[0] : [],
    };
  };

  const onSubmit = () => {
    // loginUser(form); //(authDispatch);

    if (form.email && form.password) {
      // console.log({ ...form });
      loginUser(form); //(authDispatch);
    }
  };

  const getNormalUser = async (u, tok) => {
    let result = {};
    let pre_data = await axios
      .get(`${URL_API}/account/user?user-ids=${u}`, {
        // headers: { ...headers, Authorization: `${tok}` },
        headers,
      })
      .then((res) => {
        // console.log("Success. ", res.data[0]);

        storeData("@userPrefs", JSON.stringify(res.data[0]));
        storeData("@firstname", res.data[0].first_name);
        storeData("@hubId", res.data[0].hub_id);

        return { ...res.data[0], api: tok };
      })
      .catch((err) => {
        // console.log("Failed to get userSettings ", err.response.data);
        return null;
      });

      return {
        user: { ...pre_data },
        isIncomplete: false,
        failed: false,
      };
    //check for required fields
    if (pre_data != null) {
      const {
        email,
        first_name,
        hub_id,
        postal_code,
        contracted_power,
        tarif_type,
      } = pre_data;

      if (
        email != null &&
        first_name != null &&
        hub_id != null &&
        postal_code != null &&
        contracted_power != null &&
        tarif_type != null
      ) {
        result = {
          user: { ...pre_data },
          ggl: pre_data.is_google_account,
          isIncomplete: false,
          failed: false,
        };
      } else {
        result = {
          user: { ...pre_data },
          ggl: pre_data.is_google_account,
          isIncomplete: true,
          failed: false,
        };
      }
    } //pre_data null
    else {
      result = {
        user: { email: "email@temp.pt" },
        ggl: false,
        isIncomplete: true,
        failed: true,
      };
    }

    return result;
  };

  const loginSuccess = (registered) => (dispatch) => {
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: { ...registered },
    });
  };

  const loginFail = (mess) => (dispatch) => {
    dispatch({
      type: "LOGIN_FAIL",
      payload: mess,
    });
  };

  const startLogin = () => (dispatch) => {
    dispatch({
      type: "LOGIN_LOADING",
    });
  };
  const loginGGL = async (data) => {
    // console.log(data);
    const { email, first_name, last_name, ggl_token } = data;
    startLogin()(authDispatch);

    let decoded,
      json = {},
      user_id,
      user_data,
      result;

    let token = await axios
      .post(
        `${URL_API}/account/register-google`,
        {
          email,
          first_name,
          last_name,
        },
        { headers: { ...headers, Authorization: `Bearer ${ggl_token}` } }
      )
      .then((res) => {
        // console.log(res);
        token = res.headers.authorization.split(" ")[1];
        // console.log(token);
        storeData("@token", token);
        return token;
      })
      .catch((err) => {
        console.log("Login google fail...", err.response.data);
        let fail = err.response
          ? getErrorField(err.response.data)
          : { message: "server is unreachable...", field: "server" };

        loginFail(fail)(authDispatch);

        return null;
      });

    if (token) {
      let pic = token.split(".")[1];
      decoded = base64.decode(pic);

      json = JSON.parse(decoded);
      user_id = json.sub;
      storeData("@userId", user_id);
      user_data = await getNormalUser(user_id, token).then((res) => {
        // console.log("Google User pre-data: ", res);
        loginSuccess(res)(authDispatch);
      });
    }
  };

  const onChange = ({ name, value }) => {
    setJustSignedUp(false);
    setForm({ ...form, [name]: value });
  };

  return (
    <LoginComp
      onSubmit={onSubmit}
      onGgl={loginGGL}
      onChange={onChange}
      form={form}
      error={error}
      loading={loading}
      justSignedUp={justSignedUp}
    />
  );
};
