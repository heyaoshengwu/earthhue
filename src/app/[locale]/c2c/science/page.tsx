import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "c2c.science" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `https://earthhue.net/${locale}/c2c/science` },
  };
}

const articles = [
  { key: "natural-vs-synthetic" },
  { key: "sustainability" },
  { key: "stability" },
  { key: "safety" },
] as const;

export default async function SciencePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("c2c.science");

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

          <div className="space-y-10">
            {articles.map((a) => (
              <article key={a.key} className="bg-white border border-earth-200 rounded-xl p-6">
                <h2 className="font-serif text-2xl font-semibold text-earth-900 mb-3">
                  {t(`articles.${a.key}.title`)}
                </h2>
                <p className="text-earth-700 leading-relaxed mb-4">
                  {t(`articles.${a.key}.lede`)}
                </p>
                <p className="text-earth-600 text-sm leading-relaxed">
                  {t(`articles.${a.key}.body`)}
                </p>
              </article>
            ))}
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
