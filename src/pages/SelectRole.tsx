import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@clerk/clerk-react"; // ← ДОБАВЬТЕ ЭТО
import { useState, useEffect } from "react"; // ← ДОБАВЬТЕ ЭТО

export default function SelectRole() {
  const { isSignedIn, getToken } = useAuth(); // ← ДОБАВЬТЕ ЭТО
  const me = useQuery(api.users.me);
  const createMe = useMutation(api.users.createMe);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ДЛЯ ОТЛАДКИ - проверяем аутентификацию Clerk
  useEffect(() => {
    const checkClerk = async () => {
      console.log("isSignedIn:", isSignedIn);
      if (isSignedIn) {
        const token = await getToken();
        console.log("Clerk token:", token);
      }
    };
    checkClerk();
  }, [isSignedIn, getToken]);

  if (me === undefined) {
    return <div>Loading user data...</div>;
  }

  // Если пользователь не авторизован в Clerk
  if (!isSignedIn) {
    return <div>Please sign in first</div>;
  }

  // Если пользователь уже создан в базе
  if (me) {
    return <div>Welcome! You are already registered as: {me.role}</div>;
  }

  const handleCreateUser = async (role: "author" | "partner") => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Creating user with role:", role);
      await createMe({ role });
      console.log("User created successfully");
    } catch (err: any) {
      console.error("Error creating user:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      {error && (
        <div className="text-red-500 mb-4 p-4 bg-red-50 rounded">
          Error: {error}
        </div>
      )}
      
      <div className="text-lg mb-4">Choose your role:</div>
      
      <button
        onClick={() => handleCreateUser("author")}
        disabled={loading}
        className="px-6 py-3 bg-black text-white rounded disabled:opacity-50 hover:bg-gray-800 transition"
      >
        {loading ? "Creating..." : "Я добавляю желания"}
      </button>
      
      <button
        onClick={() => handleCreateUser("partner")}
        disabled={loading}
        className="px-6 py-3 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50 transition"
      >
        {loading ? "Creating..." : "Я подтверждаю"}
      </button>
    </div>
  );
}