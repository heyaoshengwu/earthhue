"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { pigments as defaultPigments, type Pigment } from "@/content/pigments/data";
import { pigmentTranslations } from "@/content/pigments/translations";
import type { Locale } from "@/content/pigments/translations";

const categories = ["all", "plant", "mineral", "microbial"] as const;

export function PigmentFilter() {
  const t = useTranslations("pigments");
  const locale = useLocale() as Locale;
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [pigments, setPigments] = useState<Pigment[]>(defaultPigments);

  useEffect(() => {
    const stored = localStorage.getItem("earthhue_pigments");
    if (stored) {
      setPigments(JSON.parse(stored));
    }
  }, []);

  const categoryLabels: Record<string, string> = {
    all: t("allCategories"),
    plant: t("categories.plant"),
    mineral: t("categories.mineral"),
    microbial: t("categories.microbial"),
  };

  const filtered = activeCategory === "all"
    ? pigments
    : pigments.filter((p) => p.category === activeCategory);

  return (
    <>
      <div className="flex flex-wrap gap-4 mb-12 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-sage-600 text-white"
                : "bg-earth-100 text-earth-700 hover:bg-earth-200"
            }`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((pigment) => {
          const tr = pigmentTranslations[pigment.id]?.[locale] || pigmentTranslations[pigment.id]?.["en"];
          const displayName = pigment.name;
          const displaySource = tr?.source || pigment.source;
          const displayDesc = tr?.desc || pigment.description;
          const displayApps = tr?.apps || pigment.applications;

          return (
            <article
              key={pigment.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-earth-100"
            >
              <div className="h-32 flex" style={{ backgroundColor: "#f5f0e8" }}>
                {pigment.colors.map((color, i) => (
                  <div key={i} className="flex-1" style={{ backgroundColor: color }} />
                ))}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="font-serif text-xl font-semibold text-earth-900">{displayName}</h2>
                    <p className="text-sm text-earth-500">{displaySource}</p>
                  </div>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                    pigment.category === "microbial" ? "bg-sage-100 text-sage-700" :
                    pigment.category === "plant" ? "bg-earth-100 text-earth-700" :
                    "bg-terracotta-100 text-terracotta-700"
                  }`}>
                    {categoryLabels[pigment.category]}
                  </span>
                </div>
                <p className="text-earth-600 text-sm mb-4">{displayDesc}</p>
                <div className="space-y-2 mb-4">
                  <div className="text-xs text-earth-500">
                    <span className="font-medium">CAS:</span> {pigment.casNumber}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {displayApps.map((app) => (
                      <span key={app} className="px-2 py-1 text-xs bg-earth-50 text-earth-600 rounded">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-earth-100 pt-4">
                  <p className="text-xs text-earth-500 mb-2">{t("regulatoryStatus")}:</p>
                  <div className="flex flex-wrap gap-1 text-xs">
                    <span className="px-2 py-1 bg-earth-50 rounded">{pigment.regulations.eu}</span>
                    <span className="px-2 py-1 bg-earth-50 rounded">{pigment.regulations.us}</span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
