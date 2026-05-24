"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { LogoutButton } from "@/components/auth/logout-button";
import { User } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

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
      ? "flex h-10 items-center gap-2 rounded-xl border border-white/[0.12] bg-qn-card px-3 text-sm font-medium text-qn-muted transition-colors hover:border-qn-accent/30 hover:text-white"
      : "flex w-full items-center gap-2 rounded-xl border border-white/[0.08] bg-qn-surface px-2 py-2 text-left text-sm font-medium text-qn-muted hover:bg-white/[0.04] hover:text-white";

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
        <User className="h-4 w-4 shrink-0 text-qn-muted-2" strokeWidth={1.75} />
        <span className="max-w-[140px] truncate sm:max-w-[180px]">{email}</span>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className={
            variant === "header"
              ? "qn-card absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[220px] overflow-hidden py-1 shadow-xl"
              : "qn-card absolute bottom-full left-0 right-0 z-50 mb-2 overflow-hidden py-1 shadow-xl"
          }
        >
          <p className="border-b border-white/[0.08] px-3 py-2.5 text-xs text-qn-muted-2">
            {email}
          </p>
          <Link
            href="/dashboard"
            role="menuitem"
            className="block px-3 py-2 text-sm text-qn-muted transition-colors hover:bg-white/[0.04] hover:text-white"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <div className="border-t border-white/[0.08] px-1 py-1">
            <LogoutButton
              className="w-full rounded-lg px-2 py-2 text-left text-sm text-qn-danger hover:bg-qn-danger/10 disabled:opacity-50"
              onLoggedOut={() => setOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
