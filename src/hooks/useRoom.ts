import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export const useRoom = (roomId?: Id<"rooms">) => {
  // -------- QUERIES --------
  const room = useQuery(
    api.rooms.getById,
    roomId ? { roomId } : "skip"
  );

  const members = useQuery(
    api.rooms.getMembers,
    roomId ? { roomId } : "skip"
  );

  const currentUser = useQuery(api.users.getMe);

  // -------- MUTATIONS --------
  const regenerateInvite = useMutation(
    api.rooms.regenerateInvite
  );

  const removeMemberMutation = useMutation(
    api.rooms.removeMember
  );

  const leaveRoomMutation = useMutation(
    api.rooms.leave
  );

  const deleteRoomMutation = useMutation(
    api.rooms.deleteRoom
  );

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

  return {
    room,
    members: members ?? [],
    currentUserId: currentUser?._id,
    regenerateInviteLink,
    removeMember,
    leaveRoom,
    deleteRoom,
    isLoading: room === undefined || members === undefined,
  };
};
