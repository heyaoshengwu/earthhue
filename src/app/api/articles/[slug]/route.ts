import { NextRequest, NextResponse } from "next/server";
import { deleteArticle, getArticleBySlug, updateArticle, articleSlugExists } from "@/lib/articles";
import type { ArticleTranslation } from "@/lib/articles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const article = getArticleBySlug(slug);
  if (!article) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ item: article });
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const existing = getArticleBySlug(slug);
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });
  const body = await req.json();
  let nextSlug = body.slug || existing.slug;
  nextSlug = String(nextSlug).trim().toLowerCase();
  if (!/^[a-z0-9-]+$/.test(nextSlug))
    return NextResponse.json({ error: "slug invalid" }, { status: 400 });
  if (nextSlug !== existing.slug && articleSlugExists(nextSlug, existing.id))
    return NextResponse.json({ error: "slug already exists" }, { status: 409 });
  const updated = updateArticle(existing.id, {
    slug: nextSlug,
    translations: (body.translations || existing.translations) as Record<string, ArticleTranslation>,
    cover_image: body.cover_image !== undefined ? body.cover_image : existing.cover_image,
    published: body.published !== undefined ? !!body.published : !!existing.published,
    tags_json: body.tags_json !== undefined ? body.tags_json : existing.tags_json,
  });
  return NextResponse.json({ ok: true, item: updated });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const existing = getArticleBySlug(slug);
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });
  deleteArticle(existing.id);
  return NextResponse.json({ ok: true });
}