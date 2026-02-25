import { useTranslation } from "react-i18next";
import deFlag from "../assets/flags/de.svg";
import ruFlag from "../assets/flags/ru.svg";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const isRu = i18n.language === "ru";

  const toggleLanguage = () => {
    i18n.changeLanguage(isRu ? "de" : "ru");
  };

  return (
    <div className="flex items-center gap-4">
      {/* DE Flag */}
      <div className="relative">
        <img
          src={deFlag}
          alt="German"
          className={`w-7 h-5 rounded-sm transition-all duration-300
          ${!isRu ? "scale-110" : "opacity-50"}`}
        />
        {!isRu && (
          <div className="absolute inset-0 rounded-sm blur-xl bg-blue-500/30 animate-pulse -z-10" />
        )}
      </div>

      {/* Glass Toggle */}
      <button
        onClick={toggleLanguage}
        className="
            relative w-16 h-8 rounded-full
            backdrop-blur-md
            transition-all duration-300
            border
            shadow-inner
            bg-gray-200 dark:bg-gray-700
            border-gray-300/50
            dark:border-white/20
        "
      >
        {/* Sliding circle */}
        <span
          className={`
            absolute top-1 left-1 w-6 h-6 rounded-full
            bg-white/80 backdrop-blur-md
            shadow-lg
            transition-all duration-300
            ${isRu ? "translate-x-8 bg-blue-400" : ""}
          `}
        />
      </button>

      {/* RU Flag */}
      <div className="relative">
        <img
          src={ruFlag}
          alt="Russian"
          className={`w-7 h-5 rounded-sm transition-all duration-300
          ${isRu ? "scale-110" : "opacity-50"}`}
        />
        {isRu && (
          <div className="absolute inset-0 rounded-sm blur-md bg-blue-500/40 -z-10" />
        )}
      </div>
    </div>
  );
}