import { useAuth, useUser } from "@clerk/clerk-react";

export default function ProfilePage() {
  const { signOut } = useAuth();
  const { user } = useUser();

  // Получаем email корректно
  const email = user?.primaryEmailAddress?.emailAddress;

  return (
    <div className="max-w-md mx-auto p-8 flex flex-col items-center space-y-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold">Мой профиль</h1>
      
      <div className="text-gray-700 text-lg">
        {user?.firstName || email || "Неизвестный пользователь"}
      </div>

      <button
        onClick={() => signOut()}
        className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Выйти из аккаунта
      </button>
    </div>
  );
}
