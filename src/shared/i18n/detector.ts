// src/shared/i18n/detector.ts — Auto-detection and storage management for 9 languages
import type { I18nDictionary, LocaleSetting, SupportedLocale } from './types';
import { SUPPORTED_LOCALES } from './types';
import { ar } from './locales/ar';
import { de } from './locales/de';
import { en } from './locales/en';
import { fr } from './locales/fr';
import { hi } from './locales/hi';
import { it } from './locales/it';
import { ja } from './locales/ja';
import { ru } from './locales/ru';
import { zh } from './locales/zh';

export const DICTIONARIES: Record<SupportedLocale, I18nDictionary> = {
  ar,
  en,
  fr,
  it,
  ru,
  zh,
  ja,
  de,
  hi,
};

/**
 * Detects supported locale from raw language string (e.g. 'fr-FR', 'ar-EG', 'zh-CN')
 * or falls back to 'en' (English).
 */
export function detectLocale(rawLang?: string): SupportedLocale {
  const code = (
    rawLang ||
    (typeof navigator !== 'undefined' ? navigator.language : '') ||
    (typeof chrome !== 'undefined' && chrome.i18n?.getUILanguage ? chrome.i18n.getUILanguage() : '') ||
    'en'
  )
    .trim()
    .toLowerCase();

  if (code.startsWith('ar')) return 'ar';
  if (code.startsWith('fr')) return 'fr';
  if (code.startsWith('it')) return 'it';
  if (code.startsWith('ru')) return 'ru';
  if (code.startsWith('zh')) return 'zh';
  if (code.startsWith('ja')) return 'ja';
  if (code.startsWith('de')) return 'de';
  if (code.startsWith('hi')) return 'hi';
  if (code.startsWith('en')) return 'en';

  // Safe fallback to English for any unsupported language
  return 'en';
}

/**
 * Checks if a string is a valid SupportedLocale
 */
export function isSupportedLocale(val: unknown): val is SupportedLocale {
  return typeof val === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(val);
}

/**
 * Resolves effective locale from user setting ('auto' or specific locale)
 */
export function resolveActiveLocale(setting: LocaleSetting): SupportedLocale {
  if (setting === 'auto') {
    return detectLocale();
  }
  return isSupportedLocale(setting) ? setting : 'en';
}

/**
 * Returns dictionary for a given locale, safely falling back to English
 */
export function getDictionary(locale: SupportedLocale): I18nDictionary {
  return DICTIONARIES[locale] || DICTIONARIES.en;
}

/**
 * Storage key for user interface language preference
 */
export const LOCALE_STORAGE_KEY = 'sf_ui_locale';

/**
 * Reads user preferred locale setting from chrome.storage.local
 */
export async function getStoredLocale(): Promise<LocaleSetting> {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      const res = await chrome.storage.local.get([LOCALE_STORAGE_KEY]);
      const val = res[LOCALE_STORAGE_KEY];
      if (val === 'auto' || isSupportedLocale(val)) {
        return val as LocaleSetting;
      }
    }
  } catch {
    // Storage access may fail in isolated tests
  }
  return 'auto';
}

/**
 * Saves user preferred locale setting to chrome.storage.local
 */
export async function setStoredLocale(setting: LocaleSetting): Promise<void> {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      await chrome.storage.local.set({ [LOCALE_STORAGE_KEY]: setting });
    }
  } catch {
    // Storage access may fail
  }
}
