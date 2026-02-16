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
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <label className="text-sm font-medium text-gray-700">
        <h1 className="text-xl font-semibold text-gray-900">
              Новое желание
            </h1>
            <p className="text-sm text-gray-500">
              Напиши что хочешь получать каждый день 💚
            </p>
      </label>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Например: Пожелания спокойной ночи"
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        autoFocus
      />

      <button
        onClick={addWish}
        disabled={loading || !title.trim()}
        className="w-full bg-green-500 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-green-600 disabled:opacity-50 transition"
      >
        Добавить
      </button>
    </div>
  );
}
