import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./locales/en/translation.json";
import componentsTranslationEN from "./locales/en/componentsTranslation.json";
import advanceLearningTranslationEN from "./locales/en/advanceLearning.json";
import basicLearningTranslationEN from "./locales/en/basicLearning.json"; // Import basic learning English translations

import translationVI from "./locales/vi/translation.json";
import componentsTranslationVI from "./locales/vi/componentsTranslation.json";
import advanceLearningTranslationVI from "./locales/vi/advanceLearning.json";
import basicLearningTranslationVI from "./locales/vi/basicLearning.json"; // Import basic learning Vietnamese translations

import translationJP from "./locales/jp/translation.json";
import componentsTranslationJP from "./locales/jp/componentsTranslation.json";
import advanceLearningTranslationJP from "./locales/jp/advanceLearning.json";
import basicLearningTranslationJP from "./locales/jp/basicLearning.json"; // Import basic learning Japanese translations

const resources = {
  en: {
    translation: translationEN,
    componentsTranslation: componentsTranslationEN,
    advanceLearning: advanceLearningTranslationEN,
    basicLearning: basicLearningTranslationEN, // Add basic learning to resources
  },
  vi: {
    translation: translationVI,
    componentsTranslation: componentsTranslationVI,
    advanceLearning: advanceLearningTranslationVI,
    basicLearning: basicLearningTranslationVI, // Add basic learning to resources
  },
  jp: {
    translation: translationJP,
    componentsTranslation: componentsTranslationJP,
    advanceLearning: advanceLearningTranslationJP,
    basicLearning: basicLearningTranslationJP, // Add basic learning to resources
  },
};

i18n.use(initReactI18next).init({
  interpolation: { escapeValue: false },
  lng: localStorage.getItem("language") || "vi",
  fallbackLng: "vi",
  resources: resources,
});

export default i18n;
