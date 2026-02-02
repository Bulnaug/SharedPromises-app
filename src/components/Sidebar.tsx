import { Link } from "react-router-dom";
import type { Id } from "../../convex/_generated/dataModel";

export function Sidebar({ roomId }: { roomId: Id<"rooms"> }) {
  return (
    <aside className="w-56 border-r p-4 space-y-4">
      <Link
        to={`/rooms/${roomId}/new`}
        className="block rounded px-3 py-2 bg-black text-white text-sm text-center"
      >
        + Add wish
      </Link>

      <Link
        to="/rooms"
        className="block text-sm underline text-center"
      >
        ← back to rooms
      </Link>

      <Link
        to="/profile"
        className="block rounded px-3 py-2 text-sm hover:bg-gray-100"
      >
        👤 My profile
      </Link>

      <Link
        to={`/rooms/${roomId}/settings`}
        className="block rounded px-3 py-2 text-sm hover:bg-gray-100"
      >
        ⚙️ Settings
      </Link>
    </aside>
  );
}
