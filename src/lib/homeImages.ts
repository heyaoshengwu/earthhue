import { getDb } from "./db";

export type HomeImage = {
  key: string;
  url: string;
  alt: string | null;
  caption: string | null;
  updated_at: string;
};

export const HOME_IMAGE_SLOTS = [
  { key: "hero", label: "Hero 主图", desc: "首页顶部主视觉图，建议 16:9 或更宽。" },
  { key: "brand", label: "品牌/工艺图", desc: "展示在 Hero 下方，用于介绍公司/工艺。" },
  { key: "aesthetics", label: "色彩美学预览图", desc: "首页底部『进入色彩美学』旁边的小图。" },
] as const;

export type HomeImageKey = (typeof HOME_IMAGE_SLOTS)[number]["key"];

function rowToHomeImage(row: Record<string, unknown>): HomeImage {
  return {
    key: row.key as string,
    url: row.url as string,
    alt: (row.alt as string | null) ?? null,
    caption: (row.caption as string | null) ?? null,
    updated_at: row.updated_at as string,
  };
}

export function listHomeImages(): HomeImage[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM home_images ORDER BY key").all() as Record<string, unknown>[];
  return rows.map(rowToHomeImage);
}

export function getHomeImage(key: string): HomeImage | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM home_images WHERE key = ?").get(key) as Record<string, unknown> | undefined;
  return row ? rowToHomeImage(row) : null;
}

export function upsertHomeImage(key: string, url: string, alt?: string | null, caption?: string | null): HomeImage {
  const db = getDb();
  db.prepare(
    `INSERT INTO home_images (key, url, alt, caption, updated_at)
     VALUES (?, ?, ?, ?, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET
       url = excluded.url,
       alt = excluded.alt,
       caption = excluded.caption,
       updated_at = datetime('now')`
  ).run(key, url, alt ?? null, caption ?? null);
  return getHomeImage(key)!;
}

export function deleteHomeImage(key: string): boolean {
  const db = getDb();
  const res = db.prepare("DELETE FROM home_images WHERE key = ?").run(key);
  return res.changes > 0;
}

export function updateHomeImageMeta(key: string, alt: string | null, caption: string | null): HomeImage | null {
  const db = getDb();
  const res = db
    .prepare(
      "UPDATE home_images SET alt = ?, caption = ?, updated_at = datetime('now') WHERE key = ?"
    )
    .run(alt, caption, key);
  if (res.changes === 0) return null;
  return getHomeImage(key);
}

export function isValidHomeImageKey(key: string): key is HomeImageKey {
  return HOME_IMAGE_SLOTS.some((s) => s.key === key);
}