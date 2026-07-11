import OpenAI from "openai";

let client: OpenAI | null = null;

function getClient(): OpenAI | null {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return null;

  if (!client) {
    client = new OpenAI({
      baseURL: "https://api.deepseek.com/v1",
      apiKey,
    });
  }

  return client;
}

export async function callDeepseek(
  systemPrompt: string,
  userPrompt: string,
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const c = getClient();
  if (!c) {
    throw new Error(
      "DEEPSEEK_API_KEY não configurada. Configure a variável de ambiente para usar classificação com IA."
    );
  }

  const response = await c.chat.completions.create({
    model: "deepseek-chat",
    temperature: options?.temperature ?? 0.3,
    max_tokens: options?.maxTokens ?? 4096,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  return response.choices[0]?.message?.content ?? "";
}

export async function callDeepseekJSON<T>(
  systemPrompt: string,
  userPrompt: string,
  options?: { temperature?: number }
): Promise<T> {
  const raw = await callDeepseek(systemPrompt, userPrompt, {
    ...options,
    maxTokens: 8192,
  });

  const jsonMatch = raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("DeepSeek não retornou JSON válido");
  }

  return JSON.parse(jsonMatch[0]) as T;
}
