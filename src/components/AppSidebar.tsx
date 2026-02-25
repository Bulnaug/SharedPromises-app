import { Link, useMatch, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function AppSidebar() {
  const isRoomsPage = useMatch("/rooms");
  const isAddWishPage = useMatch("/rooms/:roomId/new");
  const isRoomSettingsPage = useMatch("/rooms/:roomId/settings");
  const isProfilePage = useMatch("/profile");

  const { roomId } = useParams();
  const inRoom = Boolean(roomId);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const topAction = getTopAction({
    inRoom,
    isAddWishPage: Boolean(isAddWishPage),
    isRoomSettingsPage: Boolean(isRoomSettingsPage),
    roomId,
    t,
    navigate,
  });

  return (
    <>
      {/* =========================
          MOBILE TOP BAR (< md)
      ========================== */}
      <header className="md:hidden sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="px-3 py-2 flex items-center gap-2">
          {/* Logo */}
          <div className="text-lg font-semibold text-gray-900 shrink-0">
            S<span className="text-green-500">P</span>
          </div>

          {/* Main action */}
          <div className="flex-1 flex">
            <div className="w-max">
              <TopActionButtonMobile action={topAction} />
            </div>
          </div>

          {/* Nav icons */}
          <nav className="flex items-center gap-1 shrink-0">
            <IconLink
              to="/rooms"
              icon="🏠"
              label={t("myRooms")}
              active={!!isRoomsPage}
            />

            {inRoom && (
              <IconLink
                to={`/rooms/${roomId}/settings`}
                icon="⚙️"
                label={t("roomSettings")}
                active={!!isRoomSettingsPage}
              />
            )}

            <IconLink
              to="/profile"
              icon="👤"
              label={t("myProfile")}
              active={!!isProfilePage}
            />
          </nav>
        </div>
      </header>

      {/* =========================
          DESKTOP SIDEBAR (md+)
      ========================== */}
      <aside
        className="
          hidden md:flex
          sticky top-0
          h-dvh
          bg-white
          border-r border-gray-200
          flex-col
          w-64
          shrink-0
        "
      >
        <div className="p-6 space-y-6">
          {/* Logo */}
          <div className="text-xl font-semibold text-gray-900">
            Shared<span className="text-green-500">Promises</span>
          </div>

          {/* Top action */}
          <TopActionButtonDesktop action={topAction} />

          {/* Nav */}
          <nav className="space-y-1">
            <SidebarLink
              to="/rooms"
              icon="🏠"
              label={t("myRooms")}
              active={!!isRoomsPage}
            />

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

        <div className="mt-auto p-6 border-t border-gray-100">
          <SidebarLink
            to="/profile"
            icon="👤"
            label={t("myProfile")}
            active={!!isProfilePage}
          />
        </div>
      </aside>
    </>
  );
}

/* =========================
   Top action helpers
========================= */

type TopAction =
  | {
      kind: "link";
      to: string;
      label: string;
      mobileIcon: string;
      desktopPrefix?: string;
    }
  | {
      kind: "button";
      onClick: () => void;
      label: string;
      mobileIcon: string;
      desktopPrefix?: string;
    };

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

  if (isAddWishPage || isRoomSettingsPage) {
    return {
      kind: "link",
      to: backToRoomHref,
      label: t("back"),
      mobileIcon: "←",
      desktopPrefix: "←",
    };
  }

  return {
    kind: "link",
    to: addWishHref,
    label: t("add"),
    mobileIcon: "＋",
    desktopPrefix: "+",
  };
}

/* =========================
   Mobile top action button
========================= */

function TopActionButtonMobile({ action }: { action: TopAction }) {
  const className = `
    w-full
    rounded-full
    bg-green-500 text-white
    hover:bg-green-600 transition
    px-4 py-2
    text-sm font-medium
    flex items-center justify-center gap-2
  `;

  const content = (
    <>
      <span className="text-base leading-none">{action.mobileIcon}</span>
      <span className="truncate">{action.label}</span>
    </>
  );

  if (action.kind === "link") {
    return (
      <Link to={action.to} aria-label={action.label} title={action.label} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={action.onClick} aria-label={action.label} title={action.label} className={className}>
      {content}
    </button>
  );
}

/* =========================
   Desktop top action button
========================= */

function TopActionButtonDesktop({ action }: { action: TopAction }) {
  const className = `
    block rounded-xl
    bg-green-500 text-white
    hover:bg-green-600 transition
    px-4 py-2.5
    text-center
    w-full
  `;

  const content = (
    <span className="text-sm font-medium">
      {action.desktopPrefix ? `${action.desktopPrefix} ` : ""}
      {action.label}
    </span>
  );

  if (action.kind === "link") {
    return (
      <Link to={action.to} aria-label={action.label} title={action.label} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={action.onClick} aria-label={action.label} title={action.label} className={className}>
      {content}
    </button>
  );
}

/* =========================
   Links
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
        flex items-center gap-3
        rounded-xl
        text-sm font-medium
        hover:bg-gray-100 transition
        px-4 py-2.5
        justify-start
        `,
        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
      ].join(" ")}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function IconLink({
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
        w-10 h-10
        rounded-xl
        flex items-center justify-center
        hover:bg-gray-100 transition
        `,
        active ? "bg-gray-100" : "",
      ].join(" ")}
    >
      <span className="text-lg leading-none">{icon}</span>
    </Link>
  );
}