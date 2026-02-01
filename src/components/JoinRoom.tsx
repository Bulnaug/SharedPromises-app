import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

export default function JoinRoom() {
  const { roomId } = useParams<{ roomId: string }>();

  const me = useQuery(api.users.getMe);
  const joinRoom = useMutation(api.rooms.inviteToRoom);

  const [joined, setJoined] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!roomId || !me || joined) return;

    joinRoom({ roomId: roomId as Id<"rooms"> })
      .then(() => setJoined(true))
      .catch((e) => setError(e.message));
  }, [roomId, me, joined, joinRoom]);

  return (
    <>
      <SignedOut>
        <div className="p-6 text-center">
          <p className="mb-4">Please sign in to join the room</p>
        </div>
      </SignedOut>

      <SignedIn>
        {error && (
          <div className="p-6 text-red-500 text-center">
            {error}
          </div>
        )}

        {!joined && (
          <div className="p-6 text-center">
            Joining room…
          </div>
        )}

        {joined && (
          <Navigate
            to={`/rooms/${roomId}`}
            replace
          />
        )}
      </SignedIn>
    </>
  );
}
