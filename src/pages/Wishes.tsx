import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import WishCard from "../components/WishCard";
import { useState } from "react";

type Wish = Doc<"wishes">;

export default function Wishes({ role }: { role: "author" | "partner" }) {
  const wishes = useQuery(api.wishes.list);

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">Ваши желания</h1>

      {/* Список желаний */}
      {wishes?.length === 0 && (
        <div className="text-gray-500">Здесь пока нет желаний</div>
      )}

      {wishes?.map((wish) => (
        <WishCard key={wish._id} wish={wish} role={role} />
      ))}

      {/* Форма добавления желания для автора */}
      {role === "author" && <AddWishForm />}
    </div>
  );
}

/* ---------- AddWishForm ---------- */

function AddWishForm() {
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
    } catch (err: any) {
      console.error("Error adding wish:", err);
      alert(err.message || "Ошибка при добавлении");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 flex gap-2 items-center"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Что хотите?"
        className="flex-1 px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-black text-white rounded disabled:opacity-50 hover:bg-gray-800 transition"
      >
        {loading ? "Добавляем..." : "Добавить"}
      </button>
    </form>
  );
}
