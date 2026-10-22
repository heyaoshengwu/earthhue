import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { UPLOAD_DIR } from "./db";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const MAX_BYTES = 8 * 1024 * 1024;

export type UploadResult = {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
};

export async function saveUpload(file: File, subdir = "general"): Promise<UploadResult> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }
  if (file.size > MAX_BYTES) {
    throw new Error(`File too large: ${file.size} > ${MAX_BYTES}`);
  }
  const targetDir = path.join(UPLOAD_DIR, subdir);
  await fs.mkdir(targetDir, { recursive: true });
  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const hash = crypto.randomBytes(8).toString("hex");
  const ts = Date.now();
  const filename = `${ts}-${hash}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(targetDir, filename), buf);
  return {
    url: `/uploads/${subdir}/${filename}`,
    filename,
    size: file.size,
    mimeType: file.type,
  };
}

export async function deleteUpload(urlOrUrl: string): Promise<boolean> {
  if (!urlOrUrl || !urlOrUrl.startsWith("/uploads/")) return false;
  const rel = urlOrUrl.replace(/^\/+/, "");
  const target = path.join(process.cwd(), "public", rel);
  try {
    await fs.unlink(target);
    return true;
  } catch {
    return false;
  }
}