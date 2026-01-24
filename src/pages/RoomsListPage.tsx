import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";

interface RoomsListPageProps {
  onSelectRoom: (roomId: string) => void;
}

export default function RoomsListPage({ onSelectRoom }: RoomsListPageProps) {
  const myRooms = useQuery(api.rooms.listMyRooms); // список комнат
  const createRoom = useMutation(api.rooms.createRoom);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!myRooms) return <div>Loading rooms...</div>;

  return (
    <div className="p-8 max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Мои комнаты</h1>

      {myRooms.length === 0 && <p>У вас пока нет комнат. Создайте новую!</p>}

      <div className="space-y-2">
        {myRooms.map((room: any) => (
          <button
            key={room._id}
            onClick={() => onSelectRoom(room._id)}
            className="block w-full text-left px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Комната {room._id}
          </button>
        ))}

        <button
          onClick={async () => {
            setError(null);
            setLoading(true);
            try {
              const newRoom = await createRoom();
              onSelectRoom(newRoom._id);
            } catch (e: any) {
              setError(e.message);
            } finally {
              setLoading(false);
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={loading}
        >
          Создать новую комнату
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
