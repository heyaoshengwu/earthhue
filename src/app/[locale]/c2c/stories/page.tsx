import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "c2c.stories" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `https://earthhue.net/${locale}/c2c/stories` },
  };
}

const stories = ["indigo", "saffron", "beetroot", "spirulina"] as const;

export default async function StoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("c2c.stories");

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: `https://earthhue.net/${locale}` },
        { name: "C2C", url: `https://earthhue.net/${locale}/c2c` },
        { name: t("title"), url: `https://earthhue.net/${locale}/c2c/stories` },
      ]} />

      <section className="section-padding">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-earth-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-earth-700 mb-12">{t("subtitle")}</p>

          <div className="space-y-10">
            {stories.map((s) => (
              <article key={s} className="border-l-4 border-sage-400 pl-6">
                <p className="text-sm text-sage-700 font-medium mb-2 uppercase tracking-wider">
                  {t(`items.${s}.tag`)}
                </p>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-earth-900 mb-3">
                  {t(`items.${s}.title`)}
                </h2>
                <p className="text-earth-700 leading-relaxed mb-3">
                  {t(`items.${s}.lede`)}
                </p>
                <p className="text-earth-600 text-sm">
                  {t(`items.${s}.body`)}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-16 bg-sage-50 rounded-xl p-6 text-center">
            <p className="text-earth-700 mb-4">{t("cta")}</p>
            <Link
              href={`/${locale}/c2c/science`}
              className="inline-flex items-center gap-2 text-sage-700 font-medium hover:text-sage-900"
            >
              {t("ctaLink")} →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
