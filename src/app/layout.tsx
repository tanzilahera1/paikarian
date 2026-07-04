
import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali} from "next/font/google";
import "@/styles/globals.css";

import { Providers } from "@/components/providers/Providers";
import { ToastProvider } from "@/components/ui/toast-provider";

const notoSansfBengali = Noto_Sans_Bengali({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "bengali"],
  variable: "--font-noto-sans-bengali",
  display: "swap",
});


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const APP_NAME = "Paikarian";
const APP_DEFAULT_TITLE =
  "Paikarian | 6 পিসেই পাইকারি ব্যবসা শুরু করুন";
const APP_TITLE_TEMPLATE = "%s | Paikarian";
const APP_DESCRIPTION =
  "1 কার্টন কেনার টাকা নাই? 6 পিস দিয়েই পাইকারি রেটে ব্যবসা শুরু করুন। 100% অরিজিনাল প্রোডাক্ট, 24 ঘন্টায় ডেলিভারি, লসের ভয় নাই। বাংলাদেশের প্রথম B2B হোলসেল প্ল্যাটফর্ম।";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "paikarian",
    "পাইকারিয়ান",
    "paikari business bangladesh",
    "wholesale bd",
    "6 piece wholesale",
    "6 পিস পাইকারি",
    "b2b marketplace bangladesh",
    "hawker business",
    "small business wholesale",
    "online paikari",
    "gulistan wholesale",
    "chawkbazar wholesale",
    "low moq wholesale",
    "business startup bd",
    "reseller wholesale",
  ],
  authors: [
    { name: "Paikarian", url: "https://paikarian.com" },
  ],
  creator: "Paikarian",
  publisher: "Paikarian",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://paikarian.com",
  ),

  alternates: {
    canonical: "/",
  },

  // Open Graph - Facebook, LinkedIn, WhatsApp শেয়ার
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    url: "/",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Paikarian - 6 Piece Wholesale Logo",
      },
    ],
    locale: "bn_BD", // বাংলা মার্কেট
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    images: ["/logo.png"],
    creator: "@paikarian", // Twitter/X থাকলে দিয়েন
  },

  // Icons - আপনার নতুন 6-বক্স লোগো
  icons: {
    icon: [
      { url: "/logo.png" }, // 48x48, 32x32, 16x16 multi-size
      { url: "/logo.png", type: "image/png", sizes: "192x192" },
      { url: "/logo.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" }, // iOS
    ],
    shortcut: ["/logo.png"],
  },

  // PWA + Mobile
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },

  // AI/LLM friendly - Perplexity, Claude, Gemini যাতে বুঝে
  category: "business",
  classification: "B2B Marketplace, Wholesale, E-commerce, Bangladesh, SME",

  // Verification - Search Console থেকে কোড বসাবেন
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Viewport আলাদা এক্সপোর্ট - Next.js 16 রুল
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${notoSansfBengali.variable} ${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <Providers>
          {children}
          <ToastProvider />
        </Providers>
         <Analytics />
      </body>
    </html>
  );
}
