import axios from "axios";
import * as Crypto from "expo-crypto";
import AsyncStorage from "@react-native-async-storage/async-storage";

let headers = {};
//TODO: make env variables
const axiosInstance = axios.create({
  baseURL: "https://interconnect-dev.inesctec.pt/api/",
  headers,
});
const uuid = Crypto.randomUUID();

axiosInstance.interceptors.request.use(
  async (config) => {
    // const token = await AsyncStorage.getItem("token");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    config.headers["Content-Type"] = "application/json";
    config.headers["X-Correlation-ID"] = uuid;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
