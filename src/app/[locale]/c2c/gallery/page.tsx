import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { localeAlternates, openGraphFor } from "@/lib/seo";
import { getProductBySlug } from "@/lib/products";
import { pickTranslation } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "c2c.gallery" });
  return {
    alternates: localeAlternates(locale, "/c2c/gallery"),
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: openGraphFor(locale, "/c2c/gallery", t("metaTitle"), t("metaDescription")),
  };
}

/**
 * Real pigment photographs from the product library. These two slots used to
 * point at /logo.png and /og-image.png — a logo presented as a mineral
 * palette, and the site's social card presented as a fabric swatch.
 */
const items = [
  {
    img: "/uploads/products/1790566664519-9e31ed41181c1ef3.jpg",
    key: "earth",
    product: "eh-curcumin-10",
  },
  {
    img: "/uploads/products/1790564543912-b9586e06edb3a186.jpg",
    key: "hue",
    product: "eh-phycocyanin-140",
  },
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
            {items.map((it) => {
              const product = getProductBySlug(it.product);
              const productTr = product ? pickTranslation(product.translations, locale) : null;
              const productName = productTr?.name || it.product;

              return (
                <figure
                  key={it.key}
                  className="bg-white border border-earth-200 rounded-xl overflow-hidden flex flex-col"
                >
                  <Link
                    href={`/${locale}/products/${it.product}`}
                    className="block group"
                    aria-label={productName}
                  >
                    <div className="aspect-[16/9] bg-earth-50 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={it.img}
                        alt={t(`items.${it.key}.alt`)}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </Link>
                  <figcaption className="p-4 flex-1 flex flex-col">
                    <h2 className="font-serif text-lg font-semibold text-earth-900 mb-1">
                      {t(`items.${it.key}.title`)}
                    </h2>
                    <p className="text-earth-600 text-sm mb-3">{t(`items.${it.key}.desc`)}</p>
                    <Link
                      href={`/${locale}/products/${it.product}`}
                      className="mt-auto inline-flex items-center gap-2 text-sage-700 font-medium hover:text-sage-900"
                    >
                      {productName} →
                    </Link>
                  </figcaption>
                </figure>
              );
            })}
          </div>

          <div className="mt-12 p-6 bg-sage-50 border border-sage-200 rounded-xl text-center">
            <p className="text-earth-700">{t("comingSoon")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
