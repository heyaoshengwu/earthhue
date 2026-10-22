"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  return (
    <footer className="bg-earth-900 text-earth-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sage-500 to-earth-600" />
              <span className="font-serif text-xl font-semibold">EarthHue</span>
            </div>
            <p className="text-earth-300 max-w-md text-sm">{t("tagline")}</p>
            <p className="text-earth-400 mt-4 text-sm">{t("contact")}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-earth-100">{t("products")}</h3>
            <ul className="space-y-2 text-earth-300 text-sm">
              <li><Link href={`/${locale}/products`} className="hover:text-white transition-colors">{t("productCatalog")}</Link></li>
              <li><Link href={`/${locale}/pigments`} className="hover:text-white transition-colors">{t("naturalPigments")}</Link></li>
              <li><Link href={`/${locale}/regulations`} className="hover:text-white transition-colors">{t("regulations")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-earth-100">{t("company")}</h3>
            <ul className="space-y-2 text-earth-300 text-sm">
              <li><Link href={`/${locale}/about`} className="hover:text-white transition-colors">{t("aboutUs")}</Link></li>
              <li><Link href={`/${locale}/articles`} className="hover:text-white transition-colors">{t("articles")}</Link></li>
              <li><Link href={`/${locale}/contact`} className="hover:text-white transition-colors">{t("contactUs")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-earth-100">{t("aesthetics")}</h3>
            <ul className="space-y-2 text-earth-300 text-sm">
              <li><Link href={`/${locale}/c2c`} className="hover:text-white transition-colors">{t("aestheticsOverview")}</Link></li>
              <li><Link href={`/${locale}/c2c/stories`} className="hover:text-white transition-colors">{t("aestheticsStories")}</Link></li>
              <li><Link href={`/${locale}/c2c/science`} className="hover:text-white transition-colors">{t("aestheticsScience")}</Link></li>
              <li><Link href={`/${locale}/c2c/gallery`} className="hover:text-white transition-colors">{t("aestheticsGallery")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-earth-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-earth-400 text-sm">
            © {new Date().getFullYear()} EarthHue. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <span className="text-earth-500">{t("links.privacy")}</span>
            <span className="text-earth-500">{t("links.terms")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}