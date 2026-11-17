// src/content/measure.ts — Page metrics computation and dynamic height observers (FR-01, FR-02, FR-03, FR-33, NFR-04)
import type { Metrics } from '../shared/types';
import { isScrollable } from '../core/progress';

export function computeMetrics(): Metrics {
  const el = document.scrollingElement ?? document.documentElement;
  const body = document.body;

  const bodyStyle = body ? window.getComputedStyle(body) : null;
  const htmlStyle = window.getComputedStyle(document.documentElement);

  const isBodyHidden = bodyStyle && (bodyStyle.overflowY === 'hidden' || bodyStyle.overflow === 'hidden');
  const isHtmlHidden = htmlStyle.overflowY === 'hidden' || htmlStyle.overflow === 'hidden';

  const docHeight = Math.max(el.scrollHeight, body?.scrollHeight ?? 0);
  const viewportH = window.innerHeight;
  const scrollY = window.scrollY ?? el.scrollTop ?? 0;
  const maxScroll = Math.max(0, docHeight - viewportH);

  let scrollable = isScrollable(maxScroll, viewportH);

  // FR-33: Internal container / overflow hidden
  if (isBodyHidden || isHtmlHidden) {
    if (maxScroll <= 0 || (isBodyHidden && isHtmlHidden)) {
      scrollable = false;
    }
  }

  const screens = viewportH > 0 ? docHeight / viewportH : 0;

  return {
    docHeight,
    viewportH,
    scrollY,
    maxScroll,
    scrollable,
    screens,
  };
}

export interface MeasureObserver {
  disconnect: () => void;
  pause: () => void;
  resume: () => void;
}

export function observeMetrics(onMetricsChanged: (m: Metrics) => void): MeasureObserver {
  let isPaused = false;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let lastDocHeight = 0;
  let lastMaxScroll = 0;
  let lastScrollable: boolean | null = null;

  const schedule = (delay = 150) => {
    if (isPaused || document.hidden) return;

    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      const m = computeMetrics();
      const hasChanged =
        Math.abs(m.docHeight - lastDocHeight) > 2 ||
        Math.abs(m.maxScroll - lastMaxScroll) > 2 ||
        m.scrollable !== lastScrollable;

      if (hasChanged) {
        lastDocHeight = m.docHeight;
        lastMaxScroll = m.maxScroll;
        lastScrollable = m.scrollable;
        onMetricsChanged(m);
      }
    }, delay);
  };

  const ro = new ResizeObserver(() => schedule(150));
  ro.observe(document.documentElement);
  if (document.body) {
    ro.observe(document.body);
  }

  const mo = new MutationObserver(() => schedule(350));
  mo.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: false,
  });

  const handleVisibilityChange = () => {
    if (document.hidden) {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
    } else {
      schedule(50);
    }
  };
  document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });

  const pause = () => {
    isPaused = true;
    if (debounceTimer) clearTimeout(debounceTimer);
  };

  const resume = () => {
    isPaused = false;
    schedule(50);
  };

  const disconnect = () => {
    isPaused = true;
    if (debounceTimer) clearTimeout(debounceTimer);
    ro.disconnect();
    mo.disconnect();
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };

  return {
    disconnect,
    pause,
    resume,
  };
}
