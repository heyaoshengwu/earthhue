"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { pigments as defaultPigments, type Pigment } from "@/content/pigments/data";

const ADMIN_PASSWORD = "earthhue2024"; // Change this password
const SESSION_KEY = "earthhue_admin_auth";

const defaultProducts = [
  { id: "eh-curcumin-10", name: "EarthHue Curcumin 10", base: "Curcumin", form: "Oil Dispersible", description: "High stability curcuminoid suspension for oil-based applications", applications: ["Beverages", "Confectionery", "Bakery"], color: "#FF9F1C" },
  { id: "eh-beet-20", name: "EarthHue Beet Red 20", base: "Beet Red", form: "Microencapsulated", description: "Heat-stable beetroot pigment with protective coating", applications: ["Dairy", "Frozen foods", "Snacks"], color: "#C41E3A" },
  { id: "eh-anthocyanin-30", name: "EarthHue Antho-Mix 30", base: "Anthocyanin Blend", form: "Water Soluble", description: "pH-stable grape-black carrot blend for versatile applications", applications: ["Beverages", "Functional foods", "Supplements"], color: "#8B0044" },
  { id: "eh-chlorophyll-40", name: "EarthHue Chlorophyll 40", base: "Chlorophyll", form: "Copper-Free", description: "Natural green with copper-free formulation for clean label", applications: ["Tea beverages", "Mint products", "Health foods"], color: "#2D5016" },
  { id: "eh-astaxanthin-100", name: "EarthHue Asta-Max 100", base: "Astaxanthin (Haematococcus)", form: "Oil Suspension 5%", description: "Premium microbial astaxanthin - 550x stronger antioxidant than vitamin E", applications: ["Aquaculture", "Salmon farming", "Sports nutrition", "Cosmetics"], color: "#FF4500" },
  { id: "eh-phycocyanin-140", name: "EarthHue Cyano-Blue 140", base: "C-Phycocyanin", form: "Powder 25%", description: "Premium blue pigment from Spirulina. GRAS status.", applications: ["Beverages", "Ice cream", "Confectionery", "Dietary supplements"], color: "#0066CC" },
];

