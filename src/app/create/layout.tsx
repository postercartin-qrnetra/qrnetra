import Link from "next/link";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="border-b border-zinc-200 bg-white/90 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <Link
            href="/"
            className="text-sm font-bold tracking-tight text-[#111111]"
          >
            QRNetra
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-zinc-500 hover:text-[#111111] transition-colors"
          >
            Dashboard →
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
