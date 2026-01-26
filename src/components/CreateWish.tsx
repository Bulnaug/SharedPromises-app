import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export function CreateWish({ roomId }: { roomId: Id<"rooms"> }) {
  const createWish = useMutation(api.wishes.createWish);
  const [title, setTitle] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await createWish({
      roomId,
      title,
    });

    setTitle("");
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: 16 }}>
      <input
        placeholder="New wish..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}
