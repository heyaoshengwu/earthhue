import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

const DATA_DIR = path.join(process.cwd(), "data");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const DB_FILE = path.join(DATA_DIR, "site.db");

for (const dir of [DATA_DIR, UPLOAD_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  translations TEXT NOT NULL DEFAULT '{}',
  cover_image TEXT,
  tags_json TEXT,
  published INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  translations TEXT NOT NULL DEFAULT '{}',
  base TEXT,
  form TEXT,
  color TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS product_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  url TEXT NOT NULL,
  alt TEXT,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS about (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  translations TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS about_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slot TEXT NOT NULL,
  url TEXT NOT NULL,
  alt TEXT,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE IF NOT EXISTS home_images (
  key TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  alt TEXT,
  caption TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT DEFAULT '',
  subject TEXT DEFAULT '',
  message TEXT NOT NULL,
  locale TEXT DEFAULT '',
  delivery_status TEXT NOT NULL DEFAULT 'stored',
  delivery_error TEXT,
  ip TEXT DEFAULT '',
  user_agent TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  type TEXT NOT NULL,
  locale TEXT DEFAULT '',
  path TEXT DEFAULT '',
  referrer TEXT DEFAULT '',
  referrer_class TEXT DEFAULT '',
  target TEXT DEFAULT '',
  target_kind TEXT DEFAULT '',
  session TEXT DEFAULT '',
  ua TEXT DEFAULT '',
  ip_hash TEXT DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published, created_at);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(published, sort_order);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_about_images_slot ON about_images(slot, sort_order);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON contact_submissions(created_at);
`;

/**
 * Additive, idempotent column migrations.
 * SQLite has no "ADD COLUMN IF NOT EXISTS", so we inspect the table first.
 */
function migrate(db: Database.Database) {
  const addColumn = (table: string, column: string, ddl: string) => {
    const cols = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
    if (!cols.some((c) => c.name === column)) {
      db.exec(`ALTER TABLE ${table} ADD COLUMN ${ddl}`);
    }
  };
  // Product taxonomy + locale-keyed payload (specs / FAQ) used by the
  // fermentation-series product pages and the GEO answer blocks.
  addColumn("products", "series", "series TEXT");
  addColumn("products", "specs", "specs TEXT");
  addColumn("products", "faq", "faq TEXT");

  // Inquiry qualification and attribution. Without these an inquiry arrives
  // as a name and a sentence: there is no way to route it, no way to report
  // which page produced it, and no way to mine the question it asked back
  // into the page that should have answered it.
  addColumn("contact_submissions", "source_page", "source_page TEXT");
  addColumn("contact_submissions", "referrer", "referrer TEXT");
  addColumn("contact_submissions", "product", "product TEXT");
  addColumn("contact_submissions", "application", "application TEXT");
  addColumn("contact_submissions", "market", "market TEXT");
  addColumn("contact_submissions", "volume", "volume TEXT");
  addColumn("contact_submissions", "grade", "grade TEXT");
  addColumn("contact_submissions", "quantity", "quantity TEXT");
  addColumn("contact_submissions", "intent", "intent TEXT");
  addColumn("contact_submissions", "status", "status TEXT DEFAULT 'new'");
}

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  const db = new Database(DB_FILE);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA);
  migrate(db);
  db.prepare("INSERT OR IGNORE INTO about (id, translations) VALUES (1, ?)").run("{}");
  _db = db;
  return db;
}

export { DATA_DIR, UPLOAD_DIR, DB_FILE };