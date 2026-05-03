import { action } from "./_generated/server";
import { v } from "convex/values";

const DEFAULT_SYSTEM_PROMPT = `
You are a helpful senior TypeScript and React coding assistant.

Project context:
- React
- TypeScript
- Vite
- Tailwind CSS
- Clerk authentication
- Convex backend

Rules:
- Prefer small safe changes.
- Do not over-engineer.
- Suggest concrete file paths when relevant.
- Keep UI, business logic, API calls/actions, and state separated.
`;

export const askAgent = action({
  args: {
    message: v.string(),
    systemPrompt: v.optional(v.string()),
  },
  handler: async (_ctx, { message, systemPrompt }) => {
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
        "X-Title": "SharedPromises AI Agents",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [
          {
            role: "system",
            content: systemPrompt ?? DEFAULT_SYSTEM_PROMPT,
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
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      data.choices?.[0]?.delta?.content?.trim();

    if (!reply) {
      console.error("OpenRouter empty response:", JSON.stringify(data, null, 2));
      throw new Error(
        "OpenRouter returned an empty response. Try again or reduce project/file context."
      );
    }

    return reply;
  },
});
