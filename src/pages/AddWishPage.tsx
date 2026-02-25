import { useParams, Navigate } from "react-router-dom";
import type { Id } from "../../convex/_generated/dataModel";
import { useWishes } from "../features/wishes/hooks/useWishes";
import { AddWishForm } from "../features/wishes/components/AddWishForm";
import { WishList } from "../features/wishes/components/WishList";
import { FeedbackToast } from "../features/wishes/components/FeedbackToast";
import { useTranslation } from "react-i18next";

export default function AddWishPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { t } = useTranslation();

  if (!roomId) return <Navigate to="/rooms" replace />;

  const convexRoomId = roomId as Id<"rooms">;
  const wishes = useWishes(convexRoomId);

  return (
    <div className="space-y-8">
      {/* Form */}
      <section
        className="
          rounded-2xl border p-5 md:p-6 shadow-sm
          bg-white border-gray-100
          focus-within:ring-2 focus-within:ring-emerald-400/25 focus-within:ring-offset-2
          focus-within:ring-offset-gray-50
          dark:bg-slate-800/60 dark:border-slate-700/60 dark:shadow-none
          dark:focus-within:ring-emerald-400/20
          dark:focus-within:ring-offset-slate-900
        "
      >
        <AddWishForm {...wishes} />
      </section>

      {/* List header */}
      <div className="px-1">
        <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          {t("yourWishes")}
        </h2>
      </div>

      {/* List */}
      <section
        className="
          rounded-2xl border p-3 md:p-4 shadow-sm
          bg-white border-gray-100
          dark:bg-slate-800/60 dark:border-slate-700/60 dark:shadow-none
        "
      >
        <WishList {...wishes} />
      </section>

      {/* Toast */}
      {wishes.feedback && <FeedbackToast text={wishes.feedback.text} />}
    </div>
  );
}