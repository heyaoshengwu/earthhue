import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LOCALES } from "@/lib/seo";

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
            a layout-level canonical would point every subpage back at the home page. */}
        <meta property="og:locale" content={locale.replace("-", "_")} />
        {LOCALES.filter((l) => l !== locale).map((l) => (
          <meta
            key={l}
            property="og:locale:alternate"
            content={l.replace("-", "_")}
          />
        ))}
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
