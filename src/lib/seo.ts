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
