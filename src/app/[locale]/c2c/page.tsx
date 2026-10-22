import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "c2c" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `https://earthhue.net/${locale}/c2c`,
      languages: Object.fromEntries(
        ["en","zh","ja","ko","es","fr","de"].map((l) => [l, `https://earthhue.net/${l}/c2c`])
      ),
    },
  };
}

const sections = [
  { key: "stories", icon: "🌿", href: "stories", tag: "01" },
  { key: "science", icon: "🔬", href: "science", tag: "02" },
  { key: "gallery", icon: "🎨", href: "gallery", tag: "03" },
] as const;

export default async function C2CIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("c2c");

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: `https://earthhue.net/${locale}` },
        { name: t("title"), url: `https://earthhue.net/${locale}/c2c` },
      ]} />

      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-earth-600 font-medium mb-3 uppercase tracking-wider text-sm">{t("eyebrow")}</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-earth-900 mb-6">
              {t("heroTitle")}
            </h1>
            <p className="text-lg md:text-xl text-earth-700 max-w-3xl mx-auto">
              {t("heroSubtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {sections.map((s) => (
              <Link
                key={s.key}
                href={`/${locale}/c2c/${s.href}`}
                className="group relative bg-white border border-earth-200 rounded-xl p-8 hover:border-sage-400 hover:shadow-md transition-all"
              >
                <div className="absolute top-4 right-4 text-earth-200 font-serif text-4xl font-bold">{s.tag}</div>
                <div className="text-5xl mb-4">{s.icon}</div>
                <h2 className="font-serif text-2xl font-semibold text-earth-900 mb-3">
                  {t(`sections.${s.key}.title`)}
                </h2>
                <p className="text-earth-600">{t(`sections.${s.key}.desc`)}</p>
                <span className="inline-block mt-6 text-sage-700 font-medium group-hover:translate-x-1 transition-transform">
                  {t("explore")} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
