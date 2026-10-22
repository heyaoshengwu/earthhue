"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export function Header() {
  const t = useTranslations("nav");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  const navItems = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/products`, label: t("products") },
    { href: `/${locale}/c2c`, label: t("pigments") },
    { href: `/${locale}/articles`, label: t("articles") },
    { href: `/${locale}/regulations`, label: t("regulations") },
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];

  return (
    <header className="bg-white border-b border-earth-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sage-500 to-earth-600" />
              <span className="font-serif text-xl font-semibold text-earth-900">EarthHue</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== `/${locale}` && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-sage-700 border-b-2 border-sage-600 pb-0.5"
                      : "text-earth-600 hover:text-earth-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <LanguageSwitcher currentLocale={locale} />
          </div>

          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher currentLocale={locale} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-earth-600 hover:bg-earth-100"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-earth-200">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block py-2 text-base font-medium ${
                  pathname === item.href ? "text-sage-600" : "text-earth-600"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}

function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const locales = [
    { code: "en", label: "EN" },
    { code: "zh", label: "中文" },
    { code: "ja", label: "日本語" },
    { code: "ko", label: "한국어" },
    { code: "es", label: "ES" },
    { code: "fr", label: "FR" },
    { code: "de", label: "DE" },
  ];

  return (
    <select
      className="text-sm bg-transparent border border-earth-300 rounded-md px-2 py-1 text-earth-700 cursor-pointer hover:border-earth-400"
      value={currentLocale}
      onChange={(e) => {
        const newLocale = e.target.value;
        const segments = pathname.split('/');
        segments[1] = newLocale;
        window.location.href = segments.join('/');
      }}
    >
      {locales.map((loc) => (
        <option key={loc.code} value={loc.code}>{loc.label}</option>
      ))}
    </select>
  );
}
