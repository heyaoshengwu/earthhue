import { NextRequest, NextResponse } from "next/server";
import { isWriteAuthorized } from "@/lib/adminAuth";
import { saveUpload } from "@/lib/upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!isWriteAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const subdir = (formData.get("subdir") as string) || "general";
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    const safeSubdir = subdir.replace(/[^a-z0-9_-]/gi, "").slice(0, 32) || "general";
    const result = await saveUpload(file, safeSubdir);
    return NextResponse.json({ ok: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Upload failed" }, { status: 400 });
  }
}