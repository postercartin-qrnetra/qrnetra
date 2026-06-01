import Link from "next/link";
import type { LegalPageContent } from "@/content/types";

export function LegalPageLayout({
  content,
  breadcrumb,
}: {
  content: LegalPageContent;
  breadcrumb?: { href: string; label: string }[];
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      {breadcrumb?.length ? (
        <nav className="mb-6 text-sm text-qn-muted-2">
          {breadcrumb.map((b, i) => (
            <span key={b.href}>
              {i > 0 ? " / " : ""}
              <Link href={b.href} className="hover:text-white">
                {b.label}
              </Link>
            </span>
          ))}
        </nav>
      ) : null}
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {content.title}
        </h1>
        <p className="mt-3 text-sm text-qn-muted">Last updated: {content.lastUpdated}</p>
        <p className="mt-4 text-base leading-relaxed text-qn-muted">{content.description}</p>
      </header>
      <div className="space-y-10">
        {content.sections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2 className="text-lg font-semibold text-white">{section.title}</h2>
            {section.body ? (
              <p className="mt-3 text-sm leading-relaxed text-qn-muted">{section.body}</p>
            ) : null}
            {section.paragraphs?.map((p) => (
              <p key={p.slice(0, 40)} className="mt-3 text-sm leading-relaxed text-qn-muted">
                {p}
              </p>
            ))}
            {section.list?.length ? (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-qn-muted">
                {section.list.map((item) => (
                  <li key={item.slice(0, 48)}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </article>
  );
}
