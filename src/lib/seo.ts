export const BASE_URL = "https://earthhue.net";

export const LOCALES = ["en", "zh", "ja", "ko", "es", "fr", "de"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Trim trailing slashes but keep the root path as "" */
export function normalizePath(path: string): string {
  if (!path) return "";
  const cleaned = path.replace(/\/+$/, "");
  return cleaned === "/" ? "" : cleaned;
}

/**
 * Canonical + hreflang alternates for a localized path.
 * `path` is the locale-independent path, e.g. "/products/eh-lutein-ferment-120".
 */
export function localeAlternates(locale: string, path = "") {
  const suffix = normalizePath(path);
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `${BASE_URL}/${l}${suffix}`;
  return {
    canonical: `${BASE_URL}/${locale}${suffix}`,
    languages: {
      ...languages,
      "x-default": `${BASE_URL}/${DEFAULT_LOCALE}${suffix}`,
    },
  };
}

export function absoluteUrl(path: string): string {
  if (!path) return BASE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Static (non-db) routes that should be indexed and appear in the sitemap. */
export const STATIC_ROUTES: { path: string; priority: number; changefreq: "daily" | "weekly" | "monthly" }[] = [
  { path: "", priority: 1.0, changefreq: "daily" },
  { path: "/products", priority: 0.9, changefreq: "weekly" },
  { path: "/pigments", priority: 0.8, changefreq: "weekly" },
  { path: "/regulations", priority: 0.8, changefreq: "monthly" },
  { path: "/articles", priority: 0.8, changefreq: "weekly" },
  { path: "/about", priority: 0.7, changefreq: "monthly" },
  { path: "/contact", priority: 0.7, changefreq: "monthly" },
  { path: "/b2b", priority: 0.7, changefreq: "monthly" },
  { path: "/b2b/capability", priority: 0.6, changefreq: "monthly" },
  { path: "/b2b/certifications", priority: 0.6, changefreq: "monthly" },
  { path: "/b2b/samples", priority: 0.6, changefreq: "monthly" },
  { path: "/b2b/factory-visit", priority: 0.5, changefreq: "monthly" },
  { path: "/b2b/contact", priority: 0.6, changefreq: "monthly" },
  { path: "/c2c", priority: 0.5, changefreq: "monthly" },
  { path: "/c2c/stories", priority: 0.4, changefreq: "monthly" },
  { path: "/c2c/science", priority: 0.5, changefreq: "monthly" },
  { path: "/c2c/gallery", priority: 0.4, changefreq: "monthly" },
];

/**
 * Per-locale social and discovery metadata.
 *
 * The root layout is shared by all seven locales, so a fixed English block
 * there leaks English twitter cards, keywords, categories and og:image alt
 * text onto every translated page. These tables keep the per-locale values
 * in one place so `[locale]/layout.tsx` can hand them down to every page.
 */
export const SOCIAL: Record<
  string,
  {
    twitterTitle: string;
    twitterDescription: string;
    keywords: string[];
    category: string;
    ogImageAlt: string;
  }
> = {
  en: {
    twitterTitle: "EarthHue — Fermentation-Derived Natural Carotenoids",
    twitterDescription:
      "Astaxanthin, lutein, lycopene, beta-carotene and zeaxanthin made by precision fermentation. Batch-level COA and MSDS.",
    keywords: [
      "astaxanthin supplier",
      "astaxanthin manufacturer",
      "lutein supplier",
      "lutein manufacturer",
      "lycopene powder supplier",
      "lycopene manufacturer",
      "fermentation derived carotenoids",
      "natural carotenoid manufacturer",
      "beta-carotene supplier",
      "zeaxanthin supplier",
      "natural pigment manufacturer",
      "natural food colorant supplier",
      "clean label colorant",
      "microbial pigment fermentation",
      "EU FDA compliant carotenoid",
      "nutraceutical pigment supplier",
      "bulk astaxanthin powder",
      "bulk lutein powder",
      "bulk lycopene powder",
    ],
    category: "natural color ingredients",
    ogImageAlt:
      "EarthHue — fermentation-derived natural carotenoids for food, nutraceutical and cosmetic formulations",
  },
  zh: {
    twitterTitle: "EarthHue — 发酵法天然类胡萝卜素",
    twitterDescription:
      "发酵法虾青素、叶黄素、番茄红素、β-胡萝卜素与玉米黄素，批批出具 COA 与 MSDS，欧盟/美国/日本/韩国合规。",
    keywords: [
      "虾青素供应商",
      "发酵法虾青素",
      "虾青素厂家",
      "叶黄素供应商",
      "发酵法叶黄素",
      "番茄红素粉",
      "发酵法番茄红素",
      "天然类胡萝卜素厂家",
      "天然色素厂家",
      "β-胡萝卜素供应商",
      "玉米黄素供应商",
      "天然色素原料",
      "食品天然着色剂",
      "清洁标签着色剂",
      "微生物发酵色素",
      "类胡萝卜素厂家直销",
      "营养保健品色素供应商",
      "散装虾青素粉",
      "散装叶黄素粉",
      "散装番茄红素粉",
    ],
    category: "天然色素原料",
    ogImageAlt: "EarthHue — 用于食品、营养保健与化妆品的发酵法天然类胡萝卜素",
  },
  ja: {
    twitterTitle: "EarthHue — 発酵由来天然カロテノイド",
    twitterDescription:
      "アスタキサンチン、ルテイン、リコペン、β-カロテン、ゼアキサンチンを発酵で製造。ロットごとに COA・MSDS 付属。",
    keywords: [
      "アスタキサンチン サプライヤー",
      "アスタキサンチン メーカー",
      "発酵由来 アスタキサンチン",
      "ルテイン サプライヤー",
      "発酵由来 ルテイン",
      "リコペン 粉末 サプライヤー",
      "発酵由来 リコペン",
      "天然カロテノイド メーカー",
      "天然色素 メーカー",
      "β-カロテン サプライヤー",
      "ゼアキサンチン サプライヤー",
      "天然色素 原料",
      "食品用 天然着色料",
      "クリーンラベル 着色料",
      "微生物 発酵 色素",
      "Nutraceutical 色素 サプライヤー",
      "アスタキサンチン 粉 まとめ買い",
      "ルテイン 粉 まとめ買い",
      "リコペン 粉 まとめ買い",
    ],
    category: "天然色素原料",
    ogImageAlt: "EarthHue — 食品・栄養化粧品・化粧品向けの発酵由来天然カロテノイド",
  },
  ko: {
    twitterTitle: "EarthHue — 발효 유래 천연 카로티노이드",
    twitterDescription:
      "아스타잔틴, 루틴, 라이코펜, 베타카로틴, 제아잔틴을 발효로 제조. 배치별 COA·MSDS 제공.",
    keywords: [
      "아스타잔틴 공급업체",
      "아스타잔틴 제조사",
      "발효 유래 아스타잔틴",
      "루틴 공급업체",
      "발효 유래 루틴",
      "라이코펜 분말 공급업체",
      "발효 유래 라이코펜",
      "천연 카로티노이드 제조사",
      "천연 색소 제조사",
      "베타카로틴 공급업체",
      "제아잔틴 공급업체",
      "천연 색소 원료",
      "식품용 천연착색제",
      "클린라벨 착색제",
      "미생물 발효 색소",
      "건강기능식품 색소 공급업체",
      "아스타잔틴 분말 도매",
      "루틴 분말 도매",
      "라이코펜 분말 도매",
    ],
    category: "천연 색소 원료",
    ogImageAlt: "EarthHue — 식품·건강기능식품·화장품용 발효 유래 천연 카로티노이드",
  },
  es: {
    twitterTitle: "EarthHue — Carotenoides naturales por fermentación",
    twitterDescription:
      "Astaxantina, luteína, licopeno, beta-caroteno y zeaxantina obtenidos por fermentación. COA y MSDS por lote.",
    keywords: [
      "proveedor de astaxantina",
      "fabricante de astaxantina",
      "astaxantina por fermentación",
      "proveedor de luteína",
      "luteína por fermentación",
      "licopeno en polvo proveedor",
      "licopeno por fermentación",
      "fabricante de carotenoides naturales",
      "fabricante de pigmentos naturales",
      "beta-caroteno proveedor",
      "zeaxantina proveedor",
      "materia prima de pigmentos naturales",
      "colorante natural para alimentos",
      "colorante de etiqueta limpia",
      "fermentación de pigmentos microbianos",
      "carotenoides conformes FDA y UE",
      "pigmentos para nutracéuticos",
      "astaxantina en polvo al por mayor",
      "luteína en polvo al por mayor",
      "licopeno en polvo al por mayor",
    ],
    category: "ingredientes de color natural",
    ogImageAlt:
      "EarthHue — carotenoides naturales por fermentación para alimentos, nutracéuticos y cosméticos",
  },
  fr: {
    twitterTitle: "EarthHue — Caroténoïdes naturels par fermentation",
    twitterDescription:
      "Astaxanthine, lutéine, lycopène, bêta-carotène et zéaxanthine obtenus par fermentation. COA et MSDS par lot.",
    keywords: [
      "fournisseur d'astaxanthine",
      "fabricant d'astaxanthine",
      "astaxanthine par fermentation",
      "fournisseur de lutéine",
      "lutéine par fermentation",
      "lycopène en poudre fournisseur",
      "lycopène par fermentation",
      "fabricant de caroténoïdes naturels",
      "fabricant de pigments naturels",
      "fournisseur de bêta-carotène",
      "fournisseur de zéaxanthine",
      "matière première de pigments naturels",
      "colorant naturel alimentaire",
      "colorant clean label",
      "fermentation de pigments microbiens",
      "caroténoïdes conformes UE et FDA",
      "pigments nutraceutiques fournisseur",
      "astaxanthine en poudre en gros",
      "lutéine en poudre en gros",
      "lycopène en poudre en gros",
    ],
    category: "ingrédients de couleur naturelle",
    ogImageAlt:
      "EarthHue — caroténoïdes naturels par fermentation pour l'alimentaire, les nutraceutiques et les cosmétiques",
  },
  de: {
    twitterTitle: "EarthHue — Natürliche Carotinoide durch Fermentation",
    twitterDescription:
      "Astaxanthin, Lutein, Lycopin, Beta-Carotin und Zeaxanthin durch Fermentation gewonnen. COA und MSDS je Charge.",
    keywords: [
      "Astaxanthin Lieferant",
      "Astaxanthin Hersteller",
      "Astaxanthin aus Fermentation",
      "Lutein Lieferant",
      "Lutein aus Fermentation",
      "Lycopin Pulver Lieferant",
      "Lycopin aus Fermentation",
      "Hersteller natürlicher Carotinoide",
      "Hersteller natürlicher Farbpigmente",
      "Beta-Carotin Lieferant",
      "Zeaxanthin Lieferant",
      "Rohstoff natürliche Farbstoffe",
      "natürlicher Lebensmittelfarbstoff",
      "Clean-Label-Farbstoff",
      "mikrobielle Pigmentfermentation",
      "EU- und FDA-konforme Carotinoide",
      "Nutraceutical Farbpigmente Lieferant",
      "Astaxanthin Pulver Großhandel",
      "Lutein Pulver Großhandel",
      "Lycopin Pulver Großhandel",
    ],
    category: "natürliche Farbstoffrohstoffe",
    ogImageAlt:
      "EarthHue — durch Fermentation gewonnene natürliche Carotinoide für Lebensmittel, Nutraceuticals und Kosmetik",
  },
};

/** Social/discovery metadata for one locale, with English as the fallback. */
export function socialMetadata(locale: string) {
  const s = SOCIAL[locale] || SOCIAL.en;
  return {
    twitter: {
      card: "summary_large_image" as const,
      title: s.twitterTitle,
      description: s.twitterDescription,
      images: ["/og-image.png"],
    },
    keywords: s.keywords,
    category: s.category,
  };
}

/** The og:image entry for one locale — the alt text is the part that was English everywhere. */
export function ogImages(locale: string) {
  const s = SOCIAL[locale] || SOCIAL.en;
  return [
    {
      url: `${BASE_URL}/og-image.png`,
      width: 1200,
      height: 630,
      alt: s.ogImageAlt,
    },
  ];
}

/**
 * Per-page OpenGraph block with a correct, localized og:url.
 *
 * A page-level `openGraph` object replaces the layout's block outright — the
 * fields are not deep-merged — so every page that declares one has to spell
 * out the URL and the image alt text itself. Before this helper the 13
 * pages that declared no `openGraph` inherited `https://earthhue.net/en`
 * from the shared root layout, so every non-English share card pointed back
 * at the English home page.
 */
export function openGraphFor(
  locale: string,
  path: string,
  title: string | { absolute: string },
  description: string,
  type: "website" | "article" = "website"
) {
  return {
    type,
    locale,
    ...(type === "website"
      ? { alternateLocale: LOCALES.filter((l) => l !== locale) }
      : {}),
    siteName: "EarthHue",
    url: `${BASE_URL}/${locale}${normalizePath(path)}`,
    title,
    description,
    images: ogImages(locale),
  };
}
