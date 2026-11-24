import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import InquiryForm, { type InquiryIntent } from "@/components/InquiryForm";
import { listProducts } from "@/lib/products";
import { pickTranslation } from "@/lib/i18n";
import { localeAlternates, openGraphFor } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "b2b.contact" });
  return {
    alternates: localeAlternates(locale, "/b2b/contact"),
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: openGraphFor(locale, "/b2b/contact", t("metaTitle"), t("metaDescription")),
  };
}

const INTENT_KEYS = ["quote", "sample", "visit", "partnership", "other"] as const;

export default async function B2BContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("b2b.contact");

  const intents: InquiryIntent[] = INTENT_KEYS.map((key) => ({
    key,
    label: String(t(`intents.${key}`)),
  }));

  const products = listProducts({ onlyPublished: true }).map((p) => ({
    slug: p.slug,
    name: pickTranslation(p.translations, locale)?.name || p.slug,
  }));

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `https://earthhue.net/${locale}` },
          { name: "B2B", url: `https://earthhue.net/${locale}/b2b` },
          { name: String(t("title")), url: `https://earthhue.net/${locale}/b2b/contact` },
        ]}
      />

      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-earth-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-earth-700 mb-10">{t("subtitle")}</p>

          <div className="bg-white border border-earth-200 rounded-xl p-6">
            <InquiryForm variant="b2b" products={products} intents={intents} />
            <p className="text-xs text-earth-500 text-center mt-4">{t("form.note")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
