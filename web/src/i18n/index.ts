import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import cs from "./locales/cs.json";

const SUPPORTED = ["en", "cs"] as const;
type Supported = (typeof SUPPORTED)[number];

function detectLocale(): Supported {
  const stored = localStorage.getItem("locale");
  if (stored && (SUPPORTED as readonly string[]).includes(stored)) {
    return stored as Supported;
  }
  const nav = navigator.language?.slice(0, 2).toLowerCase();
  return (SUPPORTED as readonly string[]).includes(nav)
    ? (nav as Supported)
    : "en";
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    cs: { translation: cs },
  },
  lng: detectLocale(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
