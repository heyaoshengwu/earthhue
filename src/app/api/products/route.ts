import { NextRequest, NextResponse } from "next/server";
import { createProduct, listProducts, productSlugExists } from "@/lib/products";
import type { ProductTranslation } from "@/lib/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ items: listProducts({ onlyPublished: false }) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const slug = String(body.slug || "").trim().toLowerCase();
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  if (!/^[a-z0-9-]+$/.test(slug))
    return NextResponse.json({ error: "slug invalid" }, { status: 400 });
  if (productSlugExists(slug))
    return NextResponse.json({ error: "slug already exists" }, { status: 409 });
  const product = createProduct({
    slug,
    translations: (body.translations || {}) as Record<string, ProductTranslation>,
    base: body.base || null,
    form: body.form || null,
    color: body.color || null,
    sort_order: Number(body.sort_order) || 0,
    published: body.published !== false,
  });
  return NextResponse.json({ ok: true, item: product });
}