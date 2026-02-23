import { useNavigate, useParams, Navigate } from "react-router-dom";
import type { Id } from "../../convex/_generated/dataModel";
import { RoomSettingsPage } from "./RoomSettings";

export default function RoomSettingsRoute() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  // Если roomId отсутствует — уходим (можно на /rooms)
  if (!roomId) {
    return <Navigate to="/rooms" replace />;
  }

  return (
    <RoomSettingsPage
      roomId={roomId as Id<"rooms">}
      back={() => navigate(-1)}
    />
  );
}