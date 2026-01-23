копировать и вставлять в файл:

# 🚀 Настройка аутентификации Clerk + Convex

Полный гайд по интеграции **Clerk** и **Convex** для React-проекта.  

---

## 📋 Предварительные требования

- [ ] Установить пакеты:

```bash
npm install convex @convex-dev/clerk @clerk/clerk-react


 Создать аккаунты:

Clerk Dashboard → создать приложение

Convex Dashboard → создать проект

🔧 Шаг 1: Настройка Clerk
1️⃣ Получите ключи из Clerk Dashboard

VITE_CLERK_PUBLISHABLE_KEY → начинается с pk_test_...

CLERK_SECRET_KEY → начинается с sk_test_...

2️⃣ Создайте JWT Template

Перейдите: JWT Templates → New Template

Имя шаблона: convex (обязательно!)

Claims (JSON):

{
  "aud": "convex"
}


Настройки токена:

🕒 Token lifetime: 60 минут

🌐 Allowed origins:

http://localhost:5173

http://localhost:3000

Production домен

⚙️ Шаг 2: Настройка Convex
1️⃣ Переменные окружения в Convex Dashboard
CLERK_SECRET_KEY=sk_test_ваш_ключ
CLERK_PUBLISHABLE_KEY=pk_test_ваш_ключ

2️⃣ Файл окружения в проекте (.env.local)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ваш_ключ
VITE_CONVEX_URL=https://ваш-проект.convex.cloud
CONVEX_DEPLOYMENT=dev:ваш-проект

📁 Шаг 3: Структура файлов проекта
3.1 main.tsx / main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import App from "./App";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={convex}>
        <App />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </React.StrictMode>
);

3.2 convex/auth.config.ts
export default {
  providers: [
    {
      domain: "https://ваш-домен.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};

3.3 convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    externalId: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_externalId", ["externalId"]),
});

3.4 convex/users.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_externalId", q => q.eq("externalId", identity.subject))
      .first();
  },
});

export const createOrUpdateMe = mutation({
  args: { name: v.optional(v.string()), email: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("users")
      .withIndex("by_externalId", q => q.eq("externalId", identity.subject))
      .first();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
      });
    } else {
      return await ctx.db.insert("users", {
        externalId: identity.subject,
        name: args.name || identity.name,
        email: args.email || identity.email,
        createdAt: Date.now(),
      });
    }
  },
});

3.5 App.tsx
import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

function App() {
  const me = useQuery(api.users.getMe);

  return (
    <>
      <SignedIn>
        {me === undefined ? (
          <div>Loading...</div>
        ) : me ? (
          <div>Welcome, {me.name}!</div>
        ) : (
          <div>Please complete your profile</div>
        )}
      </SignedIn>

      <SignedOut>
        <SignIn />
      </SignedOut>
    </>
  );
}

export default App;

🔍 Шаг 4: Проверка настройки
# Terminal 1: Запуск Convex
npx convex dev

# Terminal 2: Запуск приложения
npm run dev


Откройте приложение в браузере и проверьте аутентификацию 🎉