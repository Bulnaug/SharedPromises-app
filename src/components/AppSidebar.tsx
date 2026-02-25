import { Link, useMatch, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function AppSidebar() {
  const isRoomsPage = useMatch("/rooms");
  const navigate = useNavigate();

  const { t } = useTranslation();

  return (
    <aside
      className="
        sticky top-0
        h-dvh
        bg-white
        border-r border-gray-200
        flex flex-col
        w-16 md:w-64
      "
    >
      {/* ───────── Верх ───────── */}
      <div className="p-3 md:p-6 space-y-3 md:space-y-6">
        {/* Лого: SP на мобилке, SharedPromises на md+ */}
        <div className="flex items-center justify-center md:justify-start">
          <div className="md:hidden text-lg font-semibold text-gray-900">
            S<span className="text-green-500">P</span>
          </div>

          <div className="hidden md:block text-xl font-semibold text-gray-900">
            Shared<span className="text-green-500">Promises</span>
          </div>
        </div>

        {/* Универсальная верхняя кнопка */}
        <button
        onClick={() => navigate(-1)}
        aria-label={t("back")}
        title={t("back")}
        className="
            block rounded-xl
            bg-green-500 text-white
            hover:bg-green-600 transition
            px-0 py-2.5 md:px-4
            text-center
            w-full
        "
        >
        <span className="md:hidden text-lg leading-none">←</span>
        <span className="hidden md:inline text-sm font-medium">
            ← {t("back")}
        </span>
        </button>

        {/* Навигация */}
        <nav className="space-y-1">
          <SidebarLink to="/rooms" icon="🏠" label={t("myRooms")} active={!!isRoomsPage} />
        </nav>
      </div>

      {/* ───────── Низ ───────── */}
        <div className="mt-auto p-3 md:p-6 border-t border-gray-100">
            <SidebarLink to="/profile" icon="👤" label={t("myProfile")} />
        </div>
    </aside>
  );
}

function SidebarLink({
  to,
  icon,
  label,
  active,
}: {
  to: string;
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      title={label}
      aria-label={label}
      className={[
        `
        flex items-center
        gap-3
        rounded-xl
        text-sm font-medium
        hover:bg-gray-100 transition
        px-0 md:px-4
        py-2.5
        justify-center md:justify-start
        `,
        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
      ].join(" ")}
    >
      <span className="text-lg">{icon}</span>
      <span className="hidden md:inline">{label}</span>
    </Link>
  );
}