import { BASE_URL, LOCALES, STATIC_ROUTES } from "./seo";
import { listProducts } from "./products";
import { listArticles } from "./articles";
import { pickTranslation } from "./i18n";
import type { ProductSpec } from "./products";
import { pigments } from "@/content/pigments/data";
import type { Pigment } from "@/content/pigments/data";

/**
 * llms.txt — a plain-text, machine-readable map of the site for LLM crawlers
 * and answer engines. Follows the llmstxt.org convention:
 *   H1 name > blockquote summary > section headings > markdown links
 *
 * The map is built per locale. Product names, article titles, pigment names and
 * every internal link follow the requested language, so a crawler that fetches
 * /zh/llms.txt gets the Chinese entity names and the Chinese URLs rather than
 * a copy of the English one.
 *
 * Navigation bullets stay in English on purpose: they name the sections of
 * this machine-readable map, while the payload they point at — names, CAS and
 * EINECS numbers, approval status, URLs — is fully localized.
 */

const LOCALE_LABELS: Record<string, string> = {
  en: "English",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
};

type HeadingKey =
  | "fermentation"
  | "others"
  | "catalogue"
  | "pigments"
  | "guides"
  | "buying"
  | "company"
  | "languages"
  | "optional";

const HEADINGS: Record<string, Record<HeadingKey, string>> = {
  en: {
    fermentation: "Core fermentation series",
    others: "Botanical, algal and mineral pigment ranges",
    catalogue: "Product catalogue and specifications",
    pigments: "Pigment and regulatory index",
    guides: "Guides and technical articles",
    buying: "Buying and technical support",
    company: "Company",
    languages: "Other languages",
    optional: "Optional",
  },
  zh: {
    fermentation: "发酵法核心系列",
    others: "植物源、藻类与矿物源色素",
    catalogue: "产品目录与规格",
    pigments: "色素与法规索引",
    guides: "指南与技术文章",
    buying: "采购与技术支持",
    company: "公司简介",
    languages: "其他语言",
    optional: "可选资源",
  },
  ja: {
    fermentation: "発酵由来コアシリーズ",
    others: "植物・藻類・鉱物由来の色素レンジ",
    catalogue: "製品カタログと仕様",
    pigments: "色素・法規インデックス",
    guides: "ガイドと技術記事",
    buying: "調達と技術サポート",
    company: "会社情報",
    languages: "その他の言語",
    optional: "オプション",
  },
  ko: {
    fermentation: "발효 유래 핵심 시리즈",
    others: "식물·조류·광물 원료 색소",
    catalogue: "제품 카탈로그 및 사양",
    pigments: "색소 및 규제 인덱스",
    guides: "가이드 및 기술 자료",
    buying: "구매 및 기술 지원",
    company: "회사 정보",
    languages: "다른 언어",
    optional: "선택 자료",
  },
  es: {
    fermentation: "Serie principal de fermentación",
    others: "Gamas de pigmentos botánicos, algales y minerales",
    catalogue: "Catálogo de productos y especificaciones",
    pigments: "Índice de pigmentos y normativa",
    guides: "Guías y artículos técnicos",
    buying: "Compras y soporte técnico",
    company: "Empresa",
    languages: "Otros idiomas",
    optional: "Opcional",
  },
  fr: {
    fermentation: "Série de fermentation cœur de gamme",
    others: "Gammes de pigments botaniques, algaux et minéraux",
    catalogue: "Catalogue produits et spécifications",
    pigments: "Index des pigments et de la réglementation",
    guides: "Guides et articles techniques",
    buying: "Achats et support technique",
    company: "Entreprise",
    languages: "Autres langues",
    optional: "Optionnel",
  },
  de: {
    fermentation: "Kernserie Fermentation",
    others: "Pflanzliche, algenbasierte und mineralische Pigmentreihen",
    catalogue: "Produktkatalog und Spezifikationen",
    pigments: "Pigment- und Rechtsvorschriften-Index",
    guides: "Leitfäden und Fachartikel",
    buying: "Einkauf und technische Unterstützung",
    company: "Unternehmen",
    languages: "Weitere Sprachen",
    optional: "Optional",
  },
};

