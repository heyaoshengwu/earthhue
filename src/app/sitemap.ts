import type { MetadataRoute } from "next";

const BASE_URL = "https://earthhue.net";
const locales = ["en", "zh", "ja", "ko", "es", "fr", "de"];

const pages = [
  "",
  "/about",
  "/pigments",
  "/products",
  "/regulations",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    const lastModified = new Date();

    const languages: Record<string, string> = {};
    for (const locale of locales) {
      languages[locale] = `${BASE_URL}/${locale}${page}`;
    }

    entries.push({
      url: `${BASE_URL}/en${page}`,
      lastModified,
      changeFrequency: page === "" ? "daily" : "weekly",
      priority: page === "" ? 1.0 : page === "/pigments" || page === "/products" ? 0.9 : 0.8,
      alternates: {
        languages,
      },
    });
  }

  return entries;
}
