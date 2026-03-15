import { useParams, Navigate } from "react-router-dom";
import type { Id } from "../../convex/_generated/dataModel";
import { UserWishes } from "../components/UserWishes";
import { ProgressBar } from "../components/ProgressBar";
import { calcProgress } from "../features/wishes/utils/progress";
import { useDashboard } from "../hooks/useDashboard";
import { Tracker } from "../features/tracker/components/Tracker";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import Spinner from "../components/Spinner";

export default function Dashboard() {
  const { roomId } = useParams<{ roomId: string }>();
  const convexRoomId = roomId ? (roomId as Id<"rooms">) : null;

  const { t } = useTranslation();
  const startDate = dayjs().startOf("month").format("YYYY-MM-DD");

  const { data, isLoading } = useDashboard(convexRoomId);

  if (!convexRoomId) return <Navigate to="/rooms" replace />;

  
  if (data === undefined) return <Spinner />;


  if (!data) return <EmptyBlock title="Room not found" />;

  const { room, wishesByUser, usersMap } = data;

  const allWishes = Object.values(wishesByUser).flat();
  const totalProgress = calcProgress(allWishes);

  return (
    <div className="relative space-y-8 text-slate-900 dark:text-slate-100">
      {isLoading && <TopLoadingOverlay />}

      {/* Header */}
      <header
        className="
          rounded-2xl border px-5 py-4 shadow-sm
          bg-white border-gray-100
          dark:bg-slate-800/60 dark:border-slate-700/60 dark:shadow-none
        "
      >
        <h1 className="text-xl md:text-2xl font-semibold text-center text-slate-900 dark:text-slate-100">
          {room.name}
        </h1>
      </header>

      {/* Tracker + progress */}
      <section
        className="
          rounded-2xl border p-5 md:p-6 space-y-5 shadow-sm
          bg-white border-gray-100
          dark:bg-slate-800/60 dark:border-slate-700/60 dark:shadow-none
        "
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {t("activityCalendar")}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <Tracker wishes={allWishes} startDate={startDate} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-300">
              {t("fullProgress")}
            </span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {totalProgress}%
            </span>
          </div>

          <ProgressBar value={totalProgress} />
        </div>
      </section>

      {/* User wishes */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(wishesByUser).map(([userId, wishes]) => {
          const user = usersMap[userId];
          if (!user) return null;

          return (
            <UserWishes
              key={userId}
              name={user.name || "Без имени"}
              wishes={wishes}
              userId={userId as Id<"users">}
            />
          );
        })}
      </section>
    </div>
  );
}

/* ---------------------------
   Tiny UI helpers
--------------------------- */

function TopLoadingOverlay() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10">
      <div
        className="
          mx-auto mt-2 w-fit
          rounded-full
          bg-white/80 dark:bg-slate-900/60
          border border-gray-200/60 dark:border-slate-700/60
          px-3 py-1
          text-xs
          text-slate-600 dark:text-slate-300
          shadow-sm
        "
      >
        Loading…
      </div>
    </div>
  );
}

function EmptyBlock({ title }: { title: string }) {
  return (
    <div className="bg-white dark:bg-gray-950 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
      <div className="text-gray-900 dark:text-slate-100 font-semibold">
        {title}
      </div>
      <div className="text-sm text-gray-500 dark:text-slate-400 mt-1">
        Room not found.
      </div>
    </div>
  );
}