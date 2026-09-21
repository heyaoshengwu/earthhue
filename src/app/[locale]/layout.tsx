import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const locales = ["en", "zh", "ja", "ko", "es", "fr", "de"];

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  const hreflangLinks = locales.map((loc) => ({
    hreflang: loc,
    href: `https://earthhue.net/${loc}`,
  }));

  return (
    <html lang={locale}>
      <head>
        <link rel="canonical" href={`https://earthhue.net/${locale}`} />
        {hreflangLinks.map((link) => (
          <link
            key={link.hreflang}
            rel="alternate"
            hrefLang={link.hreflang}
            href={link.href}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href="https://earthhue.net/en" />
        <meta property="og:locale" content={locale.replace("-", "_")} />
        {locales
          .filter((l) => l !== locale)
          .map((l) => (
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
