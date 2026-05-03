import { useState } from "react";
import { aiAgents } from "./agents";
import { AgentChat } from "./components/AgentChat";

export default function AIAgentsPage() {
  const [selectedAgentId, setSelectedAgentId] = useState(aiAgents[0].id);

  const selectedAgent = aiAgents.find((a) => a.id === selectedAgentId)!;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">AI Agents</h1>

      <div className="flex gap-2 flex-wrap">
        {aiAgents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => setSelectedAgentId(agent.id)}
            className={`px-4 py-2 rounded-xl border text-sm transition ${{
              true: "",
            }[
              agent.id === selectedAgentId
            ] || ""} ${
              agent.id === selectedAgentId
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-white text-gray-700 border-gray-300 hover:border-emerald-400"
            }`}
          >
            {agent.shortName}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border p-4 shadow-sm">
        <h2 className="text-lg font-medium">{selectedAgent.name}</h2>
        <p className="text-sm text-gray-500 mt-1">
          {selectedAgent.description}
        </p>

        <div className="mt-4 space-y-2">
          <div className="text-sm font-medium">Что он делает:</div>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            {selectedAgent.goals.map((goal) => (
              <li key={goal}>{goal}</li>
            ))}
          </ul>
        </div>

        <AgentChat agent={selectedAgent} />
      </div>
    </div>
  );
}
