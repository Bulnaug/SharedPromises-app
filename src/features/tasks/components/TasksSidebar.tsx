import { Link, useMatch, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  CheckSquare,
  Plus,
  User,
  ArrowLeft,
  Home,
  CalendarDays,
} from "lucide-react";

export function TasksSidebar() {
  const isTasksPage = useMatch("/tasks");
  const isNewTaskPage = useMatch("/tasks/new");
  const isTasksCalendarPage = useMatch("/tasks/calendar");
  const isProfilePage = useMatch("/profile");

  const navigate = useNavigate();
  const { t } = useTranslation();

  const topAction = getTopAction({
    isNewTaskPage: Boolean(isNewTaskPage),
    isTasksCalendarPage: Boolean(isTasksCalendarPage),
    navigate,
    t,
  });

  return (
    <>
      <header
        className="
          md:hidden sticky top-0 z-50
          border-b border-gray-200 bg-white/90 backdrop-blur
          dark:border-slate-800 dark:bg-slate-900/90
        "
      >
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="shrink-0 text-lg font-semibold text-slate-900 dark:text-slate-100">
            S<span className="text-emerald-500">P</span>
          </div>

          <div className="flex flex-1">
            <div className="w-max">
              <TopActionButtonMobile action={topAction} />
            </div>
          </div>

          <nav className="flex shrink-0 items-center gap-1">
            <IconLink
              to="/rooms"
              icon={<Home size={18} />}
              label={t("myRooms")}
              active={false}
            />

            <IconLink
              to="/tasks"
              icon={<CheckSquare size={18} />}
              label="Задачи"
              active={!!isTasksPage || !!isNewTaskPage}
            />

            <IconLink
              to="/tasks/calendar"
              icon={<CalendarDays size={18} />}
              label="Календарь задач"
              active={!!isTasksCalendarPage}
            />

            <IconLink
              to="/profile"
              icon={<User size={18} />}
              label={t("myProfile")}
              active={!!isProfilePage}
            />
          </nav>
        </div>
      </header>

      <aside
        className="
          hidden md:flex sticky top-0 h-dvh shrink-0 flex-col
          md:w-56 lg:w-64
          border-r border-gray-200 bg-white
          dark:border-slate-800 dark:bg-slate-900
        "
      >
        <div className="space-y-6 p-6">
          <div className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Shared<span className="text-emerald-500">Promises</span>
          </div>

          <TopActionButtonDesktop action={topAction} />

          <nav className="space-y-1">
            <SidebarLink
              to="/rooms"
              icon={<Home size={18} />}
              label={t("myRooms")}
              active={false}
            />

            <SidebarLink
              to="/tasks"
              icon={<CheckSquare size={18} />}
              label="Задачи"
              active={!!isTasksPage || !!isNewTaskPage}
            />

            <SidebarLink
              to="/tasks/calendar"
              icon={<CalendarDays size={18} />}
              label="Календарь"
              active={!!isTasksCalendarPage}
            />
          </nav>
        </div>

        <div className="mt-auto border-t border-gray-100 p-6 dark:border-slate-800">
          <SidebarLink
            to="/profile"
            icon={<User size={18} />}
            label={t("myProfile")}
            active={!!isProfilePage}
          />
        </div>
      </aside>
    </>
  );
}

type TopAction =
  | {
      kind: "link";
      to: string;
      label: string;
      mobileIcon: React.ReactNode;
      desktopPrefix?: string;
    }
  | {
      kind: "button";
      onClick: () => void;
      label: string;
      mobileIcon: React.ReactNode;
      desktopPrefix?: string;
    };

function getTopAction({
  isNewTaskPage,
  isTasksCalendarPage,
  t,
}: {
  isNewTaskPage: boolean;
  isTasksCalendarPage: boolean;
  navigate: ReturnType<typeof useNavigate>;
  t: (key: string) => string;
}): TopAction {
  if (isNewTaskPage || isTasksCalendarPage) {
    return {
      kind: "link",
      to: "/tasks",
      label: t("back"),
      mobileIcon: <ArrowLeft size={16} />,
      desktopPrefix: "←",
    };
  }

  return {
    kind: "link",
    to: "/tasks/new",
    label: "Новая задача",
    mobileIcon: <Plus size={16} />,
    desktopPrefix: "+",
  };
}

function TopActionButtonMobile({ action }: { action: TopAction }) {
  const className = `
    flex items-center justify-center gap-2
    w-full rounded-full
    bg-emerald-500 px-4 py-2
    text-sm font-medium text-white
    transition hover:bg-emerald-600
    dark:hover:bg-emerald-400
  `;

  const content = (
    <>
      <span className="shrink-0">{action.mobileIcon}</span>
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
    bg-emerald-500 px-4 py-2.5
    text-center text-sm font-medium text-white
    transition hover:bg-emerald-600
    dark:hover:bg-emerald-400
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

function SidebarLink({
  to,
  icon,
  label,
  active,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
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
      <span className="shrink-0 text-slate-500 dark:text-slate-400">
        {icon}
      </span>
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
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      className={[
        `
        flex h-10 w-10 items-center justify-center
        rounded-xl transition
        hover:bg-gray-100
        dark:hover:bg-slate-800/60
        `,
        active ? "bg-gray-100 dark:bg-slate-800/70" : "",
      ].join(" ")}
    >
      <span className="text-slate-700 dark:text-slate-300">{icon}</span>
    </Link>
  );
}
