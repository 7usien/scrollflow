// src/core/toc.ts — Pure logic for Table of Contents (Auto-TOC)
import type { TocEntry } from '../shared/types';
import { computeMarkerRatio, truncateSnippet } from './bookmarks';

export interface RawHeading {
  id?: string;
  tagName: string;
  text: string;
  offsetTop: number;
  isVisible: boolean;
}

const IGNORED_HEADINGS_AR = new Set([
  'شارك هذا', 'مشاركة', 'التعليقات', 'تعليقات', 'روابط ذات صلة', 'مقالات ذات صلة',
  'تابعنا', 'سياسة الخصوصية', 'حقوق النشر', 'اتصل بنا', 'القائمة',
]);

const IGNORED_HEADINGS_EN = new Set([
  'share this', 'share', 'comments', 'leave a comment', 'related posts', 'related articles',
  'follow us', 'privacy policy', 'terms of service', 'contact us', 'menu', 'navigation',
]);

/**
 * Validates whether a raw heading text qualifies as a meaningful section title.
 */
export function isValidHeading(text: string | null | undefined): boolean {
  if (!text) return false;
  const trimmed = text.trim().toLowerCase();
  if (trimmed.length < 2 || trimmed.length > 140) return false;
  if (IGNORED_HEADINGS_AR.has(trimmed) || IGNORED_HEADINGS_EN.has(trimmed)) return false;
  return true;
}

/**
 * Extracts and maps raw heading elements to valid, sorted TocEntry records.
 */
export function computeTocEntries(headings: RawHeading[], maxScroll: number, maxCount = 20): TocEntry[] {
  if (!Array.isArray(headings) || headings.length === 0 || maxScroll <= 0) {
    return [];
  }

  const validEntries: TocEntry[] = [];

  for (let i = 0; i < headings.length; i++) {
    const h = headings[i];
    if (!h.isVisible || !isValidHeading(h.text)) continue;

    const level = parseInt(h.tagName.replace(/[^0-9]/g, ''), 10) || 2;
    const scrollRatio = computeMarkerRatio(h.offsetTop, maxScroll);
    const id = h.id || `toc_${i}_${Math.round(scrollRatio * 100)}`;

    validEntries.push({
      id,
      level,
      text: truncateSnippet(h.text, 60),
      scrollY: Math.max(0, h.offsetTop),
      scrollRatio,
    });
  }

  // Sort ascending by vertical scroll position
  validEntries.sort((a, b) => a.scrollRatio - b.scrollRatio);

  // If there are too many headings, prioritize H1 and H2, or cap at maxCount
  if (validEntries.length > maxCount) {
    return validEntries.slice(0, maxCount);
  }

  return validEntries;
}

/**
 * Determines the currently active heading index based on the current vertical scroll position.
 * Uses an offset buffer (default 120px) so the heading becomes active as it scrolls into the reading zone.
 */
export function computeActiveHeadingIndex(entries: TocEntry[], currentScrollY: number, bufferPx = 120): number {
  if (!entries || entries.length === 0) return -1;

  const targetY = currentScrollY + bufferPx;
  let activeIdx = 0;

  for (let i = 0; i < entries.length; i++) {
    if (entries[i].scrollY <= targetY) {
      activeIdx = i;
    } else {
      break;
    }
  }

  return activeIdx;
}
