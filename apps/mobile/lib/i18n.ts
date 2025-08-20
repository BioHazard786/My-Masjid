import { languageStorage } from "@mobile/lib/language-storage";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import en from "@mobile/locales/en.json";
import hi from "@mobile/locales/hi.json";
import ur from "@mobile/locales/ur.json";

const resources = {
  en: {
    translation: en,
  },
  hi: {
    translation: hi,
  },
  ur: {
    translation: ur,
  },
};

// Get stored language or fallback to device language
const getInitialLanguage = () => {
  const storedLanguage = languageStorage.getLanguage();
  if (storedLanguage) {
    return storedLanguage;
  }

  const deviceLanguage = Localization.getLocales()[0]?.languageCode;
  if (deviceLanguage && Object.keys(resources).includes(deviceLanguage)) {
    return deviceLanguage;
  }

  return "en"; // Default fallback
};

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  react: {
    useSuspense: false,
  },
});

// Listen for language changes and persist them
i18n.on("languageChanged", (lng) => {
  languageStorage.setLanguage(lng);
});

export default i18n;
