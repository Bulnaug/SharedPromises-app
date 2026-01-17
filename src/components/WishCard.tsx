import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

type Role = "author" | "partner";

export default function WishCard({
  wish,
  role,
}: {
  wish: any;
  role: Role;
}) {
  const markDone = useMutation(api.wishes.markDone);
  const confirm = useMutation(api.wishes.confirm);
  const reject = useMutation(api.wishes.reject);

  return (
    <div className="p-4 bg-white rounded-xl shadow space-y-2">
      <p className="text-lg">{wish.text}</p>

      {/* STATUS */}
      <div className="text-sm text-gray-500">
        Статус: <b>{wish.status}</b>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2">
        {/* AUTHOR */}
        {role === "author" && wish.status === "pending" && (
          <button
            onClick={() => markDone({ id: wish._id })}
            className="px-3 py-1 rounded bg-black text-white"
          >
            Я сделал
          </button>
        )}

        {/* PARTNER */}
        {role === "partner" && wish.status === "marked_done" && (
          <>
            <button
              onClick={() => confirm({ id: wish._id })}
              className="px-3 py-1 rounded bg-green-600 text-white"
            >
              Подтвердить
            </button>

            <button
              onClick={() => reject({ id: wish._id })}
              className="px-3 py-1 rounded border"
            >
              Нет
            </button>
          </>
        )}
      </div>
    </div>
  );
}
