import { Platform } from "react-native";

const DEV_API_URL = Platform.select({
  ios: "http://127.0.0.1:8000/api",
  android: "http://10.0.2.2:8000/api",
});

const PROD_API_URL = "https://your-production-domain.com/api";

export const API_URL =
  __DEV__ ? DEV_API_URL : PROD_API_URL;
