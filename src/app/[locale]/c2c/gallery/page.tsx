import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "c2c.gallery" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `https://earthhue.net/${locale}/c2c/gallery` },
  };
}

const items = [
  { img: "/logo.png",     key: "earth" },
  { img: "/og-image.png", key: "hue" },
] as const;

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("c2c.gallery");

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: `https://earthhue.net/${locale}` },
        { name: "C2C", url: `https://earthhue.net/${locale}/c2c` },
        { name: t("title"), url: `https://earthhue.net/${locale}/c2c/gallery` },
      ]} />

      <section className="section-padding">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-earth-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-earth-700 mb-12">{t("subtitle")}</p>

          <div className="grid md:grid-cols-2 gap-6">
            {items.map((it) => (
              <figure key={it.key} className="bg-white border border-earth-200 rounded-xl overflow-hidden">
                <div className="aspect-[16/9] bg-earth-50 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.img}
                    alt={t(`items.${it.key}.alt`)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="p-4">
                  <h2 className="font-serif text-lg font-semibold text-earth-900 mb-1">
                    {t(`items.${it.key}.title`)}
                  </h2>
                  <p className="text-earth-600 text-sm">{t(`items.${it.key}.desc`)}</p>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-12 p-6 bg-sage-50 border border-sage-200 rounded-xl text-center">
            <p className="text-earth-700">{t("comingSoon")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
