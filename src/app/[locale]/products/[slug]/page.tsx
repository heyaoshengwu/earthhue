import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { getProductBySlug, listProductImages } from "@/lib/products";
import { BreadcrumbJsonLd, ProductJsonLd } from "@/components/JsonLd";
import { pickTranslation } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const tr = pickTranslation(product.translations, locale);
  return {
    title: `${tr?.name || product.slug} | EarthHue`,
    description: tr?.description || "",
    alternates: {
      canonical: `https://earthhue.net/${locale}/products/${product.slug}`,
    },
    openGraph: {
      title: tr?.name || product.slug,
      description: tr?.description || "",
      url: `https://earthhue.net/${locale}/products/${product.slug}`,
      locale,
      type: "website",
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || !product.published) notFound();
  const t = await getTranslations("products");
  const tr = pickTranslation(product.translations, locale);
  const images = listProductImages(product.id);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `https://earthhue.net/${locale}` },
          { name: t("title"), url: `https://earthhue.net/${locale}/products` },
          { name: tr?.name || product.slug, url: `https://earthhue.net/${locale}/products/${product.slug}` },
        ]}
      />
      <ProductJsonLd
        name={tr?.name || product.slug}
        description={tr?.description || ""}
        applications={tr?.applications || []}
      />

      <div className="section-padding">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-earth-500 mb-6" aria-label="Breadcrumb">
            <Link href={`/${locale}`} className="hover:text-sage-700">
              {t("breadcrumbHome")}
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/${locale}/products`} className="hover:text-sage-700">
              {t("title")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-earth-700">{tr?.name || product.slug}</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <div
                className="aspect-square rounded-2xl flex items-center justify-center overflow-hidden"
                style={{
                  background: product.color
                    ? `linear-gradient(135deg, ${product.color}25, ${product.color}55)`
                    : "linear-gradient(135deg, #f5f0e6, #e9e0cc)",
                }}
              >
                {images[0] ? (
                  <img
                    src={images[0].url}
                    alt={images[0].alt || tr?.name || product.slug}
                    className="w-full h-full object-cover"
                  />
                ) : product.color ? (
                  <div
                    className="w-40 h-40 rounded-full shadow-inner"
                    style={{ backgroundColor: product.color }}
                  />
                ) : null}
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {images.slice(1).map((img) => (
                    <div
                      key={img.id}
                      className="aspect-square rounded-lg overflow-hidden border border-earth-100"
                    >
                      <img
                        src={img.url}
                        alt={img.alt || ""}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-earth-900 mb-3">
                {tr?.name || product.slug}
              </h1>
              <div className="flex flex-wrap gap-2 mb-6">
                {product.base && (
                  <span className="px-3 py-1 bg-earth-100 text-earth-700 rounded-full text-sm">
                    {product.base}
                  </span>
                )}
                {product.form && (
                  <span className="px-3 py-1 bg-sage-50 text-sage-700 rounded-full text-sm">
                    {product.form}
                  </span>
                )}
              </div>
              <p className="text-earth-700 leading-relaxed mb-8">{tr?.description || ""}</p>

              {tr?.applications && tr.applications.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-semibold text-earth-900 mb-3">{t("applications")}</h2>
                  <div className="flex flex-wrap gap-2">
                    {tr.applications.map((app, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-sm"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center gap-2 bg-sage-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-sage-700 transition-colors"
                >
                  {t("inquire")}
                </Link>
                <Link
                  href={`/${locale}/products`}
                  className="inline-flex items-center gap-2 bg-earth-100 text-earth-700 px-6 py-3 rounded-lg font-medium hover:bg-earth-200 transition-colors"
                >
                  {t("backToList")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}