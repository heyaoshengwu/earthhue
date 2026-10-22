import { getDb } from "./db";
import { defaultAboutTranslations, type AboutTranslations, type AboutCommitment } from "./seed";

export type AboutImage = {
  id: number;
  slot: string;
  url: string;
  alt: string | null;
  caption: string | null;
  sort_order: number;
};

function ensureSeed() {
  const db = getDb();
  const row = db.prepare("SELECT translations FROM about WHERE id = 1").get() as any;
  const seed = defaultAboutTranslations();
  const merged: Record<string, AboutTranslations> = {};
  let existing: Record<string, any> = {};
  try {
    existing = row?.translations ? JSON.parse(row.translations) : {};
  } catch {
    existing = {};
  }
  for (const [locale, defaults] of Object.entries(seed)) {
    const prev = existing[locale] || {};
    merged[locale] = { ...defaults, ...prev };
  }
  db.prepare(
    "UPDATE about SET translations = ?, updated_at = datetime('now') WHERE id = 1"
  ).run(JSON.stringify(merged));
}

export function getAbout(): {
  translations: Record<string, AboutTranslations>;
} {
  ensureSeed();
  const db = getDb();
  const row = db.prepare("SELECT translations FROM about WHERE id = 1").get() as any;
  let translations: Record<string, AboutTranslations> = {};
  try {
    translations = row?.translations ? JSON.parse(row.translations) : {};
  } catch {
    translations = {};
  }
  if (Object.keys(translations).length === 0) {
    translations = defaultAboutTranslations();
  }
  return { translations };
}

export function updateAbout(translations: Record<string, AboutTranslations>) {
  const db = getDb();
  db.prepare(
    "UPDATE about SET translations = ?, updated_at = datetime('now') WHERE id = 1"
  ).run(JSON.stringify(translations));
  return getAbout();
}

export function listAboutImages(slot?: string): AboutImage[] {
  const db = getDb();
  if (slot) {
    return db
      .prepare(
        "SELECT * FROM about_images WHERE slot = ? ORDER BY sort_order ASC, id ASC"
      )
      .all(slot) as AboutImage[];
  }
  return db
    .prepare("SELECT * FROM about_images ORDER BY slot, sort_order ASC, id ASC")
    .all() as AboutImage[];
}

export function addAboutImage(input: {
  slot: string;
  url: string;
  alt?: string | null;
  caption?: string | null;
  sort_order?: number;
}): AboutImage {
  const db = getDb();
  const info = db
    .prepare(
      "INSERT INTO about_images (slot, url, alt, caption, sort_order) VALUES (?, ?, ?, ?, ?)"
    )
    .run(
      input.slot,
      input.url,
      input.alt ?? null,
      input.caption ?? null,
      input.sort_order ?? 0
    );
  return db.prepare("SELECT * FROM about_images WHERE id = ?").get(info.lastInsertRowid) as AboutImage;
}

export function updateAboutImage(
  id: number,
  input: { url?: string; alt?: string | null; caption?: string | null; sort_order?: number }
): AboutImage | null {
  const db = getDb();
  const existing = db.prepare("SELECT * FROM about_images WHERE id = ?").get(id) as any;
  if (!existing) return null;
  db.prepare(
    "UPDATE about_images SET url=?, alt=?, caption=?, sort_order=? WHERE id=?"
  ).run(
    input.url ?? existing.url,
    input.alt === undefined ? existing.alt : input.alt,
    input.caption === undefined ? existing.caption : input.caption,
    input.sort_order === undefined ? existing.sort_order : input.sort_order,
    id
  );
  return db.prepare("SELECT * FROM about_images WHERE id = ?").get(id) as AboutImage;
}

export function deleteAboutImage(id: number): boolean {
  const db = getDb();
  const info = db.prepare("DELETE FROM about_images WHERE id = ?").run(id);
  return info.changes > 0;
}

export type { AboutTranslations, AboutCommitment };