const SUMMARY: Record<string, string> = {
  en: "EarthHue manufactures fermentation-derived natural carotenoids — astaxanthin, lutein, lycopene, beta-carotene, zeaxanthin and torularhodin — for food, nutraceutical, cosmetic and pharmaceutical formulators. Batch-level COA and MSDS, EU/US/Japan/Korea compliance documentation, 1,200+ t/yr capacity.",
  zh: "EarthHue 生产发酵法天然类胡萝卜素 —— 虾青素、叶黄素、番茄红素、β-胡萝卜素、玉米黄素与圆红酵母红素 —— 供应食品、营养保健、化妆品与制药配方企业。批批出具 COA 与 MSDS，具备欧盟/美国/日本/韩国合规文件，年产能 1,200 吨以上。",
  ja: "EarthHue は発酵由来の天然カロテノイド —— アスタキサンチン、ルテイン、リコペン、β-カロテン、ゼアキサンチン、トルラロディン —— を製造し、食品・栄養化粧品・化粧品・医薬品のフォミュレーターに供給します。ロットごとの COA・MSDS、EU/米国/日本/韓国の法規対応書類、年産 1,200 トン以上。",
  ko: "EarthHue는 발효 유래 천연 카로티노이드 —— 아스타잔틴, 루틴, 라이코펜, 베타카로틴, 제아잔틴, 투룰로딘 —— 을 제조하여 식품·건강기능식품·화장품·제약 조달 회사에 공급합니다. 배치별 COA·MSDS, EU·미국·일본·한국 규제 문서, 연간 1,200톤 이상 생산능력.",
  es: "EarthHue fabrica carotenoides naturales obtenidos por fermentación — astaxantina, luteína, licopeno, beta-caroteno, zeaxantina y torularrodina — para formuladores de alimentos, nutracéuticos, cosméticos y farmacéuticos. COA y MSDS por lote, documentación de cumplimiento en la UE, EE. UU., Japón y Corea, capacidad de más de 1.200 t/año.",
  fr: "EarthHue fabrique des caroténoïdes naturels obtenus par fermentation — astaxanthine, lutéine, lycopène, bêta-carotène, zéaxanthine et torularhodine — pour les formulateurs alimentaires, nutraceutiques, cosmétiques et pharmaceutiques. COA et MSDS par lot, documentation réglementaire UE/États-Unis/Japon/Corée, capacité de plus de 1 200 t/an.",
  de: "EarthHue fertigt durch Fermentation gewonnene natürliche Carotinoide — Astaxanthin, Lutein, Lycopin, Beta-Carotin, Zeaxanthin und Torularhodin — für Lebensmittel-, Nutraceutical-, Kosmetik- und Pharmaformulierer. COA und MSDS je Charge, Konformitätsdokumentation für EU, USA, Japan und Korea, über 1.200 t/Jahr Kapazität.",
};

const INTRO: Record<string, string> = {
  en: "EarthHue is the manufacturer and exporter. Bulk pigment powders and oil suspensions, minimum order 1 kg, samples shipped worldwide within 7 days. Contact: tech@earthhue.net. Brand positioning: fermentation-derived (microbial) carotenoids give tighter batch-to-batch colour control, year-round supply independent of harvests, and a documented strain library.",
  zh: "EarthHue 是生产商与出口商。散装色素粉剂与油分散剂，起订量 1 公斤，样品全球 7 天内发出。联系：tech@earthhue.net。品牌定位：发酵法（微生物）类胡萝卜素带来更稳定的批次色差控制、不受收成季节影响的全年供应，以及可追溯的菌种库。",
  ja: "EarthHue は製造業者であり輸出業者です。粉体および油分散型の天然色素を供給します。最小注文数量 1 kg、サンプルは世界中に 7 日以内に発送します。連絡先：tech@earthhue.net。ブランドポジションは発酵由来（微生物）カロテノイド —— より厳密なバッチ間色調管理、収穫に依存しない年間供給、記録された菌株ライブラリー —— を軸にしています。",
  ko: "EarthHue는 제조업체이자 수출업체입니다. 벌크 분말 및 오일 분산형 제품, 최소 주문 1kg, 샘플은 전 세계 7일 이내 발송. 문의: tech@earthhue.net. 핵심 포지셔닝은 발효 유래(미생물) 카로티노이드 — 더 엄격한 배치 간 색상 관리, 수확에 의존하지 않는 연간 공급, 기록된 균주 라이브러리 — 입니다.",
  es: "EarthHue es el fabricante y el exportador. Polvos de pigmento a granel y suspensiones oleosas, pedido mínimo 1 kg, muestras enviadas a todo el mundo en 7 días. Contacto: tech@earthhue.net. Posicionamiento de marca: los carotenoides de fermentación dan un control de color entre lotes más estable, suministro anual independiente de las cosechas y una biblioteca de cepas documentada.",
  fr: "EarthHue est le fabricant et l'exportateur. Poudres de pigments en vrac et suspensions huileuses, commande minimum 1 kg, échantillons expédiés dans le monde entier sous 7 jours. Contact : tech@earthhue.net. Positionnement : les caroténoïdes de fermentation offrent un contrôle de couleur entre lots plus serré, un approvisionnement annuel indépendant des récoltes et une banque de souches documentée.",
  de: "EarthHue ist Hersteller und Exporteur. Pulverförmige Pigmente im Großhandel und Öl-Suspensionen, Mindestbestellmenge 1 kg, Muster weltweit innerhalb von 7 Tagen. Kontakt: tech@earthhue.net. Positionierung: Fermentations-Carotinoide liefern eine engere Chargenkontrolle der Farbe, eine ganzjährige Lieferung unabhängig von der Ernte und eine dokumentierte Stammbibliothek.",
};

