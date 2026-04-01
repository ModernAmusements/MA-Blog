import { translations, defaultLang } from '@/i18n';
import type { Lang } from '@/i18n';

export function getDictionary(lang: Lang): typeof translations.en {
  return translations[lang] || translations[defaultLang];
}

export function getLangFromParams(params: Promise<{ lang: string }>): Promise<Lang> {
  return params.then((p) => {
    if (p.lang && p.lang in translations) {
      return p.lang as Lang;
    }
    return defaultLang;
  });
}