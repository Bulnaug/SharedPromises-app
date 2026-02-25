import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type Lang = "de" | "ru";

function FlagDE() {
  return (
    <span className="inline-block h-6 w-9 overflow-hidden rounded-sm shadow-sm ring-1 ring-white/10">
      <span className="block h-2 w-full bg-black" />
      <span className="block h-2 w-full bg-[#DD0000]" />
      <span className="block h-2 w-full bg-[#FFCE00]" />
    </span>
  );
}

function FlagRU() {
  return (
    <span className="inline-block h-6 w-9 overflow-hidden rounded-sm shadow-sm ring-1 ring-white/10">
      <span className="block h-2 w-full bg-white" />
      <span className="block h-2 w-full bg-[#0039A6]" />
      <span className="block h-2 w-full bg-[#D52B1E]" />
    </span>
  );
}

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { i18n } = useTranslation();

  const current: Lang = i18n.language === "de" ? "de" : "ru";
  const [lang, setLang] = useState<Lang>(current);

  useEffect(() => setLang(current), [current]);

  const setLanguage = (next: Lang) => {
    setLang(next);
    if (i18n.language !== next) i18n.changeLanguage(next);
  };

  const toggle = () => setLanguage(lang === "de" ? "ru" : "de");

  const isRu = lang === "ru";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        type="button"
        onClick={() => setLanguage("de")}
        className="rounded-md p-1 hover:bg-white/5 active:bg-white/10"
        aria-label="Deutsch"
        title="Deutsch"
      >
        <FlagDE />
      </button>

      <button
        type="button"
        onClick={toggle}
        className="
          relative h-10 w-20 rounded-full
          bg-white/10 ring-1 ring-white/15
          shadow-sm
          transition
          active:scale-[0.99]
        "
        aria-label="Toggle language"
        title="Toggle language"
      >
        <span
          className={`
            absolute top-1 h-8 w-8 rounded-full
            bg-white/70 shadow
            transition-transform duration-200
            ${isRu ? "translate-x-11" : "translate-x-1"}
          `}
        />
      </button>

      <button
        type="button"
        onClick={() => setLanguage("ru")}
        className="rounded-md p-1 hover:bg-white/5 active:bg-white/10"
        aria-label="Русский"
        title="Русский"
      >
        <FlagRU />
      </button>
    </div>
  );
}