import { NextRequest, NextResponse } from "next/server";
import { isWriteAuthorized } from "@/lib/adminAuth";
import { addProductImage, deleteProductImage, getProductBySlug, listProductImages, updateProductImage } from "@/lib/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  if (!isWriteAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await ctx.params;
  const product = getProductBySlug(slug);
  if (!product) return NextResponse.json({ error: "product not found" }, { status: 404 });
  return NextResponse.json({ items: listProductImages(product.id) });
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  if (!isWriteAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await ctx.params;
  const product = getProductBySlug(slug);
  if (!product) return NextResponse.json({ error: "product not found" }, { status: 404 });
  const body = await req.json();
  if (!body.url) return NextResponse.json({ error: "url required" }, { status: 400 });
  const item = addProductImage({
    product_id: product.id,
    url: body.url,
    alt: body.alt ?? null,
    caption: body.caption ?? null,
    sort_order: Number(body.sort_order) || 0,
  });
  return NextResponse.json({ ok: true, item });
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  if (!isWriteAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const item = updateProductImage(Number(body.id), {
    url: body.url,
    alt: body.alt,
    caption: body.caption,
    sort_order: body.sort_order !== undefined ? Number(body.sort_order) : undefined,
  });
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  if (!isWriteAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(req.nextUrl.searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  deleteProductImage(id);
  return NextResponse.json({ ok: true });
}