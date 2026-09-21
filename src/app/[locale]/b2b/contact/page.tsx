import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "b2b.contact" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `https://earthhue.net/${locale}/b2b/contact` },
  };
}

const intents = [
  { key: "quote", icon: "💼" },
  { key: "sample", icon: "🧪" },
  { key: "visit", icon: "👷" },
  { key: "partnership", icon: "🤝" },
  { key: "other", icon: "💬" },
] as const;

export default async function B2BContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("b2b.contact");

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: `https://earthhue.net/${locale}` },
        { name: "B2B", url: `https://earthhue.net/${locale}/b2b` },
        { name: t("title"), url: `https://earthhue.net/${locale}/b2b/contact` },
      ]} />

      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-earth-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-earth-700 mb-10">{t("subtitle")}</p>

          <form className="space-y-5 bg-white border border-earth-200 rounded-xl p-6">
            <div>
              <label className="block text-sm font-medium text-earth-800 mb-1">
                {t("form.company")}
              </label>
              <input
                type="text"
                name="company"
                className="w-full border border-earth-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-earth-800 mb-1">
                  {t("form.name")}
                </label>
                <input type="text" name="name" className="w-full border border-earth-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-800 mb-1">
                  {t("form.email")}
                </label>
                <input type="email" name="email" className="w-full border border-earth-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-800 mb-2">
                {t("form.intent")}
              </label>
              <div className="flex flex-wrap gap-2">
                {intents.map((i) => (
                  <label key={i.key} className="cursor-pointer">
                    <input type="radio" name="intent" value={i.key} className="peer sr-only" />
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-earth-300 text-sm peer-checked:bg-sage-600 peer-checked:text-white peer-checked:border-sage-600">
                      <span>{i.icon}</span>
                      <span>{t(`intents.${i.key}`)}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-800 mb-1">
                {t("form.message")}
              </label>
              <textarea
                name="message"
                rows={5}
                className="w-full border border-earth-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-sage-600 text-white py-3 rounded-lg font-medium hover:bg-sage-700 transition-colors"
            >
              {t("form.submit")}
            </button>

            <p className="text-xs text-earth-500 text-center">{t("form.note")}</p>
          </form>
        </div>
      </section>
    </>
  );
}
