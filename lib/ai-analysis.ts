/**
 * lib/ai-analysis.ts
 * Server-side only — ANTHROPIC_API_KEY nunca é exposta ao client.
 * Analisa o README de um projeto e retorna JSON estruturado via Claude API.
 */

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"

// Haiku: rápido, barato, suficiente para extração estruturada
const MODEL = "claude-haiku-4-5-20251001"

// Análise cacheada por 24h — README raramente muda
const REVALIDATE_SECONDS = 86_400

// README truncado para economizar tokens (primeiros 4000 chars cobrem 95% dos casos)
const README_MAX_CHARS = 4_000

export interface ProjectAnalysis {
  tagline: string
  problem: string
  solution: string
  audience: string
  highlights: [string, string, string]
  status: "production" | "development" | "archived"
}

const FALLBACK_ANALYSIS: ProjectAnalysis = {
  tagline: "Projeto em desenvolvimento",
  problem: "—",
  solution: "—",
  audience: "Desenvolvedores",
  highlights: ["TypeScript", "React", "Node.js"],
  status: "development",
}

function buildPrompt(projectName: string, readme: string): string {
  return `Analise o README do projeto "${projectName}" e retorne SOMENTE um objeto JSON válido (sem markdown, sem texto extra) com esta estrutura:

{
  "tagline": "frase de impacto de 1 linha, máximo 80 caracteres, em português",
  "problem": "qual problema o projeto resolve, 1-2 frases em português",
  "solution": "como o projeto resolve esse problema, 1-2 frases em português",
  "audience": "para quem é o projeto, 1 frase em português",
  "highlights": ["ponto forte 1", "ponto forte 2", "ponto forte 3"],
  "status": "production"
}

Para o campo "status" use apenas: "production", "development" ou "archived".
Se o README mencionar que está em produção/live/deployed, use "production".
Se estiver em construção/WIP, use "development".

README:
${readme.slice(0, README_MAX_CHARS)}`
}

function isValidAnalysis(data: unknown): data is ProjectAnalysis {
  if (typeof data !== "object" || data === null) return false
  const d = data as Record<string, unknown>
  return (
    typeof d.tagline === "string" &&
    typeof d.problem === "string" &&
    typeof d.solution === "string" &&
    typeof d.audience === "string" &&
    Array.isArray(d.highlights) &&
    d.highlights.length >= 3 &&
    ["production", "development", "archived"].includes(d.status as string)
  )
}

/**
 * Analisa o README com Claude e retorna um JSON estruturado.
 * Retorna FALLBACK_ANALYSIS em caso de README ausente, erro de API ou resposta inválida.
 */
export async function analyzeReadme(
  readme: string | null,
  projectName: string
): Promise<ProjectAnalysis> {
  if (!readme || readme.trim().length < 50) {
    return FALLBACK_ANALYSIS
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.warn("[ai-analysis] ANTHROPIC_API_KEY não configurada — usando fallback")
    return FALLBACK_ANALYSIS
  }

  try {
    const res = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 512,
        messages: [
          {
            role: "user",
            content: buildPrompt(projectName, readme),
          },
        ],
      }),
      next: { revalidate: REVALIDATE_SECONDS },
    })

    if (!res.ok) {
      throw new Error(`Anthropic API ${res.status} ${res.statusText}`)
    }

    const data = (await res.json()) as {
      content: Array<{ type: string; text: string }>
    }

    const rawText = data.content.find((c) => c.type === "text")?.text ?? ""

    // Remove possível markdown fence se o modelo insistir em incluir
    const jsonText = rawText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim()

    const parsed: unknown = JSON.parse(jsonText)

    if (!isValidAnalysis(parsed)) {
      throw new Error("Resposta da API não corresponde ao schema esperado")
    }

    return parsed
  } catch (err) {
    console.error("[ai-analysis] Erro ao analisar README:", err)
    return FALLBACK_ANALYSIS
  }
}
