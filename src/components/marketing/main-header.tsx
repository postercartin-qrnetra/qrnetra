"use client";

import { HeaderAuthActions } from "@/components/auth/header-auth-actions";
import { useAuth } from "@/components/auth/auth-provider";
import { UserMenu } from "@/components/auth/user-menu";
import { QnLogo } from "@/components/ui/logo";
import { Menu, ShoppingCart, X } from "lucide-react";
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

export function MainHeader() {
  const [open, setOpen] = useState(false);
  const { user, isLoading } = useAuth();

  return (
    <header className="qn-header sticky top-0 z-50">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:h-16 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <QnLogo />
        </div>

        <nav
          className="hidden items-center gap-0.5 lg:flex"
          aria-label="Primary"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="qn-btn-ghost rounded-lg px-3 py-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <HeaderAuthActions />
          <Link
            href="/cart"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-qn-muted transition-colors hover:bg-white/[0.05] hover:text-white"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" strokeWidth={1.75} />
          </Link>
          <Link href="/create/type" className="qn-btn-primary hidden h-11 px-5 sm:inline-flex">
            Create QR
          </Link>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`border-t border-white/[0.08] bg-qn-bg-elevated lg:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-4 py-3 text-sm font-medium text-qn-muted transition-colors hover:bg-white/[0.04] hover:text-white"
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
              className="rounded-xl px-4 py-3 text-sm font-medium text-qn-muted hover:bg-white/[0.04] hover:text-white"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          ) : null}
          {!isLoading && user ? (
            <Link
              href="/dashboard"
              className="rounded-xl px-4 py-3 text-sm font-medium text-qn-muted hover:bg-white/[0.04] hover:text-white"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
          ) : null}
          <Link
            href="/create/type"
            className="qn-btn-primary mt-2"
            onClick={() => setOpen(false)}
          >
            Create QR
          </Link>
        </nav>
      </div>
    </header>
  );
}
