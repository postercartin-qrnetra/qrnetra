"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type NavItem = {
  label: string;
  href: string;
  description?: string;
};

const ITEMS: NavItem[] = [
  {
    label: "All Products",
    href: "/products",
    description: "Browse the full catalog",
  },
  {
    label: "Vehicle QR Sticker",
    href: "/products/vehicle",
    description: "Wrong parking & emergencies",
  },
  {
    label: "Pet QR Tag",
    href: "/products/pet",
    description: "Lost pet recovery",
  },
  {
    label: "Child Safety Wristband",
    href: "/products/child",
    description: "School-safe ID",
  },
  {
    label: "QR Keychain",
    href: "/products/keychain",
    description: "Keys, bags & everyday carry",
  },
  {
    label: "Business & Fleet Solutions",
    href: "/business-fleet",
    description: "Volume pricing & admin tools",
  },
];

type ProductsNavProps = {
  mode: "desktop" | "mobile";
  onNavigate?: () => void;
};

export function ProductsNav({ mode, onNavigate }: ProductsNavProps) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);

  if (mode === "mobile") {
    return (
      <div className="border-b border-white/[0.08]">
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-qn-muted transition-colors hover:bg-white/[0.04] hover:text-white"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          Products
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open ? (
          <div className="space-y-1 pb-3 pl-2 pr-2">
            {ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block rounded-lg px-4 py-2.5 text-sm text-qn-muted hover:bg-white/[0.04] hover:text-white"
                onClick={onNavigate}
              >
                <span className="font-medium text-white">{item.label}</span>
                {item.description ? (
                  <span className="mt-0.5 block text-xs text-qn-muted-2">
                    {item.description}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        type="button"
        className="qn-btn-ghost flex items-center gap-1 rounded-lg px-3 py-2"
        aria-expanded={hover}
        aria-haspopup="true"
      >
        Products
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${hover ? "rotate-180" : ""}`}
        />
      </button>
      {hover ? (
        <div className="qn-card absolute left-0 top-full z-50 mt-1 min-w-[280px] overflow-hidden p-2 shadow-xl">
          {ITEMS.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              className={`block rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.04] ${
                i === 0 ? "border-b border-white/[0.08] mb-1 pb-3" : ""
              }`}
              onClick={onNavigate}
            >
              <span
                className={`text-sm font-medium ${i === 0 ? "text-qn-accent" : "text-white"}`}
              >
                {item.label}
              </span>
              {item.description ? (
                <span className="mt-0.5 block text-xs text-qn-muted">
                  {item.description}
                </span>
              ) : null}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
