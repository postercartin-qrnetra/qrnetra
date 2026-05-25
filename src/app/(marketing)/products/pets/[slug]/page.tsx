import { StoreProductDetailPage } from "@/components/products/store-product-detail-page";
import { getProduct, getProductsByCategory } from "@/lib/products";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getProductsByCategory("pets").map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return product
    ? { title: `${product.title} · QR Netra`, description: product.description }
    : { title: "Product not found" };
}

export default async function PetProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product || product.category !== "pets") notFound();
  return <StoreProductDetailPage product={product} />;
}
