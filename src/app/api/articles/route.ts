import { NextRequest, NextResponse } from "next/server";
import { createArticle, listArticles, articleSlugExists } from "@/lib/articles";
import type { ArticleTranslation } from "@/lib/articles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const items = listArticles({ onlyPublished: false });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const slug = String(body.slug || "").trim().toLowerCase();
  const translations = body.translations || {};
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  if (!/^[a-z0-9-]+$/.test(slug))
    return NextResponse.json({ error: "slug must be lowercase letters, digits, hyphens" }, { status: 400 });
  if (articleSlugExists(slug))
    return NextResponse.json({ error: "slug already exists" }, { status: 409 });
  const article = createArticle({
    slug,
    translations: translations as Record<string, ArticleTranslation>,
    cover_image: body.cover_image || null,
    published: body.published !== false,
    tags_json: body.tags_json || null,
  });
  return NextResponse.json({ ok: true, item: article });
}