import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { listArticles } from "@/lib/articles";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { pickTranslation } from "@/lib/i18n";
import { localeAlternates } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "articles" });
  const titles: Record<string, string> = {
    en: "Articles & Insights",
    zh: "文章与洞察",
    ja: "記事・洞察",
    ko: "기사 & 인사이트",
    es: "Artículos e Ideas",
    fr: "Articles & Perspectives",
    de: "Artikel & Einblicke",
  };
  return {
    alternates: localeAlternates(locale, "/articles"),
    title: titles[locale] || t("title"),
    description: t("subtitle"),

  };
}

export default async function ArticlesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("articles");
  const articles = listArticles({ onlyPublished: true });

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `https://earthhue.net/${locale}` },
          { name: t("title"), url: `https://earthhue.net/${locale}/articles` },
        ]}
      />
      <ItemListJsonLd
        locale={locale}
        name={t("title")}
        items={articles.map((a) => {
          const tr = pickTranslation(a.translations, locale);
          return {
            name: tr?.title || a.slug,
            url: `https://earthhue.net/${locale}/articles/${a.slug}`,
          };
        })}
      />

      <div className="section-padding">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-earth-900 mb-4">
              {t("title")}
            </h1>
            <p className="text-earth-600 max-w-2xl mx-auto">{t("subtitle")}</p>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-16 text-earth-500">{t("empty")}</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {articles.map((a) => {
                const tr = pickTranslation(a.translations, locale);
                return (
                  <Link
                    key={a.id}
                    href={`/${locale}/articles/${a.slug}`}
                    className="group block bg-white rounded-2xl border border-earth-100 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {a.cover_image && (
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={a.cover_image}
                          alt={tr?.title || a.slug}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-serif text-xl font-semibold text-earth-900 mb-2 group-hover:text-sage-700 transition-colors">
                        {tr?.title || a.slug}
                      </h3>
                      {tr?.excerpt && (
                        <p className="text-sm text-earth-600 line-clamp-3 mb-3">
                          {tr.excerpt}
                        </p>
                      )}
                      <div className="text-xs text-earth-500">
                        {new Date(a.created_at).toLocaleDateString(locale)}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}