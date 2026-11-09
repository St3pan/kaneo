export function withDefaultLocale(locale?: string | null) {
  return locale || process.env.KANEO_DEFAULT_LOCALE || null;
}
