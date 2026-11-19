// tests/unit/i18n.test.ts — Comprehensive tests for 9-language i18n architecture
import { describe, expect, it } from 'vitest';
import {
  detectLocale,
  getDictionary,
  isSupportedLocale,
  resolveActiveLocale,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from '../../src/shared/i18n';

describe('i18n Auto-Detection & Fallbacks', () => {
  it('detects all 9 supported languages accurately from locale strings', () => {
    expect(detectLocale('ar')).toBe('ar');
    expect(detectLocale('ar-EG')).toBe('ar');
    expect(detectLocale('ar-SA')).toBe('ar');

    expect(detectLocale('en')).toBe('en');
    expect(detectLocale('en-US')).toBe('en');
    expect(detectLocale('en-GB')).toBe('en');

    expect(detectLocale('fr')).toBe('fr');
    expect(detectLocale('fr-FR')).toBe('fr');
    expect(detectLocale('fr-CA')).toBe('fr');

    expect(detectLocale('it')).toBe('it');
    expect(detectLocale('it-IT')).toBe('it');

    expect(detectLocale('ru')).toBe('ru');
    expect(detectLocale('ru-RU')).toBe('ru');

    expect(detectLocale('zh')).toBe('zh');
    expect(detectLocale('zh-CN')).toBe('zh');
    expect(detectLocale('zh-Hans')).toBe('zh');

    expect(detectLocale('ja')).toBe('ja');
    expect(detectLocale('ja-JP')).toBe('ja');

    expect(detectLocale('de')).toBe('de');
    expect(detectLocale('de-DE')).toBe('de');

    expect(detectLocale('hi')).toBe('hi');
    expect(detectLocale('hi-IN')).toBe('hi');
  });

  it('safely falls back to English for any unsupported language', () => {
    expect(detectLocale('es-ES')).toBe('en');
    expect(detectLocale('pt-BR')).toBe('en');
    expect(detectLocale('tr-TR')).toBe('en');
    expect(detectLocale('ko-KR')).toBe('en');
    expect(detectLocale('')).toBe('en');
    expect(detectLocale('unknown')).toBe('en');
  });

  it('validates supported locales using isSupportedLocale', () => {
    for (const loc of SUPPORTED_LOCALES) {
      expect(isSupportedLocale(loc)).toBe(true);
    }
    expect(isSupportedLocale('es')).toBe(false);
    expect(isSupportedLocale('pt')).toBe(false);
    expect(isSupportedLocale(123)).toBe(false);
    expect(isSupportedLocale(null)).toBe(false);
  });

  it('resolves active locale with user setting', () => {
    expect(resolveActiveLocale('fr')).toBe('fr');
    expect(resolveActiveLocale('ar')).toBe('ar');
    expect(resolveActiveLocale('zh')).toBe('zh');
    // If setting is 'auto', it delegates to detectLocale
    expect(isSupportedLocale(resolveActiveLocale('auto'))).toBe(true);
    // If setting is invalid string, falls back to 'en'
    expect(resolveActiveLocale('invalid' as unknown as SupportedLocale)).toBe('en');
  });
});

describe('i18n Dictionary Integrity & Completeness', () => {
  const ref = getDictionary('en');

  it('verifies all 9 dictionaries exist with correct text directions', () => {
    for (const loc of SUPPORTED_LOCALES) {
      const dict = getDictionary(loc);
      expect(dict).toBeDefined();
      expect(typeof dict.langName).toBe('string');
      expect(dict.langName.length).toBeGreaterThan(0);

      if (loc === 'ar') {
        expect(dict.dir).toBe('rtl');
      } else {
        expect(dict.dir).toBe('ltr');
      }
    }
  });

  it('ensures no missing keys in options across all 9 languages', () => {
    const refKeys = Object.keys(ref.options);

    for (const loc of SUPPORTED_LOCALES) {
      const dict = getDictionary(loc);
      for (const k of refKeys) {
        expect(dict.options).toHaveProperty(k);
        const val = (dict.options as unknown as Record<string, unknown>)[k];
        expect(val).toBeDefined();
      }

      // Check About & Support sub-keys
      const aboutKeys = Object.keys(ref.options.secAbout);
      for (const ak of aboutKeys) {
        expect(dict.options.secAbout).toHaveProperty(ak);
        const val = (dict.options.secAbout as unknown as Record<string, unknown>)[ak];
        expect(typeof val).toBe('string');
        expect((val as string).length).toBeGreaterThan(0);
      }
    }
  });

  it('ensures no missing keys in popup across all 9 languages', () => {
    const refKeys = Object.keys(ref.popup);

    for (const loc of SUPPORTED_LOCALES) {
      const dict = getDictionary(loc);
      for (const k of refKeys) {
        expect(dict.popup).toHaveProperty(k);
        const val = (dict.popup as unknown as Record<string, unknown>)[k];
        expect(val).toBeDefined();
      }
    }
  });

  it('ensures all select options maps are populated across all 9 languages', () => {
    const themes = ['aurora', 'sunset', 'cyberpunk', 'minimal', 'glass', 'mono'];
    const positions = ['right', 'left', 'top', 'bottom'];
    const lengths = ['floating', 'full'];
    const radii = ['subtle', 'pill', 'sharp'];

    for (const loc of SUPPORTED_LOCALES) {
      const dict = getDictionary(loc);

      for (const th of themes) {
        expect(dict.options.themes[th as keyof typeof dict.options.themes]).toBeDefined();
        expect(dict.popup.themes[th as keyof typeof dict.popup.themes]).toBeDefined();
      }
      for (const pos of positions) {
        expect(dict.options.positions[pos as keyof typeof dict.options.positions]).toBeDefined();
        expect(dict.popup.positions[pos as keyof typeof dict.popup.positions]).toBeDefined();
      }
      for (const len of lengths) {
        expect(dict.options.lengths[len as keyof typeof dict.options.lengths]).toBeDefined();
        expect(dict.popup.lengths[len as keyof typeof dict.popup.lengths]).toBeDefined();
      }
      for (const rad of radii) {
        expect(dict.options.radii[rad as keyof typeof dict.options.radii]).toBeDefined();
        expect(dict.popup.radii[rad as keyof typeof dict.popup.radii]).toBeDefined();
      }
    }
  });
});
