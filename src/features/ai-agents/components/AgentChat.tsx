import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { AIAgent } from "../agents";
import { projectContext } from "../projectContext";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function AgentChat({ agent }: { agent: AIAgent }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");

  const askAgent = useAction(api.aiAgents.askAgent);

  async function sendMessage() {
    const currentInput = input.trim();
    if (!currentInput || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: currentInput }]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const reply = await askAgent({
          message: `
        ${projectContext}

        ${fileContent ? `File content:\n${fileContent}` : ""}

        User request:
        ${currentInput}
        `,
          systemPrompt: agent.systemPrompt,
      });

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="h-80 overflow-y-auto rounded-xl border p-3 space-y-2">
        {messages.length === 0 && (
          <div className="text-sm text-gray-500">
            Сейчас выбран агент: {agent.name}. Он видит контекст проекта и может давать более точные советы.
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={message.role === "user" ? "text-right" : "text-left"}
          >
            <div
              className={
                message.role === "user"
                  ? "inline-block max-w-[85%] rounded-xl bg-emerald-500 px-3 py-2 text-left text-white"
                  : "inline-block max-w-[85%] whitespace-pre-wrap rounded-xl bg-gray-100 px-3 py-2 text-left text-slate-900"
              }
            >
              {message.content}
            </div>
          </div>
        ))}

        {loading && <div className="text-sm text-gray-400">{agent.shortName} думает...</div>}
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="file"
          accept=".ts,.tsx,.js,.jsx"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const text = await file.text();
            setFileContent(text);
          }}
        />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder={`Спроси ${agent.shortName}...`}
          className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-slate-900"
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="rounded-xl bg-emerald-500 px-4 py-2 text-white disabled:opacity-60"
        >
          Send
        </button>
      </div>
    </div>
  );
}
