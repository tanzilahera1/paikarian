// src/components/ui/ProgressiveImage.tsx
//
// কেন এই component?
// ─────────────────
// Next.js Image এর default behavior হলো image লোড হওয়ার আগে
// সাদা/ফাঁকা জায়গা দেখায় — যা UX-এ খারাপ লাগে।
//
// এই component যা করে:
// 1. Shimmer skeleton  → লোডের সময় animated gradient sweep
// 2. Smooth fade-in   → onLoad event-এ image opacity 0→1
// 3. Error fallback   → network fail হলে placeholder icon
// 4. Dark mode safe   → CSS variable দিয়ে skeleton color

"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressiveImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  /** Shimmer skeleton-এর aspect ratio class — default "aspect-square" */
  aspectClass?: string;
  /** Fallback icon size — default size-12 */
  fallbackIconSize?: string;
  /** Container-এর extra className */
  containerClassName?: string;
}

export function ProgressiveImage({
  src,
  alt,
  className,
  aspectClass = "aspect-square",
  fallbackIconSize = "size-12",
  containerClassName,
  ...props
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={cn("relative w-full overflow-hidden", aspectClass, containerClassName)}>
      {/* ── 1. Shimmer Skeleton ─────────────────────────────────── */}
      {/* image লোড না হওয়া পর্যন্ত দেখাবে, তারপর fade-out */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 img-shimmer rounded-[inherit]"
          aria-hidden="true"
        />
      )}

      {/* ── 2. Error Fallback ────────────────────────────────────── */}
      {/* network বা URL fail হলে icon দেখাবে */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/50 text-muted-foreground/40">
          <ImageOff className={cn(fallbackIconSize)} strokeWidth={1.2} />
          <span className="text-[10px] font-medium uppercase tracking-widest">
            লোড হয়নি
          </span>
        </div>
      )}

      {/* ── 3. Actual Image ──────────────────────────────────────── */}
      {/* opacity: 0 → 1, skeleton-এর উপরে বসে */}
      {!hasError && (
        <Image
          src={src}
          alt={alt}
          className={cn(
            "transition-opacity duration-500 ease-in-out",
            isLoaded ? "opacity-100" : "opacity-0",
            className,
          )}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setIsLoaded(false);
            setHasError(true);
          }}
          {...props}
        />
      )}
    </div>
  );
}
