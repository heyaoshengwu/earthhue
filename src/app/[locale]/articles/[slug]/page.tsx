import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { getArticleBySlug } from "@/lib/articles";
import { BreadcrumbJsonLd, ArticleJsonLd, FAQJsonLd } from "@/components/JsonLd";
import { Markdown } from "@/components/Markdown";
import { pickTranslation } from "@/lib/i18n";
import { localeAlternates, BASE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

/**
 * Pull a "## Frequently asked questions" section out of the article body so it
 * can be rendered as an accordion and published as FAQPage structured data.
 *
 * The section heading is matched in every locale we publish, and a question is
 * recognised as a plain question heading ("### Is it heat stable?"), in the
 * explicit form ("### Q: Is it heat stable?"), or as a bold line on its own
 * ("**Is it heat stable?**"). All three forms exist across the article
 * library, so all three have to be understood here.
 */
const FAQ_HEADING =
  /^#{2,3}\s*(?:frequently asked questions|faq|常见问题|よくある質問|자주 묻는 질문|자주묻는 질문|preguntas frecuentes|questions? fréquentes|häufige fragen)\s*$/i;

/** Heading above the rendered FAQ accordion, per locale. */
const FAQ_SECTION_TITLES: Record<string, string> = {
  en: "Frequently asked questions",
  zh: "常见问题",
  ja: "よくある質問",
  ko: "자주 묻는 질문",
  es: "Preguntas frecuentes",
  fr: "Questions fréquentes",
  de: "Häufige Fragen",
};

function extractFaq(body: string): { q: string; a: string }[] {
  if (!body) return [];
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const start = lines.findIndex((l) => FAQ_HEADING.test(l.trim()));
  if (start < 0) return [];

  const items: { q: string; a: string }[] = [];
  let current: { q: string; a: string } | null = null;

  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (/^#{1,2}\s+/.test(line.trim())) break; // next H2 ends the section
    const q =
      line.match(/^\s*(?:\*\*|###\s+)?\s*Q[:.\s]\s*(.+?)\s*$/i) ||
      line.match(/^\s*[-*]\s*\*\*(.+?)\*\*\s*$/) ||
      line.match(/^#{2,4}\s+(.+?[?？])\s*$/) ||
      line.match(/^\s*\*\*(.+?[?？])\*\*\s*$/);
    if (q) {
      if (current) items.push(current);
      current = { q: q[1].replace(/\*\*/g, "").trim(), a: "" };
      continue;
    }
    if (current && line.trim()) {
      current.a = current.a ? `${current.a} ${line.trim()}` : line.trim();
    }
  }
  if (current) items.push(current);

  return items.filter((it) => it.q && it.a.length > 10);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  const tr = pickTranslation(article.translations, locale);
  const title = tr?.title || article.slug;
  const description = tr?.excerpt || (tr?.body || "").slice(0, 160);
  const canonical = `${BASE_URL}/${locale}/articles/${article.slug}`;

  return {
    title,
    description,
    alternates: localeAlternates(locale, `/articles/${article.slug}`),
    openGraph: {
      title,
      description,
      url: canonical,
      locale,
      type: "article",
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

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || !article.published) notFound();
  const t = await getTranslations("articles");
  const tr = pickTranslation(article.translations, locale);
  const body = tr?.body || "";
  const faq = extractFaq(body);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${BASE_URL}/${locale}` },
          { name: t("title"), url: `${BASE_URL}/${locale}/articles` },
          { name: tr?.title || article.slug, url: `${BASE_URL}/${locale}/articles/${article.slug}` },
        ]}
      />
      <ArticleJsonLd
        title={tr?.title || article.slug}
        description={tr?.excerpt || ""}
        slug={article.slug}
        locale={locale}
        image={article.cover_image}
        datePublished={article.created_at}
        dateModified={article.updated_at}
      />
      {faq.length > 0 && <FAQJsonLd items={faq} locale={locale} />}

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
            {tr?.excerpt && (
              <p className="text-lg text-earth-700 leading-relaxed mb-4">{tr.excerpt}</p>
            )}
            <time className="text-sm text-earth-500" dateTime={article.created_at}>
              {new Date(article.created_at).toLocaleDateString(locale)}
            </time>
          </header>

          {article.cover_image && (
            <div className="aspect-[16/9] mb-8 rounded-2xl overflow-hidden">
              <img
                src={article.cover_image}
                alt={tr?.title || article.slug}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <Markdown content={body} />

          {faq.length > 0 && (
            <section className="mt-12">
              <h2 className="font-serif text-2xl font-bold text-earth-900 mb-6">
                {FAQ_SECTION_TITLES[locale] || FAQ_SECTION_TITLES.en}
              </h2>
              <div className="space-y-3">
                {faq.map((item) => (
                  <details
                    key={item.q}
                    className="group bg-earth-50 rounded-xl border border-earth-100 overflow-hidden"
                  >
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

          <div className="mt-12 bg-sage-50 border border-sage-200 rounded-2xl p-8 text-center">
            <h2 className="font-serif text-2xl font-bold text-earth-900 mb-3">
              {t("cta.title")}
            </h2>
            <p className="text-earth-700 max-w-xl mx-auto mb-6">{t("cta.desc")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/b2b/samples`}
                className="inline-flex items-center gap-2 bg-sage-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-sage-700 transition-colors"
              >
                {t("cta.sample")}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 bg-white text-sage-700 border border-sage-300 px-6 py-3 rounded-lg font-medium hover:bg-sage-50 transition-colors"
              >
                {t("cta.contact")}
              </Link>
            </div>
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
