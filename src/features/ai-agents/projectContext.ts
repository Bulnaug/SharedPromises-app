export const projectContext = `
Project: SharedPromises

Stack:
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Clerk authentication
- Convex backend

Current high-level structure:
- src/App.tsx: application routing and auth gates
- src/layouts/AppLayout.tsx: authenticated app shell
- src/pages/: main route pages such as rooms, dashboard, profile, settings
- src/components/: shared and legacy components
- src/components/tasks/: existing tasks feature area
- src/features/ai-agents/: AI agents feature
- convex/: Convex backend functions, actions, schema and generated API

AI agents feature structure:
- src/features/ai-agents/AIAgentsPage.tsx: page for selecting and using agents
- src/features/ai-agents/agents.ts: registry of available agents
- src/features/ai-agents/agents/structureArchitectAgent.ts: architecture-focused agent config
- src/features/ai-agents/agents/codeReviewerAgent.ts: review-focused agent config
- src/features/ai-agents/components/AgentChat.tsx: reusable chat UI for selected agent
- src/features/ai-agents/projectContext.ts: compact project context sent to agents
- convex/aiAgents.ts: Convex action that calls OpenRouter

Architecture direction:
- Prefer feature-based organization for new functionality.
- Keep feature-specific UI, hooks, types, and helpers inside src/features/<feature>/.
- Keep shared reusable UI and utilities outside feature folders only when used by multiple features.
- Keep Convex calls behind hooks/components instead of scattering low-level API details.
- Avoid large global refactors. Prefer small safe commits.

Rules for suggestions:
- Suggest concrete file paths.
- Mention migration risks.
- Prefer changes that can be implemented in one small commit.
- Do not assume files exist unless they are listed in this context or pasted by the user.
`;
