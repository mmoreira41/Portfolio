import { notFound } from "next/navigation"
import Link from "next/link"
import { getProjectBySlug, PROJECTS } from "@/lib/projects"
import { fetchRepoDetails, GITHUB_USERNAME } from "@/lib/github"
import { analyzeReadme } from "@/lib/ai-analysis"
import type { RepoDetails } from "@/types/github"
import type { ProjectAnalysis } from "@/lib/ai-analysis"

// ─── Route config ─────────────────────────────────────────────────────────────

export const dynamicParams = true // allow unknown slugs to render on-demand

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  const name = project?.name ?? slug
  return {
    title: `${name} | Miguel Moreira`,
    description: project?.description ?? "",
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDaysSince(days: number): string {
  if (days === 0) return "hoje"
  if (days === 1) return "ontem"
  if (days < 7) return `${days} dias atrás`
  if (days < 30) return `${Math.floor(days / 7)} sem. atrás`
  if (days < 365) return `${Math.floor(days / 30)} meses atrás`
  return `${Math.floor(days / 365)} anos atrás`
}

function statusLabel(status: ProjectAnalysis["status"]): string {
  if (status === "production") return "EM PRODUÇÃO"
  if (status === "archived") return "ARQUIVADO"
  return "EM DESENVOLVIMENTO"
}

function statusColor(status: ProjectAnalysis["status"]): string {
  if (status === "production") return "#c8f04a"
  if (status === "archived") return "rgba(240,237,232,0.3)"
  return "#f0c84a"
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CommitChart({ activity }: { activity: RepoDetails["commitActivity"] }) {
  const weeks = activity.slice(-24)
  const max = Math.max(...weeks.map((w) => w.total), 1)

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "48px" }}>
      {weeks.map((w) => {
        const pct = (w.total / max) * 100
        return (
          <div
            key={w.week}
            title={`${w.total} commits`}
            style={{
              flex: 1,
              height: `${Math.max(pct, 4)}%`,
              background:
                pct > 60
                  ? "#c8f04a"
                  : pct > 20
                  ? "rgba(200,240,74,0.5)"
                  : "rgba(240,237,232,0.1)",
              borderRadius: "2px",
              transition: "background 0.2s",
            }}
          />
        )
      })}
    </div>
  )
}

