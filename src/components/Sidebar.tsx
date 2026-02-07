import { Link, useMatch } from "react-router-dom";
import type { Id } from "../../convex/_generated/dataModel";

export function Sidebar({ roomId }: { roomId: Id<"rooms"> }) {
  const isAddWishPage = useMatch("/rooms/:roomId/new");
  const isRoomSettingsPage = useMatch("/rooms/:roomId/settings");
  return (
    <aside
      className="
        w-64
        h-screen
        bg-white
        border-r
        border-gray-200
        flex
        flex-col
      "
    >
      {/* ───────── Верх ───────── */}
      <div className="p-6 space-y-6">
        {/* Лого */}
        <div className="text-xl font-semibold text-gray-900">
          Shared<span className="text-green-500">Promises</span>
        </div>

        {/* Add wish */}
        {isAddWishPage || isRoomSettingsPage ? (
          <Link
            to={`/rooms/${roomId}`}
            className="
              block
              rounded-xl
              px-4
              py-2.5
              bg-green-500
              text-white
              text-sm
              font-medium
              text-center
              hover:bg-green-600
              transition
            "
          >
            ← Назад
          </Link>
        ) : (
          <Link
            to={`/rooms/${roomId}/new`}
            className="
              block
              rounded-xl
              px-4
              py-2.5
              bg-green-500
              text-white
              text-sm
              font-medium
              text-center
              hover:bg-green-600
              transition
            "
          >
            + Хочу ещё
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
      <div className="mt-auto p-6 border-t border-gray-100">
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
      className="
        flex
        items-center
        gap-3
        px-4
        py-2.5
        rounded-xl
        text-sm
        font-medium
        text-gray-700
        hover:bg-gray-100
        transition
      "
    >
      <span className="text-lg">{icon}</span>
      {label}
    </Link>
  );
}
