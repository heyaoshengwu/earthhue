"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "product",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit form");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="section-padding">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-earth-900 mb-4">{t("title")}</h1>
          <p className="text-earth-600 max-w-xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            {submitted ? (
              <div className="bg-sage-50 border border-sage-200 rounded-xl p-8 text-center">
                <svg className="w-16 h-16 text-sage-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="font-serif text-2xl font-bold text-earth-900 mb-2">{t("success.title")}</h2>
                <p className="text-earth-600">{t("success.desc")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-earth-700 mb-1">{t("form.name")}</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                    className="w-full px-4 py-2.5 border border-earth-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none"
                    placeholder={t("form.namePlaceholder")} />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-earth-700 mb-1">{t("form.email")}</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                    className="w-full px-4 py-2.5 border border-earth-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none"
                    placeholder={t("form.emailPlaceholder")} />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-earth-700 mb-1">{t("form.company")}</label>
                  <input type="text" id="company" name="company" value={formData.company} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-earth-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none"
                    placeholder={t("form.companyPlaceholder")} />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-earth-700 mb-1">{t("form.subject")}</label>
                  <select id="subject" name="subject" value={formData.subject} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-earth-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none bg-white">
                    <option value="product">{t("form.subjects.product")}</option>
                    <option value="technical">{t("form.subjects.technical")}</option>
                    <option value="regulatory">{t("form.subjects.regulatory")}</option>
                    <option value="samples">{t("form.subjects.samples")}</option>
                    <option value="partnership">{t("form.subjects.partnership")}</option>
                    <option value="other">{t("form.subjects.other")}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-earth-700 mb-1">{t("form.message")}</label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={5} required
                    className="w-full px-4 py-2.5 border border-earth-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none resize-none"
                    placeholder={t("form.messagePlaceholder")} />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-sage-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-sage-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? t("form.sending") : t("form.send")}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="font-semibold text-earth-900 mb-3">{t("info.general.title")}</h3>
              <p className="text-earth-600">{t("info.general.email")}</p>
            </div>
            <div>
              <h3 className="font-semibold text-earth-900 mb-3">{t("info.tech.title")}</h3>
              <p className="text-earth-600">{t("info.tech.email")}</p>
            </div>
            <div>
              <h3 className="font-semibold text-earth-900 mb-3">{t("info.hours.title")}</h3>
              <p className="text-earth-600">{t("info.hours.days")}<br />{t("info.hours.time")}</p>
            </div>
            <div className="pt-4 border-t border-earth-200">
              <h3 className="font-semibold text-earth-900 mb-3">{t("info.response.title")}</h3>
              <p className="text-earth-600">{t("info.response.text")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
