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
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          {t("myProfile")}
        </h1>
        <p className="text-sm text-gray-600">{t("myProfileDesc")}</p>
      </header>

      {/* Account card */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.imageUrl}
            alt="avatar"
            className="w-14 h-14 md:w-16 md:h-16 rounded-full ring-1 ring-gray-200"
          />

          <div className="min-w-0">
            <div className="font-medium text-gray-900 truncate">
              {me.name || "Без имени"}
            </div>
            <div className="text-sm text-gray-600 truncate">
              {user?.primaryEmailAddress?.emailAddress ?? ""}
            </div>
          </div>
        </div>
      </section>

      {/* Display name card */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-900">
            {t("userName")}
          </h2>

          <div className="shrink-0">
            {status === "saved" && (
              <span className="text-sm text-green-600">{t("saved")}</span>
            )}
            {status === "error" && (
              <span className="text-sm text-red-600">{t("error")}</span>
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
            w-full
            rounded-xl
            border border-gray-300
            px-3 py-2
            focus:outline-none
            focus:ring-2
            focus:ring-black/10
          "
        />

        {status === "error" && errorText && (
          <div className="text-sm text-red-600">{errorText}</div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={onSave}
            disabled={!canSave}
            className={[
              "px-4 py-2 rounded-xl text-sm font-medium transition",
              canSave
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-100 text-gray-400 cursor-not-allowed",
            ].join(" ")}
          >
            {saving ? t("saveAction") : t("save")}
          </button>

          {isDirty && !saving && (
            <button
              onClick={() => setName(me.name ?? "")}
              className="px-3 py-2 rounded-xl text-sm border border-gray-300 hover:bg-gray-50"
            >
              {t("reset")}
            </button>
          )}
        </div>
      </section>

      {/* Logout card */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {t("session")}
            </h2>
            <p className="text-sm text-gray-600">{t("signOutDesc")}</p>
          </div>

          <SignOutButton>
            <button className="text-sm font-medium text-red-600 underline underline-offset-4">
              {t("signOut")}
            </button>
          </SignOutButton>
        </div>
      </section>
    </div>
  );
}

/* ---------------------------
   Tiny UI helpers (same style)
--------------------------- */

function LoadingBlock() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="h-4 w-40 bg-gray-100 rounded mb-4" />
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
      <div className="text-sm text-gray-500 mt-1">Not authenticated</div>
    </div>
  );
}