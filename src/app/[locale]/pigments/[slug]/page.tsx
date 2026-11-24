import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { pigments, type Pigment } from "@/content/pigments/data";
import { pigmentContent } from "@/content/pigments/content";
import { BreadcrumbJsonLd, FAQJsonLd, PigmentJsonLd } from "@/components/JsonLd";
import { listProducts } from "@/lib/products";
import { pickTranslation } from "@/lib/i18n";
import { BASE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

/**
 * One page per pigment.
 *
 * The catalogue used to be a single page with 24 anchors on it. Answer engines
 * match on URLs, not on fragments, so a buyer asking "E163 anthocyanin pH
 * stability" had nothing to land on. Every pigment now has its own address
 * with the identifiers, the four regulatory markets and the questions a buyer
 * asks in the same place.
 *
 * The pages are authored in English for now. The other locales keep the
 * catalogue index and link across, and the translated editions follow the same
 * shape once the prose exists.
 */

/** Labels the page needs that the shared message catalogue does not carry yet. */
const LABELS = {
  source: "Source",
  cas: "CAS Number",
  einecs: "EINECS Number",
  category: "Category",
  formulations: "Formulations",
  sameCas: "Other routes with the same CAS number",
  backToPigments: "Back to all pigments",
  relatedProducts: "Available as",
  specTable: "Specifications",
  categoryNames: {
    plant: "Plant-based",
    mineral: "Mineral",
    microbial: "Microbial / fermentation",
  },
};

/** The catalogue product that carries each pigment, where there is one. */
const PRODUCT_LINKS: Record<string, string[]> = {
  curcumin: ["eh-curcumin-10"],
  "beet-red": ["eh-beet-20"],
  chlorophyll: ["eh-chlorophyll-40"],
  anthocyanin: ["eh-anthocyanin-30"],
  carotenoid: ["eh-betacarotene-ferment-140", "eh-lycopene-ferment-130"],
  "lutein-plant": ["eh-lutein-marigold-121"],
  astaxanthin: ["eh-astaxanthin-100"],
  "astaxanthin-synthetic-biological": ["eh-astaxanthin-yeast-110"],
  "beta-carotene-fermentation": ["eh-betacarotene-ferment-140"],
  "lutein-fermentation": ["eh-lutein-ferment-120"],
  phycocyanin: ["eh-phycocyanin-140"],
  "spirulina-blue": ["eh-phycocyanin-140"],
};

function getPigment(slug: string): Pigment | undefined {
  return pigments.find((p) => p.id === slug);
}

/** The pigments that carry the same CAS number, which is where the real question lies. */
function sameCasPeers(pigment: Pigment): Pigment[] {
  return pigments.filter(
    (p) => p.id !== pigment.id && p.casNumber === pigment.casNumber
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const pigment = getPigment(slug);
  if (!pigment || locale !== "en") return {};

  const content = pigmentContent[pigment.id];
  const title = `${pigment.name} — Natural ${LABELS.categoryNames[pigment.category].toLowerCase()} Colour | CAS ${pigment.casNumber}`;
  const description = content?.answer.slice(0, 175) || pigment.description;
  const canonical = `${BASE_URL}/en/pigments/${pigment.id}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      // Only the English edition exists so far. Advertising the other locales
      // here would point at pages that do not exist.
      languages: { en: canonical },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      locale,
      type: "website",
    },
  };
}

export default async function PigmentDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  // The pigment was published under a misspelled slug. The address is a
  // permanent asset, so the old one redirects rather than 404s.
  if (slug === "arrankin-red") permanentRedirect(`/${locale}/pigments/arpink-red`);

  const pigment = getPigment(slug);
  const content = pigment ? pigmentContent[pigment.id] : undefined;

  // The translated editions do not exist yet. A 404 is the honest answer; a
  // page that silently shows English under a translated URL is not.
  if (!pigment || !content || locale !== "en") notFound();

  const t = await getTranslations("pigments");
  const tp = await getTranslations("products");
  const peers = sameCasPeers(pigment);
  const productSlugs = PRODUCT_LINKS[pigment.id] || [];
  const products = listProducts({ onlyPublished: true }).filter((p) =>
    productSlugs.includes(p.slug)
  );

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${BASE_URL}/${locale}` },
          { name: t("title"), url: `${BASE_URL}/${locale}/pigments` },
          { name: pigment.name, url: `${BASE_URL}/${locale}/pigments/${pigment.id}` },
        ]}
      />
      <PigmentJsonLd
        name={pigment.name}
        description={content.answer}
        slug={pigment.id}
        category={pigment.category}
        casNumber={pigment.casNumber}
        einecsNumber={pigment.einecsNumber}
        source={pigment.source}
        formulations={pigment.formulations}
        applications={pigment.applications}
        regulations={pigment.regulations}
      />
      {content.faq.length > 0 && <FAQJsonLd items={content.faq} locale={locale} />}

      <div className="section-padding">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-earth-500 mb-6" aria-label="Breadcrumb">
            <Link href={`/${locale}`} className="hover:text-sage-700">
              {tp("breadcrumbHome")}
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/${locale}/pigments`} className="hover:text-sage-700">
              {t("title")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-earth-700">{pigment.name}</span>
          </nav>

          <header className="mb-10">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 bg-sage-50 text-sage-700 rounded-full text-sm">
                {LABELS.categoryNames[pigment.category]}
              </span>
              {pigment.formulations.map((f) => (
                <span
                  key={f}
                  className="px-3 py-1 bg-earth-100 text-earth-700 rounded-full text-sm"
                >
                  {f}
                </span>
              ))}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-earth-900 mb-4">
              {pigment.name}
            </h1>
            <p className="text-lg text-earth-700 leading-relaxed max-w-3xl">
              {content.answer}
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <section>
              <h2 className="font-semibold text-earth-900 mb-3">
                {LABELS.specTable}
              </h2>
              <div className="overflow-x-auto rounded-xl border border-earth-100">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      [LABELS.cas, pigment.casNumber],
                      [LABELS.einecs, pigment.einecsNumber],
                      [LABELS.source, pigment.source],
                      [LABELS.category, LABELS.categoryNames[pigment.category]],
                      [LABELS.formulations, pigment.formulations.join(", ")],
                    ].map(([label, value], i) => (
                      <tr key={label} className={i % 2 === 0 ? "bg-earth-50" : "bg-white"}>
                        <th
                          scope="row"
                          className="px-4 py-2.5 text-left font-medium text-earth-600 w-2/5"
                        >
                          {label}
                        </th>
                        <td className="px-4 py-2.5 text-earth-800">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="font-semibold text-earth-900 mb-3">
                {t("regulatoryStatus")}
              </h2>
              <div className="overflow-x-auto rounded-xl border border-earth-100">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      [t("regions.eu"), pigment.regulations.eu],
                      [t("regions.us"), pigment.regulations.us],
                      [t("regions.japan"), pigment.regulations.japan],
                      [t("regions.korea"), pigment.regulations.korea],
                    ].map(([label, value], i) => (
                      <tr key={label} className={i % 2 === 0 ? "bg-earth-50" : "bg-white"}>
                        <th
                          scope="row"
                          className="px-4 py-2.5 text-left font-medium text-earth-600 w-2/5"
                        >
                          {label}
                        </th>
                        <td className="px-4 py-2.5 text-earth-800">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {pigment.applications.length > 0 && (
            <section className="mb-12">
              <h2 className="font-semibold text-earth-900 mb-3">
                {tp("applications")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {pigment.applications.map((app) => (
                  <span
                    key={app}
                    className="px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-sm"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </section>
          )}

          {content.route && peers.length > 0 && (
            <section className="mb-12 bg-earth-50 rounded-2xl border border-earth-100 p-6">
              <h2 className="font-semibold text-earth-900 mb-3">{LABELS.sameCas}</h2>
              <p className="text-earth-700 leading-relaxed mb-4">{content.route}</p>
              <div className="flex flex-wrap gap-3">
                {peers.map((peer) => (
                  <Link
                    key={peer.id}
                    href={`/${locale}/pigments/${peer.id}`}
                    className="inline-flex items-center gap-2 bg-white border border-earth-200 text-earth-800 px-4 py-2 rounded-lg text-sm font-medium hover:border-sage-400 hover:text-sage-700 transition-colors"
                  >
                    {peer.name}
                    <span className="text-earth-500 text-xs">CAS {peer.casNumber}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {content.faq.length > 0 && (
            <section className="mb-12 max-w-3xl">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-earth-900 mb-6">
                {tp("faq")}
              </h2>
              <div className="space-y-3">
                {content.faq.map((item) => (
                  <details
                    key={item.q}
                    className="group bg-earth-50 rounded-xl border border-earth-100 overflow-hidden"
                  >
                    <summary className="cursor-pointer list-none px-5 py-4 font-medium text-earth-900 flex items-center justify-between gap-4">
                      <span>{item.q}</span>
                      <svg
                        className="w-5 h-5 text-sage-600 shrink-0 transition-transform group-open:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </summary>
                    <div className="px-5 pb-4 text-earth-700 leading-relaxed">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {products.length > 0 && (
            <section className="mb-12">
              <h2 className="font-semibold text-earth-900 mb-3">
                {LABELS.relatedProducts}
              </h2>
              <div className="flex flex-wrap gap-3">
                {products.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/${locale}/products/${p.slug}`}
                    className="inline-flex items-center gap-2 bg-white border border-earth-200 text-earth-800 px-4 py-2 rounded-lg text-sm font-medium hover:border-sage-400 hover:text-sage-700 transition-colors"
                  >
                    {pickTranslation(p.translations, locale)?.name || p.slug}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-sage-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-sage-700 transition-colors"
            >
              {tp("inquire")}
            </Link>
            <Link
              href={`/${locale}/b2b/samples`}
              className="inline-flex items-center gap-2 border border-sage-300 text-sage-700 px-6 py-3 rounded-lg font-medium hover:bg-sage-50 transition-colors"
            >
              {tp("requestSample")}
            </Link>
            <Link
              href={`/${locale}/regulations`}
              className="inline-flex items-center gap-2 bg-earth-100 text-earth-700 px-6 py-3 rounded-lg font-medium hover:bg-earth-200 transition-colors"
            >
              {tp("requestCoa")}
            </Link>
            <Link
              href={`/${locale}/pigments`}
              className="inline-flex items-center gap-2 text-earth-600 px-2 py-3 font-medium hover:text-earth-900 transition-colors"
            >
              {LABELS.backToPigments}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
