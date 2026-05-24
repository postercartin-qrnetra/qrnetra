"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error boundary caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#020817",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: "440px",
            padding: "32px",
            borderRadius: "20px",
            background: "linear-gradient(180deg, #141c2f 0%, #111827 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 24px 80px -24px rgba(0,0,0,0.5)",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#ff6b2c",
            }}
          >
            QRNetra
          </p>
          <h1 style={{ marginTop: "8px", fontSize: "20px", fontWeight: 800 }}>
            We hit a critical error
          </h1>
          <p
            style={{
              marginTop: "12px",
              fontSize: "14px",
              lineHeight: 1.6,
              color: "#94a3b8",
            }}
          >
            The root layout failed to render. This is usually a misconfigured
            environment variable on the host.
          </p>
          {error?.digest ? (
            <p
              style={{
                marginTop: "12px",
                padding: "8px 12px",
                background: "rgba(10,18,39,0.8)",
                borderRadius: "12px",
                fontFamily: "ui-monospace, SFMono-Regular, monospace",
                fontSize: "11px",
                color: "#64748b",
                wordBreak: "break-all",
              }}
            >
              Error ID: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: "24px",
              height: "48px",
              width: "100%",
              borderRadius: "12px",
              background: "linear-gradient(180deg, #ff7a3d 0%, #ff6b2c 100%)",
              border: "none",
              fontWeight: 700,
              color: "#fff",
              cursor: "pointer",
              boxShadow: "0 0 24px rgba(255,107,44,0.35)",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
