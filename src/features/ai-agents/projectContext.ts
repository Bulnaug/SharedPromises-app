export const projectContext = `
Project: SharedPromises

Stack:
- React
- TypeScript
- Vite
- Tailwind CSS
- Clerk authentication
- Convex backend

Structure:
- src/App.tsx → routing
- src/layouts/ → layouts
- src/pages/ → страницы
- src/components/ → общие компоненты
- src/components/tasks/ → tasks feature
- src/features/ai-agents/ → AI агенты
- convex/ → backend

AI agents feature:
- AIAgentsPage.tsx
- agents.ts
- agents/*
- components/AgentChat.tsx

Architecture:
- feature-based approach
- small safe refactors
- разделение UI / логики / API
`;