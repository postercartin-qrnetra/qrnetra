"use client";

import type { Product } from "@/lib/products";
import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export function ProductImageGallery({ product }: { product: Product }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (!zoomed) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setZoomed(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [zoomed]);

  const selectedImage = product.images[selectedIndex] ?? product.images[0];

  return (
    <>
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setZoomed(true)}
          className="relative block aspect-square w-full overflow-hidden rounded-[28px] border border-white/[0.08] bg-qn-card-2 text-left"
        >
          <Image
            src={selectedImage.src}
            alt={selectedImage.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 hover:scale-[1.02]"
            priority={selectedIndex === 0}
          />
          <span className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            Tap to zoom
          </span>
        </button>

        <div className="grid grid-cols-3 gap-3">
          {product.images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-2xl border transition ${
                index === selectedIndex
                  ? "border-qn-accent ring-2 ring-qn-accent/25"
                  : "border-white/[0.08] hover:border-white/[0.16]"
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 33vw, 180px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {zoomed ? (
        <div
          className="fixed inset-0 z-[120] bg-black/85 px-4 py-6 backdrop-blur"
          onClick={() => setZoomed(false)}
        >
          <div className="mx-auto flex h-full max-w-5xl flex-col">
            <div className="flex justify-end">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white"
                onClick={() => setZoomed(false)}
              >
                <span className="sr-only">Close zoomed image</span>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative mt-4 flex-1 overflow-hidden rounded-[28px] border border-white/10 bg-qn-bg-elevated">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
