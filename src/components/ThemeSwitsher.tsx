import { useTheme } from "../hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="
        rounded-xl border border-gray-200 px-3 py-2 text-sm
        text-gray-700 hover:bg-gray-50
        dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800
      "
      aria-label="Toggle theme"
      type="button"
    >
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}