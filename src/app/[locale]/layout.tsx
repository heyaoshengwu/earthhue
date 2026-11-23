import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BASE_URL, LOCALES, ogImages, socialMetadata } from "@/lib/seo";

/**
 * Locale-scoped social and discovery metadata.
 *
 * The root layout is shared by all seven locales, so the English twitter card,
 * keyword list, category and og:image alt text used to leak onto every
 * translated page. Page-level `generateMetadata` overrides title/description
 * and canonical/alternates; everything else is inherited from here.
 *
 * `openGraph` is replaced wholesale by any page that declares its own, so the
 * per-page blocks are built with `openGraphFor()` to keep the og:url pointing
 * at the page itself rather than at the locale root.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const social = socialMetadata(locale);

  return {
    twitter: social.twitter,
    keywords: social.keywords,
    category: social.category,
    openGraph: {
      type: "website",
      locale,
      alternateLocale: LOCALES.filter((l) => l !== locale),
      siteName: "EarthHue",
      url: `${BASE_URL}/${locale}`,
      title: social.twitter.title,
      description: social.twitter.description,
      images: ogImages(locale),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(LOCALES as readonly string[]).includes(locale)) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        {/* Canonical + hreflang are emitted per-page via metadata.alternates —
            a layout-level canonical would point every subpage back at the home page.
            og:locale and og:locale:alternate are emitted by the openGraph block
            below; adding them by hand as well would duplicate the tags. */}
      </head>
      <body className="font-sans min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
