import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/JsonLd";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    en: "Premium Natural Pigments for Food & Cosmetics",
    zh: "优质天然色素，应用于食品与化妆品",
    ja: "食品・化粧品向けプレミアム天然色素",
    ko: "식품 및 화장품용 프리미엄 천연 색소",
    es: "Pigmentos Naturales Premium para Alimentos y Cosméticos",
    fr: "Pigments Naturels Premium pour Alimentaire et Cosmétique",
    de: "Premium Natürliche Pigmente für Lebensmittel und Kosmetik",
  };
  const descs: Record<string, string> = {
    en: "Premium natural pigments for food, cosmetics, and pharmaceuticals. EU, FDA, Japan, Korea compliant. Sustainable plant, mineral, and microbial color solutions.",
    zh: "优质天然色素应用于食品、化妆品和制药。符合欧盟、FDA、日本、韩国法规。可持续的植物、矿物和微生物色彩方案。",
    ja: "食品・化粧品・製薬向けプレミアム天然色素。EU、FDA、日本、韓国規制対応。持続可能な植物・鉱物・微生物色彩ソリューション。",
    ko: "식품, 화장품, 제약용 프리미엄 천연 색소. EU, FDA, 일본, 한국 규제 준수. 지속 가능한 식물, 광물, 미생물 색상 솔루션.",
    es: "Pigmentos naturales premium para alimentos, cosméticos y farmacéuticos. Cumplimiento UE, FDA, Japón, Corea.",
    fr: "Pigments naturels premium pour l'alimentaire, la cosmétique et la pharmaceutique. Conformité UE, FDA, Japon, Corée.",
    de: "Premium natürliche Pigmente für Lebensmittel, Kosmetik und Pharmazeutik. EU-, FDA-, Japan-, Korea-konform.",
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

  return (
    <>
      <OrganizationJsonLd />
      <WebsiteJsonLd locale={locale} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-earth-100 via-earth-50 to-sage-50 section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-earth-900 leading-tight mb-6">
                {t("hero.title")}
              </h1>
              <p className="text-lg md:text-xl text-earth-700 mb-8 max-w-xl">
                {t("hero.subtitle")}
              </p>
              <Link
                href={`/${locale}/pigments`}
                className="inline-flex items-center gap-2 bg-sage-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-sage-700 transition-colors"
              >
                {t("hero.cta")}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-sage-200 via-earth-200 to-terracotta-200 flex items-center justify-center">
                <div className="w-3/4 h-3/4 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-4 p-8">
                    {["#C4856B", "#5A7F5A", "#BFA57F", "#8B6F47", "#D4C4A8", "#466646", "#E8DFD0", "#7A9C7A", "#A88A5C"].map((color, i) => (
                      <div key={i} className="w-12 h-12 md:w-16 md:h-16 rounded-full shadow-lg" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* Applications Section */}
      <section className="section-padding bg-earth-900 text-earth-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-12">
            {t("applications.title")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {(["food", "cosmetics", "pharmaceuticals"] as const).map((app) => (
              <div key={app} className="bg-earth-800 rounded-2xl p-8 hover:bg-earth-700 transition-colors">
                <h3 className="font-serif text-xl font-semibold mb-4">{t(`applications.${app}`)}</h3>
                <p className="text-earth-300 mb-4">
                  {t(`applications.${app}Desc`)}
                </p>
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

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-sage-600 to-sage-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-sage-100 mb-8 max-w-2xl mx-auto">
            {t("cta.desc")}
          </p>
          <Link
            href={`/${locale}/regulations`}
            className="inline-flex items-center gap-2 bg-white text-sage-700 px-6 py-3 rounded-lg font-medium hover:bg-earth-100 transition-colors"
          >
            {t("cta.button")}
          </Link>
        </div>
      </section>
    </>
  );
}
