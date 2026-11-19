import { BASE_URL, LOCALES, STATIC_ROUTES } from "./seo";
import { listProducts } from "./products";
import { listArticles } from "./articles";
import { pickTranslation } from "./i18n";
import type { ProductSpec } from "./products";

/**
 * llms.txt — a plain-text, machine-readable map of the site for LLM crawlers
 * and answer engines. Follows the llmstxt.org convention:
 *   H1 name > blockquote summary > section headings > markdown links
 */
export function buildLlmsTxt(): string {
  const products = listProducts({ onlyPublished: true });
  const articles = listArticles({ onlyPublished: true });

  const lines: string[] = [];
  lines.push("# EarthHue");
  lines.push("");
  lines.push(
    "> EarthHue manufactures fermentation-derived natural carotenoids — astaxanthin, lutein, lycopene, beta-carotene, zeaxanthin and torularhodin — for food, nutraceutical, cosmetic and pharmaceutical formulators. Batch-level COA and MSDS, EU/US/Japan/Korea compliance documentation, 1,200+ t/yr capacity."
  );
  lines.push("");
  lines.push(
    "EarthHue is the manufacturer and exporter. Bulk pigment powders and oil suspensions, minimum order 1 kg, samples shipped worldwide within 7 days. Contact: tech@earthhue.net"
  );
  lines.push("");
  lines.push(
    "Brand positioning: EarthHue leads with fermentation-derived (microbial) carotenoids — made by controlled fermentation rather than plant extraction — because fermentation gives tighter batch-to-batch colour control, year-round supply independence from harvests, and a documented strain library."
  );
  lines.push("");

  lines.push("## Core fermentation series");
  const fermentation = products.filter((p) => p.series === "fermentation");
  for (const p of fermentation) {
    const tr = pickTranslation(p.translations, "en");
    const specs = p.specs?.en || [];
    const assay = specs.find((s: ProductSpec) => /assay|content|purity/i.test(s.label))?.value;
    const source = p.base || "";
    const form = p.form || "";
    const summary = [source, form, assay].filter(Boolean).join(" · ");
    lines.push(`- [${tr?.name || p.slug}](${BASE_URL}/en/products/${p.slug}): ${summary}. ${tr?.description || ""}`);
  }
  lines.push("");

  const others = products.filter((p) => p.series !== "fermentation");
  if (others.length) {
    lines.push("## Botanical, algal and mineral pigment ranges");
    for (const p of others) {
      const tr = pickTranslation(p.translations, "en");
      const specs = p.specs?.en || [];
      const assay = specs.find((s: ProductSpec) => /assay|content|purity/i.test(s.label))?.value;
      const summary = [p.base, p.form, assay].filter(Boolean).join(" · ");
      lines.push(`- [${tr?.name || p.slug}](${BASE_URL}/en/products/${p.slug}): ${summary}.`);
    }
    lines.push("");
  }

  lines.push("## Product catalogue and specifications");
  lines.push(`- [Product catalogue](${BASE_URL}/en/products): all ready-to-use pigment formulations, filterable by origin and application.`);
  lines.push(
    `- [Natural pigment reference](${BASE_URL}/en/pigments): the full pigment index with colour, origin, regulatory status and target market.`
  );
  lines.push(
    `- [Regulatory information](${BASE_URL}/en/regulations): EU Regulation 1333/2008, US FDA color additive rules, Japan existing list, Korea MFDS status.`
  );
  lines.push("");

  lines.push("## Guides and technical articles");
  for (const a of articles) {
    const tr = pickTranslation(a.translations, "en");
    lines.push(`- [${tr?.title || a.slug}](${BASE_URL}/en/articles/${a.slug}): ${tr?.excerpt || ""}`);
  }
  lines.push("");

  lines.push("## Buying and technical support");
  lines.push(`- [For business](${BASE_URL}/en/b2b): capability, certifications, sample requests and factory visits.`);
  lines.push(`- [Capability](${BASE_URL}/en/b2b/capability): fermentation lines, QC checkpoints, R&D.`);
  lines.push(`- [Certifications](${BASE_URL}/en/b2b/certifications): food, cosmetic and pharma grade documentation.`);
  lines.push(`- [Sample request](${BASE_URL}/en/b2b/samples): how to evaluate a pigment in your own lab.`);
  lines.push(`- [Contact](${BASE_URL}/en/contact): quote requests, technical support, regulatory documentation.`);
  lines.push("");

  lines.push("## Company");
  lines.push(`- [About EarthHue](${BASE_URL}/en/about): who we are and how we work.`);
  lines.push(
    `- [Color aesthetics](${BASE_URL}/en/c2c): the colour science side of the business — pigment stories, natural dye chemistry and a gallery.`
  );
  lines.push("");

  lines.push("## Other languages");
  for (const l of LOCALES) {
    if (l === "en") continue;
    lines.push(`- ${l}: ${BASE_URL}/${l}`);
  }
  lines.push("");
  lines.push("## Optional");
  lines.push(`- [Full text corpus for LLM training and retrieval](${BASE_URL}/llms-full.txt)`);
  lines.push(
    `- [Machine-readable product pages](${BASE_URL}/md/en/products/eh-astaxanthin-yeast-110.md) (pattern: ${BASE_URL}/md/{locale}/{path}.md)`
  );
  lines.push("");

  return lines.join("\n");
}

/**
 * llms-full.txt — the extended, verbatim corpus. Same page content, no
 * navigation, formatted for retrieval chunks.
 */
