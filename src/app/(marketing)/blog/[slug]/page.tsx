import Link from "next/link";
import { BLOG_CATEGORIES, PUBLISHED_BLOG_POSTS } from "@/content/company/blog";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [
    ...BLOG_CATEGORIES.map((c) => ({ slug: c.slug })),
    ...PUBLISHED_BLOG_POSTS.map((p) => ({ slug: p.slug })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = PUBLISHED_BLOG_POSTS.find((p) => p.slug === slug);
  if (post) return { title: `${post.title} | QRNetra Blog` };
  const cat = BLOG_CATEGORIES.find((c) => c.slug === slug);
  if (cat) return { title: `${cat.title} | QRNetra Blog` };
  return { title: "Blog | QRNetra" };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = PUBLISHED_BLOG_POSTS.find((p) => p.slug === slug);
  const category = BLOG_CATEGORIES.find((c) => c.slug === slug);

  if (!post && !category) {
    notFound();
  }

  if (post) {
    return (
      <article className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-sm text-qn-muted">Article content would render here when published.</p>
        <h1 className="mt-4 text-3xl font-bold text-white">{post.title}</h1>
      </article>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/blog" className="text-sm text-qn-accent">
        ← Blog
      </Link>
      <h1 className="mt-6 text-3xl font-bold text-white">{category!.title}</h1>
      <p className="mt-4 text-qn-muted">{category!.description}</p>
      <p className="mt-8 rounded-xl border border-dashed border-white/[0.1] px-4 py-6 text-sm text-qn-muted">
        No articles in this category yet. We are preparing helpful, manually written guides for
        QRNetra customers.
      </p>
    </article>
  );
}
