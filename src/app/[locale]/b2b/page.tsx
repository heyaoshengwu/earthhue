import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { OrganizationJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "b2b" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `https://earthhue.net/${locale}/b2b`,
      languages: Object.fromEntries(
        ["en","zh","ja","ko","es","fr","de"].map((l) => [l, `https://earthhue.net/${l}/b2b`])
      ),
    },
  };
}

const modules = [
  { key: "capability", icon: "🏭", href: "capability" },
  { key: "certifications", icon: "📜", href: "certifications" },
  { key: "samples", icon: "🧪", href: "samples" },
  { key: "factoryVisit", icon: "👷", href: "factory-visit" },
  { key: "contact", icon: "✉️", href: "contact" },
] as const;

export default async function B2BIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("b2b");

  return (
    <>
      <OrganizationJsonLd />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: `https://earthhue.net/${locale}` },
        { name: t("title"), url: `https://earthhue.net/${locale}/b2b` },
      ]} />

      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sage-700 font-medium mb-3 uppercase tracking-wider text-sm">{t("eyebrow")}</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-earth-900 mb-6">
              {t("heroTitle")}
            </h1>
            <p className="text-lg md:text-xl text-earth-700 max-w-3xl mx-auto">
              {t("heroSubtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((m) => (
              <Link
                key={m.key}
                href={`/${locale}/b2b/${m.href}`}
                className="block bg-white border border-earth-200 rounded-xl p-6 hover:border-sage-400 hover:shadow-md transition-all"
              >
                <div className="text-4xl mb-3">{m.icon}</div>
                <h2 className="font-serif text-xl font-semibold text-earth-900 mb-2">
                  {t(`modules.${m.key}.title`)}
                </h2>
                <p className="text-earth-600 text-sm">{t(`modules.${m.key}.desc`)}</p>
                <span className="inline-block mt-4 text-sage-700 font-medium text-sm">
                  {t("learnMore")} →
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-16 bg-earth-900 text-earth-100 rounded-2xl p-8 md:p-12">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
              {t("catalog.title")}
            </h2>
            <p className="text-earth-300 mb-6 max-w-2xl">
              {t("catalog.desc")}
            </p>
            <Link
              href={`/${locale}/b2b/contact`}
              className="inline-flex items-center gap-2 bg-sage-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-sage-700 transition-colors"
            >
              {t("catalog.cta")} →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
