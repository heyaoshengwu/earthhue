import { NextRequest, NextResponse } from "next/server";
import { isWriteAuthorized } from "@/lib/adminAuth";
import {
  deleteProduct,
  getProductBySlug,
  listProductImages,
  productSlugExists,
  updateProduct,
} from "@/lib/products";
import type { ProductTranslation } from "@/lib/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  if (!isWriteAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await ctx.params;
  const product = getProductBySlug(slug);
  if (!product) return NextResponse.json({ error: "not found" }, { status: 404 });
  const images = listProductImages(product.id);
  return NextResponse.json({ item: product, images });
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  if (!isWriteAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await ctx.params;
  const existing = getProductBySlug(slug);
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });
  const body = await req.json();
  let nextSlug = String(body.slug || existing.slug).trim().toLowerCase();
  if (!/^[a-z0-9-]+$/.test(nextSlug))
    return NextResponse.json({ error: "slug invalid" }, { status: 400 });
  if (nextSlug !== existing.slug && productSlugExists(nextSlug, existing.id))
    return NextResponse.json({ error: "slug already exists" }, { status: 409 });
  const updated = updateProduct(existing.id, {
    slug: nextSlug,
    translations: (body.translations || existing.translations) as Record<string, ProductTranslation>,
    base: body.base !== undefined ? body.base : existing.base,
    form: body.form !== undefined ? body.form : existing.form,
    color: body.color !== undefined ? body.color : existing.color,
    series: body.series !== undefined ? body.series : existing.series,
    specs: body.specs !== undefined ? body.specs : existing.specs,
    faq: body.faq !== undefined ? body.faq : existing.faq,
    sort_order: body.sort_order !== undefined ? Number(body.sort_order) : existing.sort_order,
    published: body.published !== undefined ? !!body.published : !!existing.published,
  });
  return NextResponse.json({ ok: true, item: updated });
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  if (!isWriteAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await ctx.params;
  const existing = getProductBySlug(slug);
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });
  deleteProduct(existing.id);
  return NextResponse.json({ ok: true });
}