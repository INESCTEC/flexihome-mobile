import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { en } from "../locale/en";
import { pt } from "../locale/pt";

const resources = {
  en: en,
  pt: pt,
};

i18n
  .use(initReactI18next)
  .init({ debug: false, resources, lng: "en", compatibilityJSON: "v3" });

export default i18n;
