import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
      <section className="text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          Privacy-first emergency contact
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Protect what matters with smart QR safety tags
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
          QRNetra lets someone reach you in an emergency without exposing your phone number on a
          sticker, wristband, or tag.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-full bg-zinc-900 px-8 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Buy now
          </Link>
          <Link
            href="/create"
            className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-full border border-zinc-300 bg-white px-8 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Create your QR
          </Link>
          <Link href="/how-it-works" className="text-sm font-medium text-zinc-600 underline-offset-4 hover:underline">
            How it works
          </Link>
        </div>
      </section>

      <section className="mt-24 grid gap-8 sm:grid-cols-3">
        {[
          { title: "Vehicle", body: "Wrong parking & roadside contact without sharing your number." },
          { title: "Child", body: "Wristband with emergency profile you can update anytime." },
          { title: "Pet", body: "Collar tags that help someone reach you fast if they find your pet." },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-zinc-900">{card.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">{card.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
