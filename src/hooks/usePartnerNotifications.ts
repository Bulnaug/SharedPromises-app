import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function usePartnerNotifications() {
  const lastEvent = useQuery(api.wishes.lastEvent);
  const lastSeenId = useRef<string | null>(null);

  useEffect(() => {
    if (!lastEvent) return;

    if (lastSeenId.current === lastEvent._id) return;
    lastSeenId.current = lastEvent._id;

    if (lastEvent.status === "marked_done") {
      toast.info("👀 Партнёр отметил желание как выполненное");
    }

    if (lastEvent.status === "confirmed") {
      toast.success("❤️ Партнёр подтвердил желание");
    }
  }, [lastEvent]);
}
