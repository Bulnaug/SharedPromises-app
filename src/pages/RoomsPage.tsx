import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();

  const room = useQuery(
    api.rooms.getRoom,
    roomId
      ? { roomId: roomId as Id<"rooms"> }
      : "skip"
  );

  const wishes = useQuery(
    api.wishes.getWishesByRoom,
    roomId
      ? { roomId: roomId as Id<"rooms"> }
      : "skip"
  );

  if (!room || !wishes) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{room.name}</h1>
      {/* дальше UI */}
    </div>
  );
}
