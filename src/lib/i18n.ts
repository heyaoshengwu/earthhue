export const FALLBACK_LOCALES = ["zh", "en"] as const;

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
  return preferred || "zh";
}