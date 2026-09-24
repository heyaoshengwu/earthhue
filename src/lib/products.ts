import { getDb } from "./db";
import { defaultProducts } from "./seed";

export type ProductTranslation = {
  name: string;
  description: string;
  applications: string[];
};

export type Product = {
  id: number;
  slug: string;
  translations: Record<string, ProductTranslation>;
  base: string | null;
  form: string | null;
  color: string | null;
  sort_order: number;
  published: number;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: number;
  product_id: number;
  url: string;
  alt: string | null;
  caption: string | null;
  sort_order: number;
};

function parseRow(row: any): Product {
  return {
    ...row,
    translations: JSON.parse(row.translations || "{}"),
  };
}

function ensureSeed() {
  const db = getDb();
  const count = (db.prepare("SELECT COUNT(*) as c FROM products").get() as any).c;
  if (count === 0) {
    const insertProduct = db.prepare(
      "INSERT INTO products (slug, translations, base, form, color, sort_order, published) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    for (const p of defaultProducts()) {
      insertProduct.run(
        p.slug,
        JSON.stringify(p.translations),
        p.base,
        p.form,
        p.color,
        p.sort_order,
        p.published
      );
    }
  }
}

export function listProducts(opts?: { onlyPublished?: boolean }): Product[] {
  ensureSeed();
  const db = getDb();
  const rows = opts?.onlyPublished
    ? db.prepare("SELECT * FROM products WHERE published = 1 ORDER BY sort_order ASC, id ASC").all()
    : db.prepare("SELECT * FROM products ORDER BY sort_order ASC, id ASC").all();
  return (rows as any[]).map(parseRow);
}

export function getProductBySlug(slug: string): Product | null {
  ensureSeed();
  const db = getDb();
  const row = db.prepare("SELECT * FROM products WHERE slug = ?").get(slug) as any;
  return row ? parseRow(row) : null;
}

export function getProductById(id: number): Product | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as any;
  return row ? parseRow(row) : null;
}

export function createProduct(input: {
  slug: string;
  translations: Record<string, ProductTranslation>;
  base?: string | null;
  form?: string | null;
  color?: string | null;
  sort_order?: number;
  published?: boolean;
}): Product {
  const db = getDb();
  const info = db
    .prepare(
      "INSERT INTO products (slug, translations, base, form, color, sort_order, published) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .run(
      input.slug,
      JSON.stringify(input.translations),
      input.base ?? null,
      input.form ?? null,
      input.color ?? null,
      input.sort_order ?? 0,
      input.published === false ? 0 : 1
    );
  return getProductById(Number(info.lastInsertRowid))!;
}

export function updateProduct(
  id: number,
  input: {
    slug?: string;
    translations?: Record<string, ProductTranslation>;
    base?: string | null;
    form?: string | null;
    color?: string | null;
    sort_order?: number;
    published?: boolean;
  }
): Product | null {
  const db = getDb();
  const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as any;
  if (!existing) return null;
  db.prepare(
    "UPDATE products SET slug=?, translations=?, base=?, form=?, color=?, sort_order=?, published=?, updated_at=datetime('now') WHERE id=?"
  ).run(
    input.slug ?? existing.slug,
    input.translations ? JSON.stringify(input.translations) : existing.translations,
    input.base === undefined ? existing.base : input.base,
    input.form === undefined ? existing.form : input.form,
    input.color === undefined ? existing.color : input.color,
    input.sort_order === undefined ? existing.sort_order : input.sort_order,
    input.published === undefined ? existing.published : input.published ? 1 : 0,
    id
  );
  return getProductById(id);
}

export function deleteProduct(id: number): boolean {
  const db = getDb();
  const info = db.prepare("DELETE FROM products WHERE id = ?").run(id);
  return info.changes > 0;
}

export function productSlugExists(slug: string, excludeId?: number): boolean {
  const db = getDb();
  const row = excludeId
    ? db.prepare("SELECT id FROM products WHERE slug = ? AND id != ?").get(slug, excludeId)
    : db.prepare("SELECT id FROM products WHERE slug = ?").get(slug);
  return !!row;
}

export function listProductImages(productId: number): ProductImage[] {
  const db = getDb();
  return db
    .prepare(
      "SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC"
    )
    .all(productId) as ProductImage[];
}

export function addProductImage(input: {
  product_id: number;
  url: string;
  alt?: string | null;
  caption?: string | null;
  sort_order?: number;
}): ProductImage {
  const db = getDb();
  const info = db
    .prepare(
      "INSERT INTO product_images (product_id, url, alt, caption, sort_order) VALUES (?, ?, ?, ?, ?)"
    )
    .run(
      input.product_id,
      input.url,
      input.alt ?? null,
      input.caption ?? null,
      input.sort_order ?? 0
    );
  return db.prepare("SELECT * FROM product_images WHERE id = ?").get(info.lastInsertRowid) as ProductImage;
}

export function updateProductImage(
  id: number,
  input: { url?: string; alt?: string | null; caption?: string | null; sort_order?: number }
): ProductImage | null {
  const db = getDb();
  const existing = db.prepare("SELECT * FROM product_images WHERE id = ?").get(id) as any;
  if (!existing) return null;
  db.prepare(
    "UPDATE product_images SET url=?, alt=?, caption=?, sort_order=? WHERE id=?"
  ).run(
    input.url ?? existing.url,
    input.alt === undefined ? existing.alt : input.alt,
    input.caption === undefined ? existing.caption : input.caption,
    input.sort_order === undefined ? existing.sort_order : input.sort_order,
    id
  );
  return db.prepare("SELECT * FROM product_images WHERE id = ?").get(id) as ProductImage;
}

export function deleteProductImage(id: number): boolean {
  const db = getDb();
  const info = db.prepare("DELETE FROM product_images WHERE id = ?").run(id);
  return info.changes > 0;
}