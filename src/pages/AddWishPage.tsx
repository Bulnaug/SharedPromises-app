import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function AddWishPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const addWish = useMutation(api.wishes.add);

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

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold">Добавить новое желание</h2>
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
    </div>
  );
}
