import type { Wish } from "../types";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
  wishes: Wish[];
  editingId: Id<"wishes"> | null;
  editValue: string;
  setEditValue: (v: string) => void;
  startEdit: (wish: Wish) => void;
  saveEdit: (wish: Wish) => void;
  cancelEdit: () => void;
  removeWish: (id: Id<"wishes">) => void;
};

export function WishList({
  wishes,
  editingId,
  editValue,
  setEditValue,
  startEdit,
  saveEdit,
  cancelEdit,
  removeWish,
}: Props) {
  
const { t } = useTranslation();

  if (wishes.length === 0) {
    return (
      <p className="text-sm text-gray-400">
        {t("emptyWishes")} ✨
      </p>
    );
  }

  

  return (
    <ul className="space-y-2">
      {wishes.map((wish) => (
        <li
          key={wish._id}
          className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between gap-4"
        >
          {editingId === wish._id ? (
            <input
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => saveEdit(wish)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit(wish);
                if (e.key === "Escape") cancelEdit();
              }}
              className="flex-1 text-sm text-gray-800 bg-transparent outline-none"
            />
          ) : (
            <p className="text-sm text-gray-800 flex-1">
              {wish.title}
            </p>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => startEdit(wish)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              <Pencil size={14} />
            </button>

            <button
              onClick={() => removeWish(wish._id)}
              className="text-xs text-red-500 hover:text-red-600"
            >
              Удалить
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
