import { useTranslation } from "react-i18next";

type Props = {
  title: string;
  setTitle: (value: string) => void;
  addWish: () => void;
  loading: boolean;
};

export function AddWishForm({
  title,
  setTitle,
  addWish,
  loading,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          {t("newWish")}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t("newWishDesc")} 💚
        </p>
      </div>

      {/* Input */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t("wishExample")}
        autoFocus
        className="
          w-full rounded-xl border px-4 py-2.5 text-sm
          border-gray-200 bg-gray-50 text-slate-900
          placeholder:text-slate-400
          focus:outline-none
          focus-visible:ring-2 focus-visible:ring-emerald-400/40
          focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50
          dark:border-slate-700/60 dark:bg-slate-900/30 dark:text-slate-100
          dark:placeholder:text-slate-400
          dark:focus-visible:ring-emerald-400/30
          dark:focus-visible:ring-offset-slate-900
        "
      />

      {/* Button */}
      <button
        onClick={addWish}
        disabled={loading || !title.trim()}
        className="
          w-full inline-flex items-center justify-center
          rounded-xl py-2.5 text-sm font-medium transition
          bg-emerald-500 text-white hover:bg-emerald-600
          disabled:opacity-50 disabled:cursor-not-allowed
          dark:hover:bg-emerald-400
          focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-emerald-400/60
          focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50
          dark:focus-visible:ring-offset-slate-900
        "
      >
        {loading ? t("addAction") : t("add")}
      </button>
    </div>
  );
}