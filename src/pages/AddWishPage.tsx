import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function AddWishPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const addWish = useMutation(api.wishes.add);
  const deleteWish = useMutation(api.wishes.deleteWish);

  // Берём список своих желаний
  const me = useQuery(api.users.getMe);
  const wishes = useQuery(api.wishes.list)?.filter(
    (w) => w.createdByRole === "author"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      await addWish({ text });
      setText("");
      alert("Желание добавлено ✅");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Ошибка при добавлении");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить это желание?")) return;

    try {
      await deleteWish({ id });
      alert("Желание удалено ✅");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Ошибка при удалении");
    }
  };

  if (!me) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold">Добавить новую</h2>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Что хотите?"
          className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-black text-white rounded disabled:opacity-50 hover:bg-gray-800 transition"
        >
          {loading ? "Добавляем..." : "Добавить"}
        </button>
      </form>

      {/* Список текущих желаний */}
      <div className="space-y-2 mt-4">
        <h2 className="text-xl font-bold">Мои хотелки</h2>
        {wishes?.length === 0 && <div className="text-gray-500">Пока нет желаний</div>}
        {wishes?.map((wish) => (
          <div
            key={wish._id}
            className="flex justify-between items-center p-2 border rounded shadow-sm"
          >
            <span>{wish.text}</span>
            <button
              onClick={() => handleDelete(wish._id)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
