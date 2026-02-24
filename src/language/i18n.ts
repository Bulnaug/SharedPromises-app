import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ru from "./locales/ru.json";
import de from "./locales/de.json";

const resources = {
  ru: { translation: ru },
  de: { translation: de },
} as const;

const saved = localStorage.getItem("lang");
const initialLang = saved === "de" || saved === "ru" ? saved : "ru";

i18n.use(initReactI18next).init({
  resources,
  lng: initialLang,
  fallbackLng: "ru",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("lang", lng);
});

export default i18n;