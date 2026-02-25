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
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {t("emptyWishes")} ✨
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {wishes.map((wish) => {
        const isEditing = editingId === wish._id;

        return (
          <li
            key={wish._id}
            className="
              group
              rounded-xl border p-4 flex items-center justify-between gap-4
              bg-white border-gray-100
              hover:bg-gray-50 transition
              dark:bg-slate-900/30 dark:border-slate-700/60
              dark:hover:bg-slate-700/30
            "
          >
            {isEditing ? (
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => saveEdit(wish)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit(wish);
                  if (e.key === "Escape") cancelEdit();
                }}
                className="
                  flex-1 text-sm
                  rounded-lg px-2 py-1
                  border border-transparent
                  bg-transparent
                  text-slate-900 dark:text-slate-100
                  outline-none
                  focus-visible:border-emerald-400/40
                  focus-visible:ring-2 focus-visible:ring-emerald-400/25
                "
              />
            ) : (
              <p className="text-sm text-slate-900 dark:text-slate-100 flex-1">
                {wish.title}
              </p>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => startEdit(wish)}
                className="
                  inline-flex items-center justify-center
                  rounded-lg p-2 transition
                  text-slate-500 hover:text-slate-700 hover:bg-gray-100
                  dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700/40
                "
                aria-label={t("edit") ?? "Edit"}
                title={t("edit") ?? "Edit"}
              >
                <Pencil size={14} />
              </button>

              <button
                onClick={() => removeWish(wish._id)}
                className="
                  text-xs font-medium transition
                  text-red-600 hover:text-red-700
                  dark:text-red-300 dark:hover:text-red-200
                "
              >
                {t("remove")}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}