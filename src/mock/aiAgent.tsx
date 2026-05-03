export async function mockAgentReply(message: string) {
  return `Architect думает...\n\nТы написал: "${message}"\n\n(Следующий шаг — подключим реальный AI)`;
}