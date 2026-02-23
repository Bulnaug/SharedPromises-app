import { useMemo, useState } from "react";
import { useRoom } from "../hooks/useRoom";
import type { Id } from "../../convex/_generated/dataModel";

type Props = {
  back: () => void;
  roomId: Id<"rooms">; // ✅ лучше обязательный
};

export const RoomSettingsPage = ({ back, roomId }: Props) => {
  const {
    room,
    members,
    currentUserId,
    regenerateInviteLink,
    removeMember,
    leaveRoom,
    deleteRoom,
    isLoading,
  } = useRoom(roomId);

  const [copied, setCopied] = useState(false);
  const [busyAction, setBusyAction] = useState<
    null | "regen" | `remove:${string}` | "leave" | "delete"
  >(null);

  // ✅ НЕ hook — безопасно
  const inviteLink = room
    ? `${window.location.origin}/join/${room.inviteCode}`
    : "";

  if (isLoading) return null; // или skeleton
  if (!room || !currentUserId) return null;

  const isOwner = room.ownerId === currentUserId;

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      alert("Не удалось скопировать. Скопируй вручную.");
    }
  };

  const onRegenerate = async () => {
    if (!isOwner) return;
    const ok = confirm(
      "Перегенерировать ссылку приглашения? Старая перестанет работать."
    );
    if (!ok) return;

    setBusyAction("regen");
    try {
      await regenerateInviteLink();
    } finally {
      setBusyAction(null);
    }
  };

  const onRemoveMember = async (userId: Id<"users">, name?: string) => {
    const ok = confirm(
      `Удалить участника${name ? ` "${name}"` : ""} из комнаты?`
    );
    if (!ok) return;

    setBusyAction(`remove:${userId}`);
    try {
      await removeMember(userId);
    } finally {
      setBusyAction(null);
    }
  };

  const onLeave = async () => {
    const ok = confirm("Точно хочешь покинуть комнату?");
    if (!ok) return;

    setBusyAction("leave");
    try {
      await leaveRoom();
    } finally {
      setBusyAction(null);
    }
  };

  const onDelete = async () => {
    const ok = confirm("Удалить комнату навсегда? Это действие нельзя отменить.");
    if (!ok) return;

    setBusyAction("delete");
    try {
      await deleteRoom();
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <button
        onClick={back}
        className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-2"
      >
        <span aria-hidden>←</span> Назад
      </button>

      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-gray-900">Параметры комнаты</h2>
        <p className="text-sm text-gray-600">
          Управляй приглашением, участниками и безопасными действиями.
        </p>
      </div>

      {/* INVITE */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Приглашение</h3>
            <p className="text-sm text-gray-600">
              Отправь ссылку партнёру, чтобы он присоединился к комнате.
            </p>
          </div>

          <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700">
            Code: <span className="font-mono">{room.inviteCode}</span>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={inviteLink}
            readOnly
            className="w-full flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 font-mono"
          />
          <button
            onClick={copyInvite}
            className="rounded-xl px-4 py-2 text-sm font-medium bg-gray-900 text-white hover:bg-black transition"
          >
            {copied ? "Скопировано" : "Копировать"}
          </button>
        </div>

        {isOwner && (
          <div className="pt-1">
            <button
              onClick={onRegenerate}
              disabled={busyAction === "regen"}
              className="rounded-xl px-4 py-2 text-sm font-medium border border-gray-200 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {busyAction === "regen" ? "Генерирую..." : "Перегенерировать ссылку"}
            </button>
          </div>
        )}
      </section>

      {/* MEMBERS */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Участники</h3>
          <p className="text-sm text-gray-600">
            {members.length} {members.length === 1 ? "участник" : "участника/участников"}
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {members.map((m) => {
            const isMe = m._id === currentUserId;
            const isMemberOwner = m._id === room.ownerId;
            const removing = busyAction === `remove:${m._id}`;

            return (
              <div key={m._id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900 truncate">{m.name}</span>

                    {isMe && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        Вы
                      </span>
                    )}

                    {isMemberOwner && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        Owner
                      </span>
                    )}
                  </div>

                  {/* если захочешь, можно показать id мелким шрифтом */}
                  {/* <div className="text-xs text-gray-400 font-mono truncate">{m._id}</div> */}
                </div>

                {isOwner && !isMe && (
                  <button
                    onClick={() => onRemoveMember(m._id, m.name)}
                    disabled={removing}
                    className="rounded-xl px-3 py-1.5 text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {removing ? "Удаляю..." : "Удалить"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* DANGER ZONE */}
      <section className="bg-white rounded-2xl border border-red-200 shadow-sm p-5 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-red-700">Danger Zone</h3>
          <p className="text-sm text-gray-600">
            Эти действия необратимы. Будь аккуратнее.
          </p>
        </div>

        {!isOwner ? (
          <button
            onClick={onLeave}
            disabled={busyAction === "leave"}
            className="w-full sm:w-auto rounded-xl px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {busyAction === "leave" ? "Выходим..." : "Покинуть комнату"}
          </button>
        ) : (
          <button
            onClick={onDelete}
            disabled={busyAction === "delete"}
            className="w-full sm:w-auto rounded-xl px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {busyAction === "delete" ? "Удаляю..." : "Удалить комнату"}
          </button>
        )}
      </section>
    </div>
  );
};