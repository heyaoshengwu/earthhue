import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import {
  getProductBySlug,
  listProductImages,
  listProducts,
  getProductSpecs,
  getProductFaq,
} from "@/lib/products";
import { BreadcrumbJsonLd, ProductJsonLd, FAQJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { pickTranslation } from "@/lib/i18n";
import { localeAlternates, BASE_URL } from "@/lib/seo";

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
  const specs = getProductSpecs(product, locale);
  const assay = specs.find((s) => /assay|content|purity/i.test(s.label))?.value;
  const title = `${tr?.name || product.slug}${assay ? ` — ${assay}` : ""}`;
  const description = tr?.description || "";
  const canonical = `${BASE_URL}/${locale}/products/${product.slug}`;

  return {
    title,
    description,
    alternates: localeAlternates(locale, `/products/${product.slug}`),
    openGraph: {
      title,
      description,
      url: canonical,
      locale,
      type: "website",
      images: [
        {
          url: "https://earthhue.net/og-image.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
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
  const ts = await getTranslations("series");
  const tr = pickTranslation(product.translations, locale);
  const images = listProductImages(product.id);
  const specs = getProductSpecs(product, locale);
  const faq = getProductFaq(product, locale);
  const seriesKey = product.series || "";
  const seriesTitle = seriesKey ? ts(`${seriesKey}.title`) : "";

  const related = listProducts({ onlyPublished: true })
    .filter((p) => p.id !== product.id && (p.series || "") === seriesKey)
    .slice(0, 3);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${BASE_URL}/${locale}` },
          { name: t("title"), url: `${BASE_URL}/${locale}/products` },
          { name: tr?.name || product.slug, url: `${BASE_URL}/${locale}/products/${product.slug}` },
        ]}
      />
      <ProductJsonLd
        name={tr?.name || product.slug}
        description={tr?.description || ""}
        applications={tr?.applications || []}
        slug={product.slug}
        locale={locale}
        specs={specs}
        series={product.series}
        image={images[0]?.url}
      />
      {faq.length > 0 && <FAQJsonLd items={faq} locale={locale} />}
      {related.length > 0 && (
        <ItemListJsonLd
          name={t("related")}
          locale={locale}
          items={related.map((p) => ({
            name: pickTranslation(p.translations, locale)?.name || p.slug,
            url: `${BASE_URL}/${locale}/products/${p.slug}`,
          }))}
        />
      )}

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
 loading="lazy" decoding="async" />
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
                        alt={img.alt || `${tr?.name || product.slug} — application image ${img.id}`}
                        className="w-full h-full object-cover"
 loading="lazy" decoding="async" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              {seriesTitle && (
                <p className="text-sage-700 font-medium uppercase tracking-wider text-sm mb-2">
                  {t("seriesLabel")}: {seriesTitle}
                </p>
              )}
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

              <h2 className="font-semibold text-earth-900 mb-2">{t("overview")}</h2>
              <p className="text-earth-700 leading-relaxed mb-8">{tr?.description || ""}</p>

              {specs.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-semibold text-earth-900 mb-3">{t("specs")}</h2>
                  <div className="overflow-x-auto rounded-xl border border-earth-100">
                    <table className="w-full text-sm">
                      <tbody>
                        {specs.map((s, i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-earth-50" : "bg-white"}>
                            <th scope="row" className="px-4 py-2.5 text-left font-medium text-earth-600 w-2/5">
                              {s.label}
                            </th>
                            <td className="px-4 py-2.5 text-earth-800">{s.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

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

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center gap-2 bg-sage-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-sage-700 transition-colors"
                >
                  {t("inquire")}
                </Link>
                <Link
                  href={`/${locale}/b2b/samples`}
                  className="inline-flex items-center gap-2 border border-sage-300 text-sage-700 px-6 py-3 rounded-lg font-medium hover:bg-sage-50 transition-colors"
                >
                  {t("requestSample")}
                </Link>
                <Link
                  href={`/${locale}/regulations`}
                  className="inline-flex items-center gap-2 bg-earth-100 text-earth-700 px-6 py-3 rounded-lg font-medium hover:bg-earth-200 transition-colors"
                >
                  {t("requestCoa")}
                </Link>
                <Link
                  href={`/${locale}/products`}
                  className="inline-flex items-center gap-2 text-earth-600 px-2 py-3 font-medium hover:text-earth-900 transition-colors"
                >
                  {t("backToList")}
                </Link>
              </div>
            </div>
          </div>

          {faq.length > 0 && (
            <section className="mt-16 max-w-3xl">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-earth-900 mb-6">
                {t("faq")}
              </h2>
              <div className="space-y-3">
                {faq.map((item) => (
                  <details key={item.q} className="group bg-earth-50 rounded-xl border border-earth-100 overflow-hidden">
                    <summary className="cursor-pointer list-none px-5 py-4 font-medium text-earth-900 flex items-center justify-between gap-4">
                      <span>{item.q}</span>
                      <svg className="w-5 h-5 text-sage-600 shrink-0 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-5 pb-4 text-earth-700 leading-relaxed">{item.a}</div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-earth-900 mb-6">
                {t("related")}
              </h2>
              <div className="grid sm:grid-cols-3 gap-6">
                {related.map((p) => {
                  const rtr = pickTranslation(p.translations, locale);
                  return (
                    <Link
                      key={p.id}
                      href={`/${locale}/products/${p.slug}`}
                      className="group block bg-earth-50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div
                        className="aspect-[4/3] flex items-center justify-center overflow-hidden"
                        style={{
                          background: p.color
                            ? `linear-gradient(135deg, ${p.color}22, ${p.color}55)`
                            : "linear-gradient(135deg, #f5f0e6, #e9e0cc)",
                        }}
                      >
                        <div className="w-16 h-16 rounded-full shadow-inner" style={{ backgroundColor: p.color || "#bbb" }} />
                      </div>
                      <div className="p-5">
                        <h3 className="font-serif text-lg font-semibold text-earth-900 mb-1 group-hover:text-sage-700 transition-colors">
                          {rtr?.name || p.slug}
                        </h3>
                        <p className="text-sm text-earth-600 line-clamp-2">{rtr?.description || ""}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
