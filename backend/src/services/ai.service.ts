import axios from "axios";
import { BadRequestError } from "../utils/errors";

type NimRole = "system" | "user" | "assistant";
type NimMessage = { role: NimRole; content: string };

interface ChatOptions {
  maxTokens?: number;
  temperature?: number;
  jsonMode?: boolean;
  model?: string;
}

/**
 * Universal Multi-Provider AI Caller with automatic failover across free models:
 * 1. Groq (Ultra-fast, Free, LLaMA/GPT-OSS)
 * 2. OpenRouter (Free community router: openrouter/free)
 * 3. NVIDIA NIM (Fallback)
 */
export async function nimChat(messages: NimMessage[], opts?: ChatOptions): Promise<string> {
  const groqKey = process.env.GROQ_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const nvidiaKey = process.env.NVIDIA_API_KEY || process.env.NVAPI_KEY;

  // 1. Try Groq (Primary - Fast & 100% Free)
  if (groqKey) {
    try {
      const payload: any = {
        model: "openai/gpt-oss-120b",
        messages,
        max_tokens: opts?.maxTokens ?? 4096,
        temperature: opts?.temperature ?? 0.2,
      };
      if (opts?.jsonMode) {
        payload.response_format = { type: "json_object" };
      }

      const { data } = await axios.post("https://api.groq.com/openai/v1/chat/completions", payload, {
        headers: {
          Authorization: `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        timeout: 30_000,
      });

      const responseContent = data.choices?.[0]?.message?.content;
      if (responseContent) {
        return responseContent;
      }
    } catch (groqErr: any) {
      console.warn("[AIService] Groq attempt failed, falling back to OpenRouter. Error:", groqErr?.response?.data || groqErr?.message);
    }
  }

  // 2. Fallback to OpenRouter (Free Model Router)
  if (openRouterKey) {
    try {
      const payload: any = {
        model: "openrouter/free",
        messages,
        max_tokens: opts?.maxTokens ?? 4096,
        temperature: opts?.temperature ?? 0.2,
      };
      if (opts?.jsonMode) {
        payload.response_format = { type: "json_object" };
      }

      const { data } = await axios.post("https://openrouter.ai/api/v1/chat/completions", payload, {
        headers: {
          Authorization: `Bearer ${openRouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://profilix.site",
          "X-Title": "Profilix Resume Parser",
        },
        timeout: 45_000,
      });

      const responseContent = data.choices?.[0]?.message?.content;
      if (responseContent) {
        return responseContent;
      }
    } catch (orErr: any) {
      console.warn("[AIService] OpenRouter attempt failed, falling back to NVIDIA. Error:", orErr?.response?.data || orErr?.message);
    }
  }

  // 3. Fallback to NVIDIA NIM
  if (nvidiaKey) {
    try {
      const payload: any = {
        model: "nvidia/llama-3.1-nemotron-70b-instruct",
        messages,
        max_tokens: opts?.maxTokens ?? 4096,
        temperature: opts?.temperature ?? 0.2,
      };
      if (opts?.jsonMode) {
        payload.response_format = { type: "json_object" };
      }

      const { data } = await axios.post("https://integrate.api.nvidia.com/v1/chat/completions", payload, {
        headers: {
          Authorization: `Bearer ${nvidiaKey}`,
          "Content-Type": "application/json",
        },
        timeout: 45_000,
      });

      const responseContent = data.choices?.[0]?.message?.content;
      if (responseContent) {
        return responseContent;
      }
    } catch (nvErr: any) {
      console.error("[AIService] NVIDIA NIM attempt failed. Error:", nvErr?.response?.data || nvErr?.message);
    }
  }

  throw new BadRequestError("All configured AI providers failed. Please check your API keys or network connection.");
}

function repairJson(json: string): string {
  let cleaned = json.replace(/^```json\n?|\n?```$/g, "").trim();

  // Basic repair for common LLM truncation/omission errors
  const bracketCount = (cleaned.match(/\[/g) || []).length;
  const closeBracketCount = (cleaned.match(/\]/g) || []).length;

  if (bracketCount > closeBracketCount && cleaned.endsWith("}}")) {
    cleaned = cleaned.slice(0, -2) + "]" + "}}";
  }

  return cleaned;
}

export async function tailorBulletsToJob(args: {
  jobDescription: string;
  bullets: string[];
  context?: string;
}) {
  const { jobDescription, bullets, context } = args;
  if (!jobDescription.trim()) throw new BadRequestError("Job description is required for AI tailoring");

  const system = `You are a world-class executive resume writer.
Rules:
1. Select and rewrite exactly 3 most relevant, high-impact bullet points. 
2. Maintain all technical technologies (e.g. 'React', 'Node.js').
3. Include numerical metrics and data (e.g. 'Reduced latency by 20%', '10+ features', '500+ users').
4. Use strong action verbs.
5. Keep bullets to 1 line, under 160 characters.
6. Return ONLY valid JSON.`;

  const user = [
    "Rewrite/Summarize these into 3 solid, technical, and quantified bullets for the following job.",
    `Job Description: ${jobDescription}`,
    `Context: ${context || "Professional Experience"}`,
    `Current Bullets:\n${bullets.map((b) => `- ${b}`).join("\n")}`,
    '\nFormat: {"bullets": ["Bullet 1 with numbers", "Bullet 2 with tech", "Bullet 3 with impact"]}',
  ].join("\n\n");

  const content = await nimChat([
    { role: "system", content: system },
    { role: "user", content: user },
  ], { maxTokens: 2048, temperature: 0.2, jsonMode: true });

  try {
    const parsed = JSON.parse(repairJson(content)) as { bullets?: unknown };
    if (!Array.isArray(parsed.bullets)) throw new Error("Invalid shape");
    return parsed.bullets.map((b) => String(b).trim()).filter(Boolean).slice(0, 3);
  } catch {
    return bullets.slice(0, 3);
  }
}

export async function batchTailorBullets(args: {
  jobDescription: string;
  items: Array<{ id: string; context: string; bullets: string[] }>;
}) {
  const { jobDescription, items } = args;
  if (!items.length) return {};

  const itemsString = items
    .map((item) => `[ID: ${item.id}]\nContext: ${item.context}\nBullets:\n${item.bullets.map((b) => `- ${b}`).join("\n")}`)
    .join("\n\n---\n\n");

  const system = `You are an expert resume writer focusing on high-impact, quantified professional profiles.
Instructions:
- Provide exactly 3 tailored bullet points for every single ID. 
- Retain technical precision (technologies, frameworks).
- Incorporate numbers, percentages, and metrics to quantify impact.
- Start every bullet with a strong action verb.
- Keep the resume concise to fit on one page.
- Return ONLY JSON mapping IDs to optimized string[].`;

  const user = [
    "Convert these resume items into exactly 3 technical and quantified bullets each, tailored to the job description.",
    `Job Description: ${jobDescription}`,
    `Items:\n${itemsString}`,
    '\nFormat: {"ID": ["Tech bullet", "Metric bullet", "Impact bullet"]}',
  ].join("\n\n");

  const content = await nimChat([
    { role: "system", content: system },
    { role: "user", content: user },
  ], { maxTokens: 4096, temperature: 0.2, jsonMode: true });

  try {
    const repaired = repairJson(content);
    const parsed = JSON.parse(repaired) as Record<string, string[]>;
    if (parsed && "results" in parsed && typeof (parsed as any).results === "object") {
      return (parsed as any).results as unknown as Record<string, string[]>;
    }
    return parsed as unknown as Record<string, string[]>;
  } catch (err) {
    console.error("[BatchAI] Parse failed. Content snippet:", content.slice(0, 100));
    return {};
  }
}
