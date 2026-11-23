import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { localeAlternates, openGraphFor } from "@/lib/seo";
import { getArticleBySlug } from "@/lib/articles";
import { getProductBySlug } from "@/lib/products";
import { pickTranslation } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "c2c.stories" });
  return {
    alternates: localeAlternates(locale, "/c2c/stories"),
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: openGraphFor(locale, "/c2c/stories", t("metaTitle"), t("metaDescription")),
  };
}

/**
 * Every story is anchored to the pigment it is actually about: a photograph
 * from the product library, the product it was made with, and the long-form
 * guide that explains the colour science behind it. Before this the four
 * stories were plain text — no image, and no way through to the product or
 * to the article that explains the colour.
 */
const stories = [
  {
    key: "indigo",
    image: "/uploads/products/1790564543912-b9586e06edb3a186.jpg",
    product: "eh-phycocyanin-140",
    article: "only-natural-blue-colorant",
  },
  {
    key: "saffron",
    image: "/uploads/products/1790561152179-68e2d2a93e79c0ef.jpg",
    product: "eh-beet-20",
    article: "synthetic-dye-phaseout-natural-alternatives",
  },
  {
    key: "beetroot",
    image: "/uploads/products/1790561149224-dfd331d92956e5ad.jpg",
    product: "eh-beet-20",
    article: "synthetic-dye-phaseout-natural-alternatives",
  },
  {
    key: "spirulina",
    image: "/uploads/products/1790564528670-23cf0b6dccff35e8.jpg",
    product: "eh-phycocyanin-140",
    article: "only-natural-blue-colorant",
  },
] as const;

export default async function StoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("c2c.stories");
  const tq = await getTranslations("home.quicklinks");

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

          <div className="space-y-16">
            {stories.map((story) => {
              const product = getProductBySlug(story.product);
              const article = getArticleBySlug(story.article);
              const productTr = product ? pickTranslation(product.translations, locale) : null;
              const articleTr = article ? pickTranslation(article.translations, locale) : null;
              const productName = productTr?.name || story.product;
              const storyTitle = t(`items.${story.key}.title`);

              return (
                <article
                  key={story.key}
                  className="grid md:grid-cols-[1fr_1.1fr] gap-6 md:gap-10 items-start"
                >
                  <Link
                    href={`/${locale}/products/${story.product}`}
                    className="block group rounded-xl overflow-hidden border border-earth-200 bg-earth-50"
                    aria-label={productName}
                  >
                    <div className="aspect-[16/9]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={story.image}
                        alt={`${storyTitle} — ${productName}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                  </Link>

                  <div>
                    <p className="text-sm text-sage-700 font-medium mb-2 uppercase tracking-wider">
                      {t(`items.${story.key}.tag`)}
                    </p>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-earth-900 mb-3">
                      {storyTitle}
                    </h2>
                    <p className="text-earth-700 leading-relaxed mb-3">
                      {t(`items.${story.key}.lede`)}
                    </p>
                    <p className="text-earth-600 text-sm mb-6">
                      {t(`items.${story.key}.body`)}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {article && article.published ? (
                        <Link
                          href={`/${locale}/articles/${story.article}`}
                          className="inline-flex items-center gap-2 bg-sage-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-sage-700 transition-colors"
                        >
                          {tq("articles")}: {articleTr?.title || story.article} →
                        </Link>
                      ) : null}
                      <Link
                        href={`/${locale}/products/${story.product}`}
                        className="inline-flex items-center gap-2 bg-white text-sage-700 border border-sage-300 px-5 py-3 rounded-lg font-medium hover:bg-sage-50 transition-colors"
                      >
                        {tq("products")}: {productName} →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
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
