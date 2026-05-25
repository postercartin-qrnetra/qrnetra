import { BuyNowButton } from "@/components/products/buy-now-button";
import { FadeIn } from "@/components/ui/motion";
import { PRODUCTS, getProduct } from "@/lib/products";
import { Check, Package, RefreshCw, Shield } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.name} — QRNetra`,
    description: product.description,
  };
}

const GUARANTEES = [
  { icon: Shield, label: "Privacy guaranteed", sub: "Your number never shown" },
  { icon: Package, label: "Free shipping", sub: "Orders above ₹499" },
  { icon: RefreshCw, label: "Easy returns", sub: "7-day return policy" },
];

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) notFound();

  const isBusiness = product.qrKind === null;

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-white/[0.08] bg-qn-bg-elevated">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-qn-muted-2">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white">Products</Link>
            <span>/</span>
            <span className="text-white">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product hero */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Visual */}
          <FadeIn>
            <div
              className={`relative flex aspect-square max-h-[480px] items-center justify-center overflow-hidden rounded-[20px] bg-gradient-to-br ${product.gradientFrom} ${product.gradientTo}`}
            >
              {product.badge ? (
                <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
                  {product.badge}
                </span>
              ) : null}
              <span className="text-[9rem]" aria-hidden>
                {product.emoji}
              </span>
            </div>

            {/* Guarantees */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {GUARANTEES.map((g) => {
                const Icon = g.icon;
                return (
                  <div
                    key={g.label}
                    className="qn-card flex flex-col items-center p-3 text-center"
                  >
                    <Icon className="h-5 w-5 text-qn-accent" strokeWidth={1.75} />
                    <p className="mt-2 text-[11px] font-semibold text-white">
                      {g.label}
                    </p>
                    <p className="mt-0.5 text-[10px] text-qn-muted">{g.sub}</p>
                  </div>
                );
              })}
            </div>
          </FadeIn>

          {/* Details + CTA */}
          <FadeIn delay={0.1}>
            <p className="text-xs font-semibold uppercase tracking-wide text-qn-accent">
              {product.category}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 text-lg font-medium text-qn-muted">
              {product.tagline}
            </p>

            <p className="mt-4 text-base leading-relaxed text-qn-muted">
              {product.description}
            </p>

            <div className="mt-6">
              <p className="text-3xl font-extrabold text-white">
                {product.priceLabel}
              </p>
              {!isBusiness && (
                <p className="mt-1 text-sm text-qn-muted">
                  + free standard shipping on orders above ₹499
                </p>
              )}
            </div>

            {/* Features */}
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {product.features.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-qn-accent" strokeWidth={2} />
                  <span className="text-sm text-qn-muted">{f}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {isBusiness ? (
                <>
                  <Link href="/business-fleet#quote" className="qn-btn-primary px-10">
                    Request a Quote
                  </Link>
                  <Link href="/business-fleet" className="qn-btn-secondary px-8">
                    Learn More
                  </Link>
                </>
              ) : (
                <>
                  <BuyNowButton
                    qrKind={product.qrKind!}
                    productSlug={product.slug}
                    className="qn-btn-primary px-10"
                  >
                    Buy Now — {product.priceLabel}
                  </BuyNowButton>
                  <Link href="/create/type" className="qn-btn-secondary px-8">
                    Try Free Digital QR
                  </Link>
                </>
              )}
            </div>

            {/* Specs */}
            <div className="qn-card mt-8 p-5">
              <p className="text-sm font-semibold text-white">Product specs</p>
              <ul className="mt-3 space-y-2">
                {product.specs.map((s) => {
                  const [label, value] = s.split(": ");
                  return (
                    <li key={s} className="flex items-start gap-2 text-sm">
                      <span className="text-qn-muted-2">{label}:</span>
                      <span className="text-white">{value}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Related products */}
      <section className="border-t border-white/[0.08] bg-qn-bg-elevated py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-extrabold text-white">
            You might also like
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.filter((p) => p.slug !== slug)
              .slice(0, 4)
              .map((related) => (
                <Link
                  key={related.slug}
                  href={`/products/${related.slug}`}
                  className="qn-card qn-card-interactive flex items-center gap-3 p-4"
                >
                  <span className="text-3xl">{related.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">
                      {related.name}
                    </p>
                    <p className="mt-0.5 text-xs text-qn-accent">
                      {related.priceLabel}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
