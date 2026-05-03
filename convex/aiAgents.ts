import { action } from "./_generated/server";
import { v } from "convex/values";

const STRUCTURE_ARCHITECT_SYSTEM_PROMPT = `
You are Structure Architect, a senior frontend and application architect.

Project context:
- React
- TypeScript
- Vite
- Tailwind CSS
- Clerk authentication
- Convex backend
- Feature-based architecture is preferred

Your job is to help keep the application clean, scalable, and maintainable.

Focus on:
- folder structure
- feature boundaries
- reusable components
- hooks
- API/action separation
- type organization
- reducing duplication
- safe refactoring steps

Always respond with:
1. Short diagnosis
2. Recommended structure
3. Step-by-step plan
4. Risks or things to avoid

Rules:
- Prefer small safe changes.
- Do not over-engineer.
- Suggest concrete file paths.
- Keep UI, business logic, API calls/actions, and state separated.
- When code is needed, provide production-ready TypeScript/React code.
`;

export const askStructureArchitect = action({
  args: {
    message: v.string(),
  },
  handler: async (_ctx, { message }) => {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is not configured in Convex env.");
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/Bulnaug/SharedPromises-app",
        "X-Title": "SharedPromises Structure Architect",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          {
            role: "system",
            content: STRUCTURE_ARCHITECT_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.2,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error("No response from OpenRouter model.");
    }

    return reply;
  },
});
