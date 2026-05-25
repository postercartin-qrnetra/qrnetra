import { getProduct, getProductHref, getProductsByCategory } from "@/lib/products";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return [
    ...getProductsByCategory("vehicles"),
    ...getProductsByCategory("pets"),
    ...getProductsByCategory("kids"),
    ...getProductsByCategory("assets"),
  ].map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.title} — QR Netra`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) notFound();
  redirect(getProductHref(product));
}
