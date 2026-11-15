// src/shared/settings-schema.ts
import { DEFAULT_SETTINGS, type Settings, type Theme, type Side, type Contrast } from './types';

export { DEFAULT_SETTINGS };

const VALID_THEMES: Set<Theme> = new Set(['aurora', 'sunset', 'mono']);
const VALID_SIDES: Set<Side> = new Set(['right', 'left', 'auto']);
const VALID_CONTRASTS: Set<Contrast> = new Set(['normal', 'high']);

export function sanitizeSettings(raw: unknown): Settings {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_SETTINGS };
  }

  const obj = raw as Record<string, unknown>;

  const theme: Theme = typeof obj.theme === 'string' && VALID_THEMES.has(obj.theme as Theme)
    ? (obj.theme as Theme)
    : DEFAULT_SETTINGS.theme;

  const side: Side = typeof obj.side === 'string' && VALID_SIDES.has(obj.side as Side)
    ? (obj.side as Side)
    : DEFAULT_SETTINGS.side;

  const contrast: Contrast = typeof obj.contrast === 'string' && VALID_CONTRASTS.has(obj.contrast as Contrast)
    ? (obj.contrast as Contrast)
    : DEFAULT_SETTINGS.contrast;

  const blocklist: string[] = Array.isArray(obj.blocklist)
    ? obj.blocklist.filter((item): item is string => typeof item === 'string').slice(0, 500)
    : DEFAULT_SETTINGS.blocklist;

  const hiddenOnce: string[] = Array.isArray(obj.hiddenOnce)
    ? obj.hiddenOnce.filter((item): item is string => typeof item === 'string').slice(0, 500)
    : DEFAULT_SETTINGS.hiddenOnce;

  return {
    version: 1,
    enabled: typeof obj.enabled === 'boolean' ? obj.enabled : DEFAULT_SETTINGS.enabled,
    restoreScroll: typeof obj.restoreScroll === 'boolean' ? obj.restoreScroll : DEFAULT_SETTINGS.restoreScroll,
    celebrate: typeof obj.celebrate === 'boolean' ? obj.celebrate : DEFAULT_SETTINGS.celebrate,
    milestones: typeof obj.milestones === 'boolean' ? obj.milestones : DEFAULT_SETTINGS.milestones,
    showBadge: typeof obj.showBadge === 'boolean' ? obj.showBadge : DEFAULT_SETTINGS.showBadge,
    showToasts: typeof obj.showToasts === 'boolean' ? obj.showToasts : DEFAULT_SETTINGS.showToasts,
    theme,
    side,
    contrast,
    allowFileUrls: typeof obj.allowFileUrls === 'boolean' ? obj.allowFileUrls : DEFAULT_SETTINGS.allowFileUrls,
    blocklist,
    hiddenOnce,
  };
}

export async function readSettings(): Promise<Settings> {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      const res = await chrome.storage.sync.get('settings');
      return sanitizeSettings(res?.settings);
    }
  } catch {
    // Fail-soft: fallback to defaults
  }
  return { ...DEFAULT_SETTINGS };
}
