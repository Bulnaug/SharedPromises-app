import LanguageSwitcher from "../components/LanguageSwitcher";
import { ThemeToggle } from "../components/ThemeSwitsher";
import { ModeSwitch } from "../components/ModeSwitch";

export function TopBar() {
  return (
    <div
      className="
        sticky top-0 z-40
        -mx-2 md:-mx-6
        border-b border-gray-200/60
        bg-gray-50/90 px-2 py-3 backdrop-blur
        dark:border-slate-700/60 dark:bg-slate-900/85
        md:px-6
      "
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <ModeSwitch />
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}