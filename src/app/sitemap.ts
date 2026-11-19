import type { MetadataRoute } from "next";
import { BASE_URL, LOCALES, STATIC_ROUTES } from "@/lib/seo";
import { listProducts } from "@/lib/products";
import { listArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";

/** Release date used for static routes so the sitemap does not churn on every request. */
const STATIC_LASTMOD = new Date("2026-10-22T00:00:00.000Z");

function alternates(path: string) {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `${BASE_URL}/${l}${path}`;
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of STATIC_ROUTES) {
    entries.push({
      url: `${BASE_URL}/en${route.path}`,
      lastModified: STATIC_LASTMOD,
      changeFrequency: route.changefreq,
      priority: route.priority,
      alternates: { languages: alternates(route.path) },
    });
  }

  for (const p of listProducts({ onlyPublished: true })) {
    const path = `/products/${p.slug}`;
    entries.push({
      url: `${BASE_URL}/en${path}`,
      lastModified: p.updated_at ? new Date(p.updated_at.replace(" ", "T") + "Z") : STATIC_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: { languages: alternates(path) },
    });
  }

  for (const a of listArticles({ onlyPublished: true })) {
    const path = `/articles/${a.slug}`;
    entries.push({
      url: `${BASE_URL}/en${path}`,
      lastModified: a.updated_at ? new Date(a.updated_at.replace(" ", "T") + "Z") : STATIC_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: { languages: alternates(path) },
    });
  }

  return entries;
}
