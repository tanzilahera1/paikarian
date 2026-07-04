"use client";

import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState, useMemo, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

const BANNERS = [
  {
    id: 1,
    src:"https://res.cloudinary.com/tanjumart/image/upload/v1782442491/banner1_hutqa4.webp",
    alt: "Paikarian Banner 1",
    href: "/products",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/tanjumart/image/upload/v1782442491/banner2_ra2plr.webp",
    alt: "Paikarian Banner 2",
    href: "/products?sale=true",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/tanjumart/image/upload/v1782442491/banner3_yqvguo.webp",
    alt: "Paikarian Banner 3",
    href: "/about",
  },

];

export default function HeroSection() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const plugins = useMemo(() => {
    if (!isClient) return [];
    return [Autoplay({ delay: 4000, stopOnInteraction: false })];
  }, [isClient]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
    },
    plugins,
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // ✅ ফিক্স: queueMicrotask দিয়ে wrap করছি
  useEffect(() => {
    if (!emblaApi) return;

    // Initial index সেট করার জন্য microtask ইউজ
    queueMicrotask(() => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative w-full group">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {BANNERS.map((banner, index) => (
            <div
              key={banner.id}
              className="relative flex-[0_0_100%] min-w-0"
            >
                <div className="relative w-full aspect-video">
                  <Image
                    src={banner.src}
                    alt={banner.alt}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-contain"
                   
                  />
                </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-black/20 backdrop-blur-md border border-white/20 shadow-xl hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100 items-center justify-center"
        aria-label="Previous banner"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={scrollNext}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-black/20 backdrop-blur-md border border-white/20 shadow-xl hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100 items-center justify-center"
        aria-label="Next banner"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "h-1.5 md:h-2 rounded-full transition-all duration-300",
              index === selectedIndex
            ? "w-6 md:w-8 bg-white shadow-lg"
                : "w-1.5 md:w-2 bg-white/50 hover:bg-white/80"
            )}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
