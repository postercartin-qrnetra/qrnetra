"use client";

import { buildAuthCallbackUrl } from "@/lib/auth/callback-url";
import { createClient } from "@/lib/supabase/client";
import {
  getOAuthReturnPath,
  resolvePostLoginRedirect,
} from "@/lib/onboarding/client-storage";
import { QnLogoStatic } from "@/components/ui/logo";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function friendlyError(raw: string): string {
  const m = raw.toLowerCase();
  if (m.includes("invalid login credentials")) {
    return "That email or password doesn’t match our records.";
  }
  if (m.includes("email not confirmed")) {
    return "Please confirm your email first, then try again.";
  }
  if (m.includes("user already registered")) {
    return "An account with this email already exists. Try signing in.";
  }
  if (m.includes("password")) {
    return "Check your password and try again.";
  }
  return "Something went wrong. Please try again.";
}

export function AuthLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const urlError = searchParams.get("error");

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [emailMode, setEmailMode] = useState<"password" | "magic">("password");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const errorBanner = useMemo(() => {
    if (!urlError) return null;
    if (urlError === "auth_exchange_failed") {
      return "We couldn’t finish signing you in. Please try again.";
    }
    if (urlError === "missing_code") {
      return "Sign-in was interrupted. Please start again.";
    }
    return "Sign-in issue. Please try again.";
  }, [urlError]);

  async function startGoogle() {
    setMessage(null);
    setLoading(true);
    const supabase = createClient();
    const returnPath = getOAuthReturnPath(nextParam);
    const redirectTo = buildAuthCallbackUrl(returnPath);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    setLoading(false);
    if (error) {
      setMessage(friendlyError(error.message));
    }
  }

  async function handlePasswordSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setMessage("Enter your email and password.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const destination = resolvePostLoginRedirect(nextParam);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage(friendlyError(error.message));
        setLoading(false);
        return;
      }
      if (data.session) {
        router.push(destination);
        router.refresh();
        return;
      }
      setMessage(
        "Check your inbox to confirm your email, then sign in to continue.",
      );
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setMessage(friendlyError(error.message));
      setLoading(false);
      return;
    }
    router.push(destination);
    router.refresh();
  }

  async function handleMagicLink(formData: FormData) {
    setLoading(true);
    setMessage(null);
    const email = String(formData.get("magic_email") ?? "").trim();
    if (!email) {
      setMessage("Enter your email.");
      setLoading(false);
      return;
    }
    const supabase = createClient();
    const returnPath = getOAuthReturnPath(nextParam);
    const emailRedirectTo = buildAuthCallbackUrl(returnPath);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo, shouldCreateUser: true },
    });
    setLoading(false);
    if (error) {
      setMessage(friendlyError(error.message));
      return;
    }
    setMessage("Check your email for a sign-in link.");
  }

  async function handleForgot(formData: FormData) {
    setLoading(true);
    setMessage(null);
    const email = String(formData.get("forgot_email") ?? "").trim();
    if (!email) {
      setMessage("Enter your email.");
      setLoading(false);
      return;
    }
    const supabase = createClient();
    const redirectTo = buildAuthCallbackUrl("/auth/update-password");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    setLoading(false);
    if (error) {
      setMessage(friendlyError(error.message));
      return;
    }
    setMessage("If an account exists, you’ll get a reset link shortly.");
    setShowForgot(false);
  }

  return (
    <div className="w-full max-w-[420px]">
      <div className="qn-card rounded-3xl p-8 sm:p-10">
        <div className="mb-8 lg:hidden">
          <QnLogoStatic layout="compact" />
          <p className="mt-1 text-sm text-qn-muted-2">
            Continue setting up your safety tag
          </p>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-qn-muted">
          Sign in to finish your emergency profile and generate your dynamic QR.
        </p>

        {errorBanner ? (
          <p className="mt-4 rounded-xl border border-qn-warning/30 bg-qn-warning/15 px-4 py-3 text-sm text-qn-warning">
            {errorBanner}
          </p>
        ) : null}

        <button
          type="button"
          disabled={loading}
          onClick={() => void startGoogle()}
          className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-white/[0.08] bg-qn-card text-[15px] font-semibold text-white shadow-sm transition-all hover:border-white/[0.15] hover:shadow-md active:scale-[0.99] disabled:opacity-50"
        >
          <GoogleMark className="h-5 w-5" />
          Continue with Google
        </button>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center" aria-hidden>
            <div className="w-full border-t border-white/[0.08]" />
          </div>
          <div className="relative flex justify-center text-xs font-medium uppercase tracking-wider text-qn-muted-2">
            <span className="bg-qn-card px-3">or continue with email</span>
          </div>
        </div>

        <div className="flex rounded-2xl bg-qn-surface p-1 text-xs font-semibold">
          <button
            type="button"
            className={`flex-1 rounded-xl py-2.5 transition-all ${
              emailMode === "password"
                ? "bg-qn-card text-white shadow-sm"
                : "text-qn-muted-2"
            }`}
            onClick={() => {
              setEmailMode("password");
              setMessage(null);
            }}
          >
            Password
          </button>
          <button
            type="button"
            className={`flex-1 rounded-xl py-2.5 transition-all ${
              emailMode === "magic"
                ? "bg-qn-card text-white shadow-sm"
                : "text-qn-muted-2"
            }`}
            onClick={() => {
              setEmailMode("magic");
              setMessage(null);
            }}
          >
            Email link
          </button>
        </div>

        <div className="mt-5 flex rounded-2xl bg-qn-surface p-1 text-xs font-semibold">
          <button
            type="button"
            className={`flex-1 rounded-xl py-2 transition-all ${
              mode === "signin"
                ? "bg-qn-card text-white shadow-sm"
                : "text-qn-muted-2"
            }`}
            onClick={() => {
              setMode("signin");
              setMessage(null);
            }}
          >
            Sign in
          </button>
          <button
            type="button"
            className={`flex-1 rounded-xl py-2 transition-all ${
              mode === "signup"
                ? "bg-qn-card text-white shadow-sm"
                : "text-qn-muted-2"
            }`}
            onClick={() => {
              setMode("signup");
              setMessage(null);
            }}
          >
            Sign up
          </button>
        </div>

        {emailMode === "password" ? (
          <div className="mt-6 space-y-4">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                void handlePasswordSubmit(new FormData(e.currentTarget));
              }}
            >
              <label className="block">
                <span className="text-sm font-medium text-white">Email</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1.5 w-full rounded-2xl border border-white/[0.08] bg-qn-surface/50 px-4 py-3.5 text-base outline-none transition-shadow focus:border-qn-accent/50 focus:bg-qn-card focus:ring-2 focus:ring-qn-accent/35"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-white">
                  Password
                </span>
                <input
                  name="password"
                  type="password"
                  autoComplete={
                    mode === "signup" ? "new-password" : "current-password"
                  }
                  required
                  minLength={6}
                  className="mt-1.5 w-full rounded-2xl border border-white/[0.08] bg-qn-surface/50 px-4 py-3.5 text-base outline-none transition-shadow focus:border-qn-accent/50 focus:bg-qn-card focus:ring-2 focus:ring-qn-accent/35"
                />
              </label>

              {message ? (
                <p className="rounded-2xl border border-white/[0.08] bg-qn-surface px-4 py-3 text-sm text-white">
                  {message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center rounded-2xl bg-qn-accent text-sm font-bold text-white shadow-lg shadow-qn-accent/25 transition-transform hover:scale-[1.01] disabled:opacity-60"
              >
                {loading
                  ? "Please wait…"
                  : mode === "signin"
                    ? "Continue"
                    : "Sign up"}
              </button>
            </form>

            {mode === "signin" ? (
              <button
                type="button"
                className="text-sm font-medium text-qn-muted underline-offset-4 hover:text-white hover:underline"
                onClick={() => {
                  setShowForgot((v) => !v);
                  setMessage(null);
                }}
              >
                Forgot password?
              </button>
            ) : null}

            {showForgot && mode === "signin" ? (
              <div className="rounded-2xl border border-white/[0.08] bg-qn-surface p-4">
                <p className="text-xs text-qn-muted">
                  We’ll email you a secure link to set a new password.
                </p>
                <form
                  className="mt-3 flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void handleForgot(new FormData(e.currentTarget));
                  }}
                >
                  <input
                    name="forgot_email"
                    type="email"
                    required
                    placeholder="Email"
                    className="min-w-0 flex-1 rounded-xl border border-white/[0.08] px-3 py-2 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="shrink-0 rounded-xl bg-qn-card-2 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        ) : (
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void handleMagicLink(new FormData(e.currentTarget));
            }}
          >
            <label className="block">
              <span className="text-sm font-medium text-white">Email</span>
              <input
                name="magic_email"
                type="email"
                autoComplete="email"
                required
                className="mt-1.5 w-full rounded-2xl border border-white/[0.08] bg-qn-surface/50 px-4 py-3.5 text-base outline-none transition-shadow focus:border-qn-accent/50 focus:bg-qn-card focus:ring-2 focus:ring-qn-accent/35"
              />
            </label>
            {message ? (
              <p className="rounded-2xl border border-white/[0.08] bg-qn-surface px-4 py-3 text-sm text-white">
                {message}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-qn-card-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Sending…" : "Email me a link"}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-qn-muted-2">
          <Link
            href="/create/type"
            className="font-semibold text-white hover:underline"
          >
            ← Back to tag type
          </Link>
          <span className="mx-2 text-zinc-300">·</span>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </p>
      </div>
    </div>
  );
}
