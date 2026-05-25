import { StoreCategoryPage } from "@/components/products/store-category-page";
import { getCategory } from "@/lib/products";
import type { Metadata } from "next";

const category = getCategory("pets");

export const metadata: Metadata = {
  title: category.seoTitle,
  description: category.seoDescription,
};

export default function PetsCategoryPage() {
  return <StoreCategoryPage category="pets" />;
}
