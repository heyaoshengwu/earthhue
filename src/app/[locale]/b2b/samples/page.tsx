import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "b2b.samples" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `https://earthhue.net/${locale}/b2b/samples` },
  };
}

const steps = ["request", "review", "ship", "feedback"] as const;

export default async function SamplesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("b2b.samples");

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: `https://earthhue.net/${locale}` },
        { name: "B2B", url: `https://earthhue.net/${locale}/b2b` },
        { name: t("title"), url: `https://earthhue.net/${locale}/b2b/samples` },
      ]} />

      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-earth-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-earth-700 mb-12">{t("subtitle")}</p>

          <ol className="space-y-6 mb-12">
            {steps.map((s, i) => (
              <li key={s} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sage-600 text-white flex items-center justify-center font-bold">
                  {i + 1}
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold text-earth-900 mb-1">
                    {t(`steps.${s}.title`)}
                  </h2>
                  <p className="text-earth-600">{t(`steps.${s}.desc`)}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="bg-sage-50 border border-sage-200 rounded-xl p-6">
            <p className="text-earth-700 mb-4">{t("policy")}</p>
            <Link
              href={`/${locale}/b2b/contact`}
              className="inline-flex items-center gap-2 bg-sage-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-sage-700 transition-colors"
            >
              {t("cta")} →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
