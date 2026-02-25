import { ProgressBar } from "./ProgressBar";
import { calcProgress } from "../features/wishes/utils/progress";
import type { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { WishItem } from "../features/wishes/components/WishItem";
import { useToggleWish } from "../features/wishes/hooks/useToggleWish";
import { useTranslation } from "react-i18next";

import type { Wish } from "../features/wishes/types";

type UserWishesProps = {
  name: string;
  wishes: Wish[];
  userId: Id<"users">; // текущий залогиненный пользователь
};

export function UserWishes({ name, wishes: initialWishes }: UserWishesProps) {
  const [wishes, setWishes] = useState(initialWishes);

  const progress = calcProgress(wishes);
  const { toggleWish } = useToggleWish(setWishes);
  const { t } = useTranslation();

  return (
    <section
      className="
        rounded-2xl border p-6 space-y-5 shadow-sm
        bg-white border-gray-100
        dark:bg-slate-800/60 dark:border-slate-700/60 dark:shadow-none
      "
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {t('wishesHeader')} {name}
        </h2>
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {progress}%
        </span>
      </div>

      <ProgressBar value={progress} />

      {wishes.length === 0 && (
        <p className="text-sm italic text-slate-500 dark:text-slate-400">
          {t('emptyWishes')} ✨
        </p>
      )}

      {wishes.length > 0 && (
        <ul className="space-y-2">
          <AnimatePresence>
            {wishes.map((wish) => (
              <WishItem
                key={wish._id.toString()}
                wish={wish}
                onToggle={toggleWish}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
