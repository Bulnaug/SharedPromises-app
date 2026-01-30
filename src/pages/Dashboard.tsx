import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Dashboard() {
  const { roomId } = useParams();

  // ✅ ХУК ВСЕГДА ВЫЗЫВАЕТСЯ
  const room = useQuery(
    api.rooms.getRoom,
    roomId ? { roomId: roomId as any } : "skip"
  );

  const wishes = useQuery(
    api.wishes.getWishesByRoomGrouped,
    roomId ? { roomId: roomId as any } : "skip"
  );

  // ⬇️ дальше можно делать любые условия
  if (!roomId) {
    return <div>Комната не найдена</div>;
  }

  if (room === undefined || wishes === undefined) {
    return <div>Загрузка...</div>;
  }

  if (!room) {
    return <div>Комната не существует</div>;
  }

  return (
    <div className="flex h-full">
      {/* Левая колонка */}
      <aside className="w-64 border-r p-4">
        <a
          href={`/rooms/${roomId}/new`}
          className="text-blue-600 hover:underline"
        >
          ➕ Добавить желание
        </a>
      </aside>

      {/* Контент */}
      <main className="flex-1 p-6">
        <h1 className="text-xl font-semibold mb-4">{room.name}</h1>

        {/* дальше мы сгруппируем хотелки */}
      </main>
    </div>
  );
}
