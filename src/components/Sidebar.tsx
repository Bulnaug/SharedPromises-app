import { Link } from "react-router-dom";
import type { Id } from "../../convex/_generated/dataModel";

export function Sidebar({ roomId }: { roomId: Id<"rooms"> }) {
  return (
    <aside className="
     w-60
     bg-white
     border-r
     p-5
     space-y-4
     sticky top-0
     h-screen
    ">
      <Link
        to={`/rooms/${roomId}/new`}
        className="
            block
            rounded-xl
            px-4
            py-2.5
            bg-black
            text-white
            text-sm
            font-medium
            text-center
            hover:bg-gray-800
            transition
        "
      >
        + Add wish
      </Link>

      <Link
        to="/rooms"
        className="
            block
            rounded-xl
            px-4
            py-2.5
            bg-black
            text-white
            text-sm
            font-medium
            text-center
            hover:bg-gray-800
            transition
        "
      >
        ← back to rooms
      </Link>

      <Link
        to="/profile"
        className="
            block
            rounded-xl
            px-4
            py-2.5
            bg-black
            text-white
            text-sm
            font-medium
            text-center
            hover:bg-gray-800
            transition
        "
      >
        👤 My profile
      </Link>

      <Link
        to={`/rooms/${roomId}/settings`}
        className="
            block
            rounded-xl
            px-4
            py-2.5
            bg-black
            text-white
            text-sm
            font-medium
            text-center
            hover:bg-gray-800
            transition
        "
      >
        ⚙️ Settings
      </Link>
    </aside>
  );
}
