import { NextRequest, NextResponse } from "next/server";
import { getAbout, updateAbout } from "@/lib/about";
import type { AboutTranslations } from "@/lib/about";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getAbout());
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const translations = body.translations || {};
  const updated = updateAbout(translations as Record<string, AboutTranslations>);
  return NextResponse.json({ ok: true, ...updated });
}