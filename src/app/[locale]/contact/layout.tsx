import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localeAlternates, BASE_URL } from "@/lib/seo";
import { ContactPageJsonLd } from "@/components/JsonLd";

const CONTACT_EMAIL = "tech@earthhue.net";

/** The languages the sales desk answers in. */
const CONTACT_LANGUAGES = [
  "English",
  "Chinese",
  "Japanese",
  "Korean",
  "Spanish",
  "French",
  "German",
];

const titles: Record<string, string> = {
  en: "Contact EarthHue — Request a Quote, Sample or COA for Fermentation Carotenoids",
  zh: "联系 EarthHue — 索取发酵法类胡萝卜素的报价、样品与 COA",
  ja: "EarthHue へのお問い合わせ — 発酵由来カロテノイドのお見積・サンプル・COA",
  ko: "EarthHue 문의 — 발효 유래 카로티노이드 견적·샘플·COA 요청",
  es: "Contacte con EarthHue — Solicite presupuesto, muestra o COA de carotenoides",
  fr: "Contactez EarthHue — Demandez un devis, un échantillon ou un COA de caroténoïdes",
  de: "EarthHue kontaktieren — Angebot, Muster oder COA für Carotinoide anfordern",
};

const descriptions: Record<string, string> = {
  en: "Send your target colour, application, volume and market. We reply with a specification sheet, a sample COA and a price — usually within one business day. Samples shipped within 7 days, MOQ 1 kg.",
  zh: "告诉我们目标色、应用、用量与目标市场，通常一个工作日内回复规格书、样品 COA 与报价。样品 7 天内发出，起订量 1 公斤。",
  ja: "目標色、用途、数量、対象市場をお知らせください。仕様書、サンプルCOA、見積を通常1営業日以内にご返信します。サンプルは7日以内、MOQ 1kg。",
  ko: "목표 색, 적용 용도, 수량, 대상 시장을 알려주시면 규격서, 샘플 COA 및 견적을 보통 1 영업일 이내에 회신드립니다. 샘플 7일 이내 발송, MOQ 1kg.",
  es: "Envíe su color objetivo, aplicación, volumen y mercado. Respondemos con ficha técnica, COA de muestra y precio, normalmente en un día hábil. Muestras en 7 días, MOQ 1 kg.",
  fr: "Envoyez votre couleur cible, votre application, votre volume et votre marché. Nous répondons avec une fiche technique, un COA d'échantillon et un prix, généralement sous un jour ouvré. Échantillons expédiés sous 7 jours, MOQ 1 kg.",
  de: "Senden Sie uns Zielfarbe, Anwendung, Menge und Zielmarkt. Wir antworten mit Datenblatt, Muster-COA und Preis — meist innerhalb eines Werktags. Muster in 7 Tagen, MOQ 1 kg.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: titles[locale] || t("title"),
    description: descriptions[locale] || t("subtitle"),
    alternates: localeAlternates(locale, "/contact"),
    openGraph: {
      title: titles[locale] || t("title"),
      description: descriptions[locale] || t("subtitle"),
      url: `${BASE_URL}/${locale}/contact`,
      locale,
      type: "website",
    },
  };
}

export default async function ContactLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <>
      <ContactPageJsonLd
        locale={locale}
        name={titles[locale] || t("title")}
        description={descriptions[locale] || t("subtitle")}
        email={CONTACT_EMAIL}
        availableLanguages={CONTACT_LANGUAGES}
      />
      {children}
    </>
  );
}
