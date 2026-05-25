"use client";

import Image from "next/image";
import type { Product } from "@/lib/products";

type Props = {
  product: Product;
  className?: string;
  imageClassName?: string;
};

export function ProductImagePanel({
  product,
  className = "",
  imageClassName = "",
}: Props) {
  const image = product.images[0];

  return (
    <div
      className={`relative overflow-hidden rounded-[20px] border border-white/[0.08] bg-qn-card-2 ${className}`}
    >
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover ${imageClassName}`}
          priority={false}
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-qn-card text-qn-muted">
          No image
        </div>
      )}
    </div>
  );
}
