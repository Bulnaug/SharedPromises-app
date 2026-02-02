import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export function useDashboard(roomId: Id<"rooms"> | null) {
  const data = useQuery(
    api.wishes.getWishesByRoomGrouped,
    roomId ? { roomId } : "skip"
  );

  const toggleFulfilled = useMutation(
    api.wishes.toggleWishFulfilled
  );

  return {
    data,
    toggleFulfilled,
  };
}
