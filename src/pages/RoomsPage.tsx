import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageContainer } from "../layouts/PageContainer";

export default function RoomsPage() {
  const navigate = useNavigate();

  const rooms = useQuery(api.rooms.getMyRooms);
  const createRoom = useMutation(api.rooms.createRoom);

  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (rooms === undefined) {
    return (
      <div
        className="
          rounded-2xl border p-6 shadow-sm
          bg-white border-gray-100
          dark:bg-slate-800/60 dark:border-slate-700/60 dark:shadow-none
        "
      >
        <div className="h-4 w-44 rounded mb-4 bg-gray-100 dark:bg-slate-700/60" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-gray-100 dark:bg-slate-700/60" />
          <div className="h-3 w-5/6 rounded bg-gray-100 dark:bg-slate-700/60" />
        </div>
      </div>
    );
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
      <h1 className="text-2xl font-semibold text-center text-slate-900 dark:text-slate-100">
        {t("yourRooms")}
      </h1>

      {/* Create room */}
      <form
        onSubmit={submit}
        className="
          rounded-2xl border p-4 shadow-sm flex gap-2
          bg-white border-gray-100
          focus-within:ring-2 focus-within:ring-emerald-400/25 focus-within:ring-offset-2
          focus-within:ring-offset-gray-50
          dark:bg-slate-800/60 dark:border-slate-700/60 dark:shadow-none
          dark:focus-within:ring-emerald-400/20
          dark:focus-within:ring-offset-slate-900
        "
      >
        <input
          className="
            flex-1 rounded-xl border px-4 py-2 text-sm
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
          disabled={loading}
          className="
            inline-flex items-center justify-center
            px-4 py-2 rounded-xl
            bg-emerald-500 text-white text-sm font-medium
            hover:bg-emerald-600 transition
            disabled:opacity-50 disabled:cursor-not-allowed
            dark:hover:bg-emerald-400
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2
            focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-slate-900
          "
        >
          {loading ? t("createAction") : t("create")}
        </button>
      </form>

      {/* Rooms list */}
      {rooms.length === 0 ? (
        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          {t("emptyRooms")} ✨
        </p>
      ) : (
        <ul className="space-y-3">
          {rooms.map((room) => (
            <li
              key={room._id}
              onClick={() => navigate(`/rooms/${room._id}`)}
              className="
                cursor-pointer rounded-2xl border p-4 transition
                bg-white border-gray-100 shadow-sm hover:shadow
                dark:bg-slate-800/60 dark:border-slate-700/60 dark:shadow-none
                dark:hover:bg-slate-700/30
              "
            >
              <div className="font-medium text-slate-900 dark:text-slate-100">
                {room.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t("open")}
              </div>
            </li>
          ))}
        </ul>
      )}
    </PageContainer>
  );
}