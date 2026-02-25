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
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 px-6 py-8">
        <div className="max-w-xl mx-auto space-y-8">
          <AddWishForm {...wishes} />
            <h2 className="text-sm font-semibold text-gray-600">
              {t("yourWishes")}
            </h2>
          <WishList {...wishes} />
        </div>
      </main>

      {wishes.feedback && (
        <FeedbackToast text={wishes.feedback.text} />
      )}
    </div>
  );
}
