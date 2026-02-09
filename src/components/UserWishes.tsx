import { ProgressBar } from "./ProgressBar";
import { calcProgress } from "../utils/progress";
import { isDoneToday } from "../utils/isDoneToday";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";
import type { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { WishItem } from "../features/wishes/components/WishItem";
import { useToggleWish } from "../features/wishes/hooks/useToggleWish";

import type { Wish } from "../features/wishes/types";

type UserWishesProps = {
  name: string;
  wishes: Wish[];
  userId: Id<"users">; // текущий залогиненный пользователь
};

export function UserWishes({ name, wishes: initialWishes }: UserWishesProps) {
  const [wishes, setWishes] = useState(initialWishes);

  const progress = calcProgress(wishes);

  // ✅ используем существующую мутацию toggleWishFulfilled
  const toggleWishFulfilled = useMutation(api.wishes.toggleWishFulfilled);

  const { toggleWish } = useToggleWish(setWishes);


  return (
    <section className="
      bg-white
      rounded-2xl
      shadow-sm
      border border-gray-100
      p-6
      space-y-5
    ">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Что получает {name}
        </h2>
        <span className="text-sm font-medium text-gray-500">
          {progress}%
        </span>
      </div>

      <ProgressBar value={progress} />

      {wishes.length === 0 ? (
        
        <p className="text-sm text-gray-400 italic">Пока здесь пусто ✨</p>
      ) : (
        <ul className="space-y-2">
          <AnimatePresence>
            {wishes.map((wish) => {
              return (
                <WishItem
                  key={wish._id.toString()}
                  wish={wish}
                  onToggle={toggleWish}
                />
            );
          })}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
