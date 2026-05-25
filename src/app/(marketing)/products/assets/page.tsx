import { StoreCategoryPage } from "@/components/products/store-category-page";
import { getCategory } from "@/lib/products";
import type { Metadata } from "next";

const category = getCategory("assets");

export const metadata: Metadata = {
  title: category.seoTitle,
  description: category.seoDescription,
};

export default function AssetsCategoryPage() {
  return <StoreCategoryPage category="assets" />;
}
