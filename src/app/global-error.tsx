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
          backgroundColor: "#fafafa",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          color: "#111111",
        }}
      >
        <div
          style={{
            maxWidth: "440px",
            padding: "32px",
            borderRadius: "24px",
            backgroundColor: "#ffffff",
            border: "1px solid #e4e4e7",
            boxShadow: "0 24px 80px -24px rgba(0,0,0,0.18)",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#71717a",
            }}
          >
            QRNetra
          </p>
          <h1 style={{ marginTop: "8px", fontSize: "20px", fontWeight: 700 }}>
            We hit a critical error
          </h1>
          <p
            style={{
              marginTop: "12px",
              fontSize: "14px",
              lineHeight: 1.6,
              color: "#52525b",
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
                background: "#fafafa",
                borderRadius: "12px",
                fontFamily: "ui-monospace, SFMono-Regular, monospace",
                fontSize: "11px",
                color: "#71717a",
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
              height: "44px",
              width: "100%",
              borderRadius: "9999px",
              backgroundColor: "#ffd400",
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
