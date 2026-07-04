"use client";

import Link from "next/link";
import { MessageCircleMore } from "lucide-react";
import { IProduct } from "@/types/product";

export function WhatsAppOrderButton({ product }: { product: IProduct }) {
  const phoneNumber = "8801568390014"; // আপনার নাম্বার
  
  const price = product.salePrice || product.regularPrice;
  const moq = product.moq || 6;
  
  const message = `*Paikarian Order*
  
প্রোডাক্ট: ${product.title}
দাম: ${price} টাকা/পিস
MOQ: ${moq} পিস
মোট: ${price * moq} টাকা

আমি ${moq} পিস নিতে চাই। ডিটেইলস জানান।`;

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      className="flex w-full items-center justify-center gap-2 h-12 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm shadow-lg transition-all active:scale-95"
    >
      <MessageCircleMore className="size-5" />
      WhatsApp এ অর্ডার করুন
    </Link>
  );
}
