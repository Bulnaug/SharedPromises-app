import React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser, SignOutButton } from "@clerk/clerk-react";

export default function ProfilePage() {
  const me = useQuery(api.users.getMe);
  const updateName = useMutation(api.users.updateMyName);
  const { user } = useUser();

  const [name, setName] = React.useState("");

  React.useEffect(() => {
    if (me?.name) {
      setName(me.name);
    }
  }, [me]);

  if (me === undefined) {
    return <div className="p-6">Loading…</div>;
  }

  if (!me) {
    return <div className="p-6">Not authenticated</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-xl font-bold">My profile</h1>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <img
          src={user?.imageUrl}
          alt="avatar"
          className="w-16 h-16 rounded-full"
        />

        <a
          href="https://accounts.clerk.com"
          target="_blank"
          rel="noreferrer"
          className="text-sm underline"
        >
          Change photo
        </a>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Display name
        </label>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <button
          onClick={() => updateName({ name })}
          className="px-4 py-2 bg-black text-white rounded text-sm"
        >
          Save
        </button>
      </div>

      {/* Logout */}
      <div className="pt-6 border-t">
        <SignOutButton>
          <button className="text-sm text-red-600">
            Log out
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
