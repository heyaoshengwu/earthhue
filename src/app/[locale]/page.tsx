import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import {
  OrganizationJsonLd,
  WebsiteJsonLd,
  ItemListJsonLd,
  FAQJsonLd,
  HowToJsonLd,
} from "@/components/JsonLd";
import { listProducts, getFirstProductImagesMap, getProductSpecs } from "@/lib/products";
import { listArticles } from "@/lib/articles";
import { listHomeImages } from "@/lib/homeImages";
import { pickTranslation } from "@/lib/i18n";
import { localeAlternates, BASE_URL, openGraphFor } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    en: "Astaxanthin, Lutein & Lycopene Supplier — Fermentation-Derived Natural Carotenoids | EarthHue",
    zh: "虾青素、叶黄素、番茄红素供应商 — 发酵法天然类胡萝卜素 | EarthHue",
    ja: "アスタキサンチン、ルテイン、リコペンのサプライヤー — 発酵由来天然カロテノイド | EarthHue",
    ko: "아스타잔틴·루틴·라이코펜 공급업체 — 발효 유래 천연 카로티노이드 | EarthHue",
    es: "Proveedor de astaxantina, luteína y licopeno — carotenoides naturales obtenidos por fermentación | EarthHue",
    fr: "Fournisseur d'astaxanthine, lutéine et lycopène — caroténoïdes naturels obtenus par fermentation | EarthHue",
    de: "Lieferant für Astaxanthin, Lutein und Lycopin — durch Fermentation gewonnene natürliche Carotinoide | EarthHue",
  };
  const descs: Record<string, string> = {
    en: "EarthHue manufactures fermentation-derived astaxanthin, lutein, lycopene, beta-carotene and zeaxanthin for food, nutraceutical, cosmetic and pharmaceutical formulators. Batch-level COA and MSDS, 1,200+ t/yr capacity, MOQ 1 kg.",
    zh: "EarthHue 生产发酵法虾青素、叶黄素、番茄红素、β-胡萝卜素与玉米黄素，供应食品、营养保健、化妆品及制药企业。批批出具 COA 与 MSDS，年产能 1,200 吨以上，起订量 1 公斤。",
    ja: "EarthHue は発酵由来のアスタキサンチン、ルテイン、リコペン、β-カロテン、ゼアキサンチンを製造し、食品、栄養化粧品、化粧品、医薬品の原料として供給します。ロットごとにCOA・MSDSを添付、年産1,200トン以上、MOQ 1kg。",
    ko: "EarthHue는 발효 유래 아스타잔틴, 루틴, 라이코펜, 베타카로틴, 제아잔틴을 제조하여 식품·기능성식품·화장품·제약업체에 공급합니다. 배치별 COA·MSDS, 연간 1,200톤 이상, MOQ 1kg.",
    es: "EarthHue fabrica astaxantina, luteína, licopeno, beta-caroteno y zeaxantina obtenidos por fermentación para fabricantes de alimentos, nutracéuticos, cosméticos y farmacéuticos. COA y MSDS por lote, 1.200+ t/año, MOQ 1 kg.",
    fr: "EarthHue fabrique de l'astaxanthine, de la lutéine, du lycopène, du bêta-carotène et de la zéaxanthine obtenus par fermentation, pour les formulateurs alimentaires, nutraceutiques, cosmétiques et pharmaceutiques. COA et MSDS par lot, 1 200 t/an, MOQ 1 kg.",
    de: "EarthHue fertigt durch Fermentation gewonnenes Astaxanthin, Lutein, Lycopin, Beta-Carotin und Zeaxanthin für Lebensmittel-, Nutraceutical-, Kosmetik- und Pharmaformulierer. COA und MSDS je Charge, 1.200+ t/Jahr, MOQ 1 kg.",
  };

  return {
    alternates: localeAlternates(locale, ""),
    title: { absolute: titles[locale] || titles.en },
    description: descs[locale] || descs.en,
    openGraph: openGraphFor(
      locale,
      "",
      { absolute: titles[locale] || titles.en },
      descs[locale] || descs.en
    ),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("home");
  const ts = await getTranslations("series");

  const allProducts = listProducts({ onlyPublished: true });
  const fermentation = allProducts.filter((p) => p.series === "fermentation");
  const featured = (fermentation.length >= 3 ? fermentation : allProducts).slice(0, 3);
  const productFirstImages = getFirstProductImagesMap(featured.map((p) => p.id));
  // Six of the eight published guides, so the new long-form pieces reach the
  // home page instead of sitting behind the articles index.
  const articles = listArticles({ onlyPublished: true }).slice(0, 6);
  const homeImageMap = Object.fromEntries(listHomeImages().map((i) => [i.key, i]));
  const heroImg = homeImageMap.hero;
  const brandImg = homeImageMap.brand;
  const aestheticsImg = homeImageMap.aesthetics;

  const faqItems = t.raw("faq.items") as { q: string; a: string }[];
  const compareRows = t.raw("compare.rows") as { label: string; cells: string[] }[];
  const compareHeaders = t.raw("compare.headers") as string[];
  const processSteps = t.raw("process.steps") as { title: string; desc: string }[];
  const whyPoints = t.raw("why.points") as { title: string; desc: string }[];
  const capabilityItems = t.raw("capability.items") as { value: string; label: string }[];
  const heroChips = t.raw("hero.chips") as string[];
  const qualityItems = t.raw("quality.items") as string[];
  const applications = ["food", "nutraceutical", "cosmetics", "pharmaceuticals"] as const;

  return (
    <>
      <OrganizationJsonLd locale={locale} />
      <WebsiteJsonLd locale={locale} />
      <FAQJsonLd items={faqItems} locale={locale} />
      <HowToJsonLd
        name={t("process.title")}
        description={t("process.steps.0.desc")}
        steps={processSteps.map((s) => ({ name: s.title, text: s.desc }))}
        locale={locale}
      />
      <ItemListJsonLd
        name={t("series.title")}
        locale={locale}
        items={featured.map((p) => ({
          name: pickTranslation(p.translations, locale)?.name || p.slug,
          url: `${BASE_URL}/${locale}/products/${p.slug}`,
        }))}
      />

      {/* Hero — fermentation-derived carotenoids */}
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
              <p className="text-lg md:text-xl text-earth-700 max-w-3xl md:max-w-none mx-auto md:mb-0">
                {t("hero.subtitle")}
              </p>

              <ul className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 mt-6 text-sm text-earth-700">
                {heroChips.map((chip) => (
                  <li key={chip} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-sage-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {chip}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-10">
                <Link
                  href={`/${locale}/products`}
                  className="inline-flex items-center gap-2 bg-sage-600 text-white px-8 py-4 rounded-full font-medium hover:bg-sage-700 transition-colors shadow-sm"
                >
                  {t("hero.primaryCta")}
                </Link>
                <Link
                  href={`/${locale}/b2b/samples`}
                  className="inline-flex items-center gap-2 bg-white text-sage-700 border border-sage-300 px-8 py-4 rounded-full font-medium hover:bg-sage-50 transition-colors"
                >
                  {t("hero.secondaryCta")}
                </Link>
              </div>
            </div>
            {heroImg && (
              <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
                <img
                  src={heroImg.url}
                  alt={heroImg.alt || "Fermentation-derived natural carotenoid powders and oil suspensions"}
                  className="w-full h-full object-cover"
 loading="eager" fetchPriority="high" />
              </div>
            )}
          </div>
        </div>
      </section>

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

      {/* Core fermentation series */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sage-700 font-medium uppercase tracking-wider text-sm mb-3">
              {t("series.eyebrow")}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-earth-900 mb-4">
              {t("series.title")}
            </h2>
            <p className="text-earth-600 max-w-2xl mx-auto">{t("series.subtitle")}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featured.map((p) => {
              const tr = pickTranslation(p.translations, locale);
              const specs = getProductSpecs(p, locale);
              const assay = specs.find((s) => /assay|content|purity/i.test(s.label))?.value;
              return (
                <Link
                  key={p.id}
                  href={`/${locale}/products/${p.slug}`}
                  className="group block bg-earth-50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div
                    className="aspect-[4/3] flex items-center justify-center overflow-hidden"
                    style={{
                      background: p.color
                        ? `linear-gradient(135deg, ${p.color}22, ${p.color}55)`
                        : "linear-gradient(135deg, #f5f0e6, #e9e0cc)",
                    }}
                  >
                    {productFirstImages[p.id] ? (
                      <img
                        src={productFirstImages[p.id]}
                        alt={tr?.name || p.slug}
                        className="w-full h-full object-cover"
 loading="lazy" decoding="async" />
                    ) : (
                      <div className="w-20 h-20 rounded-full shadow-inner" style={{ backgroundColor: p.color || "#bbb" }} />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-semibold text-earth-900 mb-1 group-hover:text-sage-700 transition-colors">
                      {tr?.name || p.slug}
                    </h3>
                    <p className="text-sm text-earth-600 line-clamp-3 mb-3">{tr?.description || ""}</p>
                    <div className="flex flex-wrap gap-1 text-xs">
                      {p.base && (
                        <span className="px-2 py-0.5 bg-earth-100 text-earth-600 rounded">{p.base}</span>
                      )}
                      {p.form && (
                        <span className="px-2 py-0.5 bg-sage-50 text-sage-700 rounded">{p.form}</span>
                      )}
                      {assay && (
                        <span className="px-2 py-0.5 bg-sage-100 text-sage-800 rounded">{assay}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center gap-2 text-sage-700 hover:text-sage-900 font-medium"
            >
              {t("series.cta")} →
            </Link>
          </div>
        </div>
      </section>

      {/* Answer-first block — written to be quotable by answer engines */}
      <section className="section-padding bg-earth-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sage-700 font-medium uppercase tracking-wider text-sm mb-3 text-center">
            {t("why.eyebrow")}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-earth-900 mb-6">
            {t("why.title")}
          </h2>
          <p className="text-lg text-earth-800 leading-relaxed mb-10">{t("why.answer")}</p>

          <div className="grid sm:grid-cols-3 gap-6">
            {whyPoints.map((point) => (
              <div key={point.title} className="bg-white rounded-2xl p-6 border border-earth-100">
                <h3 className="font-semibold text-earth-900 mb-2">{point.title}</h3>
                <p className="text-sm text-earth-600">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Source comparison table */}
      <section className="section-padding bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-sage-700 font-medium uppercase tracking-wider text-sm mb-3">
              {t("compare.eyebrow")}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-earth-900 mb-4">
              {t("compare.title")}
            </h2>
            <p className="text-earth-600 max-w-2xl mx-auto">{t("compare.subtitle")}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  {compareHeaders.map((h, i) => (
                    <th
                      key={i}
                      scope="col"
                      className={`px-4 py-3 text-left font-semibold text-earth-900 bg-earth-50 border border-earth-100 ${
                        i === 0 ? "w-56" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row" className="px-4 py-3 text-left font-medium text-earth-700 bg-earth-50 border border-earth-100">
                      {row.label}
                    </th>
                    {row.cells.map((cell, i) => (
                      <td key={i} className="px-4 py-3 text-earth-700 border border-earth-100">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Capability numbers */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sage-700 font-medium uppercase tracking-wider text-sm mb-3">
              {t("capability.eyebrow")}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-earth-900">
              {t("capability.title")}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilityItems.map((item) => (
              <div key={item.label} className="text-center p-6 rounded-xl bg-earth-50">
                <div className="font-serif text-4xl font-bold text-sage-700 mb-2">{item.value}</div>
                <div className="text-sm text-earth-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-earth-900 text-earth-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sage-400 font-medium uppercase tracking-wider text-sm mb-3">
              {t("process.eyebrow")}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">{t("process.title")}</h2>
          </div>
          <ol className="grid md:grid-cols-5 gap-6">
            {processSteps.map((step, i) => (
              <li key={step.title} className="bg-earth-800 rounded-2xl p-6">
                <div className="w-8 h-8 rounded-full bg-sage-600 text-white flex items-center justify-center font-semibold mb-4">
                  {i + 1}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-earth-300">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Applications */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-earth-900 mb-12">
            {t("applications.title")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {applications.map((app) => (
              <div key={app} className="bg-earth-50 rounded-2xl p-6 hover:bg-earth-100 transition-colors">
                <h3 className="font-serif text-lg font-semibold text-earth-900 mb-2">{t(`applications.${app}`)}</h3>
                <p className="text-sm text-earth-600 mb-4">{t(`applications.${app}Desc`)}</p>
                <Link
                  href={`/${locale}/products`}
                  className="text-sage-700 hover:text-sage-900 text-sm font-medium inline-flex items-center gap-1"
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

      {/* Quality / documentation */}
      <section className="section-padding bg-earth-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-[1fr,1.3fr] gap-10 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-earth-900 mb-4">
                {t("quality.title")}
              </h2>
              <p className="text-earth-600 mb-6">{t("quality.desc")}</p>
              <Link
                href={`/${locale}/b2b/certifications`}
                className="inline-flex items-center gap-2 text-sage-700 hover:text-sage-900 font-medium"
              >
                {t("quality.cta")} →
              </Link>
            </div>
            <ul className="grid sm:grid-cols-2 gap-4">
              {qualityItems.map((item) => (
                <li key={item} className="bg-white rounded-xl p-4 text-sm text-earth-700 border border-earth-100 flex items-start gap-2">
                  <svg className="w-4 h-4 text-sage-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Catalogue preview */}
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allProducts.slice(0, 8).map((p) => {
              const tr = pickTranslation(p.translations, locale);
              return (
                <Link
                  key={p.id}
                  href={`/${locale}/products/${p.slug}`}
                  className="group block bg-earth-50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div
                    className="aspect-[4/3] flex items-center justify-center overflow-hidden"
                    style={{
                      background: p.color
                        ? `linear-gradient(135deg, ${p.color}22, ${p.color}55)`
                        : "linear-gradient(135deg, #f5f0e6, #e9e0cc)",
                    }}
                  >
                    <div className="w-14 h-14 rounded-full shadow-inner" style={{ backgroundColor: p.color || "#bbb" }} />
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-base font-semibold text-earth-900 mb-1 group-hover:text-sage-700 transition-colors">
                      {tr?.name || p.slug}
                    </h3>
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

      {/* FAQ — GEO answer block */}
      <section className="section-padding bg-earth-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-earth-900 mb-10">
            {t("faq.title")}
          </h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <details key={item.q} className="group bg-white rounded-xl border border-earth-100 overflow-hidden">
                <summary className="cursor-pointer list-none px-6 py-4 font-semibold text-earth-900 flex items-center justify-between gap-4">
                  <span>{item.q}</span>
                  <svg className="w-5 h-5 text-sage-600 shrink-0 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-earth-700 leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      {articles.length > 0 && (
        <section className="section-padding bg-white">
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
                const tr = pickTranslation(a.translations, locale);
                return (
                  <Link
                    key={a.id}
                    href={`/${locale}/articles/${a.slug}`}
                    className="group block bg-white rounded-2xl border border-earth-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {a.cover_image && (
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={a.cover_image}
                          alt={tr?.title || a.slug}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
 loading="lazy" decoding="async" />
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
            href={`/${locale}/contact`}
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
                  alt={aestheticsImg.alt || "Natural pigment colour references"}
                  className="w-full h-full object-cover"
 loading="lazy" decoding="async" />
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
