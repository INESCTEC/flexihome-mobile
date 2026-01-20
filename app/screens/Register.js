import React, { useCallback, useState, useContext, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import RegisterComp from "../components/RegisterComp";
import { GlobalContext } from "../context/Provider";

// import axiosInstance from "../utils/axiosInterceptor";
import axios from "axios";
import * as Crypto from "expo-crypto";
import env from "../config/env";

export const Register = ({ route }) => {
  const [form, setForm] = useState({});
  const { navigate } = useNavigation();
  const [errors, setErrors] = useState({}); //show input errors before any submit
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [t, i18n] = useTranslation();
  const {
    authDispatch,
    authState: { error, loading, data, lang },
  } = useContext(GlobalContext);

  // let uuid = uuidv4();
  const uuid = Crypto.randomUUID();

  const URL_API = env.base_api_url;

  // useFocusEffect(
  //   useCallback(() => {
  //     return () => {
  //       if (data || error) {
  //         // console.log(error?.field, error?.message);
  //         // console.log("onCallback data >>", { ...data });
  //         clearAuthState()(authDispatch);
  //       }
  //     };
  //   }, [data, error])
  // );

  useEffect(() => {
    if (route.params?.acceptedPolicy === true) {
      setAcceptedPolicy(true);
    }
  }, [route]);

  const clearAuthState = () => (dispatch) => {
    dispatch({
      type: "CLEAR_AUTH_STATE",
    });
  };

  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Correlation-ID": `${uuid}`,
    // "Access-Control-Allow-Origin": "*",
  };

  const register =
    ({
      email,
      password,
      password_repeat,
      first_name,
      last_name,
      hub_id,
      postal_code,
      contracted_power,
      tarif_type,
    }) =>
    (dispatch) =>
    (onSuccess) => {
      dispatch({
        type: "REGISTER_LOADING",
      });

      axios
        .post(
          `${URL_API}/account/register`,
          {
            email,
            password,
            password_repeat,
            first_name,
            last_name,
            postal_code,
            hub_id,
            country: "PT",
            tarif_type,
            contracted_power,
            schedule_type: "economic",
          },
          {
            headers,
          },
          { timeout: 10000 }
        )
        .then((res) => {
          // console.log("success >>>", res);
          dispatch({
            type: "REGISTER_SUCCESS",
            payload: res.data,
          });

          onSuccess(res.data);
        })
        .catch((err) => {
          // console.log(
          //   "Error Register ...",
          //   err.response
          //     ? err.response.data
          //     : { bolas: "Register failed.." + JSON.stringify(err.request) } //err.message
          // );
          let fail = "";

          if (err.response.status > 499) {
            fail = { message: t("ERRORserveroffline"), field: "server" };
          } else {
            fail =
              err.response.data !== ""
                ? getErrorField(err.response.data)
                : { message: t("ERRORserveroffline"), field: "server" };
          }

          dispatch({
            type: "REGISTER_FAIL",
            payload: fail,
          });
        });
    };

  const getErrorField = (rre) => {
    const varis = [
      "first_name",
      "last_name",
      "email",
      "password",
      "password_repeat",
      "postal",
      "power",
      "tarif",
      "meterId",
      "error",
    ];
    let str = rre.hasOwnProperty("detail")
      ? rre.detail
      : rre.hasOwnProperty("error")
      ? rre.error
      : "error";
    let field = varis.filter((item) => {
      return str.includes(item);
    });

    return {
      message: str.includes("not")
        ? t("ERRORinvalidvalue")
        : str.includes("already")
        ? t("ERRORvalueinuse")
        : str.includes("short")
        ? t("ERRORvaluelength")
        : str.includes("Server")
        ? t("ERRORrequestfail")
        : t("ERRORserveroffline"),
      field: field.length > 0 ? field[0] : [],
    };
  };
  const onChange = ({ name, value }) => {
    setForm({ ...form, [name]: value });
  };

  const onSubmit = () => {
    // console.log({ ...form });
    // return;
    if (
      form.email &&
      form.password &&
      form.password_repeat &&
      form.first_name &&
      // form.last_name
      form.hub_id &&
      form.postal_code &&
      form.tarif_type &&
      form.contracted_power
    ) {
      register(form)(authDispatch)((response) => {
        navigate("Login", {
          data: {
            email: response.email,
            userid: response.user_id,
            userName: response.first_name,
          },
        });
      });
    }
  };
  return (
    <RegisterComp
      onSubmit={onSubmit}
      onChange={onChange}
      form={form}
      error={error}
      language={lang}
      loading={loading}
      accepted={acceptedPolicy}
    />
  );
};
