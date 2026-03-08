import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import de from "../language/locales/de.json";
import ru from "../language/locales/ru.json";
import en from "../language/locales/en.json";
import ua from "../language/locales/ua.json";

const STORAGE_KEY = "app_language";


const savedLanguage = localStorage.getItem(STORAGE_KEY) || "ru";

i18n
  .use(initReactI18next)
  .init({
    lng: savedLanguage, 
    fallbackLng: "ru",
    supportedLngs: ["ru", "de", "en", "ua"],
    interpolation: {
      escapeValue: false,
    },
    resources: {
      de: { translation: de },
      ru: { translation: ru },
      en: { translation: en },
      ua: { translation: ua }
    },
  });

i18n.on("languageChanged", (lng) => {
  
  localStorage.setItem(STORAGE_KEY, lng);


  document.documentElement.lang = lng;


  const localeMap: Record<string, string> = {
    ru: "ru_RU",
    de: "de_DE",
    en: "en_EN",
    ua: "ua_UA",
  };

  const ogLocale = localeMap[lng] || "ru_RU";

  let meta = document.querySelector(
    'meta[property="og:locale"]'
  ) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("property", "og:locale");
    document.head.appendChild(meta);
  }

  meta.setAttribute("content", ogLocale);
});


document.documentElement.lang = savedLanguage;

export default i18n;