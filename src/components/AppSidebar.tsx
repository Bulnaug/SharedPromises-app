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
      {/* ========================= MOBILE TOP BAR ========================= */}
      <header
        className="
          md:hidden sticky top-0 z-50
          bg-white border-b border-gray-200
          dark:bg-slate-900/90 dark:border-slate-800
          backdrop-blur
        "
      >
        <div className="px-3 py-2 flex items-center gap-2">
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 shrink-0">
            S<span className="text-emerald-500">P</span>
          </div>

          <div className="flex-1 flex">
            <div className="w-max">
              <TopActionButtonMobile action={topAction} />
            </div>
          </div>

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

      {/* ========================= DESKTOP SIDEBAR ========================= */}
      <aside
        className="
          hidden md:flex sticky top-0 h-dvh shrink-0 flex-col
          md:w-56 lg:w-64
          bg-white border-r border-gray-200
          dark:bg-slate-900 dark:border-slate-800
        "
      >
        <div className="p-6 space-y-6">
          <div className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Shared<span className="text-emerald-500">Promises</span>
          </div>

          <TopActionButtonDesktop action={topAction} />

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

        <div className="mt-auto p-6 border-t border-gray-100 dark:border-slate-800">
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

/* ========================= TOP ACTION ========================= */

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
}: any): TopAction {
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

/* ========================= BUTTONS ========================= */

function TopActionButtonMobile({ action }: { action: TopAction }) {
  const className = `
    w-full rounded-full
    bg-emerald-500 text-white
    hover:bg-emerald-600 transition
    dark:hover:bg-emerald-400
    px-4 py-2
    text-sm font-medium
    flex items-center justify-center gap-2
  `;

  const content = (
    <>
      <span>{action.mobileIcon}</span>
      <span className="truncate">{action.label}</span>
    </>
  );

  return action.kind === "link" ? (
    <Link to={action.to} className={className}>
      {content}
    </Link>
  ) : (
    <button onClick={action.onClick} className={className}>
      {content}
    </button>
  );
}

function TopActionButtonDesktop({ action }: { action: TopAction }) {
  const className = `
    block w-full rounded-xl
    bg-emerald-500 text-white
    hover:bg-emerald-600 transition
    dark:hover:bg-emerald-400
    px-4 py-2.5 text-center text-sm font-medium
  `;

  const content = (
    <>
      {action.desktopPrefix ? `${action.desktopPrefix} ` : ""}
      {action.label}
    </>
  );

  return action.kind === "link" ? (
    <Link to={action.to} className={className}>
      {content}
    </Link>
  ) : (
    <button onClick={action.onClick} className={className}>
      {content}
    </button>
  );
}

/* ========================= LINKS ========================= */

function SidebarLink({ to, icon, label, active }: any) {
  return (
    <Link
      to={to}
      className={[
        `
        flex items-center gap-3
        rounded-xl px-4 py-2.5
        text-sm font-medium transition
        hover:bg-gray-100
        dark:hover:bg-slate-800/60
        `,
        active
          ? "bg-gray-100 text-slate-900 dark:bg-slate-800/70 dark:text-slate-100"
          : "text-slate-700 dark:text-slate-300",
      ].join(" ")}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function IconLink({ to, icon, label, active }: any) {
  return (
    <Link
      to={to}
      className={[
        `
        w-10 h-10 rounded-xl
        flex items-center justify-center
        transition
        hover:bg-gray-100
        dark:hover:bg-slate-800/60
        `,
        active ? "bg-gray-100 dark:bg-slate-800/70" : "",
      ].join(" ")}
    >
      <span className="text-lg leading-none">{icon}</span>
    </Link>
  );
}