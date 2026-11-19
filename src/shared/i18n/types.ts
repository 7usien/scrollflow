// src/shared/i18n/types.ts — Type definitions for 9-language i18n system
import type { BarLength, BarRadius, Contrast, Position, Theme } from '../types';

export const SUPPORTED_LOCALES = [
  'ar',
  'en',
  'fr',
  'it',
  'ru',
  'zh',
  'ja',
  'de',
  'hi',
] as const;

export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export type LocaleSetting = SupportedLocale | 'auto';

export interface I18nDictionary {
  langName: string;
  dir: 'rtl' | 'ltr';
  options: {
    pageTitle: string;
    pageSubtitle: string;
    langAuto: string;
    secGeneral: string;
    titleEnabled: string;
    descEnabled: string;
    titleRestore: string;
    descRestore: string;
    titleCelebrate: string;
    descCelebrate: string;
    titleMilestones: string;
    descMilestones: string;
    titleHideScrollbar: string;
    descHideScrollbar: string;
    titleSmoothScroll: string;
    descSmoothScroll: string;
    titleBookmarks: string;
    descBookmarks: string;
    titleAutoToc: string;
    descAutoToc: string;
    titleZenMode: string;
    descZenMode: string;
    titleBadge: string;
    descBadge: string;
    titleToasts: string;
    descToasts: string;
    titleFileUrls: string;
    descFileUrls: string;
    secAppearance: string;
    titleTheme: string;
    descTheme: string;
    titlePosition: string;
    descPosition: string;
    titleLength: string;
    descLength: string;
    titleRadius: string;
    descRadius: string;
    titleShadow: string;
    descShadow: string;
    titleContrast: string;
    descContrast: string;
    secBlocklist: string;
    descBlocklist: string;
    blocklistPlaceholder: string;
    addBlocklist: string;
    removeBlocklist: string;
    secData: string;
    exportBtn: string;
    importBtn: string;
    clearPositionsBtn: string;
    confirmClear: string;
    alertCleared: string;
    alertImportSuccess: string;
    alertImportError: string;
    secAbout: {
      titleAbout: string;
      descAbout: string;
      versionLabel: string;
      supportTitle: string;
      supportDesc: string;
      patreonBtn: string;
      coffeeBtn: string;
      emailContactLabel: string;
      rateShareTitle: string;
      rateShareDesc: string;
      rateStoreBtn: string;
      shareBtn: string;
      shareCopied: string;
    };
    themes: Record<Theme, string>;
    positions: Record<Position, string>;
    lengths: Record<BarLength, string>;
    radii: Record<BarRadius, string>;
    contrasts: Record<Contrast, string>;
  };
  popup: {
    langBtn: string;
    btnAbout: string;
    secReading: string;
    secAppearance: string;
    secNavigation: string;
    lblScreens: string;
    lblTime: string;
    screensSuffix: string;
    minsSuffix: string;
    minSingle: string;
    sitePause: string;
    siteEnable: string;
    siteDefault: string;
    lblRestore: string;
    lblCelebrate: string;
    lblTheme: string;
    lblPosition: string;
    lblLength: string;
    lblRadius: string;
    lblShadow: string;
    lblHideScrollbar: string;
    lblSmoothScroll: string;
    lblBookmarks: string;
    lblAutoToc: string;
    lblZenMode: string;
    unsupported: string;
    clearBtn: string;
    confirmClear: string;
    alertCleared: string;
    themes: Record<Theme, string>;
    positions: Record<Position, string>;
    lengths: Record<BarLength, string>;
    radii: Record<BarRadius, string>;
  };
}
