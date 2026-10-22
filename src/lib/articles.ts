import { getDb } from "./db";
import { defaultArticles } from "./seed";

export type ArticleTranslation = {
  title: string;
  excerpt?: string;
  body: string;
};

export type Article = {
  id: number;
  slug: string;
  translations: Record<string, ArticleTranslation>;
  cover_image: string | null;
  tags_json: string | null;
  published: number;
  created_at: string;
  updated_at: string;
};

function parseRow(row: any): Article {
  return {
    ...row,
    translations: JSON.parse(row.translations || "{}"),
  };
}

function ensureSeed() {
  const db = getDb();
  const count = (db.prepare("SELECT COUNT(*) as c FROM articles").get() as any).c;
  if (count === 0) {
    const insert = db.prepare(
      "INSERT INTO articles (slug, translations, cover_image, published) VALUES (?, ?, ?, ?)"
    );
    for (const a of defaultArticles()) {
      insert.run(a.slug, JSON.stringify(a.translations), a.cover_image, a.published);
    }
  }
}

export function listArticles(opts?: { onlyPublished?: boolean }): Article[] {
  ensureSeed();
  const db = getDb();
  const rows = opts?.onlyPublished
    ? db.prepare("SELECT * FROM articles WHERE published = 1 ORDER BY created_at DESC").all()
    : db.prepare("SELECT * FROM articles ORDER BY created_at DESC").all();
  return (rows as any[]).map(parseRow);
}

export function getArticleBySlug(slug: string): Article | null {
  ensureSeed();
  const db = getDb();
  const row = db.prepare("SELECT * FROM articles WHERE slug = ?").get(slug) as any;
  return row ? parseRow(row) : null;
}

export function getArticleById(id: number): Article | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM articles WHERE id = ?").get(id) as any;
  return row ? parseRow(row) : null;
}

export function createArticle(input: {
  slug: string;
  translations: Record<string, ArticleTranslation>;
  cover_image?: string | null;
  published?: boolean;
  tags_json?: string | null;
}): Article {
  const db = getDb();
  const info = db
    .prepare(
      "INSERT INTO articles (slug, translations, cover_image, published, tags_json) VALUES (?, ?, ?, ?, ?)"
    )
    .run(
      input.slug,
      JSON.stringify(input.translations),
      input.cover_image ?? null,
      input.published === false ? 0 : 1,
      input.tags_json ?? null
    );
  return getArticleById(Number(info.lastInsertRowid))!;
}

export function updateArticle(
  id: number,
  input: {
    slug?: string;
    translations?: Record<string, ArticleTranslation>;
    cover_image?: string | null;
    published?: boolean;
    tags_json?: string | null;
  }
): Article | null {
  const db = getDb();
  const existing = db.prepare("SELECT * FROM articles WHERE id = ?").get(id) as any;
  if (!existing) return null;
  db.prepare(
    "UPDATE articles SET slug = ?, translations = ?, cover_image = ?, published = ?, tags_json = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(
    input.slug ?? existing.slug,
    input.translations ? JSON.stringify(input.translations) : existing.translations,
    input.cover_image === undefined ? existing.cover_image : input.cover_image,
    input.published === undefined ? existing.published : input.published ? 1 : 0,
    input.tags_json === undefined ? existing.tags_json : input.tags_json,
    id
  );
  return getArticleById(id);
}

export function deleteArticle(id: number): boolean {
  const db = getDb();
  const info = db.prepare("DELETE FROM articles WHERE id = ?").run(id);
  return info.changes > 0;
}

export function articleSlugExists(slug: string, excludeId?: number): boolean {
  const db = getDb();
  const row = excludeId
    ? db.prepare("SELECT id FROM articles WHERE slug = ? AND id != ?").get(slug, excludeId)
    : db.prepare("SELECT id FROM articles WHERE slug = ?").get(slug);
  return !!row;
}