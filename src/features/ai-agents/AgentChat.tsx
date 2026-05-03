import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function AgentChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askStructureArchitect = useAction(
    api.aiAgents.askStructureArchitect
  );

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const currentInput = input;
    const userMessage: Message = {
      role: "user",
      content: currentInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const reply = await askStructureArchitect({
        message: currentInput,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="h-80 overflow-y-auto border rounded-xl p-3 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.role === "user" ? "text-right" : "text-left"}
          >
            <div
              className={
                m.role === "user"
                  ? "inline-block bg-emerald-500 text-white px-3 py-2 rounded-xl"
                  : "inline-block bg-gray-100 text-slate-900 px-3 py-2 rounded-xl whitespace-pre-wrap"
              }
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && <div className="text-sm text-gray-400">Thinking...</div>}
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Спроси про архитектуру..."
          className="flex-1 border rounded-xl px-3 py-2 text-slate-900"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-emerald-500 text-white px-4 rounded-xl disabled:opacity-60"
        >
          Send
        </button>
      </div>
    </div>
  );
}