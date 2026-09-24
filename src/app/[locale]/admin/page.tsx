"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const ADMIN_PASSWORD = "earthhue2024";
const SESSION_KEY = "earthhue_admin_auth";

type Locale = "en" | "zh" | "ja" | "ko" | "es" | "fr" | "de";
const LOCALES: Locale[] = ["en", "zh", "ja", "ko", "es", "fr", "de"];
const LOCALE_LABEL: Record<Locale, string> = {
  en: "EN",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  es: "ES",
  fr: "FR",
  de: "DE",
};

type Tab = "articles" | "products" | "about" | "home";

type ArticleTranslation = { title: string; excerpt: string; body: string };
type ProductTranslation = { name: string; description: string; applications: string[] };

type Article = {
  id: number;
  slug: string;
  translations: Record<string, ArticleTranslation>;
  cover_image: string | null;
  published: number;
  created_at: string;
  updated_at: string;
};

type Product = {
  id: number;
  slug: string;
  translations: Record<string, ProductTranslation>;
  base: string | null;
  form: string | null;
  color: string | null;
  sort_order: number;
  published: number;
};

type ProductImage = {
  id: number;
  product_id: number;
  url: string;
  alt: string | null;
  caption: string | null;
  sort_order: number;
};

type AboutImage = {
  id: number;
  slot: string;
  url: string;
  alt: string | null;
  caption: string | null;
  sort_order: number;
};

type HomeImage = {
  key: string;
  url: string;
  alt: string | null;
  caption: string | null;
  updated_at: string;
};

const HOME_IMAGE_SLOTS: { key: string; label: string; desc: string }[] = [
  { key: "hero", label: "Hero 主图", desc: "首页顶部主视觉，建议 16:9 或更宽（≥ 1600×900）。" },
  { key: "brand", label: "品牌/工艺图", desc: "展示在 Hero 下方，用于介绍公司/工艺流程。" },
  { key: "aesthetics", label: "色彩美学预览图", desc: "首页底部『进入色彩美学』旁的小图，建议方形或竖图。" },
];

type AboutTranslations = {
  title?: string;
  subtitle?: string;
  missionTitle?: string;
  mission?: string;
  visionTitle?: string;
  vision?: string;
  whyTitle?: string;
  whyBody?: string;
  commitmentTitle?: string;
  commitmentItems?: { title: string; desc: string }[];
  certificationsTitle?: string;
  certifications?: string[];
};

