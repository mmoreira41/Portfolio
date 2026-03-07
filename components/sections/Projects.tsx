"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { PROJECTS } from "@/lib/projects";
import type { GitHubRepo } from "@/types/github";

const INITIAL_SHOW = 5;

// ─── Background colors per scroll zone (dark → light) ───────────────────────
const BG_COLORS = ["#0a0a0a", "#1a1a1a", "#e8e3da", "#f5f3ee"];

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

// ─── Unified display type ─────────────────────────────────────────────────────
type DisplayProject = {
  id: string;
  name: string;
  year: string;
  href: string;
  isExternal: boolean;
  description: string;
  techs: string[];
  previewColor: string;
  previewEmoji: string;
  role: string;
};

function normalizeProjectKey(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function buildDisplayList(repos: GitHubRepo[]): DisplayProject[] {
  const configByKey = new Map<string, (typeof PROJECTS)[number]>();
  for (const project of PROJECTS) {
    configByKey.set(normalizeProjectKey(project.id), project);
    configByKey.set(normalizeProjectKey(project.name), project);
    configByKey.set(normalizeProjectKey(project.githubRepo), project);
  }

  const matchedProjectIds = new Set<string>();

  // GitHub repos first (sorted by pushed_at from API)
  const list: DisplayProject[] = repos.map((repo) => {
    const config = configByKey.get(normalizeProjectKey(repo.name)) ?? null;
    if (config) matchedProjectIds.add(config.id);

    return {
      id: config?.id ?? repo.name,
      name: config?.name ?? repo.name,
      year: config?.year ?? new Date(repo.pushed_at).getFullYear().toString(),
      href: config ? `/projetos/${config.id}` : `/projetos/${repo.name}`,
      isExternal: false,
      description: config?.description ?? repo.description ?? "",
      techs: config?.techs ?? (repo.language ? [repo.language] : []),
      previewColor: config?.previewColor ?? "#1a1a1a",
      previewEmoji: config?.previewEmoji ?? "📦",
      role: config?.role ?? "Developer",
    };
  });

  // Append private / unsynced projects not found in GitHub public list
  for (const p of PROJECTS) {
    if (!matchedProjectIds.has(p.id)) {
      list.push({
        id: p.id,
        name: p.name,
        year: p.year,
        href: `/projetos/${p.id}`,
        isExternal: false,
        description: p.description,
        techs: p.techs,
        previewColor: p.previewColor,
        previewEmoji: p.previewEmoji,
        role: p.role,
      });
    }
  }

  return list;
}

// ─── Single project row ───────────────────────────────────────────────────────
function ProjectRow({
  project,
  isDark,
  onHover,
  isHovered,
}: {
  project: DisplayProject;
  isDark: boolean;
  onHover: (id: string | null) => void;
  isHovered: boolean;
}) {
  const inner = (
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
    </div>
  );

  const linkProps = {
    className: "project-link",
    style: { textDecoration: "none", cursor: "pointer" },
    onMouseEnter: () => onHover(project.id),
    onMouseLeave: () => onHover(null),
  };

  return (
    <div
      className="project-row"
      style={{
        borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)"}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {project.isExternal ? (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          {...linkProps}
        >
          {inner}
        </a>
      ) : (
        <Link href={project.href} {...linkProps}>
          {inner}
        </Link>
      )}

      {/* Year à direita — fora do link, não dispara o card */}
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
  project: DisplayProject | null;
  visible: boolean;
}) {
  return (
    <div
      className="preview-panel"
      style={{
        position: "fixed",
        right: "4vw",
        top: "50%",
        transform: `translateY(-50%) translateX(${visible ? 0 : 12}px) scale(${visible ? 1 : 0.96})`,
        width: "clamp(280px, 28vw, 440px)",
        aspectRatio: "9/14",
        borderRadius: "16px",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 50,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1), transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
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
          {/* Emoji/icon placeholder */}
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
                fontFamily: "Inter, sans-serif",
                fontWeight: 900,
                fontSize: "22px",
                color: "#fff",
                marginBottom: "10px",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              {project.name}
            </div>
            {project.description && (
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
            )}
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
export default function Projects({ repos }: { repos: GitHubRepo[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const bg = useScrollColor(sectionRef);
  const isDark = bg === "#0a0a0a" || bg === "#1a1a1a";
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [supportsHover, setSupportsHover] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    const updateHoverCapability = () => {
      setSupportsHover(mediaQuery.matches);
    };

    updateHoverCapability();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateHoverCapability);
      return () => mediaQuery.removeEventListener("change", updateHoverCapability);
    }

    mediaQuery.addListener(updateHoverCapability);
    return () => mediaQuery.removeListener(updateHoverCapability);
  }, []);

  useEffect(() => {
    if (!supportsHover) setHoveredId(null);
  }, [supportsHover]);

  const allProjects = buildDisplayList(repos);
  const visible = showAll ? allProjects : allProjects.slice(0, INITIAL_SHOW);
  const hasMore = allProjects.length > INITIAL_SHOW;

  const hoveredProject = allProjects.find((p) => p.id === hoveredId) ?? null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=DM+Sans:wght@300;400;500&display=swap');

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
          font-family: 'Inter', sans-serif;
          font-weight: 900;
          font-size: clamp(72px, 11vw, 140px);
          line-height: 1;
          letter-spacing: -0.03em;
          transition: color 0.7s ease;
          opacity: 0.08;
        }

        .project-list {
          padding: 0 clamp(24px, 5vw, 80px);
        }

        .project-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          padding: clamp(16px, 2.5vw, 28px) 0;
        }

        .project-link {
          max-width: 50%;
          display: inline-block;
          min-width: 0;
        }

        .project-inner {
          display: flex;
          align-items: baseline;
          gap: 0;
          position: relative;
          min-width: 0;
        }

        .project-arrow {
          font-size: clamp(48px, 7vw, 100px);
          line-height: 1;
          font-family: 'Inter', sans-serif;
          font-weight: 900;
          flex-shrink: 0;
          width: clamp(48px, 7vw, 100px);
          display: inline-block;
          letter-spacing: -0.02em;
        }

        .project-name {
          font-family: 'Inter', sans-serif;
          font-weight: 900;
          font-size: clamp(42px, 6.5vw, 96px);
          line-height: 1;
          letter-spacing: -0.03em;
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
          .project-link {
            max-width: 100%;
            width: 100%;
          }
          .project-name {
            font-size: clamp(24px, 9vw, 40px);
            letter-spacing: -0.02em;
          }
          .project-arrow {
            display: none;
          }
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
            {String(allProjects.length).padStart(2, "0")}
          </span>
        </div>

        {/* Project list */}
        <div className="project-list">
          {visible.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              isDark={isDark}
              onHover={supportsHover ? setHoveredId : () => {}}
              isHovered={supportsHover && hoveredId === project.id}
            />
          ))}
        </div>

        {/* Footer actions */}
        <div
          style={{
            padding: `48px clamp(24px, 5vw, 80px) 0`,
            display: "flex",
            alignItems: "center",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          {hasMore && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: "13px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: isDark ? "rgba(240,237,232,0.6)" : "rgba(0,0,0,0.6)",
                background: "none",
                border: `1px solid ${isDark ? "rgba(240,237,232,0.15)" : "rgba(0,0,0,0.15)"}`,
                borderRadius: "100px",
                padding: "8px 20px",
                cursor: "pointer",
                transition: "color 0.2s, border-color 0.2s",
              }}
            >
              Ver mais ({allProjects.length - INITIAL_SHOW})
            </button>
          )}

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
      <PreviewPanel project={hoveredProject} visible={supportsHover && hoveredId !== null} />
    </>
  );
}
