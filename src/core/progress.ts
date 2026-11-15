// src/core/progress.ts — Pure progress calculation logic (FR-01, FR-02, FR-04)
import type { Metrics } from '../shared/types';

export function clamp01(n: number): number {
  if (Number.isNaN(n) || n === undefined || n === null) return 0;
  return Math.min(1, Math.max(0, n));
}

export function computeProgress(scrollY: number, maxScroll: number): number {
  if (maxScroll <= 0) return 0;
  return clamp01(scrollY / maxScroll);
}

export function isScrollable(maxScroll: number, viewportH: number): boolean {
  if (viewportH <= 0) return false;
  return maxScroll >= viewportH * 0.2;
}

export function computeMetricsFrom(params: {
  docHeight: number;
  viewportH: number;
  scrollY: number;
}): Metrics {
  const { docHeight, viewportH, scrollY } = params;
  const maxScroll = Math.max(0, docHeight - viewportH);
  const screens = viewportH > 0 ? docHeight / viewportH : 0;
  const scrollable = isScrollable(maxScroll, viewportH);

  return {
    docHeight,
    viewportH,
    scrollY,
    maxScroll,
    scrollable,
    screens,
  };
}
