import { getTranslations } from "next-intl/server";

export default async function C2CLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "c2c" });
  return (
    <div className="bg-gradient-to-b from-sage-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav aria-label="C2C sub-nav" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <span className="font-semibold text-earth-700">{t("sectionTitle")}:</span>
          <a href={`/${locale}/c2c`} className="text-sage-700 hover:text-sage-900">{t("navOverview")}</a>
          <a href={`/${locale}/c2c/stories`} className="text-sage-700 hover:text-sage-900">{t("navStories")}</a>
          <a href={`/${locale}/c2c/science`} className="text-sage-700 hover:text-sage-909">{t("navScience")}</a>
          <a href={`/${locale}/c2c/gallery`} className="text-sage-700 hover:text-sage-909">{t("navGallery")}</a>
        </nav>
      </div>
      {children}
      <div className="bg-earth-50 border-t border-earth-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-10 text-center">
          <p className="text-earth-700 mb-3">{t("crossLinkPrompt")}</p>
          <a href={`/${locale}/b2b`} className="inline-flex items-center gap-2 text-sage-700 font-medium hover:text-sage-900">
            {t("crossLinkCta")} →
          </a>
        </div>
      </div>
    </div>
  );
}