async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiSend<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function uploadFile(file: File, subdir = "general"): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("subdir", subdir);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.url as string;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("articles");
  const [articles, setArticles] = useState<Article[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productImagesMap, setProductImagesMap] = useState<Record<number, string>>({});
  const [aboutTranslations, setAboutTranslations] = useState<Record<string, AboutTranslations>>({});
  const [aboutImages, setAboutImages] = useState<AboutImage[]>([]);
  const [homeImages, setHomeImages] = useState<HomeImage[]>([]);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    void refresh();
  }, [isAuthenticated]);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const [articlesRes, productsRes, aboutRes, aboutImagesRes, homeImagesRes] = await Promise.all([
        apiGet<{ items: Article[] }>("/api/articles"),
        apiGet<{ items: Product[] }>("/api/products"),
        apiGet<{ translations: Record<string, AboutTranslations> }>("/api/about/content"),
        apiGet<{ items: AboutImage[] }>("/api/about/images"),
        apiGet<{ items: HomeImage[] }>("/api/home/images"),
      ]);
      setArticles(articlesRes.items);
      setProducts(productsRes.items);
      setAboutTranslations(aboutRes.translations || {});
      setAboutImages(aboutImagesRes.items || []);
      setHomeImages(homeImagesRes.items || []);

      const firstImageMap: Record<number, string> = {};
      for (const p of productsRes.items) {
        const imgRes = await apiGet<{ items: ProductImage[] }>(`/api/products/${p.slug}/images`);
        firstImageMap[p.id] = imgRes.items?.[0]?.url || "";
      }
      setProductImagesMap(firstImageMap);
    } catch (e: any) {
      setError(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  function flash(msg: string) {
    setSaved(msg);
    setTimeout(() => setSaved(null), 2200);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError(false);
      sessionStorage.setItem(SESSION_KEY, "true");
    } else {
      setAuthError(true);
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    sessionStorage.removeItem(SESSION_KEY);
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-earth-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-sage-500 to-earth-600 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-earth-900">Admin Login</h1>
            <p className="text-earth-600 mt-2">Enter password to access the admin panel</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none"
                autoFocus
              />
            </div>
            {authError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                Incorrect password. Please try again.
              </div>
            )}
            <button type="submit" className="w-full bg-sage-600 text-white py-3 rounded-lg font-medium hover:bg-sage-700 transition-colors">
              Login
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/en" className="text-sage-600 hover:text-sage-700 text-sm">
              ← Back to website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-earth-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-earth-900">Admin Panel</h1>
            <p className="text-earth-600">Manage articles, products, and About content.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/en" className="text-sage-600 hover:text-sage-700 font-medium">
              ← Back to Site
            </Link>
            <button onClick={handleLogout} className="bg-earth-200 text-earth-700 px-4 py-2 rounded-lg font-medium hover:bg-earth-300 transition-colors">
              Logout
            </button>
          </div>
        </div>

        {saved && (
          <div className="mb-4 p-3 bg-sage-100 text-sage-700 rounded-lg">✓ {saved}</div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>
        )}

        <div className="flex gap-4 mb-6 border-b border-earth-200">
          {(["articles", "products", "about", "home"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-4 font-medium transition-colors capitalize ${
                activeTab === tab
                  ? "text-sage-600 border-b-2 border-sage-600"
                  : "text-earth-500 hover:text-earth-700"
              }`}
            >
              {tab === "articles" && `Articles (${articles.length})`}
              {tab === "products" && `Products (${products.length})`}
              {tab === "about" && "About Us"}
              {tab === "home" && "Home Images"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-earth-500 py-8">Loading…</div>
        ) : (
          <>
            {activeTab === "articles" && (
              <ArticlesTab
                articles={articles}
                onChange={refresh}
                onFlash={flash}
                onError={setError}
              />
            )}
            {activeTab === "products" && (
              <ProductsTab
                products={products}
                firstImages={productImagesMap}
                onChange={refresh}
                onFlash={flash}
                onError={setError}
              />
            )}
            {activeTab === "about" && (
              <AboutTab
                translations={aboutTranslations}
                images={aboutImages}
                onChange={refresh}
                onFlash={flash}
                onError={setError}
              />
            )}
            {activeTab === "home" && (
              <HomeImagesTab
                images={homeImages}
                onChange={refresh}
                onFlash={flash}
                onError={setError}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ArticlesTab({
  articles,
  onChange,
  onFlash,
  onError,
}: {
  articles: Article[];
  onChange: () => Promise<void>;
  onFlash: (msg: string) => void;
  onError: (msg: string) => void;
}) {
  const [editing, setEditing] = useState<Article | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <button
        onClick={() => setCreating(true)}
        className="mb-6 bg-sage-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-sage-700 transition-colors"
      >
        + Add Article
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-earth-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-earth-50 border-b border-earth-200">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-earth-600">Title</th>
              <th className="text-left py-3 px-4 font-medium text-earth-600">Slug</th>
              <th className="text-left py-3 px-4 font-medium text-earth-600">Status</th>
              <th className="text-left py-3 px-4 font-medium text-earth-600">Updated</th>
              <th className="text-right py-3 px-4 font-medium text-earth-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => {
              const tr = a.translations.en || Object.values(a.translations)[0];
              return (
                <tr key={a.id} className="border-b border-earth-100 hover:bg-earth-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {a.cover_image && (
                        <img src={a.cover_image} alt="" className="w-10 h-10 rounded object-cover" />
                      )}
                      <span className="font-medium text-earth-900">{tr?.title || a.slug}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-earth-600 font-mono">{a.slug}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        a.published ? "bg-sage-100 text-sage-700" : "bg-earth-100 text-earth-600"
                      }`}
                    >
                      {a.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-earth-500">
                    {new Date(a.updated_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setEditing(a)}
                      className="text-sage-600 hover:text-sage-700 font-medium mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm("Delete this article?")) return;
                        try {
                          await apiSend(`/api/articles/${a.slug}`, { method: "DELETE" });
                          onFlash("Article deleted");
                          await onChange();
                        } catch (e: any) {
                          onError(e?.message || "Delete failed");
                        }
                      }}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {articles.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-earth-500">
                  No articles yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <ArticleEditor
          article={editing}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSaved={async () => {
            onFlash(editing ? "Article updated" : "Article created");
            setEditing(null);
            setCreating(false);
            await onChange();
          }}
          onError={onError}
        />
      )}
    </div>
  );
}

function ArticleEditor({
  article,
  onClose,
  onSaved,
  onError,
}: {
  article: Article | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
  onError: (msg: string) => void;
}) {
  const isNew = !article;
  const [activeLocale, setActiveLocale] = useState<Locale>("zh");
  const [slug, setSlug] = useState(article?.slug || "");
  const [published, setPublished] = useState(article ? !!article.published : true);
  const [coverImage, setCoverImage] = useState<string | null>(article?.cover_image || null);
  const [translations, setTranslations] = useState<Record<string, ArticleTranslation>>(
    article?.translations ||
      ({
        en: { title: "", excerpt: "", body: "" },
        zh: { title: "", excerpt: "", body: "" },
      } as Record<string, ArticleTranslation>)
  );
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(isNew);

  function ensureLocale(loc: Locale): ArticleTranslation {
    if (!translations[loc]) {
      setTranslations((prev) => ({ ...prev, [loc]: { title: "", excerpt: "", body: "" } }));
      return { title: "", excerpt: "", body: "" };
    }
    return translations[loc];
  }

  function setField<K extends keyof ArticleTranslation>(loc: Locale, key: K, value: ArticleTranslation[K]) {
    setTranslations((prev) => ({
      ...prev,
      [loc]: { ...(prev[loc] || { title: "", excerpt: "", body: "" }), [key]: value },
    }));
    if (isNew && autoSlug && key === "title" && loc === "zh") {
      setSlug(slugify(String(value)));
    }
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile(file, "articles");
      setCoverImage(url);
    } catch (err: any) {
      onError(err?.message || "Upload failed");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const cleaned: Record<string, ArticleTranslation> = {};
      for (const [k, v] of Object.entries(translations)) {
        if (v && v.title.trim()) cleaned[k] = v;
      }
      const body = {
        slug,
        translations: cleaned,
        cover_image: coverImage,
        published,
      };
      if (article) {
        await apiSend(`/api/articles/${article.slug}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      } else {
        await apiSend("/api/articles", {
          method: "POST",
          body: JSON.stringify(body),
        });
      }
      await onSaved();
    } catch (err: any) {
      onError(err?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const cur = ensureLocale(activeLocale);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-earth-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-earth-900">
            {article ? "Edit Article" : "New Article"}
          </h2>
          <button onClick={onClose} className="text-earth-500 hover:text-earth-700">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Slug</label>
              <input
                value={slug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value));
                  setAutoSlug(false);
                }}
                placeholder="my-article"
                className="w-full px-3 py-2 border border-earth-300 rounded-lg"
                required
              />
            </div>
            <div className="flex items-end gap-3">
              <label className="flex items-center gap-2 text-sm text-earth-700">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />
                Published
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Cover Image</label>
            <div className="flex items-center gap-4">
              {coverImage ? (
                <img src={coverImage} alt="" className="w-24 h-16 object-cover border border-earth-200 rounded" />
              ) : (
                <div className="w-24 h-16 bg-earth-100 border border-earth-200 rounded flex items-center justify-center text-earth-400 text-xs">
                  No image
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="text-sm"
              />
              {coverImage && (
                <button
                  type="button"
                  onClick={() => setCoverImage(null)}
                  className="text-red-600 text-sm hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-2 border-b border-earth-200 pb-2">
            {LOCALES.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => {
                  ensureLocale(loc);
                  setActiveLocale(loc);
                }}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  activeLocale === loc
                    ? "bg-sage-600 text-white"
                    : "bg-earth-100 text-earth-700 hover:bg-earth-200"
                }`}
              >
                {LOCALE_LABEL[loc]}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Title ({activeLocale})</label>
              <input
                value={cur.title}
                onChange={(e) => setField(activeLocale, "title", e.target.value)}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Excerpt ({activeLocale})</label>
              <textarea
                value={cur.excerpt}
                onChange={(e) => setField(activeLocale, "excerpt", e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Body ({activeLocale})</label>
              <textarea
                value={cur.body}
                onChange={(e) => setField(activeLocale, "body", e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg font-mono text-sm"
                placeholder="Paragraphs separated by blank lines"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-earth-200">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-sage-600 text-white py-2 rounded-lg font-medium hover:bg-sage-700 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-earth-200 text-earth-700 py-2 rounded-lg font-medium hover:bg-earth-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProductsTab({
  products,
  firstImages,
  onChange,
  onFlash,
  onError,
}: {
  products: Product[];
  firstImages: Record<number, string>;
  onChange: () => Promise<void>;
  onFlash: (msg: string) => void;
  onError: (msg: string) => void;
}) {
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <button
        onClick={() => setCreating(true)}
        className="mb-6 bg-sage-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-sage-700 transition-colors"
      >
        + Add Product
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-earth-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-earth-50 border-b border-earth-200">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-earth-600">Name</th>
              <th className="text-left py-3 px-4 font-medium text-earth-600">Base / Form</th>
              <th className="text-left py-3 px-4 font-medium text-earth-600">Status</th>
              <th className="text-right py-3 px-4 font-medium text-earth-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const tr = p.translations.zh || p.translations.en || Object.values(p.translations)[0];
              const cover = firstImages[p.id];
              return (
                <tr key={p.id} className="border-b border-earth-100 hover:bg-earth-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {cover ? (
                        <img src={cover} alt="" className="w-10 h-10 rounded object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full" style={{ backgroundColor: p.color || "#999" }} />
                      )}
                      <div>
                        <p className="font-medium text-earth-900">{tr?.name || p.slug}</p>
                        <p className="text-xs text-earth-500 font-mono">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-earth-600">
                    {p.base} / {p.form}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        p.published ? "bg-sage-100 text-sage-700" : "bg-earth-100 text-earth-600"
                      }`}
                    >
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setEditing(p)}
                      className="text-sage-600 hover:text-sage-700 font-medium mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm("Delete this product?")) return;
                        try {
                          await apiSend(`/api/products/${p.slug}`, { method: "DELETE" });
                          onFlash("Product deleted");
                          await onChange();
                        } catch (e: any) {
                          onError(e?.message || "Delete failed");
                        }
                      }}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-earth-500">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <ProductEditor
          product={editing}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSaved={async () => {
            onFlash(editing ? "Product updated" : "Product created");
            setEditing(null);
            setCreating(false);
            await onChange();
          }}
          onError={onError}
          onFlash={onFlash}
        />
      )}
    </div>
  );
}

function ProductEditor({
  product,
  onClose,
  onSaved,
  onError,
  onFlash,
}: {
  product: Product | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
  onError: (msg: string) => void;
  onFlash: (msg: string) => void;
}) {
  const isNew = !product;
  const [activeLocale, setActiveLocale] = useState<Locale>("zh");
  const [slug, setSlug] = useState(product?.slug || "");
  const [base, setBase] = useState(product?.base || "");
  const [form, setForm] = useState(product?.form || "");
  const [color, setColor] = useState(product?.color || "#888888");
  const [sortOrder, setSortOrder] = useState(product?.sort_order ?? 0);
  const [published, setPublished] = useState(product ? !!product.published : true);
  const [translations, setTranslations] = useState<Record<string, ProductTranslation>>(
    product?.translations ||
      ({
        en: { name: "", description: "", applications: [] },
        zh: { name: "", description: "", applications: [] },
      } as Record<string, ProductTranslation>)
  );
  const [images, setImages] = useState<ProductImage[]>([]);
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(isNew);

  useEffect(() => {
    if (!product) return;
    void apiGet<{ items: ProductImage[] }>(`/api/products/${product.slug}/images`).then((r) =>
      setImages(r.items || [])
    );
  }, [product]);

  function ensureLocale(loc: Locale): ProductTranslation {
    if (!translations[loc]) {
      setTranslations((prev) => ({ ...prev, [loc]: { name: "", description: "", applications: [] } }));
      return { name: "", description: "", applications: [] };
    }
    return translations[loc];
  }

  function setField<K extends keyof ProductTranslation>(
    loc: Locale,
    key: K,
    value: ProductTranslation[K]
  ) {
    setTranslations((prev) => ({
      ...prev,
      [loc]: { ...(prev[loc] || { name: "", description: "", applications: [] }), [key]: value },
    }));
    if (isNew && autoSlug && key === "name" && loc === "zh") {
      setSlug(slugify(String(value)));
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !product) return;
    try {
      for (const file of Array.from(files)) {
        const url = await uploadFile(file, "products");
        const res = await apiSend<{ item: ProductImage }>(`/api/products/${product.slug}/images`, {
          method: "POST",
          body: JSON.stringify({ url, sort_order: images.length }),
        });
        setImages((prev) => [...prev, res.item]);
      }
      onFlash("Images uploaded");
    } catch (err: any) {
      onError(err?.message || "Upload failed");
    }
  }

  async function removeImage(id: number) {
    if (!product) return;
    if (!confirm("Remove this image?")) return;
    try {
      await apiSend(`/api/products/${product.slug}/images?id=${id}`, { method: "DELETE" });
      setImages((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      onError(err?.message || "Delete failed");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const cleaned: Record<string, ProductTranslation> = {};
      for (const [k, v] of Object.entries(translations)) {
        if (v && v.name.trim()) {
          cleaned[k] = {
            name: v.name,
            description: v.description || "",
            applications: v.applications || [],
          };
        }
      }
      const body = {
        slug,
        translations: cleaned,
        base,
        form,
        color,
        sort_order: sortOrder,
        published,
      };
      if (product) {
        await apiSend(`/api/products/${product.slug}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      } else {
        await apiSend("/api/products", {
          method: "POST",
          body: JSON.stringify(body),
        });
      }
      await onSaved();
    } catch (err: any) {
      onError(err?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const cur = ensureLocale(activeLocale);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-earth-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-earth-900">
            {product ? "Edit Product" : "New Product"}
          </h2>
          <button onClick={onClose} className="text-earth-500 hover:text-earth-700">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Slug</label>
              <input
                value={slug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value));
                  setAutoSlug(false);
                }}
                placeholder="eh-product"
                className="w-full px-3 py-2 border border-earth-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10 border border-earth-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Base Pigment</label>
              <input
                value={base}
                onChange={(e) => setBase(e.target.value)}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Form</label>
              <input
                value={form}
                onChange={(e) => setForm(e.target.value)}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-earth-700">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />
                Published
              </label>
            </div>
          </div>

          <div className="flex gap-2 border-b border-earth-200 pb-2">
            {LOCALES.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => {
                  ensureLocale(loc);
                  setActiveLocale(loc);
                }}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  activeLocale === loc
                    ? "bg-sage-600 text-white"
                    : "bg-earth-100 text-earth-700 hover:bg-earth-200"
                }`}
              >
                {LOCALE_LABEL[loc]}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Name ({activeLocale})</label>
              <input
                value={cur.name}
                onChange={(e) => setField(activeLocale, "name", e.target.value)}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">
                Description ({activeLocale})
              </label>
              <textarea
                value={cur.description}
                onChange={(e) => setField(activeLocale, "description", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">
                Applications ({activeLocale}, comma-separated)
              </label>
              <input
                value={cur.applications.join(", ")}
                onChange={(e) =>
                  setField(
                    activeLocale,
                    "applications",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
                className="w-full px-3 py-2 border border-earth-300 rounded-lg"
              />
            </div>
          </div>

          {product && (
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">Product Images</label>
              <div className="grid grid-cols-4 gap-3 mb-3">
                {images.map((img) => (
                  <div key={img.id} className="relative group">
                    <img src={img.url} alt="" className="w-full h-24 object-cover rounded border border-earth-200" />
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="text-sm"
              />
              <p className="text-xs text-earth-500 mt-1">Upload multiple product images.</p>
            </div>
          )}
          {!product && (
            <p className="text-xs text-earth-500">
              Save the product first to upload images.
            </p>
          )}

          <div className="flex gap-4 pt-4 border-t border-earth-200">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-sage-600 text-white py-2 rounded-lg font-medium hover:bg-sage-700 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-earth-200 text-earth-700 py-2 rounded-lg font-medium hover:bg-earth-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AboutTab({
  translations,
  images,
  onChange,
  onFlash,
  onError,
}: {
  translations: Record<string, AboutTranslations>;
  images: AboutImage[];
  onChange: () => Promise<void>;
  onFlash: (msg: string) => void;
  onError: (msg: string) => void;
}) {
  const [activeLocale, setActiveLocale] = useState<Locale>("zh");
  const [data, setData] = useState<Record<string, AboutTranslations>>(translations);
  const [saving, setSaving] = useState(false);

  useEffect(() => setData(translations), [translations]);

  const cur: AboutTranslations = data[activeLocale] || {};
  function setField<K extends keyof AboutTranslations>(key: K, value: AboutTranslations[K]) {
    setData((prev) => ({ ...prev, [activeLocale]: { ...(prev[activeLocale] || {}), [key]: value } }));
  }

  async function save() {
    setSaving(true);
    try {
      await apiSend("/api/about/content", {
        method: "PUT",
        body: JSON.stringify({ translations: data }),
      });
      onFlash("About content saved");
      await onChange();
    } catch (e: any) {
      onError(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function uploadAboutImage(slot: string, file: File, caption?: string) {
    try {
      const url = await uploadFile(file, "about");
      await apiSend("/api/about/images", {
        method: "POST",
        body: JSON.stringify({ slot, url, caption }),
      });
      onFlash("Image added");
      await onChange();
    } catch (err: any) {
      onError(err?.message || "Upload failed");
    }
  }

  async function deleteImage(id: number) {
    if (!confirm("Remove this image?")) return;
    try {
      await apiSend(`/api/about/images?id=${id}`, { method: "DELETE" });
      onFlash("Image removed");
      await onChange();
    } catch (err: any) {
      onError(err?.message || "Delete failed");
    }
  }

  function renderImageSlot(slot: string, label: string) {
    const slotImages = images.filter((i) => i.slot === slot);
    return (
      <div className="bg-white p-4 rounded-xl border border-earth-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-earth-900">{label}</h4>
          <span className="text-xs text-earth-500">{slotImages.length} image(s)</span>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-3">
          {slotImages.map((img) => (
            <div key={img.id} className="relative group">
              <img src={img.url} alt="" className="w-full h-24 object-cover rounded border border-earth-200" />
              {img.caption && (
                <p className="text-xs text-earth-500 mt-1 line-clamp-1">{img.caption}</p>
              )}
              <button
                onClick={() => deleteImage(img.id)}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <label className="block">
          <input
            type="file"
            accept="image/*"
            multiple
            className="text-sm"
            onChange={async (e) => {
              const files = e.target.files;
              if (!files) return;
              for (const file of Array.from(files)) {
                const caption = prompt(`Caption for ${file.name}?`, "") || undefined;
                await uploadAboutImage(slot, file, caption);
              }
            }}
          />
        </label>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-earth-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-2">
            {LOCALES.map((loc) => (
              <button
                key={loc}
                onClick={() => setActiveLocale(loc)}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  activeLocale === loc
                    ? "bg-sage-600 text-white"
                    : "bg-earth-100 text-earth-700 hover:bg-earth-200"
                }`}
              >
                {LOCALE_LABEL[loc]}
              </button>
            ))}
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="bg-sage-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-sage-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Content"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Page Title">
            <input
              value={cur.title || ""}
              onChange={(e) => setField("title", e.target.value)}
              className="w-full px-3 py-2 border border-earth-300 rounded-lg"
            />
          </Field>
          <Field label="Subtitle">
            <input
              value={cur.subtitle || ""}
              onChange={(e) => setField("subtitle", e.target.value)}
              className="w-full px-3 py-2 border border-earth-300 rounded-lg"
            />
          </Field>
          <Field label="Mission Title">
            <input
              value={cur.missionTitle || ""}
              onChange={(e) => setField("missionTitle", e.target.value)}
              className="w-full px-3 py-2 border border-earth-300 rounded-lg"
            />
          </Field>
          <Field label="Vision Title">
            <input
              value={cur.visionTitle || ""}
              onChange={(e) => setField("visionTitle", e.target.value)}
              className="w-full px-3 py-2 border border-earth-300 rounded-lg"
            />
          </Field>
          <Field label="Mission" full>
            <textarea
              value={cur.mission || ""}
              onChange={(e) => setField("mission", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-earth-300 rounded-lg"
            />
          </Field>
          <Field label="Vision" full>
            <textarea
              value={cur.vision || ""}
              onChange={(e) => setField("vision", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-earth-300 rounded-lg"
            />
          </Field>
          <Field label="Why Title">
            <input
              value={cur.whyTitle || ""}
              onChange={(e) => setField("whyTitle", e.target.value)}
              className="w-full px-3 py-2 border border-earth-300 rounded-lg"
            />
          </Field>
          <Field label="Why Body" full>
            <textarea
              value={cur.whyBody || ""}
              onChange={(e) => setField("whyBody", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-earth-300 rounded-lg"
            />
          </Field>
          <Field label="Commitment Title">
            <input
              value={cur.commitmentTitle || ""}
              onChange={(e) => setField("commitmentTitle", e.target.value)}
              className="w-full px-3 py-2 border border-earth-300 rounded-lg"
            />
          </Field>
          <Field label="Certifications Title">
            <input
              value={cur.certificationsTitle || ""}
              onChange={(e) => setField("certificationsTitle", e.target.value)}
              className="w-full px-3 py-2 border border-earth-300 rounded-lg"
            />
          </Field>
          <Field label="Commitments (one per line: Title | Description)" full>
            <textarea
              value={(cur.commitmentItems || []).map((c) => `${c.title} | ${c.desc}`).join("\n")}
              onChange={(e) => {
                const list = e.target.value
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((line) => {
                    const [t, ...rest] = line.split("|");
                    return { title: (t || "").trim(), desc: rest.join("|").trim() };
                  });
                setField("commitmentItems", list);
              }}
              rows={6}
              className="w-full px-3 py-2 border border-earth-300 rounded-lg font-mono text-sm"
              placeholder="Quality Assurance | Every batch tested...&#10;Sustainable Sourcing | Partnering with..."
            />
          </Field>
          <Field label="Certifications (comma-separated)" full>
            <input
              value={(cur.certifications || []).join(", ")}
              onChange={(e) =>
                setField(
                  "certifications",
                  e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                )
              }
              className="w-full px-3 py-2 border border-earth-300 rounded-lg"
            />
          </Field>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {renderImageSlot("hero", "Hero Images (about page top)")}
        {renderImageSlot("factory", "Factory Images")}
        {renderImageSlot("team", "Team Images")}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium text-earth-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

function HomeImagesTab({
  images,
  onChange,
  onFlash,
  onError,
}: {
  images: HomeImage[];
  onChange: () => Promise<void>;
  onFlash: (msg: string) => void;
  onError: (msg: string) => void;
}) {
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [altInputs, setAltInputs] = useState<Record<string, string>>({});
  const fileInputsRef = useRef<Record<string, HTMLInputElement | null>>({});

  function findImage(key: string): HomeImage | undefined {
    return images.find((i) => i.key === key);
  }

  async function handleUpload(key: string, file: File) {
    setBusyKey(key);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("key", key);
      const alt = altInputs[key]?.trim();
      if (alt) fd.append("alt", alt);
      const res = await fetch("/api/home/images", { method: "POST", body: fd });
      if (!res.ok) throw new Error(await res.text());
      onFlash(`${key} 图已更新`);
      setAltInputs((prev) => ({ ...prev, [key]: "" }));
      await onChange();
    } catch (err: any) {
      onError(err?.message || "上传失败");
    } finally {
      setBusyKey(null);
    }
  }

  async function handleDelete(key: string) {
    if (!confirm(`删除「${key}」位置的图片？此操作会同时移除服务器上的文件。`)) return;
    setBusyKey(key);
    try {
      const res = await fetch(`/api/home/images/${key}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      onFlash(`${key} 图已删除`);
      await onChange();
    } catch (err: any) {
      onError(err?.message || "删除失败");
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl border border-earth-200">
        <h3 className="font-semibold text-earth-900 mb-1">首页图片</h3>
        <p className="text-sm text-earth-600">
          首页共 3 个固定槽位：Hero 主图、品牌/工艺图、色彩美学预览图。每个槽位只保留一张图，上传会自动替换。
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {HOME_IMAGE_SLOTS.map((slot) => {
          const current = findImage(slot.key);
          return (
            <div key={slot.key} className="bg-white rounded-xl border border-earth-200 overflow-hidden">
              <div className="p-4 border-b border-earth-100">
                <h4 className="font-semibold text-earth-900">{slot.label}</h4>
                <p className="text-xs text-earth-500 mt-1">{slot.desc}</p>
                <p className="text-xs text-earth-400 mt-1 font-mono">key: {slot.key}</p>
              </div>

              <div className="aspect-video bg-earth-50 flex items-center justify-center overflow-hidden">
                {current ? (
                  <img src={current.url} alt={current.alt || ""} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-earth-400 px-4 py-8">
                    <svg className="w-10 h-10 mx-auto mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs">暂无图片</p>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3">
                <label className="block text-sm font-medium text-earth-700">
                  Alt 文本（可选）
                </label>
                <input
                  type="text"
                  value={altInputs[slot.key] ?? current?.alt ?? ""}
                  onChange={(e) => setAltInputs((prev) => ({ ...prev, [slot.key]: e.target.value }))}
                  placeholder="描述图片内容，便于 SEO/无障碍"
                  className="w-full px-3 py-2 border border-earth-300 rounded-lg text-sm"
                />

                <input
                  ref={(el) => {
                    fileInputsRef.current[slot.key] = el;
                  }}
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(slot.key, f);
                    e.target.value = "";
                  }}
                />

                {current && (
                  <div className="flex items-center justify-between pt-2 border-t border-earth-100">
                    <div className="text-xs text-earth-500 truncate" title={current.url}>
                      {current.url.split("/").pop()}
                    </div>
                    <button
                      onClick={() => handleDelete(slot.key)}
                      disabled={busyKey === slot.key}
                      className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      {busyKey === slot.key ? "处理中…" : "删除"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}