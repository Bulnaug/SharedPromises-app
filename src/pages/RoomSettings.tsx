import { useState } from "react";
import { useRoom } from "../hooks/useRoom";
import { Sidebar } from "../components/Sidebar";
import type { Id } from "../../convex/_generated/dataModel";
import { useTranslation } from "react-i18next";

type Props = {
  back: () => void;
  roomId: Id<"rooms">;
};

export const RoomSettingsPage = ({ roomId }: Props) => {
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

  const { t } = useTranslation();

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
      alert(t("copyFailed"));
    }
  };

  const onRegenerate = async () => {
    if (!isOwner) return;
    const ok = confirm(
      t("generateInviteLink")
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
      `${t("removeMember")} ${name ? ` "${name}"` : ""}  ${t("fromRoom")}`
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
    const ok = confirm(t("leaveConfirm"));
    if (!ok) return;

    setBusyAction("leave");
    try {
      await leaveRoom();
    } finally {
      setBusyAction(null);
    }
  };

  const onDelete = async () => {
    const ok = confirm(t("roomDeleteConfirm"));
    if (!ok) return;

    setBusyAction("delete");
    try {
      await deleteRoom();
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar roomId={room._id} />
      <main className="
        flex-1
        px-6
        py-8
        max-w-4xl
        mx-auto
        space-y-8
      ">

      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-gray-900">{t("roomSettings")}</h2>
        <p className="text-sm text-gray-600">
          {t("roomSettingsDesc")}
        </p>
      </div>

      {/* INVITE */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t("invite")}</h3>
            <p className="text-sm text-gray-600">
              {t("inviteDesc")}
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
            {copied ? t("copied") : t("copy")}
          </button>
        </div>

        {isOwner && (
          <div className="pt-1">
            <button
              onClick={onRegenerate}
              disabled={busyAction === "regen"}
              className="rounded-xl px-4 py-2 text-sm font-medium border border-gray-200 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {busyAction === "regen" ? t("generate") : t("generateNew")}
            </button>
          </div>
        )}
      </section>

      {/* MEMBERS */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t("members")}</h3>
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
                        {t("you")}
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
                    {removing ? t("removeAction") : t("remove")}
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
            {t("dangerZoneDesc")}
          </p>
        </div>

        {!isOwner ? (
          <button
            onClick={onLeave}
            disabled={busyAction === "leave"}
            className="w-full sm:w-auto rounded-xl px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {busyAction === "leave" ? t("leavingAction") :  t("leave")}
          </button>
        ) : (
          <button
            onClick={onDelete}
            disabled={busyAction === "delete"}
            className="w-full sm:w-auto rounded-xl px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {busyAction === "delete" ? t("deleteAction") : t("deleteRoom")}
          </button>
        )}
      </section>
      </main>
    </div>
  );
};