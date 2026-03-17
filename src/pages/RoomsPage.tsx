import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageContainer } from "../layouts/PageContainer";
import Spinner from "../components/Spinner";

import { useMatch } from "react-router-dom";

export default function RoomsPage() {
  const navigate = useNavigate();

  const rooms = useQuery(api.rooms.getMyRooms);
  const createRoom = useMutation(api.rooms.createRoom);

  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (rooms === undefined) {
    return <Spinner className="min-h-[40vh]" />;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      const roomId = await createRoom({ name: name.trim() });
      setName("");
      navigate(`/rooms/${roomId}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer maxWidth="xl">
      <div className="w-full min-w-0 space-y-5 md:space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {t("yourRooms")}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t("roomsSubtitle") ?? "Create a room or open an existing one"}
          </p>
        </header>

        <form
          onSubmit={submit}
          className="
            rounded-2xl border p-3 md:p-4 shadow-sm
            bg-white border-gray-100
            focus-within:ring-2 focus-within:ring-emerald-400/25 focus-within:ring-offset-2
            focus-within:ring-offset-gray-50
            dark:bg-slate-800/60 dark:border-slate-700/60 dark:shadow-none
            dark:focus-within:ring-emerald-400/20
            dark:focus-within:ring-offset-slate-900
          "
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              className="
                min-w-0 flex-1 rounded-xl border px-4 py-3 text-sm
                border-gray-200 bg-gray-50 text-slate-900
                placeholder:text-slate-400
                focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40
                focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50
                dark:border-slate-700/60 dark:bg-slate-900/30 dark:text-slate-100
                dark:placeholder:text-slate-400
                dark:focus-visible:ring-emerald-400/30
                dark:focus-visible:ring-offset-slate-900
              "
              placeholder={t("roomName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="
                inline-flex shrink-0 items-center justify-center
                w-full sm:w-auto
                px-4 py-3 rounded-xl
                bg-emerald-500 text-white text-sm font-medium
                hover:bg-emerald-600 transition
                disabled:opacity-50 disabled:cursor-not-allowed
                dark:hover:bg-emerald-400
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2
                focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-slate-900
              "
            >
              <span className="sm:hidden">
                {loading ? t("createAction") : t("create")}
              </span>
              <span className="hidden sm:inline">
                {loading ? t("createAction") : t("create")}
              </span>
            </button>
          </div>
        </form>

        {rooms.length === 0 ? (
          <div
            className="
              rounded-2xl border border-dashed p-8 text-center
              border-gray-200 bg-white/70
              dark:border-slate-700/60 dark:bg-slate-800/30
            "
          >
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t("emptyRooms")} ✨
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-3 md:gap-4">
            {rooms.map((room) => (
              <li key={room._id}>
                <button
                  type="button"
                  onClick={() => navigate(`/rooms/${room._id}`)}
                  className="
                    w-full text-left rounded-2xl border p-4 md:p-5 transition
                    bg-white border-gray-100 shadow-sm hover:shadow
                    dark:bg-slate-800/60 dark:border-slate-700/60 dark:shadow-none
                    dark:hover:bg-slate-700/30
                  "
                >
                  <div className="truncate font-medium text-base md:text-lg text-slate-900 dark:text-slate-100">
                    {room.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {t("open")}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageContainer>
  );
}