import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export const useRoom = (roomId?: Id<"rooms">) => {
  const argsOrSkip = roomId ? { roomId } : "skip";

  // -------- QUERIES --------
  const room = useQuery(api.rooms.getById, argsOrSkip);
  const members = useQuery(api.rooms.getMembers, argsOrSkip);

  // если у тебя реально называется getMe — ок.
  // (Я бы в идеале называл me, но не принципиально.)
  const currentUser = useQuery(api.users.getMe);

  // -------- MUTATIONS --------
  const regenerateInvite = useMutation(api.rooms.regenerateInvite);
  const removeMemberMutation = useMutation(api.rooms.removeMember);
  const leaveRoomMutation = useMutation(api.rooms.leave);
  const deleteRoomMutation = useMutation(api.rooms.deleteRoom);

  // -------- ACTIONS --------
  const regenerateInviteLink = async () => {
    if (!roomId) return;
    await regenerateInvite({ roomId });
  };

  const removeMember = async (userId: Id<"users">) => {
    if (!roomId) return;
    await removeMemberMutation({ roomId, userId });
  };

  const leaveRoom = async () => {
    if (!roomId) return;
    await leaveRoomMutation({ roomId });
  };

  const deleteRoom = async () => {
    if (!roomId) return;
    await deleteRoomMutation({ roomId });
  };

  const isLoading =
    !!roomId &&
    (room === undefined || members === undefined || currentUser === undefined);

  return {
    room: room ?? null,
    members: members ?? [],
    currentUser,
    currentUserId: currentUser?._id ?? null,

    regenerateInviteLink,
    removeMember,
    leaveRoom,
    deleteRoom,

    isLoading,
  };
};