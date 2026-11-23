import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { localeAlternates, openGraphFor } from "@/lib/seo";
import { pigments } from "@/content/pigments/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "c2c.science" });
  return {
    alternates: localeAlternates(locale, "/c2c/science"),
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: openGraphFor(locale, "/c2c/science", t("metaTitle"), t("metaDescription")),
  };
}

/**
 * Each topic carries a photograph and a link through to the long-form guide
 * that goes deeper on it. The topics used to be four short paragraphs with
 * neither.
 */
const topics = [
  {
    key: "natural-vs-synthetic",
    image: "/uploads/products/1790566449603-913449ce8a5dc817.jpg",
    article: "synthetic-dye-phaseout-natural-alternatives",
  },
  {
    key: "sustainability",
    image: "/uploads/products/1790566448669-e22ceeafecce5da7.jpg",
    article: "carotenoid-hue-scale-and-colour-control",
  },
  {
    key: "stability",
    image: "/uploads/products/1790566581791-b63cd9738e47c68d.jpg",
    article: "beet-red-in-plant-based-meat",
  },
  {
    key: "safety",
    image: "/uploads/products/1790564551294-b6288e7015f4e833.jpg",
    article: "copper-free-chlorophyll-for-clean-label",
  },
  {
    key: "color-measurement",
    image: "/uploads/products/1790566437555-a235e91675fcdaa1.jpg",
    article: "accepting-a-pigment-batch-colourwise",
  },
  {
    key: "extraction-vs-fermentation",
    image: "/uploads/products/eh-astaxanthin-yeast-110.jpg",
    article: "carotenoid-hue-scale-and-colour-control",
  },
  {
    key: "clean-label",
    image: "/uploads/products/1790563592245-9ebb70f381a223de.jpg",
    article: "copper-free-chlorophyll-for-clean-label",
  },
  {
    key: "blue-challenge",
    image: "/uploads/products/1790564543912-b9586e06edb3a186.jpg",
    article: "only-natural-blue-colorant",
  },
] as const;

/** The pigments the colour stories are built from, with their own palettes. */
const PALETTE_IDS = [
  "curcumin",
  "beet-red",
  "chlorophyll",
  "anthocyanin",
  "phycocyanin",
  "spirulina-blue",
  "beta-carotene-fermentation",
  "astaxanthin",
  "torularhodin",
];

const CATEGORY_LABEL: Record<string, Record<string, string>> = {
  plant: { en: "Plant", zh: "植物源", ja: "植物由来", ko: "식물 유래", es: "Vegetal", fr: "Végétal", de: "Pflanzlich" },
  mineral: { en: "Mineral", zh: "矿物源", ja: "鉱物由来", ko: "광물 유래", es: "Mineral", fr: "Minéral", de: "Mineralisch" },
  microbial: { en: "Microbial", zh: "微生物源", ja: "微生物由来", ko: "미생물 유래", es: "Microbiano", fr: "Microbien", de: "Mikrobiell" },
};

function pigmentName(p: (typeof pigments)[number], locale: string) {
  if (locale === "zh") return p.nameZh || p.name;
  if (locale === "ja") return p.nameJa || p.name;
  if (locale === "ko") return p.nameKo || p.name;
  return p.name;
}

export default async function SciencePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("c2c.science");
  const palette = PALETTE_IDS.map((id) => pigments.find((p) => p.id === id)).filter(
    (p): p is (typeof pigments)[number] => Boolean(p)
  );

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: `https://earthhue.net/${locale}` },
        { name: "C2C", url: `https://earthhue.net/${locale}/c2c` },
        { name: t("title"), url: `https://earthhue.net/${locale}/c2c/science` },
      ]} />

      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-earth-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-earth-700 mb-12">{t("subtitle")}</p>

          <div className="space-y-12">
            {topics.map((topic) => (
              <article
                key={topic.key}
                className="bg-white border border-earth-200 rounded-xl overflow-hidden"
              >
                <Link
                  href={`/${locale}/articles/${topic.article}`}
                  className="block group"
                  aria-label={t(`articles.${topic.key}.title`)}
                >
                  <div className="aspect-[16/9] bg-earth-50 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={topic.image}
                      alt={t(`articles.${topic.key}.title`)}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                </Link>
                <div className="p-6">
                  <h2 className="font-serif text-2xl font-semibold text-earth-900 mb-3">
                    {t(`articles.${topic.key}.title`)}
                  </h2>
                  <p className="text-earth-700 leading-relaxed mb-3">
                    {t(`articles.${topic.key}.lede`)}
                  </p>
                  <p className="text-earth-600 text-sm leading-relaxed mb-4">
                    {t(`articles.${topic.key}.body`)}
                  </p>
                  <Link
                    href={`/${locale}/articles/${topic.article}`}
                    className="inline-flex items-center gap-2 text-sage-700 font-medium hover:text-sage-900"
                  >
                    {t("readGuide")} →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* The palette behind the colour stories, with the swatches the
              pigments actually produce. */}
          <div className="mt-16">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-earth-900 mb-3">
              {t("table.title")}
            </h2>
            <p className="text-earth-600 text-sm mb-6">{t("table.note")}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-earth-200 text-left">
                    <th className="py-3 pr-4 font-semibold text-earth-900">{t("table.pigment")}</th>
                    <th className="py-3 pr-4 font-semibold text-earth-900">{t("table.colour")}</th>
                    <th className="py-3 pr-4 font-semibold text-earth-900">{t("table.source")}</th>
                    <th className="py-3 font-semibold text-earth-900">{t("table.eu")}</th>
                  </tr>
                </thead>
                <tbody>
                  {palette.map((p) => (
                    <tr key={p.id} className="border-b border-earth-100">
                      <td className="py-3 pr-4 text-earth-900">{pigmentName(p, locale)}</td>
                      <td className="py-3 pr-4">
                        <span className="flex gap-1">
                          {p.colors.slice(0, 4).map((c) => (
                            <span
                              key={c}
                              aria-hidden="true"
                              title={c}
                              className="h-6 w-6 rounded ring-1 ring-inset ring-black/10"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-earth-600">
                        {CATEGORY_LABEL[p.category]?.[locale] || CATEGORY_LABEL[p.category]?.en}
                      </td>
                      <td className="py-3 text-earth-600">{p.regulations.eu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-12 p-6 bg-earth-100 rounded-xl">
            <p className="text-earth-700 mb-4">{t("externalNote")}</p>
            <Link
              href={`/${locale}/regulations`}
              className="inline-flex items-center gap-2 text-sage-700 font-medium hover:text-sage-900"
            >
              {t("externalLink")} →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
