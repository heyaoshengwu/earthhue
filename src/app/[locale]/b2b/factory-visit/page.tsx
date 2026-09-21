import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "b2b.factoryVisit" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `https://earthhue.net/${locale}/b2b/factory-visit` },
  };
}

const highlights = ["line", "lab", "warehouse", "qc"] as const;

export default async function FactoryVisitPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("b2b.factoryVisit");

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: `https://earthhue.net/${locale}` },
        { name: "B2B", url: `https://earthhue.net/${locale}/b2b` },
        { name: t("title"), url: `https://earthhue.net/${locale}/b2b/factory-visit` },
      ]} />

      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-earth-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-earth-700 mb-12">{t("subtitle")}</p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {highlights.map((h) => (
              <div key={h} className="bg-white border border-earth-200 rounded-xl p-6">
                <h2 className="font-serif text-xl font-semibold text-earth-900 mb-2">
                  {t(`highlights.${h}.title`)}
                </h2>
                <p className="text-earth-600 text-sm">{t(`highlights.${h}.desc`)}</p>
              </div>
            ))}
          </div>

          <div className="bg-earth-100 rounded-xl p-6">
            <h2 className="font-serif text-xl font-semibold text-earth-900 mb-3">{t("booking.title")}</h2>
            <p className="text-earth-700 mb-4">{t("booking.desc")}</p>
            <Link
              href={`/${locale}/b2b/contact`}
              className="inline-flex items-center gap-2 bg-sage-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-sage-700 transition-colors"
            >
              {t("booking.cta")} →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
