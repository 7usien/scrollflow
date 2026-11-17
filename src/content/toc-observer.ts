// src/content/toc-observer.ts — DOM scanner & observer for Page Headings (Auto-TOC)
import type { TocEntry } from '../shared/types';
import { computeTocEntries, type RawHeading } from '../core/toc';

export interface TocObserverController {
  scan: () => TocEntry[];
  start: (onChange: (entries: TocEntry[]) => void) => void;
  destroy: () => void;
}

/**
 * Checks if an element is visually rendered in the DOM.
 */
function isElementVisible(el: HTMLElement): boolean {
  if (!el.isConnected || el.offsetParent === null) {
    // Note: elements with position: fixed can have null offsetParent, but headings are rarely fixed
    return false;
  }
  const style = window.getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
    return false;
  }
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

/**
 * Scans the current DOM document for valid H1, H2, H3 headings.
 */
export function scanHeadings(): TocEntry[] {
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  if (maxScroll <= 0) return [];

  const elements = Array.from(document.querySelectorAll<HTMLElement>('h1, h2, h3'));
  const rawList: RawHeading[] = [];

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    const text = (el.innerText || el.textContent || '').trim();
    if (!text) continue;

    const rect = el.getBoundingClientRect();
    const offsetTop = rect.top + window.scrollY;

    rawList.push({
      id: el.id || undefined,
      tagName: el.tagName.toLowerCase(),
      text,
      offsetTop,
      isVisible: isElementVisible(el),
    });
  }

  return computeTocEntries(rawList, maxScroll, 20);
}

/**
 * Creates a TocObserver that watches for heading additions/removals and document resizes.
 */
export function createTocObserver(): TocObserverController {
  let mutationObserver: MutationObserver | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let currentOnChange: ((entries: TocEntry[]) => void) | null = null;

  const triggerScan = () => {
    if (document.hidden || !currentOnChange) return;
    if (debounceTimer !== null) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      if (document.hidden || !currentOnChange) return;
      const entries = scanHeadings();
      currentOnChange(entries);
    }, 400);
  };

  const handleVisibilityChange = () => {
    if (!document.hidden) {
      triggerScan();
    }
  };

  const start = (onChange: (entries: TocEntry[]) => void) => {
    currentOnChange = onChange;

    // Initial scan
    const initialEntries = scanHeadings();
    onChange(initialEntries);

    // Watch for DOM mutations in host document
    try {
      mutationObserver = new MutationObserver(() => {
        triggerScan();
      });
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    } catch {
      // Non-blocking fallback
    }

    // Watch for document size adjustments
    try {
      if (typeof ResizeObserver !== 'undefined' && document.body) {
        resizeObserver = new ResizeObserver(() => {
          triggerScan();
        });
        resizeObserver.observe(document.body);
      }
    } catch {
      // Non-blocking fallback
    }

    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });
  };

  const destroy = () => {
    if (debounceTimer !== null) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    mutationObserver?.disconnect();
    mutationObserver = null;
    resizeObserver?.disconnect();
    resizeObserver = null;
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    currentOnChange = null;
  };

  return {
    scan: scanHeadings,
    start,
    destroy,
  };
}
