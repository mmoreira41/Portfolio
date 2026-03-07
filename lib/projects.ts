/**
 * lib/projects.ts
 * Single source of truth for project metadata.
 * Safe to import in both Server and Client Components (no server-only code).
 */

export interface ProjectConfig {
  id: string           // slug usado nas rotas /projetos/[slug]
  name: string
  year: string
  role: string
  description: string
  techs: string[]
  githubRepo: string   // nome exato do repo no GitHub
  live: string | null
  previewColor: string
  previewEmoji: string
}

export const PROJECTS: ProjectConfig[] = [
  {
    id: "finnko",
    name: "Finnko",
    year: "2024",
    role: "Full-Stack Dev",
    description:
      "App de gestão financeira pessoal com sincronização em tempo real. CRUD de contas, 33 categorias, transferências e relatórios.",
    techs: ["React 19", "TypeScript", "Supabase", "Recharts", "Tailwind"],
    githubRepo: "repofink",
    live: null,
    previewColor: "#0f172a",
    previewEmoji: "💰",
  },
  {
    id: "custozero",
    name: "custoZero",
    year: "2024",
    role: "Full-Stack + Design",
    description:
      "Diagnóstico financeiro que revela desperdício com assinaturas em menos de 5 minutos. Relatório PDF gerado no browser.",
    techs: ["React 19", "Vite", "Supabase", "jsPDF", "Kiwify", "Framer Motion"],
    githubRepo: "custoZero",
    live: "#",
    previewColor: "#1a3a2a",
    previewEmoji: "💸",
  },
  {
    id: "audittool",
    name: "AuditTool",
    year: "2025",
    role: "Full-Stack Dev",
    description:
      "Plataforma para análise de NF-e com IA. Parsing real de XML fiscal, dashboard por cliente e análise automatizada.",
    techs: ["Next.js 15", "TypeScript", "Supabase", "shadcn/ui", "Zod"],
    githubRepo: "audittool",  // atualizar quando o repo for criado no GitHub
    live: null,
    previewColor: "#1a1a3a",
    previewEmoji: "🧾",
  },
]

export function getProjectBySlug(slug: string): ProjectConfig | undefined {
  const normalized = slug.trim().toLowerCase()
  return PROJECTS.find((p) => p.id.toLowerCase() === normalized)
}
