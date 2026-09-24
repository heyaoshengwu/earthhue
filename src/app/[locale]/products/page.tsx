import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { listProducts, listProductImages } from "@/lib/products";
import { getDb } from "@/lib/db";
import { pickTranslation } from "@/lib/i18n";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  const titles: Record<string, string> = {
    en: "Products - Ready-to-Use Natural Pigment Formulations | EarthHue",
    zh: "产品中心 - 即用型天然色素配方 | EarthHue",
    ja: "製品 - 即使用天然色素処方 | EarthHue",
    ko: "제품 - 바로 사용 가능한 천연 색소 제형 | EarthHue",
    es: "Productos - Formulaciones de Pigmentos Naturales Listas para Usar | EarthHue",
    fr: "Produits - Formulations de Pigments Naturels Prêtes à l'Emploi | EarthHue",
    de: "Produkte - Gebrauchsfertige Naturpigment-Formulierungen | EarthHue",
  };
  return {
    title: titles[locale] || t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: `https://earthhue.net/${locale}/products`,
      languages: Object.fromEntries(
        ["en", "zh", "ja", "ko", "es", "fr", "de"].map((l) => [l, `https://earthhue.net/${l}/products`])
      ),
    },
  };
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("products");
  const products = listProducts({ onlyPublished: true });
  const db = getDb();
  const firstImageStmt = db.prepare(
    "SELECT url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC LIMIT 1"
  );

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `https://earthhue.net/${locale}` },
          { name: t("title"), url: `https://earthhue.net/${locale}/products` },
        ]}
      />

      <div className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-earth-900 mb-4">
              {t("title")}
            </h1>
            <p className="text-earth-600 max-w-2xl mx-auto">{t("subtitle")}</p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 text-earth-500">
              {t("empty") || "No products yet."}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => {
                const tr = pickTranslation(p.translations, locale);
                const firstImage = firstImageStmt.get(p.id) as { url: string } | undefined;
                return (
                  <Link
                    key={p.id}
                    href={`/${locale}/products/${p.slug}`}
                    className="group block bg-white rounded-2xl border border-earth-100 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div
                      className="aspect-[4/3] flex items-center justify-center relative overflow-hidden"
                      style={{
                        background: p.color
                          ? `linear-gradient(135deg, ${p.color}25, ${p.color}50)`
                          : "linear-gradient(135deg, #f5f0e6, #e9e0cc)",
                      }}
                    >
                      {firstImage ? (
                        <img
                          src={firstImage.url}
                          alt={tr?.name || p.slug}
                          className="w-full h-full object-cover"
                        />
                      ) : p.color ? (
                        <div
                          className="w-24 h-24 rounded-full shadow-inner"
                          style={{ backgroundColor: p.color }}
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-earth-200" />
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-xl font-semibold text-earth-900 mb-2 group-hover:text-sage-700 transition-colors">
                        {tr?.name || p.slug}
                      </h3>
                      <p className="text-sm text-earth-600 line-clamp-2 mb-3">
                        {tr?.description || ""}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {p.base && (
                          <span className="px-2 py-0.5 bg-earth-100 text-earth-600 rounded">
                            {p.base}
                          </span>
                        )}
                        {p.form && (
                          <span className="px-2 py-0.5 bg-sage-50 text-sage-700 rounded">
                            {p.form}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-16 bg-earth-50 rounded-2xl p-8 text-center">
            <h2 className="font-serif text-2xl font-bold text-earth-900 mb-2">
              {t("custom.title")}
            </h2>
            <p className="text-earth-600 mb-6 max-w-2xl mx-auto">{t("custom.desc")}</p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-sage-600 text-white px-6 py-3 rounded-full font-medium hover:bg-sage-700 transition-colors"
            >
              {t("custom.button")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}