// src/shared/settings-schema.ts
import {
  DEFAULT_SETTINGS,
  type Settings,
  type Theme,
  type Side,
  type Position,
  type Orientation,
  type BarLength,
  type BarRadius,
  type Contrast,
} from './types';

export { DEFAULT_SETTINGS };

const VALID_THEMES: Set<Theme> = new Set(['aurora', 'sunset', 'cyberpunk', 'minimal', 'glass', 'mono']);
const VALID_SIDES: Set<Side> = new Set(['right', 'left', 'auto']);
const VALID_POSITIONS: Set<Position> = new Set(['auto', 'right', 'left', 'top', 'bottom']);
const VALID_ORIENTATIONS: Set<Orientation> = new Set(['vertical', 'horizontal']);
const VALID_LENGTHS: Set<BarLength> = new Set(['floating', 'full']);
const VALID_RADII: Set<BarRadius> = new Set(['subtle', 'pill', 'sharp']);
const VALID_CONTRASTS: Set<Contrast> = new Set(['normal', 'high']);

export function sanitizeSettings(raw: unknown): Settings {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_SETTINGS };
  }

  const obj = raw as Record<string, unknown>;

  // Check if we need to migrate from v1 (or unversioned) settings.
  // In v1, position was 'right' by default. We migrate that legacy default to 'auto'
  // so that the bar adapts automatically to LTR/RTL on all pages out-of-the-box.
  const isLegacy = typeof obj.version !== 'number' || obj.version < 2;

  let rawPosition = obj.position;
  let rawSide = obj.side;

  if (isLegacy) {
    if (rawPosition === 'right' || !rawPosition) {
      rawPosition = 'auto';
    }
    if (rawSide === 'right' || !rawSide) {
      rawSide = 'auto';
    }
  }

  const theme: Theme = typeof obj.theme === 'string' && VALID_THEMES.has(obj.theme as Theme)
    ? (obj.theme as Theme)
    : DEFAULT_SETTINGS.theme;

  const side: Side = typeof rawSide === 'string' && VALID_SIDES.has(rawSide as Side)
    ? (rawSide as Side)
    : DEFAULT_SETTINGS.side;

  const position: Position = typeof rawPosition === 'string' && VALID_POSITIONS.has(rawPosition as Position)
    ? (rawPosition as Position)
    : (side === 'left' ? 'left' : (side === 'right' ? 'right' : DEFAULT_SETTINGS.position));

  let orientation: Orientation = typeof obj.orientation === 'string' && VALID_ORIENTATIONS.has(obj.orientation as Orientation)
    ? (obj.orientation as Orientation)
    : (position === 'top' || position === 'bottom' ? 'horizontal' : DEFAULT_SETTINGS.orientation);

  // Maintain consistency between position and orientation
  if (position === 'top' || position === 'bottom') {
    orientation = 'horizontal';
  } else {
    orientation = 'vertical';
  }

  const barLength: BarLength = typeof obj.barLength === 'string' && VALID_LENGTHS.has(obj.barLength as BarLength)
    ? (obj.barLength as BarLength)
    : DEFAULT_SETTINGS.barLength;

  const barRadius: BarRadius = typeof obj.barRadius === 'string' && VALID_RADII.has(obj.barRadius as BarRadius)
    ? (obj.barRadius as BarRadius)
    : DEFAULT_SETTINGS.barRadius;

  const shadow: boolean = typeof obj.shadow === 'boolean'
    ? obj.shadow
    : DEFAULT_SETTINGS.shadow;

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
    version: 2,
    enabled: typeof obj.enabled === 'boolean' ? obj.enabled : DEFAULT_SETTINGS.enabled,
    restoreScroll: typeof obj.restoreScroll === 'boolean' ? obj.restoreScroll : DEFAULT_SETTINGS.restoreScroll,
    celebrate: typeof obj.celebrate === 'boolean' ? obj.celebrate : DEFAULT_SETTINGS.celebrate,
    milestones: typeof obj.milestones === 'boolean' ? obj.milestones : DEFAULT_SETTINGS.milestones,
    showBadge: typeof obj.showBadge === 'boolean' ? obj.showBadge : DEFAULT_SETTINGS.showBadge,
    showToasts: typeof obj.showToasts === 'boolean' ? obj.showToasts : DEFAULT_SETTINGS.showToasts,
    theme,
    side,
    position,
    orientation,
    barLength,
    barRadius,
    shadow,
    hideNativeScrollbar: typeof obj.hideNativeScrollbar === 'boolean' ? obj.hideNativeScrollbar : DEFAULT_SETTINGS.hideNativeScrollbar,
    smoothScroll: typeof obj.smoothScroll === 'boolean' ? obj.smoothScroll : DEFAULT_SETTINGS.smoothScroll,
    bookmarks: typeof obj.bookmarks === 'boolean' ? obj.bookmarks : DEFAULT_SETTINGS.bookmarks,
    autoToc: typeof obj.autoToc === 'boolean' ? obj.autoToc : DEFAULT_SETTINGS.autoToc,
    zenMode: typeof obj.zenMode === 'boolean' ? obj.zenMode : DEFAULT_SETTINGS.zenMode,
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
