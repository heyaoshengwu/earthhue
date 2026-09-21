import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "b2b.capability" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `https://earthhue.net/${locale}/b2b/capability` },
  };
}

const stats = [
  { key: "capacity" },
  { key: "lines" },
  { key: "qc" },
  { key: "rd" },
] as const;

export default async function CapabilityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("b2b.capability");

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: `https://earthhue.net/${locale}` },
        { name: "B2B", url: `https://earthhue.net/${locale}/b2b` },
        { name: t("title"), url: `https://earthhue.net/${locale}/b2b/capability` },
      ]} />

      <section className="section-padding">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-earth-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-earth-700 mb-12">{t("subtitle")}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((s) => (
              <div key={s.key} className="bg-white border border-earth-200 rounded-xl p-6 text-center">
                <div className="text-3xl md:text-4xl font-serif font-bold text-sage-700 mb-2">
                  {t(`stats.${s.key}.value`)}
                </div>
                <div className="text-sm text-earth-600">{t(`stats.${s.key}.label`)}</div>
              </div>
            ))}
          </div>

          <div className="prose prose-earth max-w-none">
            <h2>{t("factory.title")}</h2>
            <p>{t("factory.desc")}</p>

            <h2>{t("qc.title")}</h2>
            <p>{t("qc.desc")}</p>
            <ul>
              <li>{t("qc.list.1")}</li>
              <li>{t("qc.list.2")}</li>
              <li>{t("qc.list.3")}</li>
              <li>{t("qc.list.4")}</li>
            </ul>

            <h2>{t("rd.title")}</h2>
            <p>{t("rd.desc")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