type Tab = "pigments" | "products";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("pigments");
  const [pigments, setPigments] = useState<Pigment[]>([]);
  const [products, setProducts] = useState<typeof defaultProducts>([]);
  const [editingItem, setEditingItem] = useState<Pigment | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    const auth = sessionStorage.getItem(SESSION_KEY);
    if (auth === "true") {
      setIsAuthenticated(true);
    }

    const storedPigments = localStorage.getItem("earthhue_pigments");
    const storedProducts = localStorage.getItem("earthhue_products");
    setPigments(storedPigments ? JSON.parse(storedPigments) : defaultPigments);
    setProducts(storedProducts ? JSON.parse(storedProducts) : defaultProducts);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError(false);
      sessionStorage.setItem(SESSION_KEY, "true");
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(SESSION_KEY);
  };

  const savePigments = (data: Pigment[]) => {
    localStorage.setItem("earthhue_pigments", JSON.stringify(data));
    setPigments(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const saveProducts = (data: typeof defaultProducts) => {
    localStorage.setItem("earthhue_products", JSON.stringify(data));
    setProducts(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      if (activeTab === "pigments") {
        savePigments(pigments.filter((p) => p.id !== id));
      } else {
        saveProducts(products.filter((p: any) => p.id !== id));
      }
    }
  };

  // Login screen
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
            <button
              type="submit"
              className="w-full bg-sage-600 text-white py-3 rounded-lg font-medium hover:bg-sage-700 transition-colors"
            >
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

  // Admin panel
  return (
    <div className="section-padding bg-earth-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-earth-900">Admin Panel</h1>
            <p className="text-earth-600">Manage pigments and products content</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/en" className="text-sage-600 hover:text-sage-700 font-medium">
              ← Back to Site
            </Link>
            <button
              onClick={handleLogout}
              className="bg-earth-200 text-earth-700 px-4 py-2 rounded-lg font-medium hover:bg-earth-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {saved && (
          <div className="mb-4 p-3 bg-sage-100 text-sage-700 rounded-lg">
            ✓ Changes saved successfully
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-earth-200">
          <button
            onClick={() => setActiveTab("pigments")}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === "pigments"
                ? "text-sage-600 border-b-2 border-sage-600"
                : "text-earth-500 hover:text-earth-700"
            }`}
          >
            Pigments ({pigments.length})
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === "products"
                ? "text-sage-600 border-b-2 border-sage-600"
                : "text-earth-500 hover:text-earth-700"
            }`}
          >
            Products ({products.length})
          </button>
        </div>

        {/* Add Button */}
        <div className="mb-6">
          <button
            onClick={() => setIsAdding(true)}
            className="bg-sage-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-sage-700 transition-colors"
          >
            + Add New {activeTab === "pigments" ? "Pigment" : "Product"}
          </button>
        </div>

        {/* List */}
        <div className="bg-white rounded-xl shadow-sm border border-earth-100 overflow-hidden">
          {activeTab === "pigments" ? (
            <table className="w-full">
              <thead className="bg-earth-50 border-b border-earth-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-earth-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-earth-600">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-earth-600">Source</th>
                  <th className="text-left py-3 px-4 font-medium text-earth-600">Colors</th>
                  <th className="text-right py-3 px-4 font-medium text-earth-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pigments.map((pigment) => (
                  <tr key={pigment.id} className="border-b border-earth-100 hover:bg-earth-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-earth-900">{pigment.name}</p>
                        <p className="text-xs text-earth-500">{pigment.id}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        pigment.category === "microbial" ? "bg-sage-100 text-sage-700" :
                        pigment.category === "plant" ? "bg-earth-100 text-earth-700" :
                        "bg-terracotta-100 text-terracotta-700"
                      }`}>
                        {pigment.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-earth-600">{pigment.source}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {pigment.colors.map((color, i) => (
                          <div key={i} className="w-6 h-6 rounded-full border border-earth-200" style={{ backgroundColor: color }} />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setEditingItem(pigment)}
                        className="text-sage-600 hover:text-sage-700 font-medium mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pigment.id)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead className="bg-earth-50 border-b border-earth-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-earth-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-earth-600">Base</th>
                  <th className="text-left py-3 px-4 font-medium text-earth-600">Form</th>
                  <th className="text-left py-3 px-4 font-medium text-earth-600">Applications</th>
                  <th className="text-right py-3 px-4 font-medium text-earth-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: any) => (
                  <tr key={product.id} className="border-b border-earth-100 hover:bg-earth-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: product.color }} />
                        <div>
                          <p className="font-medium text-earth-900">{product.name}</p>
                          <p className="text-xs text-earth-500">{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-earth-600">{product.base}</td>
                    <td className="py-3 px-4 text-sm text-earth-600">{product.form}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {product.applications.map((app: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 bg-earth-100 text-earth-600 rounded text-xs">{app}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setEditingItem(product as any)}
                        className="text-sage-600 hover:text-sage-700 font-medium mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {(editingItem || isAdding) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-earth-200">
              <h2 className="text-xl font-bold text-earth-900">
                {isAdding ? "Add New" : "Edit"} {activeTab === "pigments" ? "Pigment" : "Product"}
              </h2>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const data = new FormData(form);

                if (activeTab === "pigments") {
                  const obj: Pigment = {
                    id: data.get("id") as string || `pigment-${Date.now()}`,
                    name: data.get("name") as string,
                    nameZh: data.get("nameZh") as string || "",
                    nameJa: data.get("nameJa") as string || "",
                    nameKo: data.get("nameKo") as string || "",
                    category: data.get("category") as "plant" | "mineral" | "microbial",
                    colors: (data.get("colors") as string).split(",").map(c => c.trim()),
                    applications: (data.get("applications") as string).split(",").map(c => c.trim()),
                    description: data.get("description") as string,
                    source: data.get("source") as string,
                    casNumber: data.get("casNumber") as string || "",
                    einecsNumber: data.get("einecsNumber") as string || "",
                    formulations: (data.get("formulations") as string || "").split(",").map(c => c.trim()),
                    regulations: {
                      eu: data.get("regEu") as string || "",
                      us: data.get("regUs") as string || "",
                      japan: data.get("regJapan") as string || "",
                      korea: data.get("regKorea") as string || "",
                    },
                  };

                  if (isAdding) {
                    savePigments([...pigments, obj]);
                  } else {
                    savePigments(pigments.map(p => p.id === editingItem?.id ? obj : p));
                  }
                } else {
                  const obj = {
                    id: data.get("id") as string || `product-${Date.now()}`,
                    name: data.get("name") as string,
                    base: data.get("base") as string,
                    form: data.get("form") as string,
                    description: data.get("description") as string,
                    applications: (data.get("applications") as string).split(",").map(c => c.trim()),
                    color: data.get("color") as string || "#000000",
                  };

                  if (isAdding) {
                    saveProducts([...products, obj]);
                  } else {
                    saveProducts(products.map((p: any) => p.id === editingItem?.id ? obj : p));
                  }
                }

                setEditingItem(null);
                setIsAdding(false);
              }}
              className="p-6 space-y-4"
            >
              {activeTab === "pigments" ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-1">ID</label>
                      <input name="id" defaultValue={(editingItem as Pigment)?.id || ""} className="w-full px-3 py-2 border border-earth-300 rounded-lg" required={isAdding} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-1">Name (EN)</label>
                      <input name="name" defaultValue={(editingItem as Pigment)?.name || ""} className="w-full px-3 py-2 border border-earth-300 rounded-lg" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-1">Name (中文)</label>
                      <input name="nameZh" defaultValue={(editingItem as Pigment)?.nameZh || ""} className="w-full px-3 py-2 border border-earth-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-1">Category</label>
                      <select name="category" defaultValue={(editingItem as Pigment)?.category || "plant"} className="w-full px-3 py-2 border border-earth-300 rounded-lg">
                        <option value="plant">Plant</option>
                        <option value="microbial">Microbial</option>
                        <option value="mineral">Mineral</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-1">Source</label>
                      <input name="source" defaultValue={(editingItem as Pigment)?.source || ""} className="w-full px-3 py-2 border border-earth-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-1">Colors (hex, comma-separated)</label>
                      <input name="colors" defaultValue={(editingItem as Pigment)?.colors.join(", ") || ""} className="w-full px-3 py-2 border border-earth-300 rounded-lg" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-1">Description</label>
                    <textarea name="description" defaultValue={(editingItem as Pigment)?.description || ""} rows={3} className="w-full px-3 py-2 border border-earth-300 rounded-lg" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-1">CAS Number</label>
                      <input name="casNumber" defaultValue={(editingItem as Pigment)?.casNumber || ""} className="w-full px-3 py-2 border border-earth-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-1">EINECS Number</label>
                      <input name="einecsNumber" defaultValue={(editingItem as Pigment)?.einecsNumber || ""} className="w-full px-3 py-2 border border-earth-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-1">Applications (comma-separated)</label>
                      <input name="applications" defaultValue={(editingItem as Pigment)?.applications.join(", ") || ""} className="w-full px-3 py-2 border border-earth-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-1">Formulations (comma-separated)</label>
                      <input name="formulations" defaultValue={(editingItem as Pigment)?.formulations.join(", ") || ""} className="w-full px-3 py-2 border border-earth-300 rounded-lg" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-1">EU Regulation</label>
                      <input name="regEu" defaultValue={(editingItem as Pigment)?.regulations.eu || ""} className="w-full px-3 py-2 border border-earth-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-1">US Regulation</label>
                      <input name="regUs" defaultValue={(editingItem as Pigment)?.regulations.us || ""} className="w-full px-3 py-2 border border-earth-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-1">Japan Regulation</label>
                      <input name="regJapan" defaultValue={(editingItem as Pigment)?.regulations.japan || ""} className="w-full px-3 py-2 border border-earth-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-1">Korea Regulation</label>
                      <input name="regKorea" defaultValue={(editingItem as Pigment)?.regulations.korea || ""} className="w-full px-3 py-2 border border-earth-300 rounded-lg" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-1">ID</label>
                      <input name="id" defaultValue={(editingItem as any)?.id || ""} className="w-full px-3 py-2 border border-earth-300 rounded-lg" required={isAdding} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-1">Name</label>
                      <input name="name" defaultValue={(editingItem as any)?.name || ""} className="w-full px-3 py-2 border border-earth-300 rounded-lg" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-1">Base Pigment</label>
                      <input name="base" defaultValue={(editingItem as any)?.base || ""} className="w-full px-3 py-2 border border-earth-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-1">Form</label>
                      <input name="form" defaultValue={(editingItem as any)?.form || ""} className="w-full px-3 py-2 border border-earth-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-1">Color (hex)</label>
                      <input name="color" type="color" defaultValue={(editingItem as any)?.color || "#000000"} className="w-full h-10 border border-earth-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-1">Applications (comma-separated)</label>
                      <input name="applications" defaultValue={(editingItem as any)?.applications?.join(", ") || ""} className="w-full px-3 py-2 border border-earth-300 rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-1">Description</label>
                    <textarea name="description" defaultValue={(editingItem as any)?.description || ""} rows={3} className="w-full px-3 py-2 border border-earth-300 rounded-lg" />
                  </div>
                </>
              )}

              <div className="flex gap-4 pt-4 border-t border-earth-200">
                <button
                  type="submit"
                  className="flex-1 bg-sage-600 text-white py-2 rounded-lg font-medium hover:bg-sage-700 transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => { setEditingItem(null); setIsAdding(false); }}
                  className="flex-1 bg-earth-200 text-earth-700 py-2 rounded-lg font-medium hover:bg-earth-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
