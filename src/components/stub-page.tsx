import Link from "next/link";

type StubPageProps = {
  title: string;
  description?: string;
  breadcrumb?: { href: string; label: string }[];
};

export function StubPage({ title, description, breadcrumb }: StubPageProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      {breadcrumb && breadcrumb.length > 0 ? (
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
      <h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
      {description ? (
        <p className="mt-3 text-base leading-relaxed text-qn-muted">{description}</p>
      ) : null}
      <p className="mt-8 rounded-lg border border-dashed border-white/[0.08] bg-qn-surface px-4 py-6 text-sm text-qn-muted-2">
        Stub route — content ships in a later milestone.
      </p>
    </div>
  );
}
