import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RoomsPage() {
  const rooms = useQuery(api.rooms.listMyRooms);
  const createRoom = useMutation(api.rooms.createRoom);
  const navigate = useNavigate();

  const [creating, setCreating] = useState(false);

  if (rooms === undefined) {
    return <div className="p-6">Загрузка комнат...</div>;
  }

  const handleCreateRoom = async () => {
    setCreating(true);
    const roomId = await createRoom({
      name: "Наша комната",
      role: "author",
    });
    navigate(`/rooms/${roomId}`);
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Мои комнаты</h1>

      {rooms.length === 0 ? (
        <div className="space-y-4">
          <p>У тебя пока нет комнат</p>
          <button
            onClick={handleCreateRoom}
            disabled={creating}
            className="px-4 py-2 bg-black text-white rounded"
          >
            {creating ? "Создание..." : "Создать комнату"}
          </button>
        </div>
      ) : (
        <ul className="space-y-3">
          {rooms.map(room => (
            <li
              key={room!._id}
              onClick={() => navigate(`/rooms/${room!._id}`)}
              className="p-4 border rounded cursor-pointer hover:bg-gray-50"
            >
              {room!.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
