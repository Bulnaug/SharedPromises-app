import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

import deFlag from "../assets/flags/de.svg";
import ruFlag from "../assets/flags/ru.svg";
import enFlag from "../assets/flags/en.svg";
import uaFlag from "../assets/flags/ua.svg";

const languages = [
  { code: "de", name: "Deutsch", flag: deFlag },
  { code: "ru", name: "Русский", flag: ruFlag },
  { code: "en", name: "English", flag: enFlag },
  { code: "ua", name: "Українська", flag: uaFlag },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = languages.find((l) => l.code === i18n.language) ?? languages[0];

  const changeLang = (lng: string) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  // закрытие при клике вне
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="
        flex items-center gap-2
        px-3 py-1.5
        rounded-lg
        bg-white/60 dark:bg-slate-800
        border border-gray-200 dark:border-slate-700
        hover:bg-gray-100 dark:hover:bg-slate-700
        transition
        text-sm
      "
      >
        🌍
        <img src={current.flag} className="w-5 h-4 rounded-sm" />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
          absolute left-0 mt-2 w-44
          rounded-xl
          bg-white dark:bg-slate-800
          border border-gray-200 dark:border-slate-700
          shadow-lg
          overflow-hidden
          z-50
        "
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLang(lang.code)}
              className="
              flex items-center gap-3
              w-full px-3 py-2
              text-sm
              hover:bg-gray-100 dark:hover:bg-slate-700
              transition
            "
            >
              <img src={lang.flag} className="w-5 h-4 rounded-sm" />
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}