import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@clerk/clerk-react";

export default function SelectRole() {
  const { isLoaded, isSignedIn } = useAuth();

  const me = useQuery(api.users.getMe);
  const createMe = useMutation(api.users.createMe);

  if (!isLoaded) return null;
  if (!isSignedIn) return null;

  if (me === undefined) return null;
  if (me) return null;

  return (
    <div className="h-screen flex items-center justify-center gap-4">
      <button
        onClick={() => createMe({ role: "author" })}
        className="px-6 py-3 bg-black text-white rounded"
      >
        Я добавляю желания
      </button>

      <button
        onClick={() => createMe({ role: "partner" })}
        className="px-6 py-3 border rounded"
      >
        Я подтверждаю
      </button>
    </div>
  );
}
