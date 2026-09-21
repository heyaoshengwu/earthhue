import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { OrganizationJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const titles: Record<string, string> = {
    en: "About EarthHue - Our Mission & Commitment to Natural Pigments",
    zh: "关于 EarthHue - 我们的使命与天然色素承诺",
    ja: "EarthHueについて - 天然色素への使命と約束",
    ko: "EarthHue 소개 - 천연 색소에 대한 사명과 약속",
    es: "Sobre EarthHue - Nuestra Misión y Compromiso con los Pigmentos Naturales",
    fr: "À propos d'EarthHue - Notre Mission et Engagement pour les Pigments Naturels",
    de: "Über EarthHue - Unser Engagement für Natürliche Pigmente",
  };

  return {
    title: titles[locale] || t("title"),
    description: t("subtitle"),
    openGraph: {
      title: titles[locale] || t("title"),
      description: t("subtitle"),
      url: `https://earthhue.net/${locale}/about`,
      locale,
      type: "website",
    },
    alternates: {
      canonical: `https://earthhue.net/${locale}/about`,
      languages: Object.fromEntries(
        ["en", "zh", "ja", "ko", "es", "fr", "de"].map((l) => [l, `https://earthhue.net/${l}/about`])
      ),
    },
  };
}

const certs = ["ISO 22000", "FSSC 22000", "FDA Registered", "EU Food Grade", "Kosher", "Halal"];

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("about");

  return (
    <>
      <OrganizationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `https://earthhue.net/${locale}` },
          { name: t("title"), url: `https://earthhue.net/${locale}/about` },
        ]}
      />

      <div className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-earth-900 mb-8 text-center">
            {t("title")}
          </h1>

          <div className="prose prose-earth max-w-none">
            <p className="text-lg text-earth-700 mb-8 text-center">
              {t("subtitle")}
            </p>

            <div className="grid md:grid-cols-2 gap-8 my-12">
              <div className="bg-earth-50 p-6 rounded-xl">
                <h2 className="font-serif text-xl font-semibold text-earth-900 mb-4">{t("mission.title")}</h2>
                <p className="text-earth-700">{t("mission.desc")}</p>
              </div>
              <div className="bg-earth-50 p-6 rounded-xl">
                <h2 className="font-serif text-xl font-semibold text-earth-900 mb-4">{t("vision.title")}</h2>
                <p className="text-earth-700">{t("vision.desc")}</p>
              </div>
            </div>

            <h2 className="font-serif text-2xl font-bold text-earth-900 mb-4">{t("whyChoose.title")}</h2>
            <p className="text-earth-700 mb-6">{t("whyChoose.desc")}</p>

            <h2 className="font-serif text-2xl font-bold text-earth-900 mb-4">{t("commitment.title")}</h2>
            <ul className="space-y-3 text-earth-700 mb-8">
              {(["quality", "sustainable", "technical", "global"] as const).map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-sage-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>{t(`commitment.${key}.title`)}:</strong> {t(`commitment.${key}.desc`)}</span>
                </li>
              ))}
            </ul>

            <h2 className="font-serif text-2xl font-bold text-earth-900 mb-4">{t("certifications.title")}</h2>
            <div className="flex flex-wrap gap-4">
              {certs.map((cert) => (
                <span key={cert} className="px-4 py-2 bg-sage-50 text-sage-700 rounded-full text-sm font-medium">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
