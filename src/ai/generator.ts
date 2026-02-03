import { openai } from "./openai";

const SYSTEM_PROMPT = `You are a specialized commit message generator.

Your task is to analyze the provided code diff and write a concise, conventional commit message that accurately describes the changes.

Rules:
- Use conventional commit format: type(scope): short description
- Valid types: feat, fix, docs, style, refactor, test, chore, ci, perf
- The description must be under 72 characters
- Write only the commit message — no explanations, no extra text
- If multiple logical changes exist, pick the most significant one as the primary type`;

export async function generateCommitMessage(diff: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    max_tokens: 200,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: diff },
    ],
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error(
      "OpenAI returned an empty response. The prompt may have been filtered.",
    );
  }

  return content.trim();
}
