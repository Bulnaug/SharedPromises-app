import { structureArchitectAgent } from "./agents/structureArchitectAgent";
import { codeReviewerAgent } from "./agents/codeReviewerAgent";

export const aiAgents = [
  structureArchitectAgent,
  codeReviewerAgent,
] as const;

export type AIAgent = (typeof aiAgents)[number];
export type AIAgentId = AIAgent["id"];

export function getAIAgentById(agentId: AIAgentId): AIAgent {
  const agent = aiAgents.find((item) => item.id === agentId);

  if (!agent) {
    throw new Error(`AI agent not found: ${agentId}`);
  }

  return agent;
}
