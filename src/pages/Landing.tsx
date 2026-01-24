import { SignInButton, SignUpButton } from "@clerk/clerk-react";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Shared Promises</h1>

      <SignInButton mode="modal">
        <button className="px-6 py-3 bg-black text-white rounded">
          Войти
        </button>
      </SignInButton>

      <SignUpButton mode="modal">
        <button className="px-6 py-3 border rounded">
          Зарегистрироваться
        </button>
      </SignUpButton>
    </div>
  );
}
