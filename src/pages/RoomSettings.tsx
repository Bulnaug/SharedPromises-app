import { useState } from "react";
import { useRoom } from "../hooks/useRoom";
import type { Id } from "../../convex/_generated/dataModel";
import { useTranslation } from "react-i18next";

type Props = {
  back: () => void; // можно оставить, даже если не используешь
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

  // безопасно (не hook)
  const inviteLink = room
    ? `${window.location.origin}/join/${room.inviteCode}`
    : "";

  if (isLoading) return <LoadingBlock />;
  if (!room || !currentUserId) return <EmptyBlock title={t("roomNotFound") ?? "Room not found"} />;

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
    const ok = confirm(t("generateInviteLink"));
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
      `${t("removeMember")}${name ? ` "${name}"` : ""} ${t("fromRoom")}`
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
    <div className="space-y-8">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          {t("roomSettings")}
        </h1>
        <p className="text-sm text-gray-600">{t("roomSettingsDesc")}</p>
      </header>

      {/* INVITE */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{t("invite")}</h2>
            <p className="text-sm text-gray-600">{t("inviteDesc")}</p>
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
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">{t("members")}</h2>
          <p className="text-sm text-gray-600">
            {members.length}{" "}
            {members.length === 1 ? t("memberOne") : t("memberMany")}
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
                    <span className="font-medium text-gray-900 truncate">
                      {m.name}
                    </span>

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
      <section className="bg-white rounded-2xl shadow-sm border border-red-200 p-5 md:p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-red-700">Danger Zone</h2>
          <p className="text-sm text-gray-600">{t("dangerZoneDesc")}</p>
        </div>

        {!isOwner ? (
          <button
            onClick={onLeave}
            disabled={busyAction === "leave"}
            className="w-full sm:w-auto rounded-xl px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {busyAction === "leave" ? t("leavingAction") : t("leave")}
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
    </div>
  );
};

/* ---------------------------
   Tiny UI helpers
--------------------------- */

function LoadingBlock() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="h-4 w-44 bg-gray-100 rounded mb-4" />
      <div className="space-y-2">
        <div className="h-3 w-full bg-gray-100 rounded" />
        <div className="h-3 w-5/6 bg-gray-100 rounded" />
        <div className="h-3 w-2/3 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

function EmptyBlock({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
      <div className="text-gray-900 font-semibold">{title}</div>
      <div className="text-sm text-gray-500 mt-1">
        Room not found.
      </div>
    </div>
  );
}