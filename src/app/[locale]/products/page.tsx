import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { listProducts, listProductImages } from "@/lib/products";
import { pickTranslation } from "@/lib/i18n";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { localeAlternates, BASE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

const SERIES_ORDER = ["fermentation", "algae", "botanical", "mineral"] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  const titles: Record<string, string> = {
    en: "Astaxanthin, Lutein & Lycopene — Fermentation-Derived Natural Carotenoids",
    zh: "虾青素、叶黄素与番茄红素 — 发酵法天然类胡萝卜素产品目录",
    ja: "アスタxeranthin、ルテイン、リコペン — 発酵由来天然カロテノイド 製品カタログ",
    ko: "아스타잔틴, 루틴, 라이코펜 — 발효 유래 천연 카로티노이드 제품 카탈로그",
    es: "Astaxantina, luteína y licopeno — carotenoides naturales obtenidos por fermentación",
    fr: "Astaxanthine, lutéine et lycopène — caroténoïdes naturels obtenus par fermentation",
    de: "Astaxanthin, Lutein und Lycopin — durch Fermentation gewonnene natürliche Carotinoide",
  };
  const descriptions: Record<string, string> = {
    en: "Ready-to-use natural colour formulations: fermentation-derived astaxanthin, lutein, lycopene, beta-carotene and zeaxanthin, plus botanical and mineral colourants. MOQ 1 kg, batch-level COA and MSDS.",
    zh: "即用型天然色素配方目录：发酵法虾青素、叶黄素、番茄红素、β-胡萝卜素与玉米黄素，另有植物源与矿物源色素。起订量 1 公斤，批批出具 COA 与 MSDS。",
    ja: "即使用天然色素の製品カタログ：発酵由来アスタxeranthin、ルテイン、リコペン、β-カロテン、ゼアxeranthin、および植物性・鉱物性色素。MOQ 1kg、ロットごとにCOA・MSSDSIssu。",
    ko: "바로 사용 가능한 천연 색소 제형 카탈로그: 발효 유래 아스타잔틴, 루틴, 라이코펜, 베타카로틴, 제아잔틴 및 식물·광물 색소. MOQ 1kg, 배치별 COA·MSDS.",
    es: "Formulaciones de color natural listas para usar: astaxantina, luteína, licopeno, beta-caroteno y zeaxantina obtenidos por fermentación, además de colorantes botánicos y minerales. MOQ 1 kg, COA y MSDS por lote.",
    fr: "Formulations de colourants naturels prêtes à l'emploi : astaxanthine, lutéine, lycopène, bêta-carotène et zéaxanthine obtenus par fermentation, ainsi que des colorants botaniques et minéraux. MOQ 1 kg, COA et MSDS par lot.",
    de: "Gebrauchsfertige natürliche Farbmittel: durch Fermentation gewonnenes Astaxanthin, Lutein, Lycopin, Beta-Carotin und Zeaxanthin sowie botanische und mineralische Farbpigmente. MOQ 1 kg, COA und MSDS je Charge.",
  };

  return {
    title: titles[locale] || t("title"),
    description: descriptions[locale] || t("subtitle"),
    alternates: localeAlternates(locale, "/products"),
    openGraph: {
      title: titles[locale] || t("title"),
      description: descriptions[locale] || t("subtitle"),
      url: `${BASE_URL}/${locale}/products`,
      locale,
      type: "website",
    },
  };
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("products");
  const ts = await getTranslations("series");
  const products = listProducts({ onlyPublished: true });
  const imagesByProduct = new Map<number, string>();
  for (const p of products) {
    const imgs = listProductImages(p.id);
    if (imgs[0]) imagesByProduct.set(p.id, imgs[0].url);
  }

  const grouped = SERIES_ORDER.map((key) => ({
    key,
    items: products.filter((p) => (p.series || "") === key),
  })).filter((g) => g.items.length > 0);

  const ungrouped = products.filter((p) => !SERIES_ORDER.includes((p.series || "") as any));

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${BASE_URL}/${locale}` },
          { name: t("title"), url: `${BASE_URL}/${locale}/products` },
        ]}
      />
      <ItemListJsonLd
        name={t("title")}
        locale={locale}
        items={products.map((p) => ({
          name: pickTranslation(p.translations, locale)?.name || p.slug,
          url: `${BASE_URL}/${locale}/products/${p.slug}`,
        }))}
      />

      <div className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-earth-900 mb-4">
              {t("title")}
            </h1>
            <p className="text-earth-600 max-w-3xl mx-auto">{t("subtitle")}</p>
          </div>

          {/* Series navigation */}
          <nav className="flex flex-wrap justify-center gap-3 mb-12" aria-label="Product series">
            {grouped.map((g) => (
              <a
                key={g.key}
                href={`#series-${g.key}`}
                className="px-4 py-2 rounded-full border border-earth-200 text-sm text-earth-700 hover:border-sage-500 hover:text-sage-700 transition-colors"
              >
                {ts(`${g.key}.title`)} ({g.items.length})
              </a>
            ))}
          </nav>

          {products.length === 0 ? (
            <div className="text-center py-16 text-earth-500">{t("empty")}</div>
          ) : (
            <div className="space-y-16">
              {grouped.map((g) => (
                <section key={g.key} id={`series-${g.key}`}>
                  <div className="mb-8">
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-earth-900 mb-2">
                      {ts(`${g.key}.title`)}
                    </h2>
                    <p className="text-earth-600 max-w-3xl">{ts(`${g.key}.desc`)}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {g.items.map((p) => {
                      const tr = pickTranslation(p.translations, locale);
                      const firstImage = imagesByProduct.get(p.id);
                      return (
                        <Link
                          key={p.id}
                          href={`/${locale}/products/${p.slug}`}
                          className="group block bg-white rounded-2xl border border-earth-100 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div
                            className="aspect-[4/3] flex items-center justify-center relative overflow-hidden"
                            style={{
                              background: p.color
                                ? `linear-gradient(135deg, ${p.color}25, ${p.color}50)`
                                : "linear-gradient(135deg, #f5f0e6, #e9e0cc)",
                            }}
                          >
                            {firstImage ? (
                              <img
                                src={firstImage}
                                alt={tr?.name || p.slug}
                                className="w-full h-full object-cover"
 loading="lazy" decoding="async" />
                            ) : p.color ? (
                              <div
                                className="w-24 h-24 rounded-full shadow-inner"
                                style={{ backgroundColor: p.color }}
                              />
                            ) : (
                              <div className="w-24 h-24 rounded-full bg-earth-200" />
                            )}
                          </div>
                          <div className="p-6">
                            <h3 className="font-serif text-xl font-semibold text-earth-900 mb-2 group-hover:text-sage-700 transition-colors">
                              {tr?.name || p.slug}
                            </h3>
                            <p className="text-sm text-earth-600 line-clamp-3 mb-3">
                              {tr?.description || ""}
                            </p>
                            <div className="flex flex-wrap gap-2 text-xs">
                              {p.base && (
                                <span className="px-2 py-0.5 bg-earth-100 text-earth-600 rounded">
                                  {p.base}
                                </span>
                              )}
                              {p.form && (
                                <span className="px-2 py-0.5 bg-sage-50 text-sage-700 rounded">
                                  {p.form}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              ))}

              {ungrouped.length > 0 && (
                <section>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-earth-900 mb-6">
                    {t("allCategories")}
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ungrouped.map((p) => {
                      const tr = pickTranslation(p.translations, locale);
                      return (
                        <Link
                          key={p.id}
                          href={`/${locale}/products/${p.slug}`}
                          className="group block bg-white rounded-2xl border border-earth-100 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div className="p-6">
                            <h3 className="font-serif text-xl font-semibold text-earth-900 mb-2 group-hover:text-sage-700 transition-colors">
                              {tr?.name || p.slug}
                            </h3>
                            <p className="text-sm text-earth-600 line-clamp-3">{tr?.description || ""}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          )}

          <div className="mt-16 bg-earth-50 rounded-2xl p-8 text-center">
            <h2 className="font-serif text-2xl font-bold text-earth-900 mb-2">
              {t("custom.title")}
            </h2>
            <p className="text-earth-600 mb-6 max-w-2xl mx-auto">{t("custom.desc")}</p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-sage-600 text-white px-6 py-3 rounded-full font-medium hover:bg-sage-700 transition-colors"
            >
              {t("custom.button")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
