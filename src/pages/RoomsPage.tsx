import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RoomsPage() {
  const navigate = useNavigate();

  const rooms = useQuery(api.rooms.getMyRooms);
  const createRoom = useMutation(api.rooms.createRoom);

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (rooms === undefined) {
    return <div className="p-6">Loading rooms…</div>;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      const roomId = await createRoom({ name });
      setName("");
      navigate(`/rooms/${roomId}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your rooms</h1>

      {/* Create room */}
      <form onSubmit={submit} className="flex gap-2 mb-6">
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Room name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          Create
        </button>
      </form>

      {/* Rooms list */}
      {rooms.length === 0 ? (
        <p className="text-gray-500">
          You don’t have any rooms yet ✨
        </p>
      ) : (
        <ul className="space-y-2">
          {rooms.map((room) => (
            <li
              key={room._id}
              className="border rounded p-3 cursor-pointer hover:bg-gray-50"
              onClick={() => navigate(`/rooms/${room._id}`)}
            >
              <div className="font-medium">{room.name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
