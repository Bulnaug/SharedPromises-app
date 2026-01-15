import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function AddWish() {
  const [text, setText] = useState("");
  const add = useMutation(api.wishes.add);

  return (
    <div className="flex gap-2">
      <input
        className="flex-1 border rounded px-3 py-2"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Хочу..."
      />
      <button
        onClick={() => {
          add({ text });
          setText("");
        }}
        className="bg-black text-white px-4 rounded"
      >
        Добавить
      </button>
    </div>
  );
}
