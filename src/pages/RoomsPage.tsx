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
      const roomId = await createRoom({ name: name.trim() });
      setName("");
      navigate(`/rooms/${roomId}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <main className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-center">
          Твои комнаты
        </h1>

        {/* Create room */}
        <form
          onSubmit={submit}
          className="bg-white rounded-2xl p-4 shadow-sm flex gap-2"
        >
          <input
            className="
              flex-1
              rounded-xl
              border
              border-gray-200
              px-4
              py-2
              text-sm
              focus:outline-none
              focus:ring-2
              focus:ring-black
            "
            placeholder="Название комнаты"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            disabled={loading}
            className="
              px-4
              py-2
              rounded-xl
              bg-green-500
              text-white
              text-sm
              font-medium
              disabled:opacity-50
              hover:bg-green-600
              transition
            "
          >
            Создать
          </button>
        </form>

        {/* Rooms list */}
        {rooms.length === 0 ? (
          <p className="text-center text-sm text-gray-500">
            You don’t have any rooms yet ✨
          </p>
        ) : (
          <ul className="space-y-3">
            {rooms.map((room) => (
              <li
                key={room._id}
                onClick={() => navigate(`/rooms/${room._id}`)}
                className="
                  bg-white
                  rounded-2xl
                  p-4
                  shadow-sm
                  cursor-pointer
                  hover:shadow
                  transition
                "
              >
                <div className="font-medium">
                  {room.name}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
