import { getTranslations } from "next-intl/server";

export default async function B2BLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "b2b" });
  return (
    <div className="bg-gradient-to-b from-earth-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav aria-label="Sub-nav" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a href={`/${locale}/b2b`} className="font-semibold text-sage-700">{t("navOverview")}</a>
          <a href={`/${locale}/b2b/capability`} className="text-earth-700 hover:text-sage-700">{t("navCapability")}</a>
          <a href={`/${locale}/b2b/certifications`} className="text-earth-700 hover:text-sage-700">{t("navCertifications")}</a>
          <a href={`/${locale}/b2b/samples`} className="text-earth-700 hover:text-sage-700">{t("navSamples")}</a>
          <a href={`/${locale}/b2b/factory-visit`} className="text-earth-700 hover:text-sage-700">{t("navFactoryVisit")}</a>
          <a href={`/${locale}/b2b/contact`} className="text-earth-700 hover:text-sage-700">{t("navContact")}</a>
        </nav>
      </div>
      {children}
    </div>
  );
}