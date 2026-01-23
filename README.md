ошибок
🚀 Конспект: Настройка Clerk + Convex Аутентификации
📋 Предварительные требования
1. Установка пакетов
bash
npm install convex @convex-dev/clerk @clerk/clerk-react
2. Создание аккаунтов
Clerk Dashboard - создать приложение

Convex Dashboard - создать проект

🔧 Шаг 1: Настройка Clerk
1.1 Получите ключи из Clerk Dashboard
VITE_CLERK_PUBLISHABLE_KEY (начинается с pk_test_)

CLERK_SECRET_KEY (начинается с sk_test_)

1.2 Создайте JWT Template в Clerk
Dashboard → JWT Templates → New Template

Имя шаблона: convex (важно!)

Claims (настройки):

json
{
  "aud": "convex"
}
Settings:

Token lifetime: 60 минут

Allowed origins: добавить ваши домены:

http://localhost:5173

http://localhost:3000

Production домен

⚙️ Шаг 2: Настройка Convex
2.1 Добавьте переменные окружения в Convex Dashboard
text
CLERK_SECRET_KEY=sk_test_ваш_ключ
CLERK_PUBLISHABLE_KEY=pk_test_ваш_ключ
2.2 Файл окружения в проекте (.env.local)
bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ваш_ключ
VITE_CONVEX_URL=https://ваш-проект.convex.cloud
CONVEX_DEPLOYMENT=dev:ваш -проект
📁 Шаг 3: Структура файлов проекта
3.1 main.tsx / main.jsx
tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import App from "./App";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      afterSignOutUrl="/"
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <App />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </React.StrictMode>
);
3.2 convex/auth.config.ts (ВАЖНО!)
typescript
// Простая конфигурация - работает с JWT Template "convex"
export default {
  providers: [
    {
      domain: "https://ваш-домен.clerk.accounts.dev", // ваш Clerk домен
      applicationID: "convex", // должно совпадать с именем JWT Template
    },
  ],
};
3.3 convex/schema.ts
typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    externalId: v.string(), // Clerk user ID
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.string()),
    createdAt: v.number(),
  })
  .index("by_externalId", ["externalId"]),
  
  // другие таблицы...
});
3.4 convex/users.ts (базовые функции)
typescript
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Получить текущего пользователя
export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    
    return await ctx.db
      .query("users")
      .withIndex("by_externalId", q => 
        q.eq("externalId", identity.subject)
      )
      .first();
  },
});

// Создать/обновить пользователя
export const createOrUpdateMe = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    const existing = await ctx.db
      .query("users")
      .withIndex("by_externalId", q => 
        q.eq("externalId", identity.subject)
      )
      .first();
    
    if (existing) {
      // Обновляем существующего
      return await ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
      });
    } else {
      // Создаем нового
      return await ctx.db.insert("users", {
        externalId: identity.subject,
        name: args.name || identity.name,
        email: args.email || identity.email,
        createdAt: Date.now(),
      });
    }
  },
});
3.5 App.tsx (основной компонент)
tsx
import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

function App() {
  const me = useQuery(api.users.getMe);
  
  return (
    <div>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center">
          <SignIn />
        </div>
      </SignedOut>
      
      <SignedIn>
        {me === undefined ? (
          <div>Loading...</div>
        ) : me ? (
          <div>Welcome, {me.name}!</div>
        ) : (
          <div>Please complete your profile</div>
        )}
      </SignedIn>
    </div>
  );
}

export default App;
🔍 Шаг 4: Проверка настройки
4.1 Запуск проекта
bash
# Terminal 1: Запуск Convex
npx convex dev

# Terminal 2: Запуск приложения
npm run dev