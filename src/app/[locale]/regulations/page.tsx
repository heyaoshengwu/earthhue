import { regulations } from "@/content/regulations/data";
import { regulationTranslations } from "@/content/regulations/translations";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import type { Locale } from "@/content/regulations/translations";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "regulations" });
  const titles: Record<string, string> = {
    en: "Regulatory Information - Global Compliance for Natural Pigments | EarthHue",
    zh: "法规信息 - 天然色素全球合规指南 | EarthHue",
    ja: "規制情報 - 天然色素のグローバル規制対応 | EarthHue",
    ko: "규제 정보 - 천연 색소 글로벌 규제 준수 | EarthHue",
    es: "Información Regulatoria - Cumplimiento Global para Pigmentos Naturales | EarthHue",
    fr: "Information Réglementaire - Conformité Mondiale pour Pigments Naturels | EarthHue",
    de: "Regulatorische Informationen - Globale Compliance für Natürliche Pigmente | EarthHue",
  };

  return {
    title: titles[locale] || t("title"),
    description: t("subtitle"),
    openGraph: {
      title: titles[locale] || t("title"),
      description: t("subtitle"),
      url: `https://earthhue.net/${locale}/regulations`,
      locale,
      type: "website",
    },
    alternates: {
      canonical: `https://earthhue.net/${locale}/regulations`,
      languages: Object.fromEntries(
        ["en", "zh", "ja", "ko", "es", "fr", "de"].map((l) => [l, `https://earthhue.net/${l}/regulations`])
      ),
    },
  };
}

export default async function RegulationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("regulations");
  const trLocale = locale as Locale;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `https://earthhue.net/${locale}` },
          { name: t("title"), url: `https://earthhue.net/${locale}/regulations` },
        ]}
      />

      <div className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-earth-900 mb-4">{t("title")}</h1>
            <p className="text-earth-600 max-w-2xl mx-auto">{t("subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {regulations.map((reg) => (
              <a key={reg.id} href={`#${reg.id}`} className="group p-6 bg-white rounded-xl border border-earth-100 hover:border-sage-300 hover:shadow-md transition-all">
                <h2 className="font-serif text-xl font-semibold text-earth-900 mb-2 group-hover:text-sage-700">{reg.region}</h2>
                <p className="text-sm text-earth-500">{reg.authority}</p>
              </a>
            ))}
          </div>

          <div className="space-y-12">
            {regulations.map((reg) => {
              const tr = regulationTranslations[reg.regionCode]?.[trLocale] || regulationTranslations[reg.regionCode]?.["en"];
              const displayDesc = tr?.desc || reg.description;
              const displayStandardsTitle = tr?.standards_title || "Standards & Regulations";
              const displayResourcesTitle = tr?.resources_title || "Official Resources";

              return (
                <section key={reg.id} id={reg.id} className="scroll-mt-20 bg-white rounded-2xl p-8 border border-earth-100">
                  <div className="mb-6">
                    <h2 className="font-serif text-2xl font-bold text-earth-900 mb-2">{reg.region}</h2>
                    <p className="text-sage-600 font-medium">{reg.authority}</p>
                    <p className="text-earth-600 mt-3">{displayDesc}</p>
                  </div>

                  <div className="border-t border-earth-100 pt-6">
                    <h3 className="font-semibold text-earth-900 mb-4">{displayStandardsTitle}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {reg.standards.map((std, i) => (
                        <div key={i} className="p-4 bg-earth-50 rounded-lg">
                          <p className="text-xs font-mono text-sage-600 mb-1">{std.code}</p>
                          <p className="font-medium text-earth-900">{std.title}</p>
                          <p className="text-sm text-earth-600 mt-1">{std.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-earth-100 pt-6 mt-6">
                    <h3 className="font-semibold text-earth-900 mb-4">{displayResourcesTitle}</h3>
                    <ul className="space-y-2">
                      {reg.resources.map((res, i) => (
                        <li key={i}>
                          <a href={res.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-700 hover:underline">
                            {res.title}
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              );
            })}
          </div>

          <div className="mt-12 text-center bg-earth-900 text-earth-100 rounded-2xl p-8">
            <h2 className="font-serif text-2xl font-bold mb-4">{t("guidance.title")}</h2>
            <p className="text-earth-300 mb-6 max-w-xl mx-auto">{t("guidance.desc")}</p>
            <Link href={`/${locale}/contact`} className="inline-flex items-center gap-2 bg-sage-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-sage-600 transition-colors">
              {t("guidance.button")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
