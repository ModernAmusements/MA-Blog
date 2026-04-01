import en from './en.json';
import de from './de.json';

export const languages = {
  en: 'English',
  de: 'Deutsch',
} as const;

export const defaultLang = 'en';

export const translations = {
  en,
  de,
};

export type Lang = keyof typeof languages;