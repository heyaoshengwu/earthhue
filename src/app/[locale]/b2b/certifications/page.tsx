import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "b2b.certifications" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `https://earthhue.net/${locale}/b2b/certifications` },
  };
}

const certGroups = ["food", "cosmetic", "pharma", "iso", "religious"] as const;

export default async function CertificationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("b2b.certifications");

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: `https://earthhue.net/${locale}` },
        { name: "B2B", url: `https://earthhue.net/${locale}/b2b` },
        { name: t("title"), url: `https://earthhue.net/${locale}/b2b/certifications` },
      ]} />

      <section className="section-padding">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-earth-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-earth-700 mb-12">{t("subtitle")}</p>

          <div className="space-y-8">
            {certGroups.map((g) => (
              <div key={g} className="bg-white border border-earth-200 rounded-xl p-6">
                <h2 className="font-serif text-2xl font-semibold text-earth-900 mb-3">
                  {t(`groups.${g}.title`)}
                </h2>
                <p className="text-earth-600 mb-4">{t(`groups.${g}.desc`)}</p>
                <div className="flex flex-wrap gap-2">
                  {(["a","b","c","d"] as const).map((k) => {
                    const v = t(`groups.${g}.items.${k}`);
                    return v && v !== `${g}.items.${k}` ? (
                      <span key={k} className="inline-block bg-sage-100 text-sage-800 text-sm font-medium px-3 py-1 rounded-full">
                        {v}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-earth-100 rounded-xl">
            <p className="text-earth-700">{t("downloadHint")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
