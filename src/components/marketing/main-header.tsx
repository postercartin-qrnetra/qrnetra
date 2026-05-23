"use client";

import { HeaderAuthActions } from "@/components/auth/header-auth-actions";
import { useAuth } from "@/components/auth/auth-provider";
import { UserMenu } from "@/components/auth/user-menu";
import Link from "next/link";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/#products", label: "Products" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/bulk-orders", label: "Bulk Orders" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      {open ? (
        <>
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

export function MainHeader() {
  const [open, setOpen] = useState(false);
  const { user, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/90 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#111111] lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <MenuIcon open={open} />
          </button>
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-[#111111] sm:text-xl"
          >
            QRNetra
          </Link>
        </div>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Primary"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-[#111111]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <HeaderAuthActions />
          <Link
            href="/cart"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-[#111111]"
            aria-label="Cart"
          >
            <CartIcon />
          </Link>
          <Link
            href="/create/type"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-[#ffd400] px-4 text-sm font-semibold text-[#111111] shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Create QR
          </Link>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`border-t border-zinc-100 bg-white lg:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-4 py-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {!isLoading && user ? (
            <div className="px-2 py-2">
              <UserMenu variant="header" />
            </div>
          ) : !isLoading ? (
            <Link
              href="/login"
              className="rounded-xl px-4 py-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          ) : null}
          {!isLoading && user ? (
            <Link
              href="/dashboard"
              className="rounded-xl px-4 py-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
