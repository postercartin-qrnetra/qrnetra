"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { LogoutButton } from "@/components/auth/logout-button";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

type UserMenuProps = {
  variant?: "header" | "sidebar";
};

export function UserMenu({ variant = "header" }: UserMenuProps) {
  const { user } = useAuth();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  if (!user) return null;

  const email = user.email ?? "Account";
  const triggerClass =
    variant === "header"
      ? "flex h-10 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
      : "flex w-full items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-2 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-100";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={triggerClass}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        <UserIcon className="shrink-0 text-zinc-500" />
        <span className="max-w-[140px] truncate sm:max-w-[180px]">{email}</span>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className={
            variant === "header"
              ? "absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[220px] overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg"
              : "absolute bottom-full left-0 right-0 z-50 mb-2 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg"
          }
        >
          <p className="border-b border-zinc-100 px-3 py-2.5 text-xs text-zinc-500">
            {email}
          </p>
          <Link
            href="/dashboard"
            role="menuitem"
            className="block px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <div className="border-t border-zinc-100 px-1 py-1">
            <LogoutButton
              className="w-full rounded-lg px-2 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
              onLoggedOut={() => setOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
