// src/content/restore.ts — Smart scroll restoration engine (FR-18, FR-19, FR-20, FR-21, FR-22, PRD §11.5)
import type { ScrollEntry, Settings } from '../shared/types';
import { TTL_MS, RESTORE_TOLERANCE_PX, RESTORE_DELAYS_MS, RESTORE_MAX_WAIT_MS } from '../shared/types';
import { computeMetrics } from './measure';

export async function tryRestore(
  entry: ScrollEntry | null,
  settings: Settings,
  hasUserInteracted: () => boolean,
  onSuccess: () => void
): Promise<boolean> {
  if (!entry) return false;
  if (!settings.restoreScroll) return false;

  // FR-20 abort conditions
  if (Date.now() - entry.ts > TTL_MS) return false;
  if (entry.scrollY < 60) return false;
  if (window.location.hash && !window.location.hash.startsWith('#/')) return false; // Explicit hash anchor
  if (window.scrollY > 40 || hasUserInteracted()) return false; // User already scrolled

  // If in background tab, wait for visibility
  if (document.hidden) {
    await waitForVisibility(15000);
    if (document.hidden) return false;
  }

  const startTime = performance.now();
  const deadline = startTime + RESTORE_MAX_WAIT_MS;

  for (const delay of RESTORE_DELAYS_MS) {
    if (delay > 0) {
      await sleep(delay);
    }

    if (performance.now() > deadline) break;
    if (hasUserInteracted() || window.scrollY > 40) return false;

    const m = computeMetrics();
    if (!m.scrollable) continue;

    // FR-19: Check if docHeight is within ±15% of stored docHeight
    const heightDiff = Math.abs(m.docHeight - entry.docHeight);
    const isStableHeight = heightDiff <= entry.docHeight * 0.15;

    const targetY = isStableHeight
      ? Math.min(entry.scrollY, m.maxScroll)
      : Math.min(entry.scrollRatio * m.maxScroll, m.maxScroll);

    window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior });

    // Wait 60ms to let browser apply scroll
    await sleep(60);

    const actualScroll = window.scrollY;
    if (Math.abs(actualScroll - targetY) <= RESTORE_TOLERANCE_PX) {
      onSuccess();
      return true;
    }
  }

  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForVisibility(maxTimeoutMs: number): Promise<void> {
  return new Promise((resolve) => {
    if (!document.hidden) {
      resolve();
      return;
    }

    let timer: ReturnType<typeof setTimeout> | null = null;

    const handler = () => {
      if (!document.hidden) {
        document.removeEventListener('visibilitychange', handler);
        if (timer) clearTimeout(timer);
        resolve();
      }
    };

    document.addEventListener('visibilitychange', handler, { passive: true });

    timer = setTimeout(() => {
      document.removeEventListener('visibilitychange', handler);
      resolve();
    }, maxTimeoutMs);
  });
}