function LanguageBars({
  percentages,
}: {
  percentages: RepoDetails["languagePercentages"]
}) {
  const top = percentages.slice(0, 5)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {top.map(({ language, percentage }) => (
        <div key={language}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "5px",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "12px",
              color: "rgba(240,237,232,0.6)",
              letterSpacing: "0.04em",
            }}
          >
            <span>{language}</span>
            <span>{percentage}%</span>
          </div>
          <div
            style={{
              height: "3px",
              background: "rgba(240,237,232,0.08)",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${percentage}%`,
                background: "#c8f04a",
                borderRadius: "2px",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Try static config first (known projects with curated metadata)
  const projectConfig = getProjectBySlug(slug)

  // Resolve the GitHub repo name:
  // - known projects: use githubRepo from config
  // - unknown repos: use the slug itself as the repo name
  const githubRepo = projectConfig?.githubRepo ?? slug

  // Fetch GitHub data
  let repoDetails: RepoDetails | null = null
  try {
    repoDetails = await fetchRepoDetails(githubRepo)
  } catch {
    // Private repo or not found yet
    if (!projectConfig) notFound() // no config AND no GitHub data → 404
  }

  // Resolved display values (config takes priority, falls back to GitHub/slug)
  const projectName = projectConfig?.name ?? repoDetails?.repo.name ?? slug
  const projectDescription = projectConfig?.description ?? repoDetails?.repo.description ?? ""
  const projectTechs = projectConfig?.techs ?? []
  const projectLive = projectConfig?.live ?? repoDetails?.repo.homepage ?? null

  // AI analysis — use README if available, fall back to description
  const readmeContent = repoDetails?.readme ?? projectDescription
  const analysis = await analyzeReadme(readmeContent, projectName)

  const hasGitHubData = repoDetails !== null
  const hasAnalysis = analysis.tagline !== "Projeto em desenvolvimento"

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .proj-page {
          background: #0a0a0a;
          min-height: 100vh;
          color: #f0ede8;
          padding-bottom: 120px;
        }

        .proj-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 clamp(24px, 5vw, 80px);
        }

        .proj-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
        }

        .proj-divider {
          height: 1px;
          background: rgba(240,237,232,0.08);
          margin: 64px 0;
        }

        @media (max-width: 700px) {
          .proj-grid-2 { grid-template-columns: 1fr; gap: 32px; }
        }
      `}</style>

      <div className="proj-page">
        <div className="proj-container">

          {/* ── Back link ── */}
          <div style={{ paddingTop: "clamp(32px, 5vw, 64px)", marginBottom: "48px" }}>
            <Link
              href="/#projetos"
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "12px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(240,237,232,0.35)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                transition: "color 0.2s",
              }}
            >
              ← Projetos
            </Link>
          </div>

          {/* ── Hero ── */}
          <div style={{ marginBottom: "64px" }}>
            {/* Status + links row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "24px",
                flexWrap: "wrap",
              }}
            >
              {hasAnalysis && (
                <span
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: statusColor(analysis.status),
                    border: `1px solid ${statusColor(analysis.status)}`,
                    padding: "4px 12px",
                    borderRadius: "100px",
                  }}
                >
                  {statusLabel(analysis.status)}
                </span>
              )}

              {projectLive && projectLive !== "#" && (
                <a
                  href={projectLive}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "12px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(240,237,232,0.5)",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  Live ↗
                </a>
              )}

              <a
                href={`https://github.com/${GITHUB_USERNAME}/${githubRepo}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "12px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(240,237,232,0.5)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                GitHub ↗
              </a>
            </div>

            {/* Project name */}
            <h1
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(52px, 10vw, 120px)",
                lineHeight: 0.9,
                letterSpacing: "-0.03em",
                color: "#f0ede8",
                margin: "0 0 32px",
              }}
            >
              {projectName}
            </h1>

            {/* AI tagline — or static description fallback */}
            {hasAnalysis ? (
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 300,
                  fontSize: "clamp(18px, 2.5vw, 28px)",
                  color: "rgba(240,237,232,0.55)",
                  lineHeight: 1.4,
                  maxWidth: "640px",
                  margin: 0,
                }}
              >
                &ldquo;{analysis.tagline}&rdquo;
              </p>
            ) : projectDescription ? (
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 300,
                  fontSize: "clamp(16px, 2vw, 22px)",
                  color: "rgba(240,237,232,0.45)",
                  lineHeight: 1.5,
                  maxWidth: "640px",
                  margin: 0,
                }}
              >
                {projectDescription}
              </p>
            ) : null}
          </div>

          <div className="proj-divider" />

          {/* ── Problem / Solution ── */}
          {hasAnalysis && analysis.problem !== "—" && (
            <>
              <div className="proj-grid-2" style={{ marginBottom: "64px" }}>
                <div>
                  <p
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "11px",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "rgba(240,237,232,0.3)",
                      marginBottom: "16px",
                    }}
                  >
                    Problema
                  </p>
                  <p
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "16px",
                      lineHeight: 1.7,
                      color: "rgba(240,237,232,0.75)",
                      margin: 0,
                    }}
                  >
                    {analysis.problem}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "11px",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "rgba(240,237,232,0.3)",
                      marginBottom: "16px",
                    }}
                  >
                    Solução
                  </p>
                  <p
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "16px",
                      lineHeight: 1.7,
                      color: "rgba(240,237,232,0.75)",
                      margin: 0,
                    }}
                  >
                    {analysis.solution}
                  </p>
                </div>
              </div>

              <div className="proj-divider" />
            </>
          )}

          {/* ── Activity + Stack (GitHub data) ── */}
          {hasGitHubData && (
            <>
              <div className="proj-grid-2" style={{ marginBottom: "64px" }}>
                {/* Activity */}
                <div>
                  <p
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "11px",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "rgba(240,237,232,0.3)",
                      marginBottom: "20px",
                    }}
                  >
                    Atividade · últimas 24 semanas
                  </p>

                  {repoDetails!.commitActivity.length > 0 ? (
                    <CommitChart activity={repoDetails!.commitActivity} />
                  ) : (
                    <div
                      style={{
                        height: "48px",
                        display: "flex",
                        alignItems: "center",
                        color: "rgba(240,237,232,0.2)",
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "13px",
                      }}
                    >
                      Calculando estatísticas…
                    </div>
                  )}

                  <div style={{ marginTop: "24px", display: "flex", gap: "32px" }}>
                    <div>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 900,
                          fontSize: "32px",
                          color: "#f0ede8",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {repoDetails!.totalCommits}
                      </span>
                      <p
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "12px",
                          color: "rgba(240,237,232,0.35)",
                          margin: "4px 0 0",
                          letterSpacing: "0.06em",
                        }}
                      >
                        commits
                      </p>
                    </div>
                    <div>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 700,
                          fontSize: "20px",
                          color: "#f0ede8",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {formatDaysSince(repoDetails!.daysSinceLastPush)}
                      </span>
                      <p
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: "12px",
                          color: "rgba(240,237,232,0.35)",
                          margin: "4px 0 0",
                          letterSpacing: "0.06em",
                        }}
                      >
                        último push
                      </p>
                    </div>
                    {repoDetails!.builtInDays !== null && repoDetails!.builtInDays > 0 && (
                      <div>
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 700,
                            fontSize: "20px",
                            color: "#f0ede8",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {repoDetails!.builtInDays}d
                        </span>
                        <p
                          style={{
                            fontFamily: "DM Sans, sans-serif",
                            fontSize: "12px",
                            color: "rgba(240,237,232,0.35)",
                            margin: "4px 0 0",
                            letterSpacing: "0.06em",
                          }}
                        >
                          para construir
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stack */}
                <div>
                  <p
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "11px",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "rgba(240,237,232,0.3)",
                      marginBottom: "20px",
                    }}
                  >
                    Stack
                  </p>
                  {repoDetails!.languagePercentages.length > 0 ? (
                    <LanguageBars percentages={repoDetails!.languagePercentages} />
                  ) : projectTechs.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {projectTechs.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontFamily: "DM Sans, sans-serif",
                            fontSize: "12px",
                            letterSpacing: "0.06em",
                            padding: "4px 12px",
                            border: "1px solid rgba(240,237,232,0.15)",
                            borderRadius: "100px",
                            color: "rgba(240,237,232,0.5)",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="proj-divider" />
            </>
          )}

          {/* ── Highlights (AI) ── */}
          {hasAnalysis && analysis.highlights.length > 0 && (
            <div>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(240,237,232,0.3)",
                  marginBottom: "24px",
                }}
              >
                Destaques
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "16px",
                }}
              >
                {analysis.highlights.slice(0, 3).map((h, i) => (
                  <div
                    key={i}
                    style={{
                      border: "1px solid rgba(240,237,232,0.08)",
                      borderRadius: "12px",
                      padding: "24px",
                      background: "rgba(240,237,232,0.03)",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 900,
                        fontSize: "28px",
                        color: "#c8f04a",
                        marginBottom: "8px",
                        opacity: 0.6,
                      }}
                    >
                      0{i + 1}
                    </span>
                    <p
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: "14px",
                        lineHeight: 1.6,
                        color: "rgba(240,237,232,0.7)",
                        margin: 0,
                      }}
                    >
                      {h}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Tech badges (fallback: no GitHub data, no highlights) ── */}
          {!hasGitHubData && projectTechs.length > 0 && (
            <div>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(240,237,232,0.3)",
                  marginBottom: "16px",
                }}
              >
                Stack
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {projectTechs.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "12px",
                      letterSpacing: "0.06em",
                      padding: "6px 14px",
                      border: "1px solid rgba(240,237,232,0.15)",
                      borderRadius: "100px",
                      color: "rgba(240,237,232,0.5)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
