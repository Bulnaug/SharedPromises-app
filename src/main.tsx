import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import App from "./App";
import "./index.css";

import dayjs from "dayjs";
import "dayjs/locale/ru";
import "dayjs/locale/de";
import i18n from "./utils/i18n";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

const normalizeLng = (lng: string) =>
  lng.startsWith("de") ? "de" : "ru";

// установить локаль при старте
dayjs.locale(normalizeLng(i18n.language));

// обновлять при смене языка
i18n.on("languageChanged", (lng) => {
  dayjs.locale(normalizeLng(lng));
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <App />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </React.StrictMode>
);
