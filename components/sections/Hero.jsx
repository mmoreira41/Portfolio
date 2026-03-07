"use client";

import { useEffect, useRef, useState } from "react";

// ─── Ticker techs ────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "Next.js 15", "React 19", "TypeScript", "Supabase",
  "Tailwind CSS", "Framer Motion", "shadcn/ui", "Node.js",
  "PostgreSQL", "Figma", "Vite", "Zod",
];

function Ticker() {
  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="ticker-item">
            {item}
            <span className="ticker-dot">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Animated word that cycles ───────────────────────────────────────────────
const ROLES = ["Full-Stack Dev", "SaaS Builder", "UI Crafter", "MicroSaaS Maker"];
const NAV_ITEMS = [
  { label: "Projetos", target: "projetos" },
  { label: "Sobre", target: "sobre" },
  { label: "Experiências", target: "experiencias" },
  { label: "Contato", target: "contato" },
];

function CyclingWord() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % ROLES.length);
        setVisible(true);
      }, 350);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className="cycling-word"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.35s ease, transform 0.35s ease",
        display: "inline-block",
      }}
    >
      {ROLES[index]}
    </span>
  );
}

// ─── Nav link com animação de "decodificação" no hover ───────────────────────
const DECODE_CHARS = "0123456789ABCDEF<>?/\\*#&@";
const DECODE_FRAMES = 12;
const DECODE_FRAME_MS = 100;

function NavLinkDecode({ label, href, onClick }) {
  const [display, setDisplay] = useState(label);
  const intervalRef = useRef(null);

  const runDecode = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    let frame = 0;
    intervalRef.current = setInterval(() => {
      frame += 1;
      if (frame >= DECODE_FRAMES) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setDisplay(label);
        return;
      }
      setDisplay(
        label
          .split("")
          .map(() =>
            DECODE_CHARS[Math.floor(Math.random() * DECODE_CHARS.length)]
          )
          .join("")
      );
    }, DECODE_FRAME_MS);
  };

  const resetToLabel = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDisplay(label);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={runDecode}
      onMouseLeave={resetToLabel}
    >
      {display}
    </a>
  );
}

