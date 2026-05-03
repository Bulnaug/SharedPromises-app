import { aiAgents } from "./agents";
import { AgentChat } from "./components/AgentChat";

export default function AIAgentsPage() {
  const agent = aiAgents[0];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">AI Agents</h1>

      <div className="rounded-2xl border p-4 shadow-sm">
        <h2 className="text-lg font-medium">{agent.name}</h2>
        <p className="text-sm text-gray-500 mt-1">
          {agent.description}
        </p>

        <div className="mt-4 space-y-2">
          <div className="text-sm font-medium">Что он делает:</div>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            {agent.goals.map((goal) => (
              <li key={goal}>{goal}</li>
            ))}
          </ul>
        </div>

        <AgentChat />
      </div>
    </div>
  );
}
