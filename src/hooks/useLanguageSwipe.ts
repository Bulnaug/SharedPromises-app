import { useEffect, useRef } from "react";
import i18n from "../language/i18n";

type Options = {
  edgePx?: number;       // зона старта у левого края
  minDx?: number;        // минимальная дистанция
  maxDy?: number;        // максимально допустимый вертикальный сдвиг
};

export function useLanguageSwipe(opts: Options = {}) {
  const edgePx = opts.edgePx ?? 24;
  const minDx = opts.minDx ?? 70;
  const maxDy = opts.maxDy ?? 60;

  const startX = useRef(0);
  const startY = useRef(0);
  const tracking = useRef(false);
  const handled = useRef(false);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;

      const t = e.touches[0];
      startX.current = t.clientX;
      startY.current = t.clientY;

      tracking.current = t.clientX <= edgePx; // только если стартуем у левого края
      handled.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!tracking.current || handled.current) return;
      const t = e.touches[0];

      const dx = t.clientX - startX.current;
      const dy = t.clientY - startY.current;

      // если это вертикальный скролл — выходим
      if (Math.abs(dy) > maxDy && Math.abs(dy) > Math.abs(dx)) {
        tracking.current = false;
        return;
      }

      // свайп вправо (от края) — включаем немецкий
      if (dx > minDx && Math.abs(dy) < maxDy) {
        handled.current = true;
        const next = i18n.language === "de" ? "ru" : "de";
        i18n.changeLanguage(next);
      }
    };

    const onTouchEnd = () => {
      tracking.current = false;
      handled.current = false;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [edgePx, minDx, maxDy]);
}