// ─── Main Hero ────────────────────────────────────────────────────────────────
export default function Hero() {
  const heroRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  const handleNavClick = (event, targetId) => {
    event.preventDefault();
    const target = document.getElementById(targetId);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${targetId}`);
  };

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const parallaxY = scrollY * 0.3;
  const fadeOut = Math.max(0, 1 - scrollY / 400);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --bg: #0a0a0a;
          --fg: #f0ede8;
          --accent: #c8f04a;
          --muted: #666;
          --border: rgba(255,255,255,0.08);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: var(--bg);
          color: var(--fg);
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        /* ── Hero wrapper ── */
        .hero {
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 0;
          position: relative;
          overflow: hidden;
          background: var(--bg);
        }

        /* ── Noise grain overlay ── */
        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          background-size: 180px;
          opacity: 0.35;
          pointer-events: none;
          z-index: 0;
        }

        /* ── Ambient glow ── */
        .hero-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(200,240,74,0.07) 0%, transparent 70%);
          top: -100px;
          right: -100px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── Navbar ── */
        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 28px 48px;
          position: relative;
          z-index: 10;
        }

        .nav-logo {
          font-family: 'Inter', sans-serif;
          font-weight: 900;
          font-size: 18px;
          letter-spacing: -0.02em;
          color: var(--fg);
        }

        .nav-logo span {
          color: var(--accent);
        }

        .nav-links {
          display: flex;
          gap: 32px;
          list-style: none;
        }

        .nav-links a {
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.2s;
        }

        .nav-links a:hover { color: var(--fg); }

        .nav-cta {
          font-size: 13px;
          font-weight: 500;
          padding: 10px 22px;
          border-radius: 100px;
          border: 1px solid var(--border);
          color: var(--fg);
          text-decoration: none;
          background: rgba(255,255,255,0.04);
          transition: background 0.2s, border-color 0.2s;
        }

        .nav-cta:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.18);
        }

        /* ── Main content ── */
        .hero-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 48px;
          position: relative;
          z-index: 5;
        }

        /* ── Top badge row ── */
        .hero-meta {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .identity-chip {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          padding-right: 4px;
        }

        .identity-label {
          font-family: 'Inter', sans-serif;
          font-size: 20px;
          font-weight: 500;
          letter-spacing: -0.02em;
          color: var(--fg);
          line-height: 1;
          margin-bottom: 4px;
        }

        .identity-photo {
          width: 84px;
          aspect-ratio: 1.5 / 1;
          border-radius: 40px 40px 40px 12px;
          overflow: hidden;
          border: 1px solid var(--border);
          background: #111;
        }

        .identity-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 24%;
          transform: scale(1.22);
          transform-origin: center;
        }

        .badge-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          border-radius: 100px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.04);
          font-size: 12px;
          font-weight: 400;
          color: var(--muted);
          letter-spacing: 0.06em;
        }

        .badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 8px rgba(200,240,74,0.6);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }

        .period-badge {
          font-size: 12px;
          color: var(--muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* ── Headline block ── */
        .headline-block {
          display: flex;
          flex-direction: column;
          gap: 0;
          line-height: 0.95;
          margin-bottom: 48px;
        }

        .headline-row {
          display: flex;
          align-items: baseline;
          overflow: hidden;
        }

        .headline-row:nth-child(2) {
          padding-left: clamp(32px, 5vw, 80px);
        }

        .h1-word {
          font-family: 'Inter', sans-serif;
          font-weight: 900;
          font-size: clamp(56px, 11vw, 160px);
          letter-spacing: -0.03em;
          color: var(--fg);
          display: inline-block;
          transform: translateY(100%);
          animation: slideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .h1-word:nth-child(1) { animation-delay: 0.1s; }

        .headline-row:nth-child(2) .h1-word { animation-delay: 0.22s; }

        .h1-word-accent {
          font-family: 'Inter', sans-serif;
          font-weight: 900;
          font-size: clamp(56px, 11vw, 160px);
          letter-spacing: -0.03em;
          color: var(--accent);
          display: inline-block;
          animation-delay: 0.34s;
          transform: translateY(100%);
          animation: slideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideUp {
          to { transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        /* ── Sub-row ── */
        .hero-sub {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-bottom: 48px;
          gap: 32px;
          animation: fadeIn 0.8s ease 0.6s both;
        }

        .hero-desc {
          max-width: 360px;
        }

        .hero-role {
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 10px;
        }

        .cycling-word {
          color: var(--accent);
          font-weight: 500;
        }

        .hero-bio {
          font-size: 15px;
          line-height: 1.7;
          color: rgba(240,237,232,0.55);
          font-weight: 300;
        }

        .hero-actions {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-shrink: 0;
        }

        .btn-primary {
          padding: 14px 28px;
          border-radius: 100px;
          background: var(--accent);
          color: #0a0a0a;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          letter-spacing: -0.01em;
          transition: transform 0.2s, box-shadow 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(200,240,74,0.25);
        }

        .btn-ghost {
          padding: 14px 28px;
          border-radius: 100px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--fg);
          font-size: 14px;
          font-weight: 400;
          text-decoration: none;
          letter-spacing: -0.01em;
          transition: border-color 0.2s, background 0.2s;
        }

        .btn-ghost:hover {
          border-color: rgba(255,255,255,0.22);
          background: rgba(255,255,255,0.05);
        }

        /* ── Ticker ── */
        .ticker-section {
          border-top: 1px solid var(--border);
          padding: 18px 0;
          overflow: hidden;
          position: relative;
          z-index: 5;
        }

        .ticker-wrap {
          overflow: hidden;
          mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
        }

        .ticker-track {
          display: flex;
          width: max-content;
          animation: tickerScroll 22s linear infinite;
        }

        .ticker-item {
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          white-space: nowrap;
          padding: 0 4px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: color 0.2s;
        }

        .ticker-item:hover { color: var(--fg); }

        .ticker-dot {
          color: var(--accent);
          margin-left: 16px;
        }

        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* ── Scroll indicator ── */
        .scroll-indicator {
          position: absolute;
          right: 48px;
          bottom: 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          z-index: 10;
          animation: fadeIn 1s ease 1s both;
        }

        .scroll-line {
          width: 1px;
          height: 48px;
          background: linear-gradient(to bottom, var(--accent), transparent);
          animation: scrollPulse 2s ease infinite;
        }

        .scroll-label {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--muted);
          writing-mode: vertical-lr;
          transform: rotate(180deg);
        }

        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.1); }
        }

        /* ── Location badge ── */
        .location {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--muted);
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .nav { padding: 20px 24px; }
          .nav-links { display: none; }
          .hero-body { padding: 0 24px; }
          .hero-meta { gap: 12px; margin-bottom: 18px; }
          .identity-label { font-size: 17px; }
          .identity-photo { width: 72px; }
          .headline-row:nth-child(2) { padding-left: 16px; }
          .hero-sub { flex-direction: column; align-items: flex-start; padding-bottom: 32px; }
          .scroll-indicator { display: none; }
          .hero-desc { max-width: 100%; }
          .h1-word, .h1-word-accent { font-size: clamp(40px, 12vw, 80px); }
        }
      `}</style>

      <section className="hero" ref={heroRef} id="hero">
        <div className="hero-glow" />

        {/* ── Navbar ── */}
        <nav className="nav">
          <div className="nav-logo">
            M<span>.</span>
          </div>
          <ul className="nav-links">
            {NAV_ITEMS.map((item) => (
              <li key={item.target}>
                <NavLinkDecode
                  label={item.label}
                  href={`#${item.target}`}
                  onClick={(event) => handleNavClick(event, item.target)}
                />
              </li>
            ))}
          </ul>
          <a
            href="#contato"
            className="nav-cta"
            onClick={(event) => handleNavClick(event, "contato")}
          >
            Disponível para projetos →
          </a>
        </nav>

        {/* ── Body ── */}
        <div
          className="hero-body"
          style={{
            transform: `translateY(${mounted ? parallaxY : 0}px)`,
            opacity: mounted ? fadeOut : 1,
            transition: "opacity 0.1s",
          }}
        >
          {/* Meta badges */}
          <div className="hero-meta">
            <div className="identity-chip">
              <span className="identity-label">M. é</span>
              <figure className="identity-photo">
                <img
                  src="/images/mmoreira-hero.png"
                  alt="Foto de Miguel Moreira"
                  loading="eager"
                />
              </figure>
            </div>
            <div className="badge-pill">
              <span className="badge-dot" />
              Disponível para freelas
            </div>
            <span className="period-badge">PUC Minas · Eng. Software · 5º período</span>
          </div>

          {/* Headline — 2 rows */}
          <div className="headline-block">
            <div className="headline-row">
              <span className="h1-word">Building High-End Software.</span>
            </div>
            <div className="headline-row">
              <span className="h1-word-accent">Gerando impacto real.</span>
            </div>
          </div>

          {/* Sub row */}
          <div className="hero-sub">
            <div className="hero-desc">
              <p className="hero-role">
                <CyclingWord />
              </p>
              <p className="hero-bio">
                Construo produtos digitais do zero — de landing pages a SaaS completos.
                Baseado em Belo Horizonte, focado no mercado brasileiro.
              </p>
            </div>

            <div className="hero-actions">
              <a
                href="#projetos"
                className="btn-primary"
                onClick={(event) => handleNavClick(event, "projetos")}
              >
                Ver projetos
                <span style={{ fontSize: 18 }}>↓</span>
              </a>
              <a
                href="https://github.com/mmoreira41"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* ── Scroll indicator ── */}
        <div className="scroll-indicator">
          <div className="scroll-label">scroll</div>
          <div className="scroll-line" />
        </div>

        {/* ── Ticker ── */}
        <div className="ticker-section">
          <Ticker />
        </div>
      </section>
    </>
  );
}
