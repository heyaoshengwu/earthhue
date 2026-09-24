import { NextRequest, NextResponse } from "next/server";
import { getHomeImage, deleteHomeImage, isValidHomeImageKey } from "@/lib/homeImages";
import { deleteUpload } from "@/lib/upload";

export const dynamic = "force-dynamic";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!isValidHomeImageKey(key)) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }
  const existing = getHomeImage(key);
  if (existing) {
    await deleteUpload(existing.url);
  }
  const ok = deleteHomeImage(key);
  return NextResponse.json({ ok });
}