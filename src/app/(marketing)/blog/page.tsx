import Link from "next/link";
import { BLOG_CATEGORIES } from "@/content/company/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | QRNetra",
  description:
    "Articles on vehicle safety, pet recovery, child safety, and QR technology—published when ready.",
};

export default function BlogIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <nav className="mb-6 text-sm text-qn-muted-2">
        <Link href="/" className="hover:text-white">
          Home
        </Link>
        {" / "}
        <span className="text-white">Blog</span>
      </nav>
      <h1 className="text-3xl font-bold text-white sm:text-4xl">QRNetra Blog</h1>
      <p className="mt-4 max-w-2xl text-qn-muted">
        Practical guides on safety, recovery, and dynamic QR tags. We publish articles manually—no
        filler content. Browse categories below; posts will appear as they are ready.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BLOG_CATEGORIES.map((cat) => (
          <div key={cat.slug} className="qn-card p-5">
            <h2 className="font-semibold text-white">{cat.title}</h2>
            <p className="mt-2 text-sm text-qn-muted">{cat.description}</p>
            <p className="mt-4 text-xs text-qn-muted-2">Articles coming soon</p>
          </div>
        ))}
      </div>

      <p className="mt-12 rounded-xl border border-dashed border-white/[0.1] px-4 py-6 text-center text-sm text-qn-muted">
        No published articles yet. Check back soon or contact us if you would like a specific topic
        covered.
      </p>
    </div>
  );
}
