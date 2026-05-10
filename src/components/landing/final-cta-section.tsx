import Link from "next/link";

export function FinalCtaSection() {
  return (
    <section className="scroll-mt-28 bg-[#fafafa] pb-16 pt-4 sm:pb-20">
      <div className="relative mx-4 overflow-hidden rounded-3xl bg-[#111111] px-6 py-14 text-center sm:mx-6 sm:py-20 lg:mx-auto lg:max-w-6xl">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#ffd400]/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#ffd400]/5 blur-3xl"
          aria-hidden
        />
        <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          One Scan Can Solve An Emergency.
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-sm text-zinc-400 sm:text-base">
          Join thousands who chose privacy-first contact for what matters most.
        </p>
        <div className="relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/shop"
            className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-full bg-[#ffd400] px-8 text-sm font-semibold text-[#111111] transition-transform hover:scale-[1.02]"
          >
            Shop Now
          </Link>
          <Link
            href="/create/type"
            className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-full border border-zinc-600 bg-transparent px-8 text-sm font-semibold text-white transition-colors hover:border-zinc-400"
          >
            Create Your QR
          </Link>
          <Link
            href="/bulk-orders"
            className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-full border border-zinc-600 bg-transparent px-8 text-sm font-semibold text-white transition-colors hover:border-zinc-400"
          >
            Bulk Orders
          </Link>
        </div>
      </div>
    </section>
  );
}
