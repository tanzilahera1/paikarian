// src/app/(main)/page.tsx
import { Suspense } from "react";
import Product from "@/models/Product";
import Category from "@/models/Category";
import HeroSection from "@/components/home/HeroSection";
import { IProduct } from "@/types/product";
import { ICategory } from "@/types/category";
import Footer from "@/components/layout/Footer";
import { dbConnect } from "@/lib/db";
import { ProductsPageContent } from "@/components/products/ProductsPageContent";
import { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Paikarian | পাইকারি দামে কিনুন",
  description:
    "বাংলাদেশের সবচেয়ে বিশ্বস্ত B2B পাইকারি প্ল্যাটফর্ম। সর্বনিম্ন ৬ পিস থেকে অর্ডার করুন।",
};

type LeanProduct = Omit<IProduct, "category"> & {
  _id: { toString(): string };
  category: ICategory & { _id: { toString(): string } };
};

async function getInitialData() {
  await dbConnect();

  const [productsDocs, categoriesDocs] = await Promise.all([
    Product.find({ status: "published" })
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean<LeanProduct[]>(),

    Category.find()
      .lean<(ICategory & { _id: { toString(): string } })[]>(),
  ]);

  const products = productsDocs.map((p) => ({
    ...p,
    _id: String(p._id),
    category: {
      ...p.category,
      _id: String(p.category._id),
    },
  })) as IProduct[];

  const categories = categoriesDocs.map((c) => ({
    ...c,
    _id: String(c._id),
  })) as ICategory[];

  return { products, categories };
}

export default async function HomePage() {
  const { products, categories } = await getInitialData();

  return (
    <div className="min-h-screen flex flex-col">
      {/* JSON-LD Structured Data for Home Page SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Paikarian",
            "url": "https://paikarian.com/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://paikarian.com/products?search={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Paikarian",
            "url": "https://paikarian.com/",
            "logo": "https://paikarian.com/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+8801330807372",
              "contactType": "customer service"
            }
          }),
        }}
      />
      {/* ── Hero ── */}
      <Suspense
        fallback={
          <div className="h-[40vh] animate-pulse bg-muted/50 rounded-xl m-4" />
        }
      >
        <HeroSection />
      </Suspense>

      {/* ── Products ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
<div className="relative mb-6">
  <div className="text-center">
    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
      সকল প্রোডাক্ট
    </h2>
    <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
      সর্বনিম্ন ৬ পিস থেকে অর্ডার করুন
    </p>
  </div>
</div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-3/4 animate-pulse bg-muted/50 rounded-xl"
                />
              ))}
            </div>
          }
        >
          <ProductsPageContent
            initialProducts={products}
            initialCategories={categories}
          />
        </Suspense>
      </main>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}