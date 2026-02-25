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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <label className="text-sm font-medium text-gray-700">
        <h1 className="text-xl font-semibold text-gray-900">
              {t("newWish")}
            </h1>
            <p className="text-sm text-gray-500">
               {t("newWishDesc")} 💚
            </p>
      </label>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t("wishExample")}
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        autoFocus
      />

      <button
        onClick={addWish}
        disabled={loading || !title.trim()}
        className="w-full bg-green-500 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-green-600 disabled:opacity-50 transition"
      >
        {t("add")}
      </button>
    </div>
  );
}
