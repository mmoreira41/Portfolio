"use client";

import { useEffect, useRef, useState } from "react";

const ITEMS = [
  {
    num: "01",
    title: "Design de Produto",
    desc: "Photoshop · Figma · Sistemas visuais · Prototipação · UX",
    role: "Autodidatta",
    date: "2022 — 2024",
    current: false,
  },
  {
    num: "02",
    title: "Frontend & Produto",
    desc: "Landing pages · Apps web · Primeiros SaaS",
    role: "Freelancer",
    date: "2024 — hoje",
    current: false,
  },
  {
    num: "03",
    title: "Full-Stack Dev",
    desc: "Next.js · Supabase · TypeScript · SaaS de ponta a ponta",
    role: "Projetos próprios · BH",
    date: "out 2025 — hoje",
    current: true,
  },
];

export default function Trajectory() {
  const [entered, setEntered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .trajectory-section {
          background: #0a0a0a;
          padding: 96px 48px;
          position: relative;
          overflow: hidden;
        }

        /* subtle grain, same as Hero */
        .trajectory-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          background-size: 180px;
          opacity: 0.35;
          pointer-events: none;
        }

        .trajectory-inner {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .trajectory-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 64px;
        }

        .trajectory-eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(240,237,232,0.35);
        }

        .trajectory-statement {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 300;
          color: rgba(240,237,232,0.45);
          text-align: right;
          max-width: 30Agor0px;
          line-height: 1.6;
          font-style: italic;
        }

        .trajectory-statement em {
          color: #c8f04a;
          font-style: normal;
          font-weight: 500;
        }

        /* ── Rows ── */
        .trajectory-list {
          border-top: 1px solid rgba(255,255,255,0.07);
        }

        .trajectory-row {
          display: grid;
          grid-template-columns: 56px 1fr auto;
          gap: 0 32px;
          align-items: center;
          padding: 36px 0;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          cursor: default;
          transition: background 0.2s ease;
          position: relative;
        }

        .trajectory-row::before {
          content: '';
          position: absolute;
          left: -48px;
          right: -48px;
          top: 0;
          bottom: 0;
          background: rgba(255,255,255,0.025);
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .trajectory-row:hover::before {
          opacity: 1;
        }

        .trajectory-row:hover .row-num {
          color: #c8f04a;
        }

        .row-num {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: rgba(240,237,232,0.2);
          transition: color 0.2s ease;
          position: relative;
          z-index: 1;
        }

        .row-main {
          position: relative;
          z-index: 1;
        }

        .row-title {
          font-family: 'Inter', sans-serif;
          font-size: clamp(22px, 3vw, 36px);
          font-weight: 700;
          letter-spacing: -0.025em;
          color: #f0ede8;
          margin-bottom: 6px;
          line-height: 1;
        }

        .row-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 400;
          color: rgba(240,237,232,0.4);
          letter-spacing: 0.02em;
        }

        .row-meta {
          text-align: right;
          position: relative;
          z-index: 1;
          flex-shrink: 0;
        }

        .row-role {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: rgba(240,237,232,0.55);
          margin-bottom: 4px;
        }

        .row-date {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.06em;
          color: rgba(240,237,232,0.3);
        }

        .current-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c8f04a;
          box-shadow: 0 0 8px rgba(200,240,74,0.6);
          animation: pulse 2s infinite;
          flex-shrink: 0;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        /* ── Entry animations ── */
        .trajectory-header {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1);
        }

        .trajectory-header.entered {
          opacity: 1;
          transform: translateY(0);
        }

        .trajectory-row {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.16,1,0.3,1), background 0.2s ease;
        }

        .trajectory-row.entered {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .trajectory-section { padding: 72px 24px; }
          .trajectory-header { flex-direction: column; align-items: flex-start; gap: 16px; }
          .trajectory-statement { text-align: left; max-width: 100%; }
          .trajectory-row { grid-template-columns: 40px 1fr; gap: 0 16px; padding: 28px 0; }
          .row-meta { display: none; }
          .row-title { font-size: clamp(20px, 5vw, 28px); }
        }
      `}</style>

      <section ref={sectionRef} id="experiencias" className="trajectory-section">
        <div className="trajectory-inner">
          <div className={`trajectory-header${entered ? " entered" : ""}`}>
            <span className="trajectory-eyebrow">Trajetória</span>
            <p className="trajectory-statement">
              Comecei pelo visual. Fui para o código.{" "}
              <em>Agora construo os dois.</em>
            </p>
          </div>

          <div className="trajectory-list">
            {ITEMS.map((item, i) => (
              <div
                key={item.num}
                className={`trajectory-row${entered ? " entered" : ""}`}
                style={entered ? { transitionDelay: `${i * 90}ms` } : {}}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span className="row-num">{item.num}</span>

                <div className="row-main">
                  <h3 className="row-title">{item.title}</h3>
                  <p className="row-desc">{item.desc}</p>
                </div>

                <div className="row-meta">
                  <span className="row-role">{item.role}</span>
                  <span className="row-date">
                    {item.current && <span className="current-dot" />}
                    {item.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