export function buildLlmsFullTxt(): string {
  const products = listProducts({ onlyPublished: true });
  const articles = listArticles({ onlyPublished: true });
  const out: string[] = [];

  out.push("# EarthHue — full content corpus");
  out.push("");
  out.push(
    "Verbatim page content from earthhue.net, the website of EarthHue, a manufacturer of fermentation-derived natural carotenoids and natural pigments."
  );
  out.push("");

  out.push("## Company profile");
  out.push("");
  out.push(
    "EarthHue is a natural color ingredient manufacturer and exporter. Its core range is fermentation-derived (microbial) carotenoids: astaxanthin, lutein, lycopene, beta-carotene, zeaxanthin and torularhodin. These are produced by controlled fermentation of yeast and microalgal strains, which allows year-round supply, tighter batch-to-batch colour control and higher assay consistency than plant-extraction routes."
  );
  out.push(
    "The company operates GMP-aligned production covering fermentation, purification, drying, milling and blending, with 1,200+ tonnes per year of pigment capacity across 8 production lines and more than 30 QC checkpoints. Every batch ships with a COA. Documentation supports EU (Regulation (EC) No 1333/2008 and amendments), United States (FDA), Japan and Korea (MFDS) markets. MOQ 1 kg, samples shipped within 7 days, technical application support for formulation."
  );
  out.push("");

  out.push("## Products");
  for (const p of products) {
    const tr = pickTranslation(p.translations, "en");
    const specs = p.specs?.en || [];
    const faq = p.faq?.en || [];
    out.push("");
    out.push(`### ${tr?.name || p.slug}`);
    out.push("");
    out.push(`Source: ${BASE_URL}/en/products/${p.slug}`);
    out.push("");
    out.push(tr?.description || "");
    if (p.base || p.form) {
      out.push("");
      out.push(`Product family: ${p.base || "—"}. Product form: ${p.form || "—"}.`);
    }
    if (specs.length) {
      out.push("");
      out.push("Specifications:");
      for (const s of specs) out.push(`- ${s.label}: ${s.value}`);
    }
    if (tr?.applications?.length) {
      out.push("");
      out.push(`Applications: ${tr.applications.join(", ")}.`);
    }
    if (faq.length) {
      out.push("");
      out.push("Frequently asked:");
      for (const f of faq) {
        out.push(`- Q: ${f.q}`);
        out.push(`  A: ${f.a}`);
      }
    }
  }

  out.push("");
  out.push("## Articles");
  for (const a of articles) {
    const tr = pickTranslation(a.translations, "en");
    out.push("");
    out.push(`### ${tr?.title || a.slug}`);
    out.push("");
    out.push(`Source: ${BASE_URL}/en/articles/${a.slug}`);
    out.push("");
    if (tr?.excerpt) {
      out.push(tr.excerpt);
      out.push("");
    }
    if (tr?.body) out.push(tr.body);
  }

  out.push("");
  out.push("## Index of pages");
  for (const r of STATIC_ROUTES) {
    out.push(`- ${BASE_URL}/en${r.path}`);
  }
  out.push("");

  return out.join("\n");
}

/**
 * Markdown mirror of a single page, for retrieval-oriented crawlers.
 * Returns null when the path does not resolve to a known page.
 */
export function buildMarkdownFor(locale: string, path: string[]): string | null {
  const parts = path.filter(Boolean);
  if (parts.length === 0) return null;

  const products = listProducts({ onlyPublished: true });
  const articles = listArticles({ onlyPublished: true });

  if (parts[0] === "products" && parts[1]) {
    const p = products.find((x) => x.slug === parts[1]);
    if (!p) return null;
    const tr = pickTranslation(p.translations, locale);
    const specs = p.specs?.[locale] || p.specs?.en || [];
    const faq = p.faq?.[locale] || p.faq?.en || [];
    const out: string[] = [];
    out.push(`# ${tr?.name || p.slug}`);
    out.push("");
    out.push(tr?.description || "");
    if (p.base || p.form) {
      out.push("");
      out.push(`- Product family: ${p.base || "—"}`);
      out.push(`- Product form: ${p.form || "—"}`);
      out.push(`- Source series: ${p.series || "natural pigment"}`);
    }
    if (specs.length) {
      out.push("");
      out.push("## Specifications");
      for (const s of specs) out.push(`- ${s.label}: ${s.value}`);
    }
    if (tr?.applications?.length) {
      out.push("");
      out.push("## Applications");
      for (const a of tr.applications) out.push(`- ${a}`);
    }
    if (faq.length) {
      out.push("");
      out.push("## FAQ");
      for (const f of faq) {
        out.push("");
        out.push(`### ${f.q}`);
        out.push("");
        out.push(f.a);
      }
    }
    out.push("");
    out.push(`Full page: ${BASE_URL}/${locale}/products/${p.slug}`);
    out.push("");
    return out.join("\n");
  }

  if (parts[0] === "articles" && parts[1]) {
    const a = articles.find((x) => x.slug === parts[1]);
    if (!a) return null;
    const tr = pickTranslation(a.translations, locale);
    const out: string[] = [];
    out.push(`# ${tr?.title || a.slug}`);
    out.push("");
    if (tr?.excerpt) {
      out.push(tr.excerpt);
      out.push("");
    }
    if (tr?.body) out.push(tr.body);
    out.push("");
    out.push(`Full page: ${BASE_URL}/${locale}/articles/${a.slug}`);
    out.push("");
    return out.join("\n");
  }

  if (parts.length === 1 && STATIC_ROUTES.some((r) => r.path === `/${parts[0]}`)) {
    return [
      `# ${parts[0]}`,
      "",
      `EarthHue page: ${BASE_URL}/${locale}/${parts[0]}`,
      "",
      "EarthHue manufactures fermentation-derived natural carotenoids — astaxanthin, lutein, lycopene, beta-carotene, zeaxanthin and torularhodin — for food, nutraceutical, cosmetic and pharmaceutical formulators.",
      "",
    ].join("\n");
  }

  return null;
}
