import axios from "axios";
import { BadRequestError } from "../utils/errors";

const NIM_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = "google/gemma-4-31b-it";

type NimRole = "system" | "user" | "assistant";
type NimMessage = { role: NimRole; content: string };

interface NimChatResponse {
  choices: Array<{
    message: { role: NimRole; content: string };
  }>;
}

function getApiKey(): string {
  const key = process.env.NVIDIA_API_KEY || process.env.NVAPI_KEY;
  if (!key) throw new BadRequestError("NVIDIA API key is not configured");
  return key;
}

export async function nimChat(messages: NimMessage[], opts?: { maxTokens?: number; temperature?: number }) {
  const apiKey = getApiKey();
  const payload = {
    model: MODEL,
    messages,
    max_tokens: opts?.maxTokens ?? 4096,
    temperature: opts?.temperature ?? 0.8,
    top_p: 0.95,
    stream: false,
    chat_template_kwargs: { enable_thinking: true },
  };

  const { data } = await axios.post<NimChatResponse>(NIM_URL, payload, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    timeout: 60_000,
  });

  return data.choices?.[0]?.message?.content ?? "";
}

export async function tailorBulletsToJob(args: {
  jobDescription: string;
  bullets: string[];
  context?: string;
}) {
  const { jobDescription, bullets, context } = args;
  if (!jobDescription.trim()) throw new BadRequestError("Job description is required for AI tailoring");

  const prompt = [
    "You are an expert resume writer optimizing for ATS.",
    "Rewrite the provided bullet points to better match the job description.",
    "Constraints:",
    "- Keep each bullet to 1 line, max ~160 characters.",
    "- Preserve truthfulness; do not invent technologies, numbers, or outcomes.",
    "- Use strong action verbs; emphasize impact and keywords from the job description.",
    "- Return ONLY valid JSON with shape: {\"bullets\": string[]}. No markdown.",
    context ? `Context:\n${context}` : null,
    `Job description:\n${jobDescription}`,
    `Bullets:\n${bullets.map((b) => `- ${b}`).join("\n")}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const content = await nimChat([{ role: "user", content: prompt }], { maxTokens: 2048, temperature: 0.7 });

  try {
    const parsed = JSON.parse(content) as { bullets?: unknown };
    if (!Array.isArray(parsed.bullets)) throw new Error("Invalid JSON shape");
    const cleaned = parsed.bullets
      .map((b) => String(b).trim())
      .filter(Boolean)
      .slice(0, 10);
    return cleaned;
  } catch {
    // If the model returns non-JSON, fall back to original bullets
    return bullets;
  }
}

