import { useParams, Navigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";

export default function NewWishPage() {
  const { roomId } = useParams<{ roomId: string }>();

  const convexRoomId = roomId
    ? (roomId as Id<"rooms">)
    : null;

  const createWish = useMutation(api.wishes.createWish);

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  if (!convexRoomId) {
    return <Navigate to="/rooms" replace />;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setLoading(true);
      await createWish({
        roomId: convexRoomId,
        title,
      });
      window.history.back();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">
        New wish
      </h1>

      <form onSubmit={submit} className="space-y-4">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Wish title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Create
          </button>

          <button
            type="button"
            className="border px-4 py-2 rounded"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
