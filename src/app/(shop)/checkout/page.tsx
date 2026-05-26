import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ product?: string }>;
};

export const metadata = {
  title: "Checkout · QR Netra",
};

export default async function CheckoutPage({ searchParams }: Props) {
  const { product } = await searchParams;
  if (product) {
    redirect(`/order/setup?product=${encodeURIComponent(product)}`);
  }

  redirect("/products");
}
