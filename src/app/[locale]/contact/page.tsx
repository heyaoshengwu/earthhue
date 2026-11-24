import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import InquiryForm from "@/components/InquiryForm";
import { listProducts } from "@/lib/products";
import { pickTranslation } from "@/lib/i18n";
import { localeAlternates, openGraphFor } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    alternates: localeAlternates(locale, "/contact"),
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: openGraphFor(locale, "/contact", t("metaTitle"), t("metaDescription")),
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("contact");
  const tc = await getTranslations("articles");

  const products = listProducts({ onlyPublished: true }).map((p) => ({
    slug: p.slug,
    name: pickTranslation(p.translations, locale)?.name || p.slug,
  }));

  return (
    <div className="section-padding">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-earth-900 mb-4">{t("title")}</h1>
          <p className="text-earth-600 max-w-xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <InquiryForm variant="general" products={products} />

          <div className="space-y-8">
            <div>
              <h3 className="font-semibold text-earth-900 mb-3">{t("info.inquiry.title")}</h3>
              <p className="text-earth-600">
                <a
                  href={`mailto:${t("info.inquiry.email")}`}
                  className="hover:text-sage-700 hover:underline underline-offset-2"
                >
                  {t("info.inquiry.email")}
                </a>
              </p>
            </div>
            <div className="rounded-xl bg-sage-50 border border-sage-200 p-5">
              <h3 className="font-semibold text-earth-900 mb-2">{tc("cta.title")}</h3>
              <p className="text-earth-600 text-sm mb-4">{tc("cta.desc")}</p>
              <Link
                href={`/${locale}/b2b/samples`}
                className="inline-flex items-center gap-2 bg-sage-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-sage-700 transition-colors"
              >
                {tc("cta.sample")}
              </Link>
            </div>
            <div>
              <h3 className="font-semibold text-earth-900 mb-3">{t("info.hours.title")}</h3>
              <p className="text-earth-600">
                {t("info.hours.days")}
                <br />
                {t("info.hours.time")}
              </p>
            </div>
            <div className="pt-4 border-t border-earth-200">
              <h3 className="font-semibold text-earth-900 mb-3">{t("info.response.title")}</h3>
              <p className="text-earth-600">{t("info.response.text")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
