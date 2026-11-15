// src/shared/types.ts — نسخة مطابقة لـ contracts/types.ts

export type Theme = 'aurora' | 'sunset' | 'cyberpunk' | 'minimal' | 'glass' | 'mono';
export type Side = 'right' | 'left' | 'auto';
export type Orientation = 'vertical' | 'horizontal';
export type Position = 'right' | 'left' | 'top' | 'bottom';
export type BarLength = 'floating' | 'full';
export type BarRadius = 'subtle' | 'pill' | 'sharp';
export type Contrast = 'normal' | 'high';

export interface Settings {
  version: 1;
  enabled: boolean;
  restoreScroll: boolean;
  celebrate: boolean;
  milestones: boolean;
  showBadge: boolean;
  showToasts: boolean;
  theme: Theme;
  side: Side;
  position: Position;
  orientation: Orientation;
  barLength: BarLength;
  barRadius: BarRadius;
  shadow: boolean;
  hideNativeScrollbar: boolean;
  smoothScroll: boolean;
  contrast: Contrast;
  allowFileUrls: boolean;
  blocklist: string[];
  hiddenOnce: string[];
}

export const DEFAULT_SETTINGS: Settings = {
  version: 1,
  enabled: true,
  restoreScroll: true,
  celebrate: true,
  milestones: true,
  showBadge: true,
  showToasts: true,
  theme: 'aurora',
  side: 'right',
  position: 'right',
  orientation: 'vertical',
  barLength: 'floating',
  barRadius: 'subtle',
  shadow: true,
  hideNativeScrollbar: true,
  smoothScroll: false,
  contrast: 'normal',
  allowFileUrls: false,
  blocklist: [],
  hiddenOnce: [],
};

/** مفتاح السجل في storage.local: `pos:${normalizedUrl}` */
export interface ScrollEntry {
  url: string;
  scrollY: number;
  scrollRatio: number; // 0..1
  docHeight: number;
  viewportH: number;
  ts: number;
}

export interface Metrics {
  docHeight: number;
  viewportH: number;
  scrollY: number;
  maxScroll: number;
  scrollable: boolean;
  screens: number;
}

export type BarState = 'hidden' | 'idle' | 'active' | 'hover' | 'milestone' | 'complete' | 'restored';

export interface PageSession {
  url: string;
  mounted: boolean;
  scrollable: boolean;
  maxScroll: number;
  docHeight: number;
  viewportH: number;
  lastPercent: number;
  smoothed: number;
  firedMilestones: Set<25 | 50 | 75>;
  celebrated: boolean;
  lastCelebrationAt: number;
  userInteracted: boolean;
  restore: { attempted: boolean; succeeded: boolean; status: 'none' | 'ok' | 'partial' | 'skipped' };
}

export const TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 يومًا
export const MAX_ENTRIES = 1500;
export const SAVE_DEBOUNCE_MS = 400;
export const CELEBRATION_COOLDOWN_MS = 60_000;
export const BADGE_THROTTLE_MS = 1000;
export const RESTORE_TOLERANCE_PX = 8;
export const RESTORE_MAX_WAIT_MS = 5000;
export const RESTORE_DELAYS_MS = [0, 150, 400, 800, 1400, 2200, 3200, 4500] as const;
export const WORDS_PER_MINUTE = 220;
