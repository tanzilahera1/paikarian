"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/socialCustomSVGIcon/SocialCustomSVGIcon";

export default function FloatingActionButtons() {
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed bottom-20 right-4 z-[999] flex flex-col gap-3">
      {/* WhatsApp */}
      <Link
        href="https://wa.me/8801330807372"
        target="_blank"
        rel="noopener noreferrer"
        className="flex size-11 items-center justify-center rounded-full bg-[#25D366]/20 backdrop-blur-xl border border-[#25D366]/30 text-[#25D366] shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-[#25D366]/30 group"
        aria-label="Chat on WhatsApp"
      >
        <div className="absolute inset-0 rounded-full bg-[#25D366]/10 animate-ping group-hover:hidden" />
        <WhatsAppIcon className="size-6 relative z-10" />
      </Link>

      {/* Scroll to Top */}
      {showScrollTop && (
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          size="icon"
          className="h-11 w-11 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 animate-in fade-in slide-in-from-bottom-4"
          aria-label="Scroll to top"
        >
          <ChevronUp className="size-5" />
        </Button>
      )}
    </div>
  );
}
