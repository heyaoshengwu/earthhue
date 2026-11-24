import { getRequestConfig } from "next-intl/server";

/**
 * Message loading with an English base.
 *
 * Every catalogue used to have to carry exactly the same key set in all seven
 * locales. That constraint made each new field a seven-language chore and
 * turned a forgotten key into a runtime error that took a page down.
 *
 * English is now the base and a locale overrides what it has translated, so
 * a missing translation degrades to readable English instead of breaking the
 * page. The parity that used to be enforced by a runtime throw is enforced by
 * scripts/check-messages.mjs instead, which reports the gap without taking
 * the site offline.
 */

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeMessages(
  base: Record<string, unknown>,
  override: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const baseValue = base[key];
    if (isPlainObject(value) && isPlainObject(baseValue)) {
      out[key] = mergeMessages(baseValue, value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) || "en";
  const base = (await import(`../messages/en.json`)).default as Record<string, unknown>;

  if (locale === "en") {
    return { locale, messages: base };
  }

  const localized = (await import(`../messages/${locale}.json`)).default as Record<string, unknown>;
  return { locale, messages: mergeMessages(base, localized) };
});
