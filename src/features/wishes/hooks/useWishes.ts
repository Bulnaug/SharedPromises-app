import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import type { Wish, Feedback, FeedbackType } from "../types";

export function useWishes(roomId: Id<"rooms">) {
  /* ───── data ───── */

  const wishesQuery = useQuery(
    api.wishes.getMyWishesByRoom,
    { roomId }
  );

  const createWish = useMutation(api.wishes.createWish);
  const deleteWish = useMutation(api.wishes.deleteWish);
  const updateWish = useMutation(api.wishes.updateWish);

  /* ───── state ───── */

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<Id<"wishes"> | null>(null);
  const [editValue, setEditValue] = useState("");

  const [feedback, setFeedback] = useState<Feedback | null>(null);

  /* ───── sync query → state ───── */

  useEffect(() => {
    if (wishesQuery) {
      setWishes(wishesQuery as Wish[]);
    }
  }, [wishesQuery]);

  /* ───── feedback ───── */

  const showFeedback = (type: FeedbackType) => {
    const map: Record<FeedbackType, string> = {
      saved: "Сохранено",
      added: "Желание добавлено",
      deleted: "Желание удалено",
    };

    setFeedback({ type, text: map[type] });

    setTimeout(() => {
      setFeedback(null);
    }, 1500);
  };

  /* ───── actions ───── */

  const addWish = async () => {
    if (!title.trim()) return;

    setLoading(true);
    try {
      await createWish({
        roomId,
        title: title.trim(),
      });

      setTitle("");
      showFeedback("added");
    } finally {
      setLoading(false);
    }
  };

  const removeWish = async (wishId: Id<"wishes">) => {
    await deleteWish({ wishId });
    showFeedback("deleted");
  };

  const startEdit = (wish: Wish) => {
    setEditingId(wish._id);
    setEditValue(wish.title);
  };

  const saveEdit = async (wish: Wish) => {
    if (!editValue.trim()) return;

    await updateWish({
      wishId: wish._id,
      title: editValue.trim(),
    });

    setEditingId(null);
    showFeedback("saved");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  return {
    wishes,
    isLoading: wishesQuery === undefined,
    title,
    setTitle,
    loading,
    addWish,
    removeWish,
    editingId,
    editValue,
    setEditValue,
    startEdit,
    saveEdit,
    cancelEdit,
    feedback,
  };
}
