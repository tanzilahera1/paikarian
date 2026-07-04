import { Metadata } from "next";
import CartPageClient from "./CartPageClient";

export const metadata: Metadata = {
  title: "আপনার কার্ট | Paikarian",
  description: "আপনার পছন্দের প্রোডাক্ট চেকআউট করার জন্য তৈরি করুন।",
};

export default function CartPage() {
  return <CartPageClient />;
}
