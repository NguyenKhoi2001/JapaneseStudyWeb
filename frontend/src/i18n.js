// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en/translation.json";
import translationVI from "./locales/vi/translation.json";
import translationJP from "./locales/jp/translation.json";

const resources = {
  en: { translation: translationEN },
  vi: { translation: translationVI },
  jp: { translation: translationJP },
};

i18n.use(initReactI18next).init({
  interpolation: { escapeValue: false },
  lng: localStorage.getItem("language") || "vi",
  fallbackLng: "vi",
  resources: resources,
});
export default i18n;
