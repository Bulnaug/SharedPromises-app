import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useRef } from "react";

export function useDashboard(roomId: Id<"rooms"> | null) {
  const fresh = useQuery(
    api.wishes.getWishesByRoomGrouped,
    roomId ? { roomId } : "skip"
  );

  // ✅ держим последнее НЕ-undefined значение
  const lastRef = useRef<typeof fresh>(undefined);
  if (fresh !== undefined) {
    lastRef.current = fresh;
  }

  // Если fresh undefined (loading) — отдаём последнее значение
  const data = fresh === undefined ? lastRef.current : fresh;

  // loading имеет смысл только когда уже есть что показать
  const isLoading = fresh === undefined && lastRef.current !== undefined;

  const toggleFulfilled = useMutation(api.wishes.toggleWishFulfilled);
  const toggleDay = useMutation(api.wishes.toggleWishDay);

  return {
    data,
    isLoading,
    toggleFulfilled,
    toggleDay,
  };
}