import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs";
import fsPromises from "node:fs/promises";

export const dynamic = "force-dynamic";

const ROOT = path.join(process.cwd(), "public", "uploads");
const MAX_PATH_LEN = 512;

function contentTypeFromExt(ext: string): string {
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    avif: "image/avif",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    pdf: "application/pdf",
  };
  return map[ext.toLowerCase()] || "application/octet-stream";
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  if (!segments || segments.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const rel = segments.join("/");
  if (rel.length > MAX_PATH_LEN || rel.includes("..")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }
  const abs = path.normalize(path.join(ROOT, rel));
  if (!abs.startsWith(ROOT + path.sep) && abs !== ROOT) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }
  if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  try {
    const buf = await fsPromises.readFile(abs);
    const ext = path.extname(abs).slice(1);
    const type = contentTypeFromExt(ext);
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": type,
        "Content-Length": String(buf.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Read failed" }, { status: 500 });
  }
}