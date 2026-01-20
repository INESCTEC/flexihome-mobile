import Constants from "expo-constants";
import { PROD_BASE_URL, APP_POLICY_VERSION } from "@env";

const base_api_url = PROD_BASE_URL
  ? PROD_BASE_URL
  : Constants.expoConfig.extra?.eas?.api_url ??
    Constants.manifest2?.extra?.expoClient?.extra?.eas?.api_url;

const app_policy_version = APP_POLICY_VERSION
  ? APP_POLICY_VERSION
  : Constants.expoConfig.extra?.eas?.policy ??
    Constants.manifest2?.extra?.expoClient?.extra?.eas?.policy;
export default { base_api_url, app_policy_version };
