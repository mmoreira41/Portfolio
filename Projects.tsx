"use client";

import { useState, useRef, useEffect } from "react";

const PROJECTS = [
  {
    id: "finnko",
    name: "Finnko",
    year: "2024",
    role: "Full-Stack Dev",
    description:
      "App de gestão financeira pessoal com sincronização em tempo real. CRUD de contas, 33 categorias, transferências e relatórios.",
    techs: ["React 19", "TypeScript", "Supabase", "Recharts", "Tailwind"],
    github: "https://github.com/mmoreira41",
    live: null,
    // placeholder color used as preview bg until real screenshot exists
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
    github: "https://github.com/mmoreira41",
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
    github: "https://github.com/mmoreira41",
    live: null,
    previewColor: "#1a1a3a",
    previewEmoji: "🧾",
  },
];

// ─── Background colors per scroll zone ───────────────────────────────────────
const BG_COLORS = ["#f5f3ee", "#eeeae3", "#e8e3da", "#0a0a0a"];

function useScrollColor(ref: React.RefObject<HTMLElement | null>) {
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const sectionHeight = el.offsetHeight;
      const scrollProgress = Math.max(
        0,
        Math.min(1, (window.scrollY - sectionTop + window.innerHeight * 0.5) / sectionHeight)
      );
      const idx = Math.min(
        BG_COLORS.length - 1,
        Math.floor(scrollProgress * BG_COLORS.length)
      );
      setColorIndex(idx);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);

  return BG_COLORS[colorIndex];
}

// ─── Single project row ───────────────────────────────────────────────────────
function ProjectRow({
  project,
  isDark,
  onHover,
  isHovered,
}: {
  project: (typeof PROJECTS)[0];
  isDark: boolean;
  onHover: (id: string | null) => void;
  isHovered: boolean;
}) {
  return (
    <div
      className="project-row"
      onMouseEnter={() => onHover(project.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)"}`,
        position: "relative",
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      <a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", display: "block" }}
      >
        <div className="project-inner">
          {/* Arrow — appears on hover */}
          <span
            className="project-arrow"
            style={{
              color: isDark ? "#c8f04a" : "#111",
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? "translateX(0)" : "translateX(-12px)",
              transition: "opacity 0.25s ease, transform 0.25s ease",
            }}
          >
            →
          </span>

          {/* Project name */}
          <span
            className="project-name"
            style={{
              color: isHovered
                ? isDark
                  ? "#c8f04a"
                  : "#949494"
                : isDark
                ? "#f0ede8"
                : "#111111",
              transform: isHovered ? "translateX(16px)" : "translateX(0)",
              transition: "color 0.25s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {project.name}
          </span>

          {/* Year tag */}
          <span
            className="project-year"
            style={{
              color: isDark ? "rgba(240,237,232,0.3)" : "rgba(0,0,0,0.3)",
              opacity: isHovered ? 0 : 1,
              transition: "opacity 0.2s ease",
            }}
          >
            {project.year}
          </span>
        </div>
      </a>

      {/* Bottom border last item */}
      <style>{`
        .project-row:last-child {
          border-bottom: 1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)"};
        }
      `}</style>
    </div>
  );
}

// ─── Hover preview panel (fixed right) ───────────────────────────────────────
function PreviewPanel({
  project,
  visible,
}: {
  project: (typeof PROJECTS)[0] | null;
  visible: boolean;
}) {
  return (
    <div
      style={{
        position: "fixed",
        right: "4vw",
        top: "50%",
        transform: `translateY(-50%) scale(${visible ? 1 : 0.94})`,
        width: "clamp(280px, 28vw, 440px)",
        aspectRatio: "9/14",
        borderRadius: "16px",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 50,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
      }}
    >
      {project && (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: project.previewColor,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "32px",
          }}
        >
          {/* Emoji/icon placeholder — replace with real screenshot */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -60%)",
              fontSize: "80px",
              opacity: 0.15,
              userSelect: "none",
            }}
          >
            {project.previewEmoji}
          </div>

          {/* Info */}
          <div>
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "8px",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              {project.role} · {project.year}
            </div>
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: "22px",
                color: "#fff",
                marginBottom: "10px",
                lineHeight: 1.2,
              }}
            >
              {project.name}
            </div>
            <p
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.6,
                margin: "0 0 16px",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 300,
              }}
            >
              {project.description}
            </p>
            {/* Tech badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {project.techs.slice(0, 4).map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "4px 10px",
                    borderRadius: "100px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Projects section ────────────────────────────────────────────────────
export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const bg = useScrollColor(sectionRef);
  const isDark = bg === "#0a0a0a";
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const hoveredProject = PROJECTS.find((p) => p.id === hoveredId) ?? null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .projects-section {
          transition: background-color 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0 0 120px;
          min-height: 100vh;
          position: relative;
        }

        .projects-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: clamp(60px, 8vw, 120px) clamp(24px, 5vw, 80px) clamp(40px, 5vw, 72px);
        }

        .projects-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          transition: color 0.7s ease;
        }

        .projects-count {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: clamp(72px, 11vw, 140px);
          line-height: 0.85;
          letter-spacing: -0.03em;
          transition: color 0.7s ease;
          opacity: 0.08;
          line-height: 1;
        }

        .project-list {
          padding: 0 clamp(24px, 5vw, 80px);
        }

        .project-inner {
          display: flex;
          align-items: baseline;
          gap: 0;
          padding: clamp(16px, 2.5vw, 28px) 0;
          position: relative;
        }

        .project-arrow {
          font-size: clamp(48px, 7vw, 100px);
          line-height: 1;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          flex-shrink: 0;
          width: clamp(48px, 7vw, 100px);
          display: inline-block;
          letter-spacing: -0.02em;
        }

        .project-name {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(52px, 8.5vw, 128px);
          line-height: 1;
          letter-spacing: -0.03em;
          flex: 1;
          display: inline-block;
        }

        .project-year {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 13px;
          letter-spacing: 0.06em;
          align-self: center;
          flex-shrink: 0;
        }

        /* hide preview on mobile */
        @media (max-width: 900px) {
          .preview-panel { display: none !important; }
          .project-year { display: none; }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="projects-section"
        id="projetos"
        style={{ backgroundColor: bg }}
      >
        {/* Header */}
        <div className="projects-header">
          <span
            className="projects-label"
            style={{ color: isDark ? "rgba(240,237,232,0.4)" : "rgba(0,0,0,0.4)" }}
          >
            Projetos Selecionados
          </span>
          <span
            className="projects-count"
            style={{ color: isDark ? "#f0ede8" : "#111" }}
          >
            0{PROJECTS.length}
          </span>
        </div>

        {/* Project list */}
        <div className="project-list">
          {PROJECTS.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              isDark={isDark}
              onHover={setHoveredId}
              isHovered={hoveredId === project.id}
            />
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            padding: `48px clamp(24px, 5vw, 80px) 0`,
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <a
            href="https://github.com/mmoreira41"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "13px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: isDark ? "rgba(240,237,232,0.4)" : "rgba(0,0,0,0.4)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "color 0.2s",
            }}
          >
            Ver todos no GitHub
            <span style={{ fontSize: "16px" }}>↗</span>
          </a>
        </div>
      </section>

      {/* Hover preview — fixed right */}
      <PreviewPanel project={hoveredProject} visible={hoveredId !== null} />
    </>
  );
}
