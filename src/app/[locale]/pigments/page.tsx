import { PigmentFilter } from "@/components/PigmentFilter";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pigments" });
  const titles: Record<string, string> = {
    en: "Natural Pigments - Plant, Mineral & Microbial Color Solutions | EarthHue",
    zh: "天然色素 - 植物、矿物和微生物色彩方案 | EarthHue",
    ja: "天然色素 - 植物・鉱物・微生物色彩ソリューション | EarthHue",
    ko: "천연 색소 - 식물, 광물, 미생물 색상 솔루션 | EarthHue",
    es: "Pigmentos Naturales - Soluciones de Color Vegetal, Mineral y Microbiano | EarthHue",
    fr: "Pigments Naturels - Solutions Colorantes Végétales, Minérales et Microbiennes | EarthHue",
    de: "Natürliche Pigmente - Pflanzliche, Mineralische & Mikrobielle Farblösungen | EarthHue",
  };

  return {
    title: titles[locale] || t("title"),
    description: t("subtitle"),
    openGraph: {
      title: titles[locale] || t("title"),
      description: t("subtitle"),
      url: `https://earthhue.net/${locale}/pigments`,
      locale,
      type: "website",
    },
    alternates: {
      canonical: `https://earthhue.net/${locale}/pigments`,
      languages: Object.fromEntries(
        ["en", "zh", "ja", "ko", "es", "fr", "de"].map((l) => [l, `https://earthhue.net/${l}/pigments`])
      ),
    },
  };
}

export default async function PigmentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("pigments");

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `https://earthhue.net/${locale}` },
          { name: t("title"), url: `https://earthhue.net/${locale}/pigments` },
        ]}
      />

      <div className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-earth-900 mb-4">
              {t("title")}
            </h1>
            <p className="text-earth-600 max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>

          <PigmentFilter />
        </div>
      </div>
    </>
  );
}
