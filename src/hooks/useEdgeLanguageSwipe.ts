import { useEffect, useRef } from "react";
import i18n from "../utils/i18n";

type Options = {
  edgePx?: number;   // зона у левого края, откуда свайп “считается”
  minDx?: number;    // минимальный горизонтальный сдвиг для срабатывания
  maxDy?: number;    // если вертикальный сдвиг больше — считаем это скроллом
};

export function useEdgeLanguageSwipe(opts: Options = {}) {
  const edgePx = opts.edgePx ?? 24;
  const minDx = opts.minDx ?? 80;
  const maxDy = opts.maxDy ?? 70;

  const startX = useRef(0);
  const startY = useRef(0);
  const tracking = useRef(false);
  const fired = useRef(false);

  useEffect(() => {
    const isInteractiveEl = (el: EventTarget | null) => {
      const node = el as HTMLElement | null;
      if (!node) return false;
      return Boolean(
        node.closest?.(
          'input, textarea, select, button, a, [role="button"], [data-no-edge-swipe="true"]'
        )
      );
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;

      // не мешаем интерактивным элементам
      if (isInteractiveEl(e.target)) {
        tracking.current = false;
        return;
      }

      const t = e.touches[0];
      startX.current = t.clientX;
      startY.current = t.clientY;

      tracking.current = t.clientX <= edgePx;
      fired.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!tracking.current || fired.current) return;

      const t = e.touches[0];
      const dx = t.clientX - startX.current;
      const dy = t.clientY - startY.current;

      // если пользователь реально скроллит вертикально — выходим
      if (Math.abs(dy) > maxDy && Math.abs(dy) > Math.abs(dx)) {
        tracking.current = false;
        return;
      }

      // сработать только на свайп вправо
      if (dx >= minDx && Math.abs(dy) <= maxDy) {
        fired.current = true;

        const current = i18n.language === "de" ? "de" : "ru";
        const next = current === "de" ? "ru" : "de";
        i18n.changeLanguage(next);
      }
    };

    const onTouchEnd = () => {
      tracking.current = false;
      fired.current = false;
    };

    // passive: true — не блокируем скролл
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [edgePx, minDx, maxDy]);
}