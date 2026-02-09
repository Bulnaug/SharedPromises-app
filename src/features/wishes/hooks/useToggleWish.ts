import dayjs from "dayjs";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { isDoneToday } from "../../../utils/isDoneToday";

import type { Wish } from "../types";

export function useToggleWish(
  setWishes: React.Dispatch<React.SetStateAction<Wish[]>>
) {
  const toggleWishFulfilled = useMutation(
    api.wishes.toggleWishFulfilled
  );

  const today = dayjs().format("YYYY-MM-DD");

  const toggleWish = async (wish: Wish) => {
    const doneToday = isDoneToday(wish.completedDates);

    // ⚡ optimistic update
    setWishes((prev) =>
      prev.map((w) =>
        w._id === wish._id
          ? {
              ...w,
              completedDates: doneToday
                ? w.completedDates.filter((d) => d !== today)
                : [...w.completedDates, today],
            }
          : w
      )
    );

    // 🛰 сервер
    await toggleWishFulfilled({ wishId: wish._id });
  };

  return { toggleWish };
}
