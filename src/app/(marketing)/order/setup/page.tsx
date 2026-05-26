import { OrderSetupPageClient } from "@/components/order/order-setup-page-client";
import { createClient } from "@/lib/supabase/server";
import { getProduct } from "@/lib/products";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Product Setup · QR Netra",
  description:
    "Create the permanent QR profile for your purchased QRNetra product before payment and shipping.",
};

type Props = {
  searchParams: Promise<{ product?: string }>;
};

export default async function OrderSetupPage({ searchParams }: Props) {
  const { product: productSlug } = await searchParams;
  if (!productSlug) {
    redirect("/products");
  }

  const product = getProduct(productSlug);
  if (!product) {
    notFound();
  }

  const supabase = await createClient();
  let userEmail: string | null = null;

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userEmail = user?.email ?? null;
  }

  return <OrderSetupPageClient product={product} initialEmail={userEmail} />;
}
