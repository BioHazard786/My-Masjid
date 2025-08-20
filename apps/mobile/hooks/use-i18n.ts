import { useTranslation } from "react-i18next";

export const useI18n = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const getCurrentLanguage = () => {
    return i18n.language;
  };

  const getAvailableLanguages = () => {
    return ["en", "hi", "ur"];
  };

  const getLanguageLabel = (code: string) => {
    const labels: Record<string, string> = {
      en: "English",
      hi: "हिंदी",
      ur: "اردو",
    };
    return labels[code] || code;
  };

  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    getLanguageLabel,
  };
};

export default useI18n;
