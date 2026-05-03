import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { AppProviders } from "./app/providers/AppProviders";

import { registerSW } from 'virtual:pwa-register'

import dayjs from "dayjs";
import "dayjs/locale/ru";
import "dayjs/locale/de";
import i18n from "./utils/i18n";

const normalizeLng = (lng: string) =>
  lng.startsWith("de") ? "de" : "ru";

dayjs.locale(normalizeLng(i18n.language));

i18n.on("languageChanged", (lng) => {
  dayjs.locale(normalizeLng(lng));
});

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
