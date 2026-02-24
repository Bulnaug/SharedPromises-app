import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Lang = "ru" | "de";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function LanguageSwiper({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const { i18n } = useTranslation();
  const current = (i18n.language === "de" ? "de" : "ru") as Lang;

  const [lang, setLang] = useState<Lang>(current);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startLeftRef = useRef(0);

  useEffect(() => {
    setLang(current);
  }, [current]);

  const dims = useMemo(() => {
    const h = size === "sm" ? 36 : 44;
    const pad = 4;
    return { h, pad };
  }, [size]);

  // 2 позиции: 0 (RU) и 1 (DE)
  const leftPercent = lang === "ru" ? 0 : 50;

  const applyLang = (next: Lang) => {
    setLang(next);
    if (i18n.language !== next) i18n.changeLanguage(next);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!trackRef.current) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    draggingRef.current = true;
    startXRef.current = e.clientX;

    // текущее “лево” в пикселях
    const rect = trackRef.current.getBoundingClientRect();
    startLeftRef.current = (lang === "ru" ? 0 : rect.width / 2);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current || !trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const dx = e.clientX - startXRef.current;

    // позиция ползунка в px: 0..width/2
    const maxLeft = rect.width / 2;
    const nextLeftPx = clamp(startLeftRef.current + dx, 0, maxLeft);

    // порог: если перетащили больше половины пути — переключаем
    const next: Lang = nextLeftPx > maxLeft / 2 ? "de" : "ru";
    setLang(next);
  };

  const onPointerUp = () => {
    draggingRef.current = false;
    applyLang(lang);
  };

  return (
    <div className={className}>
      <div
        ref={trackRef}
        className="relative select-none rounded-full border border-gray-200 bg-gray-50 p-1"
        style={{ height: dims.h }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* бегунок */}
        <div
          className="absolute top-1 bottom-1 w-1/2 rounded-full bg-white shadow-sm transition-[left] duration-200"
          style={{ left: `${leftPercent}%` }}
        />

        {/* кнопки */}
        <div className="relative z-10 grid h-full grid-cols-2 items-center text-sm font-medium">
          <button
            type="button"
            className={`h-full rounded-full transition ${
              lang === "ru" ? "text-gray-900" : "text-gray-500"
            }`}
            onClick={() => applyLang("ru")}
          >
            RU
          </button>
          <button
            type="button"
            className={`h-full rounded-full transition ${
              lang === "de" ? "text-gray-900" : "text-gray-500"
            }`}
            onClick={() => applyLang("de")}
          >
            DE
          </button>
        </div>
      </div>
    </div>
  );
}