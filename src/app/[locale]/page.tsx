import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/JsonLd";
import { listProducts } from "@/lib/products";
import { listArticles } from "@/lib/articles";
import { listHomeImages } from "@/lib/homeImages";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    en: "EarthHue — Natural Pigments for Food, Cosmetics & Pharma",
    zh: "EarthHue — 食品、化妆品、制药用天然色素",
    ja: "EarthHue — 食品・化粧品・製薬向け天然色素",
    ko: "EarthHue — 식품·화장품·제약용 천연 색소",
    es: "EarthHue — Pigmentos Naturales para Alimentación, Cosmética y Farmacéutica",
    fr: "EarthHue — Pigments Naturels pour l'Agroalimentaire, la Cosmétique et la Pharmacie",
    de: "EarthHue — Natürliche Pigmente für Lebensmittel, Kosmetik und Pharma",
  };
  const descs: Record<string, string> = {
    en: "Premium natural pigments for food, cosmetics and pharmaceutical manufacturers. Regulatory-compliant, sustainably sourced, globally delivered.",
    zh: "面向食品、化妆品、制药制造商的优质天然色素。合规、可持续、全球交付。",
    ja: "食品・化粧品・製薬メーカー向けプレミアム天然色素。法令準拠、持続可能な調達、世界規模で供給。",
    ko: "식품·화장품·제약 제조업체를 위한 프리미엄 천연 색소. 규제 준수, 지속 가능한 공급, 글로벌 배송.",
    es: "Pigmentos naturales premium para fabricantes de alimentación, cosmética y farmacéutica.",
    de: "Premium-Naturpigmente für Hersteller von Lebensmitteln, Kosmetik und Pharma.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descs[locale] || descs.en,
    openGraph: {
      title: titles[locale] || titles.en,
      description: descs[locale] || descs.en,
      url: `https://earthhue.net/${locale}`,
      siteName: "EarthHue",
      locale,
      type: "website",
      images: [
        {
          url: "https://earthhue.net/og-image.png",
          width: 1200,
          height: 630,
          alt: "EarthHue Natural Pigments",
        },
      ],
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("home");

  const products = listProducts({ onlyPublished: true }).slice(0, 3);
  const articles = listArticles({ onlyPublished: true }).slice(0, 3);
  const homeImageMap = Object.fromEntries(listHomeImages().map((i) => [i.key, i]));
  const heroImg = homeImageMap.hero;
  const brandImg = homeImageMap.brand;
  const aestheticsImg = homeImageMap.aesthetics;

  return (
    <>
      <OrganizationJsonLd />
      <WebsiteJsonLd locale={locale} />

      {/* Hero — focused on B2B ingredients */}
      <section className="relative bg-gradient-to-br from-earth-100 via-earth-50 to-sage-50 section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid gap-12 items-center ${heroImg ? "md:grid-cols-2" : ""}`}>
            <div className="text-center md:text-left">
              <p className="text-sage-700 font-medium mb-3 uppercase tracking-wider text-sm">
                {t("hero.eyebrow")}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-earth-900 leading-tight mb-6">
                {t("hero.title")}
              </h1>
              <p className="text-lg md:text-xl text-earth-700 max-w-3xl md:max-w-none mx-auto md:mx-0">
                {t("hero.subtitle")}
              </p>
            </div>
            {heroImg && (
              <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
                <img
                  src={heroImg.url}
                  alt={heroImg.alt || ""}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-12">
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center gap-2 bg-sage-600 text-white px-8 py-4 rounded-full font-medium hover:bg-sage-700 transition-colors shadow-sm"
            >
              {t("hero.primaryCta")}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-white text-sage-700 border border-sage-300 px-8 py-4 rounded-full font-medium hover:bg-sage-50 transition-colors"
            >
              {t("hero.secondaryCta")}
            </Link>
          </div>
        </div>
      </section>

      {/* Brand / craftsmanship image */}
      {brandImg && (
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="rounded-3xl overflow-hidden shadow-lg aspect-[21/9]">
              <img
                src={brandImg.url}
                alt={brandImg.alt || ""}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Quick links */}
      <section className="bg-white py-6 border-b border-earth-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
          <Link href={`/${locale}/products`} className="text-earth-700 hover:text-sage-700">
            {t("quicklinks.products")}
          </Link>
          <Link href={`/${locale}/pigments`} className="text-earth-700 hover:text-sage-700">
            {t("quicklinks.pigments")}
          </Link>
          <Link href={`/${locale}/articles`} className="text-earth-700 hover:text-sage-700">
            {t("quicklinks.articles")}
          </Link>
          <Link href={`/${locale}/regulations`} className="text-earth-700 hover:text-sage-700">
            {t("quicklinks.regulations")}
          </Link>
          <Link href={`/${locale}/about`} className="text-earth-700 hover:text-sage-700">
            {t("quicklinks.about")}
          </Link>
          <Link href={`/${locale}/contact`} className="text-earth-700 hover:text-sage-700">
            {t("quicklinks.contact")}
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-earth-900 mb-2">
                  {t("featuredProducts.title")}
                </h2>
                <p className="text-earth-600">{t("featuredProducts.subtitle")}</p>
              </div>
              <Link
                href={`/${locale}/products`}
                className="text-sage-700 hover:text-sage-900 font-medium hidden sm:inline"
              >
                {t("featuredProducts.allCta")} →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => {
                const tr = p.translations[locale] || p.translations.en || Object.values(p.translations)[0];
                return (
                  <Link
                    key={p.id}
                    href={`/${locale}/products/${p.slug}`}
                    className="group block bg-earth-50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div
                      className="aspect-[4/3] flex items-center justify-center"
                      style={{
                        background: p.color
                          ? `linear-gradient(135deg, ${p.color}22, ${p.color}55)`
                          : "linear-gradient(135deg, #f5f0e6, #e9e0cc)",
                      }}
                    >
                      <div className="w-20 h-20 rounded-full shadow-inner" style={{ backgroundColor: p.color || "#bbb" }} />
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-lg font-semibold text-earth-900 mb-1 group-hover:text-sage-700 transition-colors">
                        {tr?.name || p.slug}
                      </h3>
                      <p className="text-sm text-earth-600 line-clamp-2 mb-2">{tr?.description || ""}</p>
                      <div className="flex flex-wrap gap-1 text-xs">
                        {p.base && (
                          <span className="px-2 py-0.5 bg-earth-100 text-earth-600 rounded">{p.base}</span>
                        )}
                        {p.form && (
                          <span className="px-2 py-0.5 bg-sage-50 text-sage-700 rounded">{p.form}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-earth-900 mb-4">
            {t("features.title")}
          </h2>
          <p className="text-earth-600 text-center max-w-2xl mx-auto mb-12">
            {t("features.trusted")}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.raw("features.items").map((item: { title: string; desc: string }, i: number) => (
              <div key={i} className="text-center p-6 rounded-xl bg-earth-50 hover:bg-earth-100 transition-colors">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-sage-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-earth-900 mb-2">{item.title}</h3>
                <p className="text-sm text-earth-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="section-padding bg-earth-900 text-earth-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-12">
            {t("applications.title")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {(["food", "cosmetics", "pharmaceuticals"] as const).map((app) => (
              <div key={app} className="bg-earth-800 rounded-2xl p-8 hover:bg-earth-700 transition-colors">
                <h3 className="font-serif text-xl font-semibold mb-4">{t(`applications.${app}`)}</h3>
                <p className="text-earth-300 mb-4">{t(`applications.${app}Desc`)}</p>
                <Link
                  href={`/${locale}/pigments?application=${app}`}
                  className="text-sage-400 hover:text-sage-300 text-sm font-medium inline-flex items-center gap-1"
                >
                  {t("applications.viewPigments")}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      {articles.length > 0 && (
        <section className="section-padding bg-earth-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-earth-900">
                {t("articles.title")}
              </h2>
              <Link
                href={`/${locale}/articles`}
                className="text-sage-700 hover:text-sage-900 font-medium hidden sm:inline"
              >
                {t("articles.allCta")} →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {articles.map((a) => {
                const tr = a.translations[locale] || a.translations.en || Object.values(a.translations)[0];
                return (
                  <Link
                    key={a.id}
                    href={`/${locale}/articles/${a.slug}`}
                    className="group block bg-white rounded-2xl border border-earth-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {a.cover_image && (
                      <div className="aspect-[16/9] overflow-hidden">
                        <img src={a.cover_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-serif text-lg font-semibold text-earth-900 mb-2 group-hover:text-sage-700 transition-colors">
                        {tr?.title || a.slug}
                      </h3>
                      {tr?.excerpt && (
                        <p className="text-sm text-earth-600 line-clamp-3">{tr.excerpt}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding bg-gradient-to-r from-sage-600 to-sage-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">{t("cta.title")}</h2>
          <p className="text-sage-100 mb-8 max-w-2xl mx-auto">{t("cta.desc")}</p>
          <Link
            href={`/${locale}/regulations`}
            className="inline-flex items-center gap-2 bg-white text-sage-700 px-6 py-3 rounded-lg font-medium hover:bg-earth-100 transition-colors"
          >
            {t("cta.button")}
          </Link>
        </div>
      </section>

      {/* 色彩美学 link */}
      <section className="bg-earth-50 border-t border-earth-200">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className={`grid gap-8 items-center ${aestheticsImg ? "md:grid-cols-[1fr,1.4fr]" : ""}`}>
            {aestheticsImg && (
              <div className="rounded-2xl overflow-hidden shadow-md aspect-[4/3]">
                <img
                  src={aestheticsImg.url}
                  alt={aestheticsImg.alt || ""}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="text-center md:text-left">
              <p className="text-earth-600 mb-3 text-lg">{t("aestheticsLink.prompt")}</p>
              <Link
                href={`/${locale}/c2c`}
                className="inline-flex items-center gap-2 text-sage-700 font-medium hover:text-sage-900 text-lg"
              >
                {t("aestheticsLink.cta")} →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}