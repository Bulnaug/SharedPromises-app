import { useNavigate, useParams } from "react-router-dom";
import type { Id } from "../../convex/_generated/dataModel";
import { RoomSettingsPage } from "./RoomSettings";

export default function RoomSettingsRoute() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  // roomId из URL — строка. Convex Id в runtime тоже строка, так что безопасно cast’им.
  const convexRoomId = roomId as Id<"rooms"> | undefined;

  return (
    <RoomSettingsPage
      roomId={convexRoomId}
      back={() => navigate(-1)}
    />
  );
}