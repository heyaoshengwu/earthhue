"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

/**
 * The inquiry form.
 *
 * Three pages used to have three different ideas of what an inquiry is: the
 * public contact page posted a name and a sentence, the B2B contact page had
 * a form with no action attribute that silently discarded whatever was typed
 * into it, and the sample page bounced visitors to the B2B contact page. One
 * component now backs all three, and one API route stores them, so an inquiry
 * always arrives with the qualification a formulator expects to give.
 *
 * The fields are deliberately limited to the ones that change what happens
 * next: which pigment, which application, which market, how much. Everything
 * else stays in the free-text message.
 */

export type InquiryProduct = { slug: string; name: string };
export type InquiryIntent = { key: string; label: string };

type Props = {
  variant: "general" | "b2b" | "samples";
  products: InquiryProduct[];
  intents?: InquiryIntent[];
  defaultProduct?: string;
  showQuantity?: boolean;
  className?: string;
};

const APPLICATION_KEYS = [
  "food",
  "beverage",
  "bakery",
  "dairy",
  "meat",
  "nutraceutical",
  "cosmetics",
  "pharma",
  "other",
] as const;

const MARKET_KEYS = ["eu", "us", "jp", "kr", "cn", "sea", "other"] as const;

const VOLUME_KEYS = ["lt1", "t1to10", "t10to50", "gt50", "unknown"] as const;

const GRADE_KEYS = ["food", "cosmetic", "pharma", "industrial", "other"] as const;

/** Which subject an intent maps to on the API side. */
const INTENT_SUBJECT: Record<string, string> = {
  quote: "product",
  sample: "samples",
  visit: "other",
  partnership: "partnership",
  other: "other",
};

const inputClass =
  "w-full px-4 py-2.5 border border-earth-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none bg-white";
const labelClass = "block text-sm font-medium text-earth-700 mb-1";

export default function InquiryForm({
  variant,
  products,
  intents,
  defaultProduct,
  showQuantity = false,
  className = "",
}: Props) {
  const t = useTranslations("inquiry");
  const tc = useTranslations("contact");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  const [values, setValues] = useState({
    name: "",
    email: "",
    company: "",
    product: defaultProduct || "",
    application: "",
    market: "",
    volume: "",
    grade: "",
    quantity: "",
    intent: intents && intents.length ? intents[0].key : "",
    subject: variant === "samples" ? "samples" : variant === "b2b" ? "general" : "product",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      // An intent choice overrides the subject on the B2B form.
      if (name === "intent" && intents) {
        next.subject = INTENT_SUBJECT[value] || "general";
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const sourcePage = typeof window !== "undefined" ? window.location.pathname : "";
    const referrer = typeof document !== "undefined" ? document.referrer : "";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          company: values.company,
          subject: values.subject,
          message: values.message,
          product: values.product,
          application: values.application,
          market: values.market,
          volume: values.volume,
          grade: values.grade,
          quantity: values.quantity,
          intent: values.intent,
          locale,
          source_page: sourcePage,
          referrer,
        }),
      });

      const data = await response.json().catch(() => ({}) as { error?: string });
      if (!response.ok) {
        throw new Error(data.error || t("error"));
      }
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error"));
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className={`bg-sage-50 border border-sage-200 rounded-xl p-8 text-center ${className}`}>
        <svg
          className="w-16 h-16 text-sage-500 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="font-serif text-2xl font-bold text-earth-900 mb-2">{t("successTitle")}</h2>
        <p className="text-earth-600">{t("successDesc")}</p>
      </div>
    );
  }

  return (
    // The form posts to the API directly as well as through fetch. If the
    // script never loads, the submission still reaches the database instead of
    // reloading the page and losing every field that was filled in.
    <form
      action="/api/contact"
      method="post"
      onSubmit={handleSubmit}
      className={`space-y-5 ${className}`}
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="subject" value={values.subject} />

      {status === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
      )}

      {intents && intents.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-2">{t("intent")}</label>
          <div className="flex flex-wrap gap-2">
            {intents.map((intent) => (
              <label key={intent.key} className="cursor-pointer">
                <input
                  type="radio"
                  name="intent"
                  value={intent.key}
                  checked={values.intent === intent.key}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-earth-300 text-sm peer-checked:bg-sage-600 peer-checked:text-white peer-checked:border-sage-600">
                  {intent.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className={labelClass}>
            {tc("form.name")}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder={tc("form.namePlaceholder")}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            {tc("form.email")}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder={tc("form.emailPlaceholder")}
          />
        </div>
      </div>

      <div>
        <label htmlFor="company" className={labelClass}>
          {tc("form.company")}
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={values.company}
          onChange={handleChange}
          className={inputClass}
          placeholder={tc("form.companyPlaceholder")}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="product" className={labelClass}>
            {t("product")}
          </label>
          <select
            id="product"
            name="product"
            value={values.product}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">{t("productAny")}</option>
            {products.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="application" className={labelClass}>
            {t("application")}
          </label>
          <select
            id="application"
            name="application"
            value={values.application}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">{t("applicationAny")}</option>
            {APPLICATION_KEYS.map((key) => (
              <option key={key} value={key}>
                {t(`apps.${key}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="market" className={labelClass}>
            {t("market")}
          </label>
          <select
            id="market"
            name="market"
            value={values.market}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">{t("marketAny")}</option>
            {MARKET_KEYS.map((key) => (
              <option key={key} value={key}>
                {t(`markets.${key}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="volume" className={labelClass}>
            {t("volume")}
          </label>
          <select
            id="volume"
            name="volume"
            value={values.volume}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">{t("volumeUnknown")}</option>
            {VOLUME_KEYS.map((key) => (
              <option key={key} value={key}>
                {t(`volumes.${key}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="grade" className={labelClass}>
            {t("grade")}
          </label>
          <select
            id="grade"
            name="grade"
            value={values.grade}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">{t("gradeAny")}</option>
            {GRADE_KEYS.map((key) => (
              <option key={key} value={key}>
                {t(`grades.${key}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showQuantity && (
        <div>
          <label htmlFor="quantity" className={labelClass}>
            {t("quantity")}
          </label>
          <input
            type="text"
            id="quantity"
            name="quantity"
            value={values.quantity}
            onChange={handleChange}
            className={inputClass}
            placeholder={t("quantityPlaceholder")}
          />
        </div>
      )}

      <div>
        <label htmlFor="message" className={labelClass}>
          {tc("form.message")}
        </label>
        <textarea
          id="message"
          name="message"
          value={values.message}
          onChange={handleChange}
          rows={5}
          required
          className={`${inputClass} resize-none`}
          placeholder={tc("form.messagePlaceholder")}
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-sage-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-sage-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? t("sending") : t("send")}
      </button>
    </form>
  );
}
