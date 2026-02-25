import { Link, useMatch } from "react-router-dom";
import type { Id } from "../../convex/_generated/dataModel";
import { useTranslation } from "react-i18next";

export function Sidebar({ roomId }: { roomId: Id<"rooms"> }) {
  const isAddWishPage = useMatch("/rooms/:roomId/new");
  const isRoomSettingsPage = useMatch("/rooms/:roomId/settings");

  const backHref = `/rooms/${roomId}`;
  const addHref = `/rooms/${roomId}/new`;

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

        {/* Add / Back button: иконка на мобилке, текст на md+ */}
        {isAddWishPage || isRoomSettingsPage ? (
          <Link
            to={backHref}
            aria-label="Назад"
            title="Назад"
            className="
              block rounded-xl
              bg-green-500 text-white
              hover:bg-green-600 transition
              px-0 py-2.5 md:px-4
              text-center
            "
          >
            <span className="md:hidden text-lg leading-none">←</span>
            <span className="hidden md:inline text-sm font-medium">← {t("navigation.back")}</span>
          </Link>
        ) : (
          <Link
            to={addHref}
            aria-label="Добавить хотелку"
            title="Добавить хотелку"
            className="
              block rounded-xl
              bg-green-500 text-white
              hover:bg-green-600 transition
              px-0 py-2.5 md:px-4
              text-center
            "
          >
            <span className="md:hidden text-lg leading-none">＋</span>
            <span className="hidden md:inline text-sm font-medium">
              + Хочу ещё
            </span>
          </Link>
        )}

        {/* Навигация */}
        
        <nav className="space-y-1">
          <SidebarLink to="/rooms" icon="🏠" label="Мои комнаты" />
          <SidebarLink
            to={`/rooms/${roomId}/settings`}
            icon="⚙️"
            label="Параметры комнаты"
          />
        </nav>
      </div>

      {/* ───────── Низ ───────── */}
      <div className="mt-auto p-3 md:p-6 border-t border-gray-100">
        <SidebarLink to="/profile" icon="👤" label="Мой профиль" />
      </div>
    </aside>
  );
}

/* ───────── Link-компонент ───────── */

function SidebarLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: string;
  label: string;
}) {
  return (
    <Link
      to={to}
      title={label} // на мобилке будет подсказка при долгом тапе/ховере
      aria-label={label}
      className="
        flex items-center
        gap-3
        rounded-xl
        text-sm font-medium text-gray-700
        hover:bg-gray-100 transition
        px-0 md:px-4
        py-2.5
        justify-center md:justify-start
      "
    >
      <span className="text-lg">{icon}</span>
      <span className="hidden md:inline">{label}</span>
    </Link>
  );
}