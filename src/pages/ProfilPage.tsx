import React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser, SignOutButton } from "@clerk/clerk-react";

export default function ProfilePage() {
  const me = useQuery(api.users.getMe);
  const updateName = useMutation(api.users.updateMyName);
  const { user } = useUser();

  const [name, setName] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [status, setStatus] = React.useState<"idle" | "saved" | "error">("idle");
  const [errorText, setErrorText] = React.useState("");

  React.useEffect(() => {
    if (me?.name) setName(me.name);
  }, [me?.name]);

  if (me === undefined) return <div>Loading…</div>;
  if (!me) return <div>Not authenticated</div>;

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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Мой профиль
        </h1>
        <p className="text-sm text-gray-600">
          Управление аккаунтом и отображаемым именем.
        </p>
      </div>

      {/* Account card */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center gap-4">
          <img
            src={user?.imageUrl}
            alt="avatar"
            className="w-16 h-16 rounded-full ring-1 ring-gray-200"
          />

          <div className="min-w-0">
            <div className="font-medium text-gray-900 truncate">
              {me.name || "Без имени"}
            </div>
            <div className="text-sm text-gray-600 truncate">
              {user?.primaryEmailAddress?.emailAddress ?? ""}
            </div>
          </div>

          {/* <div className="ml-auto">
            <a
              href="https://accounts.clerk.com/user"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium underline underline-offset-4"
            >
              Сменить фото
            </a>
          </div> */}
        </div>
      </section>

      {/* Display name card */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            Отображаемое имя
          </h2>

          {status === "saved" && (
            <span className="text-sm text-green-600">Сохранено</span>
          )}
          {status === "error" && (
            <span className="text-sm text-red-600">Ошибка</span>
          )}
        </div>

        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setStatus("idle");
            setErrorText("");
          }}
          placeholder="Введите имя"
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
            {saving ? "Сохраняю…" : "Сохранить"}
          </button>

          {isDirty && !saving && (
            <button
              onClick={() => setName(me.name ?? "")}
              className="px-3 py-2 rounded-xl text-sm border border-gray-300 hover:bg-gray-50"
            >
              Сбросить
            </button>
          )}
        </div>
      </section>

      {/* Logout card */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Сессия
            </h2>
            <p className="text-sm text-gray-600">
              Выйти из аккаунта на этом устройстве.
            </p>
          </div>

          <SignOutButton>
            <button className="text-sm font-medium text-red-600 underline underline-offset-4">
              Выйти
            </button>
          </SignOutButton>
        </div>
      </section>
    </div>
  );
}