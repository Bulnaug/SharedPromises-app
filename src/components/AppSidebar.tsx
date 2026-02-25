import { Link, useMatch, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function AppSidebar() {
  const isRoomsPage = useMatch("/rooms");
  const isAddWishPage = useMatch("/rooms/:roomId/new");
  const isRoomSettingsPage = useMatch("/rooms/:roomId/settings");

  const { roomId } = useParams();
  const inRoom = Boolean(roomId);

  const navigate = useNavigate();
  const { t } = useTranslation();

  // ───────── Верхняя кнопка (clean) ─────────
  const topAction = getTopAction({
    inRoom,
    isAddWishPage: Boolean(isAddWishPage),
    isRoomSettingsPage: Boolean(isRoomSettingsPage),
    roomId,
    t,
    navigate,
  });

  return (
    <aside
      className="
        sticky top-0
        h-dvh
        bg-white
        border-r border-gray-200
        flex flex-col
        w-16 md:w-64
        shrink-0
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

        {/* ───────── Универсальная верхняя кнопка ───────── */}
        <TopActionButton action={topAction} />

        {/* ───────── Навигация ───────── */}
        <nav className="space-y-1">
          <SidebarLink
            to="/rooms"
            icon="🏠"
            label={t("myRooms")}
            active={!!isRoomsPage}
          />

          {/* ✅ Настройки комнаты — только если внутри комнаты */}
          {inRoom && (
            <SidebarLink
              to={`/rooms/${roomId}/settings`}
              icon="⚙️"
              label={t("roomSettings")}
              active={!!isRoomSettingsPage}
            />
          )}
        </nav>
      </div>

      {/* ───────── Низ ───────── */}
      <div className="mt-auto p-3 md:p-6 border-t border-gray-100">
        <SidebarLink to="/profile" icon="👤" label={t("myProfile")} />
      </div>
    </aside>
  );
}

/* =========================
   Top action helpers
========================= */

type TopAction =
  | { kind: "link"; to: string; label: string; mobileIcon: string; desktopPrefix?: string }
  | { kind: "button"; onClick: () => void; label: string; mobileIcon: string; desktopPrefix?: string };

function getTopAction({
  inRoom,
  isAddWishPage,
  isRoomSettingsPage,
  roomId,
  t,
  navigate,
}: {
  inRoom: boolean;
  isAddWishPage: boolean;
  isRoomSettingsPage: boolean;
  roomId?: string;
  t: (key: string) => string;
  navigate: ReturnType<typeof useNavigate>;
}): TopAction {
  // вне комнаты — обычный Back
  if (!inRoom) {
    return {
      kind: "button",
      onClick: () => navigate(-1),
      label: t("back"),
      mobileIcon: "←",
      desktopPrefix: "←",
    };
  }

  const backToRoomHref = roomId ? `/rooms/${roomId}` : "/rooms";
  const addWishHref = roomId ? `/rooms/${roomId}/new` : "/rooms";

  // внутри комнаты на страницах new/settings — Back в комнату
  if (isAddWishPage || isRoomSettingsPage) {
    return {
      kind: "link",
      to: backToRoomHref,
      label: t("back"),
      mobileIcon: "←",
      desktopPrefix: "←",
    };
  }

  // внутри комнаты на dashboard — Add wish
  return {
    kind: "link",
    to: addWishHref,
    label: t("add"),
    mobileIcon: "＋",
    desktopPrefix: "+",
  };
}

function TopActionButton({ action }: { action: TopAction }) {
  const baseClassName = `
    block rounded-xl
    bg-green-500 text-white
    hover:bg-green-600 transition
    px-0 py-2.5 md:px-4
    text-center
    w-full
  `;

  const content = (
    <>
      <span className="md:hidden text-lg leading-none">{action.mobileIcon}</span>
      <span className="hidden md:inline text-sm font-medium">
        {action.desktopPrefix ? `${action.desktopPrefix} ` : ""}
        {action.label}
      </span>
    </>
  );

  if (action.kind === "link") {
    return (
      <Link to={action.to} aria-label={action.label} title={action.label} className={baseClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={action.onClick} aria-label={action.label} title={action.label} className={baseClassName}>
      {content}
    </button>
  );
}

/* =========================
   Sidebar link
========================= */

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