import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/JsonLd";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    en: "EarthHue — Natural Pigments for Industry & Aesthetic Color Stories",
    zh: "EarthHue — 面向工业的天然色素 与 美学色彩故事",
    ja: "EarthHue — 産業向け天然色素 と 色彩の美学ストーリー",
    ko: "EarthHue — 산업용 천연 색소 와 미학 컬러 스토리",
    es: "EarthHue — Pigmentos Naturales para la Industria e Historias de Color Estéticas",
    fr: "EarthHue — Pigments Naturels pour l'Industrie et Récits Esthétiques",
    de: "EarthHue — Natürliche Pigmente für die Industrie und ästhetische Farbgeschichten",
  };
  const descs: Record<string, string> = {
    en: "Two zones, one palette of nature. B2B raw-material catalog for formulators; C2C color stories, science, and aesthetic gallery for color enthusiasts.",
    zh: "同一调色板，两种入口。B 端面向配方师的天然原料；C 端面向色彩爱好者的故事、科学与图库。",
    ja: "二つのゾーン、一つの天然パレット。B2B は処方者向け原料、C2C は色彩愛好家向けのストーリー・科学・ギャラリー。",
    ko: "두 개의 존, 하나의 자연 팔레트. B2B는 제형가용 원료, C2C는 컬러 애호가용 스토리·과학·갤러리.",
    es: "Dos zonas, una paleta de la naturaleza. B2B con catálogo para formuladores; C2C con historias, ciencia y galería.",
    fr: "Deux zones, une palette de la nature. B2B pour formulateurs ; C2C pour passionnés : histoires, science, galerie.",
    de: "Zwei Zonen, eine Palette der Natur. B2B für Formulierer; C2C für Farbbegeisterte: Geschichten, Wissenschaft, Galerie.",
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

const zones = [
  { key: "b2b", icon: "🏭", href: "b2b", accent: "from-earth-700 to-earth-900" },
  { key: "c2c", icon: "🎨", href: "c2c", accent: "from-sage-600 to-sage-800" },
] as const;

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

      {/* Hero — B/C Dual-Zone Entry */}
      <section className="relative bg-gradient-to-br from-earth-100 via-earth-50 to-sage-50 section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sage-700 font-medium mb-3 uppercase tracking-wider text-sm">
              {t("hero.eyebrow")}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-earth-900 leading-tight mb-6">
              {t("hero.title")}
            </h1>
            <p className="text-lg md:text-xl text-earth-700 max-w-3xl mx-auto">
              {t("hero.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {zones.map((z) => (
              <Link
                key={z.key}
                href={`/${locale}/${z.href}`}
                className={`group relative block bg-gradient-to-br ${z.accent} text-white rounded-2xl p-8 md:p-10 overflow-hidden hover:scale-[1.02] transition-transform`}
              >
                <div className="absolute top-4 right-4 text-6xl opacity-20 group-hover:opacity-30 transition-opacity">
                  {z.icon}
                </div>
                <div className="relative">
                  <p className="text-xs uppercase tracking-widest opacity-80 mb-3">
                    {t(`hero.zones.${z.key}.eyebrow`)}
                  </p>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
                    {t(`hero.zones.${z.key}.title`)}
                  </h2>
                  <p className="opacity-90 mb-6 leading-relaxed">
                    {t(`hero.zones.${z.key}.desc`)}
                  </p>
                  <span className="inline-flex items-center gap-2 font-medium border-b border-white/50 pb-1 group-hover:border-white">
                    {t(`hero.zones.${z.key}.cta`)} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-link strip */}
      <section className="bg-white py-6 border-b border-earth-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
          <Link href={`/${locale}/pigments`} className="text-earth-700 hover:text-sage-700">
            {t("quicklinks.pigments")}
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
