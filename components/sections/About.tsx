"use client";

import { useEffect, useRef, useState } from "react";

type Lang = "pt" | "en";

const WORDS: Record<Lang, string[]> = {
  pt: ["Construo", "produtos", "digitais", "que", "resolvem", "problemas", "reais."],
  en: ["I", "build", "digital", "products", "that", "solve", "real", "problems."],
};

const CELLS: Record<Lang, { label: string; value: string; sub: string }[]> = {
  pt: [
    { label: "Base", value: "BH, Brasil", sub: "GMT-3" },
    { label: "Formação", value: "Eng. Software", sub: "PUC Minas · 5º período" },
    { label: "Stack", value: "Full-Stack Dev", sub: "Next.js · Supabase · TS" },
    { label: "Status", value: "Disponível", sub: "Projetos & Freelas" },
  ],
  en: [
    { label: "Base", value: "BH, Brazil", sub: "GMT-3" },
    { label: "Education", value: "Software Eng.", sub: "PUC Minas · 5th year" },
    { label: "Stack", value: "Full-Stack Dev", sub: "Next.js · Supabase · TS" },
    { label: "Status", value: "Available", sub: "Projects & Freelance" },
  ],
};

const STAGGER_MS = 60;
const ANIM_MS = 320;

export default function About() {
  const [lang, setLang] = useState<Lang>("pt");
  const [displayLang, setDisplayLang] = useState<Lang>("pt");
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const [transitioning, setTransitioning] = useState(false);
  const [entered, setEntered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const enteredRef = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !enteredRef.current) {
          enteredRef.current = true;
          setEntered(true);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const toggleLang = () => {
    if (transitioning) return;
    const nextLang: Lang = lang === "pt" ? "en" : "pt";
    const outDuration = WORDS[displayLang].length * STAGGER_MS + ANIM_MS;
    setTransitioning(true);
    setPhase("out");
    setTimeout(() => {
      setDisplayLang(nextLang);
      setLang(nextLang);
      setPhase("in");
      const inDuration = WORDS[nextLang].length * STAGGER_MS + ANIM_MS;
      setTimeout(() => {
        setPhase("idle");
        setTransitioning(false);
      }, inDuration);
    }, outDuration);
  };

  const getWordStyle = (i: number): React.CSSProperties => {
    if (!entered) {
      return { opacity: 0, transform: "translateY(20px)" };
    }
    if (phase === "out") {
      return {
        opacity: 0,
        transform: "translateY(10px)",
        transition: `opacity ${ANIM_MS}ms ease ${i * STAGGER_MS}ms, transform ${ANIM_MS}ms ease ${i * STAGGER_MS}ms`,
      };
    }
    if (phase === "in") {
      return {
        opacity: 1,
        transform: "translateY(0)",
        transition: `opacity ${ANIM_MS}ms cubic-bezier(0.16,1,0.3,1) ${i * STAGGER_MS}ms, transform ${ANIM_MS}ms cubic-bezier(0.16,1,0.3,1) ${i * STAGGER_MS}ms`,
      };
    }
    // idle — entry or resting state
    return {
      opacity: 1,
      transform: "translateY(0)",
      transition: `opacity 0.6s ease ${i * STAGGER_MS}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * STAGGER_MS}ms`,
    };
  };

  const words = WORDS[displayLang];
  const cells = CELLS[displayLang];

  return (
    <>
      <style>{`
        .about-section {
          background: #f5f2ec;
          min-height: 100svh;
          display: flex;
          align-items: center;
          padding: 80px 48px;
          position: relative;
        }

        .about-inner {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .about-lang-toggle {
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 72px;
        }

        .about-title {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #0a0a0a;
          line-height: 1;
        }

        .about-lang-buttons {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .lang-btn {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          border: none;
          background: none;
          padding: 0;
          color: #0a0a0a;
          transition: opacity 0.2s;
          line-height: 1;
        }

        .lang-btn.active { opacity: 1; }
        .lang-btn.inactive { opacity: 0.25; }
        .lang-btn.inactive:hover { opacity: 0.5; cursor: pointer; }
        .lang-btn.active { cursor: default; }

        .lang-sep {
          width: 1px;
          height: 10px;
          background: #0a0a0a;
          opacity: 0.2;
        }

        .about-phrase {
          font-family: 'Inter', sans-serif;
          font-weight: 900;
          font-size: clamp(44px, 7.5vw, 80px);
          letter-spacing: -0.035em;
          line-height: 0.94;
          color: #0a0a0a;
          margin-bottom: 80px;
          max-width: 860px;
        }

        .about-word {
          display: inline-block;
          margin-right: 0.22em;
          white-space: nowrap;
        }

        .about-word:last-child {
          margin-right: 0;
        }

        .about-cells {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid rgba(10,10,10,0.1);
          transition: opacity 0.25s ease;
        }

        .about-cell {
          padding: 28px 32px 28px 0;
        }

        .about-cell + .about-cell {
          padding-left: 32px;
          border-left: 1px solid rgba(10,10,10,0.1);
        }

        .cell-label {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #0a0a0a;
          opacity: 0.35;
          margin-bottom: 10px;
        }

        .cell-value {
          font-family: 'Inter', sans-serif;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.025em;
          color: #0a0a0a;
          margin-bottom: 5px;
          line-height: 1;
        }

        .cell-value.accent {
          color: #5a8a00;
        }

        .cell-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 400;
          color: #0a0a0a;
          opacity: 0.45;
          line-height: 1.4;
        }

        @media (max-width: 900px) {
          .about-section { padding: 64px 24px; min-height: auto; }
          .about-cells { grid-template-columns: repeat(2, 1fr); }
          .about-cell:nth-child(2) { border-left: 1px solid rgba(10,10,10,0.1); }
          .about-cell:nth-child(3) { border-left: none; padding-left: 0; border-top: 1px solid rgba(10,10,10,0.1); padding-top: 24px; }
          .about-cell:nth-child(4) { border-top: 1px solid rgba(10,10,10,0.1); padding-top: 24px; }
          .about-lang-toggle { margin-bottom: 48px; }
          .about-phrase { margin-bottom: 56px; }
        }

        @media (max-width: 480px) {
          .about-cells { grid-template-columns: 1fr; }
          .about-cell + .about-cell { border-left: none; padding-left: 0; border-top: 1px solid rgba(10,10,10,0.1); padding-top: 20px; }
        }
      `}</style>

      <section ref={sectionRef} id="sobre" className="about-section">
        <div className="about-inner">
          {/* About title (left) + Lang toggle (right), alinhado à frase abaixo */}
          <div className="about-lang-toggle">
            <span className="about-title">About</span>
            <div className="about-lang-buttons">
              <button
                className={`lang-btn ${lang === "pt" ? "active" : "inactive"}`}
                onClick={lang !== "pt" ? toggleLang : undefined}
              >
                PT
              </button>
              <div className="lang-sep" />
              <button
                className={`lang-btn ${lang === "en" ? "active" : "inactive"}`}
                onClick={lang !== "en" ? toggleLang : undefined}
              >
                EN
              </button>
            </div>
          </div>

          {/* Big phrase — word by word animation */}
          <p className="about-phrase">
            {words.map((word, i) => (
              <span key={i} className="about-word" style={getWordStyle(i)}>
                {word}
              </span>
            ))}
          </p>

          {/* Data cells */}
          <div
            className="about-cells"
            style={{ opacity: transitioning ? 0.35 : 1, transition: "opacity 0.25s ease" }}
          >
            {cells.map((cell, i) => (
              <div key={i} className="about-cell">
                <div className="cell-label">{cell.label}</div>
                <div className={`cell-value${cell.value === "Disponível" || cell.value === "Available" ? " accent" : ""}`}>
                  {cell.value}
                </div>
                <div className="cell-sub">{cell.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
