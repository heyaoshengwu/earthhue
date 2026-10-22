import { NextRequest, NextResponse } from "next/server";
import { addAboutImage, deleteAboutImage, listAboutImages, updateAboutImage } from "@/lib/about";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const slot = req.nextUrl.searchParams.get("slot") || undefined;
  return NextResponse.json({ items: listAboutImages(slot) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.url || !body.slot)
    return NextResponse.json({ error: "url and slot required" }, { status: 400 });
  const item = addAboutImage({
    slot: body.slot,
    url: body.url,
    alt: body.alt ?? null,
    caption: body.caption ?? null,
    sort_order: Number(body.sort_order) || 0,
  });
  return NextResponse.json({ ok: true, item });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const item = updateAboutImage(Number(body.id), {
    url: body.url,
    alt: body.alt ?? null,
    caption: body.caption ?? null,
    sort_order: body.sort_order !== undefined ? Number(body.sort_order) : undefined,
  });
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(req: NextRequest) {
  const id = Number(req.nextUrl.searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  deleteAboutImage(id);
  return NextResponse.json({ ok: true });
}