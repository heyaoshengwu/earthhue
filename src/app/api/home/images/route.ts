import { NextRequest, NextResponse } from "next/server";
import { listHomeImages, upsertHomeImage, isValidHomeImageKey, HOME_IMAGE_SLOTS } from "@/lib/homeImages";
import { saveUpload } from "@/lib/upload";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = listHomeImages();
  return NextResponse.json({ items, slots: HOME_IMAGE_SLOTS });
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");
  const key = String(form.get("key") || "").trim();
  const alt = String(form.get("alt") || "").trim() || null;
  const caption = String(form.get("caption") || "").trim() || null;

  if (!isValidHomeImageKey(key)) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  try {
    const up = await saveUpload(file, "home");
    const item = upsertHomeImage(key, up.url, alt, caption);
    return NextResponse.json({ ok: true, item });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}