import Link from "next/link";

export function ShopShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-qn-bg">
      <header className="border-b border-white/[0.08]">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="text-sm font-medium text-qn-muted hover:text-white">
            ← QRNetra
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/shop" className="text-white">
              Shop
            </Link>
            <Link href="/cart" className="text-qn-muted hover:text-white">
              Cart
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
