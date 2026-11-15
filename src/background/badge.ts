// src/background/badge.ts — Tab badge percentage display (FR-08, PRD §6.7)
import { BADGE_THROTTLE_MS } from '../shared/types';

const lastBadgeUpdate = new Map<number, number>();
const completeTimers = new Map<number, ReturnType<typeof setTimeout>>();

const BADGE_BG = '#6D5BFF';
const BADGE_COLOR = '#FFFFFF';

export function updateBadge(tabId: number, percent: number, scrollable: boolean): void {
  const now = Date.now();
  const lastTime = lastBadgeUpdate.get(tabId) ?? 0;

  if (now - lastTime < BADGE_THROTTLE_MS && percent < 99.5) {
    return;
  }
  lastBadgeUpdate.set(tabId, now);

  try {
    if (!scrollable || percent <= 0) {
      chrome.action.setBadgeText({ tabId, text: '' }).catch(() => {});
      return;
    }

    chrome.action.setBadgeBackgroundColor({ tabId, color: BADGE_BG }).catch(() => {});
    if ('setBadgeTextColor' in chrome.action) {
      (chrome.action as { setBadgeTextColor: (d: { tabId: number; color: string }) => Promise<void> })
        .setBadgeTextColor({ tabId, color: BADGE_COLOR })
        .catch(() => {});
    }

    if (percent >= 99.5) {
      // Clear previous timer if any
      const existing = completeTimers.get(tabId);
      if (existing) clearTimeout(existing);

      chrome.action.setBadgeText({ tabId, text: '✓' }).catch(() => {});

      const timer = setTimeout(() => {
        chrome.action.setBadgeText({ tabId, text: '100' }).catch(() => {});
        completeTimers.delete(tabId);
      }, 3000);

      completeTimers.set(tabId, timer);
    } else {
      const rounded = Math.round(percent);
      chrome.action.setBadgeText({ tabId, text: String(rounded) }).catch(() => {});
    }
  } catch {
    // Fail-soft: tab may be closed
  }
}

export function clearTabBadge(tabId: number): void {
  lastBadgeUpdate.delete(tabId);
  const timer = completeTimers.get(tabId);
  if (timer) {
    clearTimeout(timer);
    completeTimers.delete(tabId);
  }
  chrome.action.setBadgeText({ tabId, text: '' }).catch(() => {});
}
