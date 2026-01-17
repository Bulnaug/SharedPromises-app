import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";

type Wish = Doc<"wishes">;
type Role = "author" | "partner";

type Props = {
  wish: Wish;
  role: Role;
};

const statusMap: Record<Wish["status"], string> = {
  pending: "⏳ В ожидании",
  marked_done: "👀 Проверяется",
  confirmed: "❤️ Подтверждено",
};

export default function WishCard({ wish, role }: Props) {
  const markDone = useMutation(api.wishes.markDone);
  const confirm = useMutation(api.wishes.confirm);
  const reject = useMutation(api.wishes.reject);

  return (
    <div className="p-4 bg-white rounded-xl shadow space-y-2">
      <p className="text-lg">{wish.text}</p>

      <p className="text-sm text-gray-500">
        {statusMap[wish.status]}
      </p>

      <div className="flex gap-2">
        {role === "author" && wish.status === "pending" && (
          <button
            onClick={() => markDone({ id: wish._id })}
            className="px-3 py-1 rounded bg-black text-white"
          >
            Я сделал
          </button>
        )}

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
