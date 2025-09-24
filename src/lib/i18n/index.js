import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-fs-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import enTranslations from "../../public/locales/en/common.json";
import viTranslations from "../../public/locales/vi/common.json";

const createI18nInstance = (locale = "en", namespace = "common") => {
  const i18nInstance = createInstance();

  i18nInstance
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      lng: locale,
      fallbackLng: "en",
      debug: process.env.NODE_ENV === "development",

      ns: [namespace],
      defaultNS: namespace,

      resources: {
        en: {
          common: enTranslations,
        },
        vi: {
          common: viTranslations,
        },
      },

      interpolation: {
        escapeValue: false,
      },

      detection: {
        order: ["cookie", "header", "querystring", "localStorage", "navigator"],
        caches: ["localStorage", "cookie"],
      },
    });

  return i18nInstance;
};

export default createI18nInstance;
