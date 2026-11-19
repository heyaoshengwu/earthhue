/**
 * Fallback order when the requested locale has no translation.
 *
 * English comes first: it is the site's default locale and the language the
 * source material is authored in, so a reader who lands on a locale we have
 * not translated yet gets readable English rather than a Chinese fallback on a
 * Japanese, Korean, Spanish, French or German page. Chinese stays as the
 * second fallback because it is the best-maintained translation.
 */
export const FALLBACK_LOCALES = ["en", "zh"] as const;

export function pickTranslation<T>(
  translations: Record<string, T | undefined> | undefined | null,
  preferred?: string
): T | undefined {
  if (!translations || typeof translations !== "object") return undefined;
  if (preferred && translations[preferred] != null) return translations[preferred];
  for (const loc of FALLBACK_LOCALES) {
    if (translations[loc] != null) return translations[loc];
  }
  for (const key of Object.keys(translations)) {
    if (translations[key] != null) return translations[key];
  }
  return undefined;
}

export function getTranslationLocale(translations: Record<string, unknown>, preferred?: string): string {
  if (preferred && translations[preferred] != null) return preferred;
  for (const loc of FALLBACK_LOCALES) {
    if (translations[loc] != null) return loc;
  }
  for (const key of Object.keys(translations)) {
    if (translations[key] != null) return key;
  }
  return preferred || "en";
}