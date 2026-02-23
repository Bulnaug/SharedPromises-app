import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import type { Id } from "../../convex/_generated/dataModel";

export default function JoinRoom() {
  const { inviteCode } = useParams<{ inviteCode: string }>();

  const joinByCode = useMutation(api.rooms.joinByCode);

  const [roomId, setRoomId] = React.useState<Id<"rooms"> | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!inviteCode) {
      setError("Invite code отсутствует в ссылке.");
      return;
    }
    if (roomId || error) return;

    joinByCode({ inviteCode })
      .then((id) => setRoomId(id))
      .catch((e) => setError(e?.message ?? "Не удалось присоединиться"));
  }, [inviteCode, roomId, error, joinByCode]);

  return (
    <>
      <SignedOut>
        <div className="p-6 text-center">
          <p className="mb-4">Please sign in to join the room</p>
        </div>
      </SignedOut>

      <SignedIn>
        {error && <div className="p-6 text-red-500 text-center">{error}</div>}

        {!error && !roomId && (
          <div className="p-6 text-center">Joining room…</div>
        )}

        {roomId && <Navigate to={`/rooms/${roomId}`} replace />}
      </SignedIn>
    </>
  );
}