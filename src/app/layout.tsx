import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://earthhue.net"),
  title: {
    template: "%s | EarthHue - Natural Pigments",
    default: "EarthHue - Premium Natural Pigments for Food & Cosmetics",
  },
  description:
    "Premium natural pigments and colorants derived from plant, mineral, and microbial sources. EU, FDA, Japan, Korea regulatory compliant. Sustainable sourcing for food, cosmetics, and pharmaceuticals.",
  keywords: [
    "natural pigments",
    "natural colorants",
    "food colorants",
    "cosmetic pigments",
    "plant-based pigments",
    "microbial pigments",
    "astaxanthin",
    "curcumin",
    "chlorophyll",
    "phycocyanin",
    "EU FDA compliant pigments",
    "sustainable colorants",
    "clean label colors",
  ],
  authors: [{ name: "EarthHue" }],
  creator: "EarthHue",
  publisher: "EarthHue",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://earthhue.net",
    siteName: "EarthHue",
    title: "EarthHue - Premium Natural Pigments for Food & Cosmetics",
    description:
      "Premium natural pigments and colorants derived from plant, mineral, and microbial sources. EU, FDA, and international regulatory compliant.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EarthHue Natural Pigments",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EarthHue - Premium Natural Pigments",
    description:
      "Premium natural pigments for food, cosmetics, and pharmaceuticals. EU, FDA compliant.",
    images: ["/og-image.png"],
  },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
