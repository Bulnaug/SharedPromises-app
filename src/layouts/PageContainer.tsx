import React from "react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { ThemeToggle } from "../components/ThemeSwitsher";

type Props = {
  children: React.ReactNode;
  /** Центрировать контент и ограничить ширину */
  centered?: boolean;
  /** Максимальная ширина, если centered=true */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl";
  /** Доп. классы для внешнего контейнера (фон/паддинги) */
  className?: string;
  /** Доп. классы для внутреннего main (ширина/отступы) */
  innerClassName?: string;
};

const widthMap: Record<NonNullable<Props["maxWidth"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
};

export function PageContainer({
  children,
  centered = true,
  maxWidth = "xl",
  className = "",
  innerClassName = "",
}: Props) {
  return (
    <div
      className={[
        `
        min-h-dvh
        bg-gray-50 text-slate-900
        dark:bg-slate-900 dark:text-slate-100
        px-4 py-8 md:py-10
        `,
        className,
      ].join(" ")}
    >
      <main
        className={[
          centered ? `${widthMap[maxWidth]} mx-auto w-full` : "w-full",
          "space-y-6",
          innerClassName,
        ].join(" ")}
      >
        <LanguageSwitcher />
        <ThemeToggle />
        {children}
      </main>
    </div>
  );
}