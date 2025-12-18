// src/app/[locale]/admin/login/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const ADMIN_EMAIL = "admin@taramar.be";
const ADMIN_PASSWORD = "UwnzAuxmVb93nHMt";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Fake tiny delay so the animation feels nicer
    setTimeout(() => {
      const isValid =
        email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD;

      if (isValid) {
        router.push(`/${locale}/admin/products`);
      } else {
        setError("Invalid email or password. Please try again.");
        setIsSubmitting(false);
      }
    }, 500);
  }

  return (
    <>
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 16px",
          background:
            "radial-gradient(circle at top left, #22c1c3 0%, #0f766e 30%, #020617 90%)",
          color: "#f9fafb",
        }}
      >
        <div className="login-shell">
          <div className="login-card">
            <div className="login-accent-pill" />

            <h1 className="login-title">Taramar Admin</h1>
            <p className="login-subtitle">
              Sign in to manage products and content.
            </p>

            <form onSubmit={handleSubmit} className="login-form">
              <label className="login-label">
                Email
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label className="login-label">
                Password
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  placeholder="••••••••"
                  required
                />
              </label>

              {error && <p className="login-error">{error}</p>}

              <button
                type="submit"
                className="login-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Log in"}
              </button>
            </form>

            <p className="login-hint">
              This area is reserved for Taramar team members only.
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .login-shell {
          width: 100%;
          max-width: 420px;
        }

        .login-card {
          position: relative;
          background: radial-gradient(
              circle at top left,
              rgba(45, 212, 191, 0.11),
              transparent 55%
            ),
            rgba(15, 23, 42, 0.96);
          border-radius: 24px;
          padding: 32px 28px 28px;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(148, 163, 184, 0.35);
          backdrop-filter: blur(16px);
        }

        .login-accent-pill {
          position: absolute;
          top: 18px;
          right: 22px;
          width: 56px;
          height: 18px;
          border-radius: 999px;
          background: linear-gradient(90deg, #22c1c3, #0ea5e9);
          opacity: 0.85;
        }

        .login-title {
          font-size: 24px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin: 0 0 4px;
        }

        .login-subtitle {
          margin: 0 0 24px;
          font-size: 13px;
          color: #cbd5f5;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .login-label {
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #e5e7eb;
        }

        .login-input {
          margin-top: 6px;
          width: 100%;
          padding: 10px 12px;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.6);
          background: rgba(15, 23, 42, 0.9);
          color: #f9fafb;
          font-size: 14px;
          outline: none;
          transition:
            border-color 160ms ease-out,
            box-shadow 160ms ease-out,
            background 160ms ease-out;
        }

        .login-input::placeholder {
          color: #6b7280;
        }

        .login-input:focus {
          border-color: #22c1c3;
          box-shadow: 0 0 0 1px rgba(34, 193, 195, 0.4),
            0 0 0 10px rgba(15, 23, 42, 0.9);
          background: rgba(15, 23, 42, 1);
        }

        .login-error {
          margin: 2px 0 0;
          font-size: 12px;
          color: #f97373;
        }

        .login-button {
          margin-top: 8px;
          width: 100%;
          padding: 10px 16px;
          border-radius: 999px;
          border: none;
          font-size: 13px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
          background: linear-gradient(90deg, #0f172a, #020617);
          color: #f9fafb;
          box-shadow: 0 14px 35px rgba(0, 0, 0, 0.7);
          transition:
            transform 140ms ease-out,
            box-shadow 140ms ease-out,
            background 140ms ease-out,
            opacity 120ms ease-out;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.8);
        }

        .login-button:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.7);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: default;
        }

        .login-hint {
          margin-top: 18px;
          font-size: 11px;
          color: #9ca3af;
          text-align: center;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 24px 18px 22px;
            border-radius: 20px;
          }
        }
      `}</style>
    </>
  );
}
