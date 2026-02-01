import { useParams, Navigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import React from "react";

export default function RoomSettings() {
  const { roomId } = useParams<{ roomId: string }>();

  const convexRoomId = roomId
    ? (roomId as Id<"rooms">)
    : null;

  const room = useQuery(
    api.rooms.getRoom,
    convexRoomId ? { roomId: convexRoomId } : "skip"
  );

  const invite = useMutation(api.rooms.inviteToRoom);

  if (!convexRoomId) {
    return <Navigate to="/rooms" replace />;
  }

  if (room === undefined) {
    return <div className="p-6">Loading…</div>;
  }

  if (!room) {
    return <div className="p-6">Room not found</div>;
  }

  const inviteLink = `${window.location.origin}/join/${room._id}`;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">Room settings</h1>

      <section className="border rounded p-4 space-y-3">
        <h2 className="font-semibold">Invite partner</h2>

        <p className="text-sm text-gray-600">
          Share this link with your partner:
        </p>

        <input
          readOnly
          value={inviteLink}
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </section>

      <section className="border rounded p-4 space-y-2">
        <h2 className="font-semibold">Members</h2>

        <ul className="text-sm space-y-1">
          {room.users.map((user) => (
            <li key={user!._id}>
              • {user!.name}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