/** Localized pigment name — only zh/ja/ko carry a translation in the data file. */
function pigmentName(p: Pigment, locale: string): string {
  if (locale === "zh") return p.nameZh || p.name;
  if (locale === "ja") return p.nameJa || p.name;
  if (locale === "ko") return p.nameKo || p.name;
  return p.name;
}

/**
 * The first complete sentence of a markdown body, ignoring headings.
 * Used as a fallback when a stored excerpt cannot be repaired on its own.
 */
function firstSentence(body: string): string {
  if (!body) return "";
  const text = body
    .replace(/```[\s\S]*?```/g, " ")
    .split(/\n{2,}/)
    .map((para) => para.replace(/^#+\s.*$/gm, "").replace(/[*_`>#-]/g, " ").trim())
    .filter(Boolean)
    .join(" ");
  const m = text.match(/^[\s\S]*?[.!?。！？](?=\s|$)/);
  return (m ? m[0] : text.slice(0, 200)).trim();
}

/**
 * Repair an excerpt that was stored with a hard character cut.
 *
 * Several article excerpts were saved against a fixed 300-character limit that
 * landed in the middle of a word ("…listed un", "…for tomato-r"). A summary
 * that breaks mid-token is worse than a shorter, well-formed one for a
 * retrieval system, so the excerpt is cut back to its last complete sentence
 * and the body is used as a fallback when no boundary is available.
 */
export function cleanSummary(excerpt?: string, body?: string): string {
  const raw = (excerpt || "").trim();
  if (!raw) return firstSentence(body || "");
  if (/[.!?。！？]["')\]】）]?$/.test(raw)) return raw;

  const boundaries: number[] = [];
  const re = /[.!?。！？](?=["')\]】）]?(?=\s|$))/g;
  let match = re.exec(raw);
  while (match) {
    boundaries.push(match.index + 1);
    match = re.exec(raw);
  }
  if (boundaries.length) {
    const cut = raw.slice(0, boundaries[boundaries.length - 1]).trim();
    if (cut.length >= 60) return cut;
  }

  // No sentence boundary at all: drop the partial trailing word.
  const words = raw.split(/\s+/);
  if (words.length > 8) return words.slice(0, -1).join(" ") + "…";
  return firstSentence(body || "");
}

/**
 * The pigment and regulatory index.
 *
 * This is the payload an answer engine actually needs: CAS and EINECS
 * identifiers, available formulations and the approval status in the EU, the
 * United States, Japan and Korea. It used to exist only inside the HTML of
 * /pigments and was completely absent from the llms.txt files, where a
 * search for "JSFA" or "EINECS" returned nothing.
 */
function pigmentIndexLines(locale: string): string[] {
  const out: string[] = [];
  out.push(
    "Every natural pigment EarthHue works with, with the identifiers a compliance or procurement team needs: CAS and EINECS numbers, source, available formulations, and the approval status in the EU, the United States, Japan and Korea."
  );
  out.push("");
  for (const p of pigments) {
    const parts = [
      `CAS ${p.casNumber || "—"}`,
      `EINECS ${p.einecsNumber || "—"}`,
      `source: ${p.source}`,
      `forms: ${p.formulations.join(", ")}`,
      `EU: ${p.regulations.eu}`,
      `US: ${p.regulations.us}`,
      `Japan: ${p.regulations.japan}`,
      `Korea: ${p.regulations.korea}`,
    ];
    out.push(`- ${pigmentName(p, locale)} (${p.id}) — ${parts.join(" · ")}`);
  }
  out.push("");
  return out;
}

function normalizeLocale(locale: string): string {
  return (LOCALES as readonly string[]).includes(locale) ? locale : "en";
}

/**
 * llms.txt — a plain-text, machine-readable map of the site for LLM crawlers
 * and answer engines. Follows the llmstxt.org convention:
 *   H1 name > blockquote summary > section headings > markdown links
 */
export function buildLlmsTxt(locale = "en"): string {
  const loc = normalizeLocale(locale);
  const products = listProducts({ onlyPublished: true });
  const articles = listArticles({ onlyPublished: true });
  const headings = HEADINGS[loc] || HEADINGS.en;

  const lines: string[] = [];
  lines.push("# EarthHue");
  lines.push("");
  lines.push(`> ${SUMMARY[loc] || SUMMARY.en}`);
  lines.push("");
  lines.push(INTRO[loc] || INTRO.en);
  lines.push("");

  lines.push(`## ${headings.fermentation}`);
  const fermentation = products.filter((p) => p.series === "fermentation");
  for (const p of fermentation) {
    const tr = pickTranslation(p.translations, loc);
    const specs = p.specs?.[loc] || p.specs?.en || [];
    const assay = specs.find((s: ProductSpec) => /assay|content|purity/i.test(s.label))?.value;
    const summary = [p.base, p.form, assay].filter(Boolean).join(" · ");
    lines.push(
      `- [${tr?.name || p.slug}](${BASE_URL}/${loc}/products/${p.slug}): ${summary}. ${tr?.description || ""}`
    );
  }
  lines.push("");

  const others = products.filter((p) => p.series !== "fermentation");
  if (others.length) {
    lines.push(`## ${headings.others}`);
    for (const p of others) {
      const tr = pickTranslation(p.translations, loc);
      const specs = p.specs?.[loc] || p.specs?.en || [];
      const assay = specs.find((s: ProductSpec) => /assay|content|purity/i.test(s.label))?.value;
      const summary = [p.base, p.form, assay].filter(Boolean).join(" · ");
      lines.push(`- [${tr?.name || p.slug}](${BASE_URL}/${loc}/products/${p.slug}): ${summary}.`);
    }
    lines.push("");
  }

  lines.push(`## ${headings.catalogue}`);
  lines.push(
    `- [Product catalogue](${BASE_URL}/${loc}/products): all ready-to-use pigment formulations, filterable by origin and application.`
  );
  lines.push(
    `- [Natural pigment reference](${BASE_URL}/${loc}/pigments): the full pigment index with colour, origin, regulatory status and target market.`
  );
  lines.push(
    `- [Regulatory information](${BASE_URL}/${loc}/regulations): EU Regulation 1333/2008, US FDA color additive rules, Japan existing list, Korea MFDS status.`
  );
  lines.push("");

  lines.push(`## ${headings.pigments}`);
  lines.push(...pigmentIndexLines(loc));

  lines.push(`## ${headings.guides}`);
  for (const a of articles) {
    const tr = pickTranslation(a.translations, loc);
    const summary = cleanSummary(tr?.excerpt, tr?.body);
    lines.push(`- [${tr?.title || a.slug}](${BASE_URL}/${loc}/articles/${a.slug}): ${summary}`);
  }
  lines.push("");

  lines.push(`## ${headings.buying}`);
  lines.push(`- [For business](${BASE_URL}/${loc}/b2b): capability, certifications, sample requests and factory visits.`);
  lines.push(`- [Capability](${BASE_URL}/${loc}/b2b/capability): fermentation lines, QC checkpoints, R&D.`);
  lines.push(`- [Certifications](${BASE_URL}/${loc}/b2b/certifications): food, cosmetic and pharma grade documentation.`);
  lines.push(`- [Sample request](${BASE_URL}/${loc}/b2b/samples): how to evaluate a pigment in your own lab.`);
  lines.push(`- [Contact](${BASE_URL}/${loc}/contact): quote requests, technical support, regulatory documentation.`);
  lines.push("");

  lines.push(`## ${headings.company}`);
  lines.push(`- [About EarthHue](${BASE_URL}/${loc}/about): who we are and how we work.`);
  lines.push(
    `- [Color aesthetics](${BASE_URL}/${loc}/c2c): the colour science side of the business — pigment stories, natural dye chemistry and a gallery.`
  );
  lines.push("");

  lines.push(`## ${headings.languages}`);
  lines.push(
    "This map is published in seven languages. Each language tree has its own llms.txt with localized product, article and pigment names, and a machine-readable markdown mirror of every page."
  );
  lines.push("");
  for (const l of LOCALES) {
    lines.push(
      `- ${LOCALE_LABELS[l] || l} — [llms.txt](${BASE_URL}/${l}/llms.txt) · [site](${BASE_URL}/${l}) · [products.md](${BASE_URL}/md/${l}/products/eh-astaxanthin-yeast-110.md)`
    );
  }
  lines.push("");

  lines.push(`## ${headings.optional}`);
  lines.push(`- [Full text corpus for LLM training and retrieval](${BASE_URL}/${loc}/llms-full.txt)`);
  lines.push(
    `- [Machine-readable product pages](${BASE_URL}/md/${loc}/products/eh-astaxanthin-yeast-110.md) (pattern: ${BASE_URL}/md/{locale}/{path}.md)`
  );
  lines.push("");

  return lines.join("\n");
}

/**
 * llms-full.txt — the extended, verbatim corpus. Same page content, no
 * navigation, formatted for retrieval chunks.
 */
export function buildLlmsFullTxt(locale = "en"): string {
  const loc = normalizeLocale(locale);
  const products = listProducts({ onlyPublished: true });
  const articles = listArticles({ onlyPublished: true });
  const headings = HEADINGS[loc] || HEADINGS.en;
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
    const tr = pickTranslation(p.translations, loc);
    const specs = p.specs?.[loc] || p.specs?.en || [];
    const faq = p.faq?.[loc] || p.faq?.en || [];
    out.push("");
    out.push(`### ${tr?.name || p.slug}`);
    out.push("");
    out.push(`Source: ${BASE_URL}/${loc}/products/${p.slug}`);
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
  out.push(`## ${headings.pigments}`);
  out.push(...pigmentIndexLines(loc));

  out.push("");
  out.push("## Articles");
  for (const a of articles) {
    const tr = pickTranslation(a.translations, loc);
    out.push("");
    out.push(`### ${tr?.title || a.slug}`);
    out.push("");
    out.push(`Source: ${BASE_URL}/${loc}/articles/${a.slug}`);
    out.push("");
    const summary = cleanSummary(tr?.excerpt, tr?.body);
    if (summary) {
      out.push(summary);
      out.push("");
    }
    if (tr?.body) out.push(tr.body);
  }

  out.push("");
  out.push("## Index of pages");
  for (const r of STATIC_ROUTES) {
    out.push(`- ${BASE_URL}/${loc}${r.path}`);
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

  const loc = normalizeLocale(locale);
  const products = listProducts({ onlyPublished: true });
  const articles = listArticles({ onlyPublished: true });

  if (parts[0] === "products" && parts[1]) {
    const p = products.find((x) => x.slug === parts[1]);
    if (!p) return null;
    const tr = pickTranslation(p.translations, loc);
    const specs = p.specs?.[loc] || p.specs?.en || [];
    const faq = p.faq?.[loc] || p.faq?.en || [];
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
    out.push(`Full page: ${BASE_URL}/${loc}/products/${p.slug}`);
    out.push("");
    return out.join("\n");
  }

  if (parts[0] === "articles" && parts[1]) {
    const a = articles.find((x) => x.slug === parts[1]);
    if (!a) return null;
    const tr = pickTranslation(a.translations, loc);
    const out: string[] = [];
    out.push(`# ${tr?.title || a.slug}`);
    out.push("");
    const summary = cleanSummary(tr?.excerpt, tr?.body);
    if (summary) {
      out.push(summary);
      out.push("");
    }
    if (tr?.body) out.push(tr.body);
    out.push("");
    out.push(`Full page: ${BASE_URL}/${loc}/articles/${a.slug}`);
    out.push("");
    return out.join("\n");
  }

  if (parts.length === 1 && STATIC_ROUTES.some((r) => r.path === `/${parts[0]}`)) {
    return [
      `# ${parts[0]}`,
      "",
      `EarthHue page: ${BASE_URL}/${loc}/${parts[0]}`,
      "",
      "EarthHue manufactures fermentation-derived natural carotenoids — astaxanthin, lutein, lycopene, beta-carotene and zeaxanthin — for food, nutraceutical, cosmetic and pharmaceutical formulators.",
      "",
    ].join("\n");
  }

  return null;
}
