import { useState } from "react";
import { useRoom } from "../hooks/useRoom";
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

  const inviteLink = room ? `${window.location.origin}/join/${room.inviteCode}` : "";

  if (isLoading) return <LoadingBlock />;
  if (!room || !currentUserId)
    return <EmptyBlock title={t("roomNotFound") ?? "Room not found"} />;

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
    const ok = confirm(`${t("removeMember")}${name ? ` "${name}"` : ""} ${t("fromRoom")}`);
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

  const btnBase =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition " +
    "disabled:opacity-60 disabled:cursor-not-allowed " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-slate-900";

  const btnPrimary =
    btnBase +
    " bg-emerald-500 text-white hover:bg-emerald-600 " +
    "dark:bg-emerald-500 dark:hover:bg-emerald-400";

  const btnSecondary =
    btnBase +
    " border border-gray-200 bg-white text-slate-900 hover:bg-gray-50 " +
    "dark:border-slate-700/60 dark:bg-slate-900/20 dark:text-slate-100 dark:hover:bg-slate-700/30";

  const btnDanger =
    btnBase +
    " bg-red-600 text-white hover:bg-red-700 " +
    "dark:bg-red-500/15 dark:text-red-300 dark:hover:bg-red-500/25 " +
    "focus-visible:ring-red-400/60";

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {t("roomSettings")}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t("roomSettingsDesc")}
        </p>
      </header>

      {/* INVITE */}
      <section
        className="
          rounded-2xl border p-5 md:p-6 space-y-4 shadow-sm
          bg-white border-gray-100
          focus-within:ring-2 focus-within:ring-emerald-400/25 focus-within:ring-offset-2
          focus-within:ring-offset-gray-50
          dark:bg-slate-800/60 dark:border-slate-700/60 dark:shadow-none
          dark:focus-within:ring-emerald-400/20
          dark:focus-within:ring-offset-slate-900
        "
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {t("invite")}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t("inviteDesc")}
            </p>
          </div>

          <span
            className="
              inline-flex items-center gap-1
              text-xs font-medium px-2.5 py-1 rounded-full
              bg-gray-100 text-slate-700
              dark:bg-slate-700/40 dark:text-slate-200
            "
          >
            Code: <span className="font-mono">{room.inviteCode}</span>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={inviteLink}
            readOnly
            className="
              w-full flex-1 rounded-xl border px-3 py-2 text-sm font-mono
              border-gray-200 bg-gray-50 text-slate-800
              focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40
              focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50
              dark:border-slate-700/60 dark:bg-slate-900/30 dark:text-slate-200
              dark:focus-visible:ring-emerald-400/30
              dark:focus-visible:ring-offset-slate-900
            "
          />
          <button
            onClick={copyInvite}
            className={btnPrimary}
          >
            {copied ? t("copied") : t("copy")}
          </button>
        </div>

        {isOwner && (
          <div className="pt-1">
            <button
              onClick={onRegenerate}
              disabled={busyAction === "regen"}
              className={btnSecondary}
            >
              {busyAction === "regen" ? t("generate") : t("generateNew")}
            </button>
          </div>
        )}
      </section>

      {/* MEMBERS */}
      <section
        className="
          rounded-2xl border p-5 md:p-6 space-y-4 shadow-sm
          bg-white border-gray-100
          dark:bg-slate-800/60 dark:border-slate-700/60 dark:shadow-none
        "
      >
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {t("members")}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {members.length} {members.length === 1 ? t("memberOne") : t("memberMany")}
          </p>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-slate-700/60">
          {members.map((m) => {
            const isMe = m._id === currentUserId;
            const isMemberOwner = m._id === room.ownerId;
            const removing = busyAction === `remove:${m._id}`;

            return (
              <div key={m._id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-slate-900 dark:text-slate-100 truncate">
                      {m.name}
                    </span>

                    {isMe && (
                      <span
                        className="
                          inline-flex items-center rounded-full px-2.5 py-1
                          text-xs font-medium
                          bg-slate-100 text-slate-700
                          dark:bg-slate-700/40 dark:text-slate-200
                        "
                      >
                        {t("you")}
                      </span>
                    )}

                    {isMemberOwner && (
                      <span
                        className="
                          inline-flex items-center rounded-full px-2.5 py-1
                          text-xs font-medium
                          bg-sky-50 text-sky-700
                          dark:bg-sky-500/15 dark:text-sky-300
                        "
                      >
                        Owner
                      </span>
                    )}
                  </div>
                </div>

                {isOwner && !isMe && (
                  <button
                    onClick={() => onRemoveMember(m._id, m.name)}
                    disabled={removing}
                    className={btnDanger + " px-3 py-1.5"}
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
      <section
        className="
          rounded-2xl border p-5 md:p-6 space-y-4 shadow-sm
          bg-white border-red-200
          focus-within:ring-2 focus-within:ring-red-400/25 focus-within:ring-offset-2
          focus-within:ring-offset-gray-50
          dark:bg-slate-800/60 dark:border-red-500/30 dark:shadow-none
          dark:focus-within:ring-red-400/20
          dark:focus-within:ring-offset-slate-900
        "
      >
        <div>
          <h2 className="text-base font-semibold text-red-700 dark:text-red-300">
            Danger Zone
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t("dangerZoneDesc")}
          </p>
        </div>

        {!isOwner ? (
          <button
            onClick={onLeave}
            disabled={busyAction === "leave"}
            className={btnDanger}
          >
            {busyAction === "leave" ? t("leavingAction") : t("leave")}
          </button>
        ) : (
          <button
            onClick={onDelete}
            disabled={busyAction === "delete"}
            className={btnDanger}
          >
            {busyAction === "delete" ? t("deleteAction") : t("deleteRoom")}
          </button>
        )}
      </section>
    </div>
  );
};

/* --------------------------- Tiny UI helpers --------------------------- */

function LoadingBlock() {
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
        <div className="h-3 w-2/3 rounded bg-gray-100 dark:bg-slate-700/60" />
      </div>
    </div>
  );
}

function EmptyBlock({ title }: { title: string }) {
  return (
    <div
      className="
        rounded-2xl border p-6 text-center shadow-sm
        bg-white border-gray-100
        dark:bg-slate-800/60 dark:border-slate-700/60 dark:shadow-none
      "
    >
      <div className="font-semibold text-slate-900 dark:text-slate-100">{title}</div>
      <div className="text-sm mt-1 text-slate-500 dark:text-slate-400">
        Room not found.
      </div>
    </div>
  );
}