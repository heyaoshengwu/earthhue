import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { getArticleBySlug } from "@/lib/articles";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  const tr = article.translations[locale] || article.translations.en;
  return {
    title: `${tr?.title || article.slug} | EarthHue`,
    description: tr?.excerpt || tr?.body?.slice(0, 160) || "",
    alternates: {
      canonical: `https://earthhue.net/${locale}/articles/${article.slug}`,
    },
    openGraph: {
      title: tr?.title || article.slug,
      description: tr?.excerpt || "",
      url: `https://earthhue.net/${locale}/articles/${article.slug}`,
      locale,
      type: "article",
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || !article.published) notFound();
  const t = await getTranslations("articles");
  const tr =
    article.translations[locale] ||
    article.translations.en ||
    Object.values(article.translations)[0];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `https://earthhue.net/${locale}` },
          { name: t("title"), url: `https://earthhue.net/${locale}/articles` },
          { name: tr?.title || article.slug, url: `https://earthhue.net/${locale}/articles/${article.slug}` },
        ]}
      />

      <article className="section-padding">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-earth-500 mb-6" aria-label="Breadcrumb">
            <Link href={`/${locale}`} className="hover:text-sage-700">
              {t("breadcrumbHome")}
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/${locale}/articles`} className="hover:text-sage-700">
              {t("title")}
            </Link>
          </nav>

          <header className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-earth-900 mb-3">
              {tr?.title || article.slug}
            </h1>
            <time className="text-sm text-earth-500">
              {new Date(article.created_at).toLocaleDateString(locale)}
            </time>
          </header>

          {article.cover_image && (
            <div className="aspect-[16/9] mb-8 rounded-2xl overflow-hidden">
              <img
                src={article.cover_image}
                alt={tr?.title || article.slug}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-earth max-w-none">
            {tr?.excerpt && (
              <p className="text-lg text-earth-700 mb-6 leading-relaxed">{tr.excerpt}</p>
            )}
            {(tr?.body || "").split(/\n\n+/).map((para, i) => (
              <p key={i} className="text-earth-700 leading-relaxed mb-4">
                {para}
              </p>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-earth-200">
            <Link
              href={`/${locale}/articles`}
              className="text-sage-700 hover:text-sage-900 font-medium"
            >
              ← {t("backToList")}
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}