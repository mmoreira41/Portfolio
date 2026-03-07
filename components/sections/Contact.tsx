"use client";

import { useState } from "react";
import { z } from "zod";
import emailjs from "@emailjs/browser";

const ContactSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  message: z.string().min(10, "Mensagem muito curta"),
});

type FormData = z.infer<typeof ContactSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;
type Status = "idle" | "loading" | "success" | "error";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

export default function Contact() {
  const [form, setForm] = useState<FormData>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = ContactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setStatus("loading");
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        { name: form.name, email: form.email, message: form.message },
        PUBLIC_KEY
      );
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <style>{`
        .contact-section {
          background: #c8f04a;
          padding: 96px 48px 64px;
          border-radius: 24px 24px 0 0;
          margin-top: -24px;
          position: relative;
          z-index: 10;
        }

        .contact-inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        .contact-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 72px;
          gap: 32px;
        }

        .contact-headline {
          font-family: 'Inter', sans-serif;
          font-weight: 900;
          font-size: clamp(56px, 9vw, 136px);
          letter-spacing: -0.035em;
          line-height: 0.92;
          color: #0a0a0a;
        }

        .contact-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: rgba(10,10,10,0.5);
          max-width: 240px;
          text-align: right;
          line-height: 1.6;
          flex-shrink: 0;
          padding-bottom: 8px;
        }

        /* ── Form ── */
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .field-wrap {
          display: flex;
          flex-direction: column;
          gap: 0;
          position: relative;
        }

        .contact-input,
        .contact-textarea {
          background: transparent;
          border: 1.5px solid rgba(10,10,10,0.25);
          border-radius: 8px;
          padding: 18px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 400;
          color: #0a0a0a;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }

        .contact-input::placeholder,
        .contact-textarea::placeholder {
          color: rgba(10,10,10,0.35);
        }

        .contact-input:focus,
        .contact-textarea:focus {
          border-color: #0a0a0a;
        }

        .contact-input.has-error,
        .contact-textarea.has-error {
          border-color: rgba(180,0,0,0.6);
        }

        .contact-textarea {
          resize: none;
          height: 140px;
          margin-bottom: 16px;
        }

        .field-error {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 500;
          color: rgba(150,0,0,0.8);
          margin-top: 5px;
          letter-spacing: 0.03em;
        }

        /* ── Submit row ── */
        .form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }

        .btn-submit {
          padding: 16px 36px;
          border-radius: 100px;
          background: #0a0a0a;
          color: #c8f04a;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: -0.01em;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: background 0.2s, transform 0.2s;
          flex-shrink: 0;
        }

        .btn-submit:hover:not(:disabled) {
          background: #1a1a1a;
          transform: translateY(-2px);
        }

        .btn-submit:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .submit-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(200,240,74,0.3);
          border-top-color: #c8f04a;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .form-error-msg {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(150,0,0,0.8);
          font-weight: 400;
        }

        /* ── Success state ── */
        .contact-success {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 56px 0;
        }

        .success-check {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2px solid #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }

        .success-title {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 28px;
          letter-spacing: -0.025em;
          color: #0a0a0a;
        }

        .success-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: rgba(10,10,10,0.55);
          font-weight: 400;
        }

        /* ── Footer ── */
        .contact-footer {
          margin-top: 80px;
          padding-top: 32px;
          border-top: 1px solid rgba(10,10,10,0.12);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }

        .footer-links {
          display: flex;
          gap: 24px;
          align-items: center;
        }

        .footer-link {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #0a0a0a;
          text-decoration: none;
          opacity: 0.6;
          letter-spacing: 0.04em;
          transition: opacity 0.2s;
        }

        .footer-link:hover { opacity: 1; }

        .footer-copy {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: rgba(10,10,10,0.4);
          font-weight: 400;
        }

        @media (max-width: 768px) {
          .contact-section { padding: 72px 24px 48px; }
          .contact-header { flex-direction: column; align-items: flex-start; margin-bottom: 48px; }
          .contact-sub { text-align: left; max-width: 100%; }
          .form-row { grid-template-columns: 1fr; }
          .form-footer { flex-direction: column; align-items: flex-start; }
          .contact-footer { flex-direction: column; align-items: flex-start; gap: 12px; }
        }
      `}</style>

      <section id="contato" className="contact-section">
        <div className="contact-inner">
          {/* Header */}
          <div className="contact-header">
            <h2 className="contact-headline">
              Vamos construir
              <br />
              algo juntos?
            </h2>
            <p className="contact-sub">
              Aberto a projetos, freelas e boas conversas.
              Respondo em até 24h.
            </p>
          </div>

          {/* Form / Success */}
          {status === "success" ? (
            <div className="contact-success">
              <div className="success-check">
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                  <path d="M1 7L6.5 12.5L17 1.5" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="success-title">Mensagem recebida.</p>
              <p className="success-sub">Falo contigo em breve.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="field-wrap">
                  <input
                    className={`contact-input${errors.name ? " has-error" : ""}`}
                    type="text"
                    name="name"
                    placeholder="Nome"
                    value={form.name}
                    onChange={handleChange}
                    disabled={status === "loading"}
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="field-wrap">
                  <input
                    className={`contact-input${errors.email ? " has-error" : ""}`}
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    value={form.email}
                    onChange={handleChange}
                    disabled={status === "loading"}
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
              </div>

              <div className="field-wrap">
                <textarea
                  className={`contact-textarea${errors.message ? " has-error" : ""}`}
                  name="message"
                  placeholder="Mensagem"
                  value={form.message}
                  onChange={handleChange}
                  disabled={status === "loading"}
                />
                {errors.message && <span className="field-error">{errors.message}</span>}
              </div>

              <div className="form-footer">
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <span className="submit-spinner" />
                      Enviando
                    </>
                  ) : (
                    "Enviar mensagem →"
                  )}
                </button>
                {status === "error" && (
                  <p className="form-error-msg">
                    Algo deu errado. Tente novamente ou envie direto para miguelmmc08@gmail.com
                  </p>
                )}
              </div>
            </form>
          )}

          {/* Footer */}
          <footer className="contact-footer">
            <div className="footer-links">
              <a
                href="https://www.linkedin.com/in/miguel-moreira-69a171269/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/mmoreira41"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                GitHub
              </a>
              <a href="mailto:miguelmmc08@gmail.com" className="footer-link">
                miguelmmc08@gmail.com
              </a>
            </div>
            <span className="footer-copy">© {new Date().getFullYear()} Miguel Moreira</span>
          </footer>
        </div>
      </section>
    </>
  );
}
