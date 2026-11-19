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
    template: "%s | EarthHue",
    default:
      "EarthHue — Fermentation-Derived Natural Carotenoids: Astaxanthin, Lutein, Lycopene",
  },
  description:
    "Manufacturer of fermentation-derived natural carotenoids — astaxanthin, lutein, lycopene, beta-carotene and zeaxanthin for food, nutraceutical, cosmetic and pharmaceutical formulations. EU, US, Japan and Korea compliant, with COA and MSDS per batch.",
  applicationName: "EarthHue",
  keywords: [
    "astaxanthin supplier",
    "astaxanthin manufacturer",
    "lutein supplier",
    "lutein manufacturer",
    "lycopene powder supplier",
    "lycopene manufacturer",
    "fermentation derived carotenoids",
    "natural carotenoid manufacturer",
    "beta-carotene supplier",
    "zeaxanthin supplier",
    "natural pigment manufacturer",
    "natural food colorant supplier",
    "clean label colorant",
    "microbial pigment fermentation",
    "EU FDA compliant carotenoid",
    "nutraceutical pigment supplier",
    "bulk astaxanthin powder",
    "bulk lutein powder",
    "bulk lycopene powder",
  ],
  authors: [{ name: "EarthHue" }],
  creator: "EarthHue",
  publisher: "EarthHue",
  category: "natural color ingredients",
  alternates: {
    canonical: "https://earthhue.net/en",
    languages: {
      en: "https://earthhue.net/en",
      zh: "https://earthhue.net/zh",
      ja: "https://earthhue.net/ja",
      ko: "https://earthhue.net/ko",
      es: "https://earthhue.net/es",
      fr: "https://earthhue.net/fr",
      de: "https://earthhue.net/de",
      "x-default": "https://earthhue.net/en",
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://earthhue.net/en",
    siteName: "EarthHue",
    title: "EarthHue — Fermentation-Derived Natural Carotenoids",
    description:
      "Astaxanthin, lutein, lycopene, beta-carotene and zeaxanthin made by precision fermentation. Food, nutraceutical, cosmetic and pharma grades. Batch-level COA and MSDS.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EarthHue — fermentation-derived natural carotenoids for food, nutraceutical and cosmetic formulations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EarthHue — Fermentation-Derived Natural Carotenoids",
    description:
      "Astaxanthin, lutein, lycopene, beta-carotene and zeaxanthin made by precision fermentation. Batch-level COA and MSDS.",
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
