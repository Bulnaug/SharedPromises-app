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
        bg-white dark:bg-gray-950 dark:border-gray-800
        border-r border-gray-200
        flex flex-col
        w-16 md:w-64
      "
    >
      <div className="p-3 md:p-6 space-y-3 md:space-y-6">
        <div className="flex items-center justify-center md:justify-start">
          <div className="md:hidden text-lg font-semibold text-gray-900">
            S<span className="text-green-500">P</span>
          </div>

          <div className="hidden md:block text-xl font-semibold text-gray-900">
            Shared<span className="text-green-500">Promises</span>
          </div>
        </div>

        {isAddWishPage || isRoomSettingsPage ? (
          <Link
            to={backHref}
            aria-label={t("back")}
            title={t("back")}
            className="
              block rounded-xl
              bg-green-500 text-white
              hover:bg-green-600 transition
              px-0 py-2.5 md:px-4
              text-center
            "
          >
            <span className="md:hidden text-lg leading-none">←</span>
            <span className="hidden md:inline text-sm font-medium">← {t("back")}</span>
          </Link>
        ) : (
          <Link
            to={addHref}
            aria-label={t("add")}
            title={t("add")}
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
              + {t("add")}
            </span>
          </Link>
        )}

        
        <nav className="space-y-1">
          <SidebarLink to="/rooms" icon="🏠" label={t("myRooms")} />
          <SidebarLink
            to={`/rooms/${roomId}/settings`}
            icon="⚙️"
            label={t("roomSettings")}
          />
        </nav>
      </div>

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
}: {
  to: string;
  icon: string;
  label: string;
}) {
  return (
    <Link
      to={to}
      title={label}
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