import React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser, SignOutButton } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const me = useQuery(api.users.getMe);
  const updateName = useMutation(api.users.updateMyName);
  const { user } = useUser();
  const { t } = useTranslation();

  const [name, setName] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [status, setStatus] = React.useState<"idle" | "saved" | "error">("idle");
  const [errorText, setErrorText] = React.useState("");

  React.useEffect(() => {
    if (me?.name) setName(me.name);
  }, [me?.name]);

  if (me === undefined) return <LoadingBlock />;
  if (!me) return <EmptyBlock title={t("notAuthenticated") ?? "Not authenticated"} />;

  const trimmed = name.trim();
  const original = (me.name ?? "").trim();
  const isDirty = trimmed !== original;
  const canSave = !!trimmed && isDirty && !saving;

  async function onSave() {
    if (!canSave) return;

    setStatus("idle");
    setErrorText("");

    try {
      setSaving(true);
      await updateName({ name: trimmed });
      setStatus("saved");
      window.setTimeout(() => setStatus("idle"), 1400);
    } catch (e: any) {
      setStatus("error");
      setErrorText(e?.message ?? "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {t("myProfile")}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t("myProfileDesc")}
        </p>
      </header>

      {/* Account card */}
      <section
        className="
          rounded-2xl border p-5 md:p-6 space-y-4 shadow-sm
          bg-white border-gray-100
          focus-within:ring-2 focus-within:ring-emerald-400/30 focus-within:ring-offset-2
          focus-within:ring-offset-gray-50
          dark:bg-slate-800/60 dark:border-slate-700/60 dark:shadow-none
          dark:focus-within:ring-emerald-400/25
          dark:focus-within:ring-offset-slate-900
        "
      >
        <div className="flex items-center gap-4">
          <img
            src={user?.imageUrl}
            alt="avatar"
            className="
              w-14 h-14 md:w-16 md:h-16 rounded-full
              ring-1 ring-gray-200
              dark:ring-slate-700/60
            "
          />

          <div className="min-w-0">
            <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
              {me.name || "Без имени"}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 truncate">
              {user?.primaryEmailAddress?.emailAddress ?? ""}
            </div>
          </div>
        </div>
      </section>

      {/* Display name card */}
      <section
        className="
          rounded-2xl border p-5 md:p-6 space-y-4 shadow-sm
          bg-white border-gray-100
          dark:bg-slate-800/60 dark:border-slate-700/60 dark:shadow-none
        "
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {t("userName")}
          </h2>

          <div className="shrink-0">
            {status === "saved" && (
              <span
                className="
                  inline-flex items-center rounded-full px-2.5 py-1
                  text-xs font-medium
                  bg-emerald-50 text-emerald-700
                  dark:bg-emerald-500/15 dark:text-emerald-300
                "
              >
                {t("saved")}
              </span>
            )}

            {status === "error" && (
              <span
                className="
                  inline-flex items-center rounded-full px-2.5 py-1
                  text-xs font-medium
                  bg-red-50 text-red-700
                  dark:bg-red-500/15 dark:text-red-300
                "
              >
                {t("error")}
              </span>
            )}
          </div>
        </div>

        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setStatus("idle");
            setErrorText("");
          }}
          placeholder={t("addName")}
          className="
            w-full rounded-xl border px-3 py-2 text-sm
            border-gray-300 bg-white text-slate-900
            placeholder:text-slate-400
            focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50
            focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50
            dark:border-slate-700/60 dark:bg-slate-900/30 dark:text-slate-100
            dark:placeholder:text-slate-400
            dark:focus-visible:ring-offset-slate-900
          "
        />

        {status === "error" && errorText && (
          <div
            className="
              text-sm rounded-xl px-3 py-2
              bg-red-50 text-red-700
              dark:bg-red-500/10 dark:text-red-300
            "
          >
            {errorText}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={onSave}
            disabled={!canSave}
            className={[
              "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2",
              "focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-slate-900",
              canSave
                ? "bg-emerald-500 text-white hover:bg-emerald-600 dark:hover:bg-emerald-400"
                : "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-700/40 dark:text-slate-400",
            ].join(" ")}
          >
            {saving ? t("saveAction") : t("save")}
          </button>

          {isDirty && !saving && (
            <button
              onClick={() => setName(me.name ?? "")}
              className="
                inline-flex items-center justify-center
                rounded-xl px-3 py-2 text-sm font-medium transition
                border border-gray-300 hover:bg-gray-50
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 focus-visible:ring-offset-2
                focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-slate-900
                dark:border-slate-700/60 dark:text-slate-100 dark:hover:bg-slate-700/30
              "
            >
              {t("reset")}
            </button>
          )}
        </div>
      </section>

      {/* Logout card */}
      <section
        className="
          rounded-2xl border p-5 md:p-6 shadow-sm
          bg-white border-gray-100
          dark:bg-slate-800/60 dark:border-slate-700/60 dark:shadow-none
        "
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {t("session")}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t("signOutDesc")}
            </p>
          </div>

          <SignOutButton>
            <button
              className="
                text-sm font-medium
                text-red-600 underline underline-offset-4
                hover:text-red-700
                dark:text-red-300 dark:hover:text-red-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50 focus-visible:ring-offset-2
                focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-slate-900
              "
            >
              {t("signOut")}
            </button>
          </SignOutButton>
        </div>
      </section>
    </div>
  );
}

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
      <div className="h-4 w-40 rounded mb-4 bg-gray-100 dark:bg-slate-700/60" />
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
        Not authenticated
      </div>
    </div>
  );
}