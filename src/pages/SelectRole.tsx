import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function SelectRole() {
  const me = useQuery(api.users.getMe);
  const createMe = useMutation(api.users.createMe);

  if (me === undefined) return null;

  if (me) return null;

  return (
    <div className="h-screen flex items-center justify-center gap-4">
      <button
        onClick={() => createMe({ role: "author" })}
        className="px-6 py-3 bg-black text-white rounded"
      >
        Я добавляю желания
      </button>

      <button
        onClick={() => createMe({ role: "partner" })}
        className="px-6 py-3 border rounded"
      >
        Я подтверждаю
      </button>
    </div>
  );
}
