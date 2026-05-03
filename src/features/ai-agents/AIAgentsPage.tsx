import { structureArchitectAgent } from "./agents/structureArchitectAgent";

export default function AIAgentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">AI Agents</h1>

      <div className="rounded-2xl border p-4 shadow-sm">
        <h2 className="text-lg font-medium">{structureArchitectAgent.name}</h2>
        <p className="text-sm text-gray-500 mt-1">
          {structureArchitectAgent.description}
        </p>

        <div className="mt-4 space-y-2">
          <div className="text-sm font-medium">Что он делает:</div>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            {structureArchitectAgent.goals.map((goal) => (
              <li key={goal}>{goal}</li>
            ))}
          </ul>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          В следующем шаге здесь появится чат с агентом.
        </div>
      </div>
    </div>
  );
}
