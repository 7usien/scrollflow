// src/core/storage-model.ts — Pure storage management, TTL and LRU algorithms (FR-16, FR-24)
import type { ScrollEntry } from '../shared/types';
import { TTL_MS, MAX_ENTRIES } from '../shared/types';

export { TTL_MS, MAX_ENTRIES };

export function makeEntry(
  params: {
    url: string;
    scrollY: number;
    maxScroll: number;
    docHeight: number;
    viewportH: number;
  },
  now: number = Date.now()
): ScrollEntry {
  const { url, scrollY, maxScroll, docHeight, viewportH } = params;
  const scrollRatio = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;

  return {
    url,
    scrollY,
    scrollRatio,
    docHeight,
    viewportH,
    ts: now,
  };
}

export function applyTtl(entries: ScrollEntry[], now: number = Date.now()): ScrollEntry[] {
  return entries.filter((entry) => now - entry.ts <= TTL_MS);
}

export function applyLruCap(entries: ScrollEntry[], cap: number = MAX_ENTRIES): ScrollEntry[] {
  if (entries.length <= cap) {
    return [...entries];
  }

  // Sort descending by timestamp (newest first)
  const sorted = [...entries].sort((a, b) => b.ts - a.ts);
  return sorted.slice(0, cap);
}
