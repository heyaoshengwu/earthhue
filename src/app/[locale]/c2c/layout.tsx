import { getTranslations } from "next-intl/server";

export default async function C2CLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "c2c" });
  return (
    <div className="bg-gradient-to-b from-sage-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav aria-label="Sub-nav" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a href={`/${locale}/c2c`} className="font-semibold text-sage-700">{t("navOverview")}</a>
          <a href={`/${locale}/c2c/stories`} className="text-earth-700 hover:text-sage-900">{t("navStories")}</a>
          <a href={`/${locale}/c2c/science`} className="text-earth-700 hover:text-sage-900">{t("navScience")}</a>
          <a href={`/${locale}/c2c/gallery`} className="text-earth-700 hover:text-sage-900">{t("navGallery")}</a>
        </nav>
      </div>
      {children}
    </div>
  );
}