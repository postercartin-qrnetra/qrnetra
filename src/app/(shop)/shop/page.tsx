import { redirect } from "next/navigation";

/** /shop redirects to the marketing-shell products catalog */
export default function ShopPage() {
  redirect("/products");
}
