import { structureArchitectAgent } from "./agents/structureArchitectAgent";

export const aiAgents = [structureArchitectAgent] as const;

export type AIAgent = (typeof aiAgents)[number];
export type AIAgentId = AIAgent["id"];

export function getAIAgentById(agentId: AIAgentId): AIAgent {
  const agent = aiAgents.find((item) => item.id === agentId);

  if (!agent) {
    throw new Error(`AI agent not found: ${agentId}`);
  }

  return agent;
}
