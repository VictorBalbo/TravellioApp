import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEn from "./locales/en-us.json";
import translationPt from "./locales/pt-br.json";

const locales = getLocales();
const deviceLanguage = locales[0].languageCode ?? "en";

const resources = {
  pt: { translation: translationPt },
  en: { translation: translationEn },
};

// eslint-disable-next-line import/no-named-as-default-member
i18n
  .use(initReactI18next)
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    compatibilityJSON: "v4",
    lng: deviceLanguage,
    fallbackLng: "en",
    debug: false,
    resources,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
