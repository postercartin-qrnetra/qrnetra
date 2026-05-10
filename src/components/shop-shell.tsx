import Link from "next/link";

export function ShopShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-zinc-200">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
            ← QRNetra
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/shop" className="text-zinc-900">
              Shop
            </Link>
            <Link href="/cart" className="text-zinc-600 hover:text-zinc-900">
              Cart
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
