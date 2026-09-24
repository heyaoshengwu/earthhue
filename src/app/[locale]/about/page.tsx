import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { OrganizationJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { getAbout, listAboutImages } from "@/lib/about";
import { pickTranslation } from "@/lib/i18n";

export const dynamic = "force-dynamic";

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

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("about");

  const { translations } = getAbout();
  const data = pickTranslation(translations, locale) || {};
  const heroImages = listAboutImages("hero");
  const teamImages = listAboutImages("team");
  const factoryImages = listAboutImages("factory");

  return (
    <>
      <OrganizationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `https://earthhue.net/${locale}` },
          { name: data.title || t("title"), url: `https://earthhue.net/${locale}/about` },
        ]}
      />

      <div className="section-padding">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-earth-900 mb-6 text-center">
            {data.title || t("title")}
          </h1>

          {heroImages.length > 0 && (
            <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {heroImages.map((img) => (
                <figure key={img.id} className="rounded-2xl overflow-hidden">
                  <img src={img.url} alt={img.alt || ""} className="w-full h-full object-cover" />
                  {img.caption && (
                    <figcaption className="text-xs text-earth-500 mt-2 px-2">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}

          {data.subtitle && (
            <p className="text-lg text-earth-700 mb-10 text-center max-w-3xl mx-auto">
              {data.subtitle}
            </p>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {data.mission && (
              <div className="bg-earth-50 p-6 rounded-xl">
                <h2 className="font-serif text-xl font-semibold text-earth-900 mb-3">
                  {data.missionTitle || t("mission.title")}
                </h2>
                <p className="text-earth-700 leading-relaxed">{data.mission}</p>
              </div>
            )}
            {data.vision && (
              <div className="bg-earth-50 p-6 rounded-xl">
                <h2 className="font-serif text-xl font-semibold text-earth-900 mb-3">
                  {data.visionTitle || t("vision.title")}
                </h2>
                <p className="text-earth-700 leading-relaxed">{data.vision}</p>
              </div>
            )}
          </div>

          {data.whyTitle && data.whyBody && (
            <section className="mb-12">
              <h2 className="font-serif text-2xl font-bold text-earth-900 mb-4">
                {data.whyTitle}
              </h2>
              <p className="text-earth-700 leading-relaxed">{data.whyBody}</p>
            </section>
          )}

          {factoryImages.length > 0 && (
            <section className="mb-12">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {factoryImages.map((img) => (
                  <figure key={img.id} className="rounded-xl overflow-hidden">
                    <img src={img.url} alt={img.alt || ""} className="w-full h-48 object-cover" />
                  </figure>
                ))}
              </div>
            </section>
          )}

          {data.commitmentItems && data.commitmentItems.length > 0 && (
            <section className="mb-12">
              <h2 className="font-serif text-2xl font-bold text-earth-900 mb-4">
                {data.commitmentTitle || t("commitment.title")}
              </h2>
              <ul className="space-y-3">
                {data.commitmentItems.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 text-earth-700">
                    <svg className="w-5 h-5 text-sage-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>{c.title}:</strong> {c.desc}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {data.certifications && data.certifications.length > 0 && (
            <section className="mb-12">
              <h2 className="font-serif text-2xl font-bold text-earth-900 mb-4">
                {data.certificationsTitle || t("certifications.title")}
              </h2>
              <div className="flex flex-wrap gap-3">
                {data.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="px-4 py-2 bg-sage-50 text-sage-700 rounded-full text-sm font-medium"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </section>
          )}

          {teamImages.length > 0 && (
            <section>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {teamImages.map((img) => (
                  <figure key={img.id} className="rounded-xl overflow-hidden">
                    <img src={img.url} alt={img.alt || ""} className="w-full h-40 object-cover" />
                    {img.caption && (
                      <figcaption className="text-xs text-earth-500 mt-1">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}