"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProgressiveImage } from "@/components/ui/ProgressiveImage";

interface ProductImageGalleryProps {
  images: { url: string; alt: string }[];
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);

  if (!images.length) {
    return (
      <div className="aspect-square bg-slate-50 rounded-3xl flex items-center justify-center">
        <span className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">
          No Image
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image — shimmer + fade-in */}
      <div className="aspect-square relative rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 group">
        <ProgressiveImage
          src={images[activeImage].url}
          alt={images[activeImage].alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          aspectClass=""
          containerClassName="absolute inset-0"
        />
      </div>

      {/* Thumbnails — প্রতিটিতে shimmer */}
      <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(idx)}
            className={cn(
              "relative size-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all",
              activeImage === idx
                ? "border-primary ring-4 ring-primary/10 shadow-lg"
                : "border-slate-100 hover:border-slate-200",
            )}
          >
            <ProgressiveImage
              src={img.url}
              alt={img.alt}
              fill
              priority={idx < 4}
              sizes="80px"
              className="object-cover"
              aspectClass=""
              containerClassName="absolute inset-0"
              fallbackIconSize="size-5"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
