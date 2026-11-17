// src/core/bookmarks.ts — Pure logic for bookmarks / margins management (FR-36..FR-42)
import type { BookmarkEntry, BookmarkColor } from '../shared/types';
import { clamp01 } from './progress';

export const BOOKMARK_COLORS: Record<BookmarkColor, { hex: string; labelAr: string; labelEn: string }> = {
  yellow: { hex: '#ffd166', labelAr: 'مهم', labelEn: 'Important' },
  green: { hex: '#06d6a0', labelAr: 'اقتباس', labelEn: 'Quote' },
  purple: { hex: '#b5179e', labelAr: 'ملاحظة', labelEn: 'Note' },
  blue: { hex: '#00d4ff', labelAr: 'مرجع', labelEn: 'Reference' },
  red: { hex: '#ff4d6d', labelAr: 'تنبيه', labelEn: 'Warning' },
};

/**
 * Validates whether user-selected text qualifies for creating a bookmark.
 */
export function isValidSelection(text: string | null | undefined): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  return trimmed.length >= 2 && trimmed.length <= 1500;
}

/**
 * Cleanly truncates a text snippet for display in cards/tooltips.
 */
export function truncateSnippet(text: string, maxLength = 80): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength).trim()}…`;
}

/**
 * Computes the vertical position ratio (0..1) on the rail for a given scroll position.
 */
export function computeMarkerRatio(scrollY: number, maxScroll: number): number {
  if (maxScroll <= 0) return 0;
  return clamp01(scrollY / maxScroll);
}

/**
 * Factory for creating a consistent BookmarkEntry.
 */
export function createBookmarkEntry(params: {
  id?: string;
  url: string;
  text: string;
  title?: string;
  color?: BookmarkColor;
  scrollY: number;
  maxScroll: number;
  selector?: string;
  createdAt?: number;
}): BookmarkEntry {
  const { url, text, scrollY, maxScroll, selector, color = 'blue' } = params;
  const id = params.id || `bm_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const title = params.title || truncateSnippet(text, 40);
  const scrollRatio = computeMarkerRatio(scrollY, maxScroll);
  const createdAt = params.createdAt || Date.now();

  return {
    id,
    url,
    text: text.trim(),
    title,
    color,
    scrollY: Math.max(0, scrollY),
    scrollRatio,
    selector,
    createdAt,
  };
}

/**
 * Sorts bookmarks by vertical page order.
 */
export function sortBookmarks(bookmarks: BookmarkEntry[]): BookmarkEntry[] {
  return [...bookmarks].sort((a, b) => a.scrollRatio - b.scrollRatio);
}

export interface BookmarksLocaleConfig {
  title: string;
  empty: string;
  triggerAria: string;
  closeAria: string;
  jumpAria: string;
  deleteAria: string;
  bookmarksTab: string;
  tocTab: string;
  tocEmpty: string;
  exportBtn: string;
  copied: string;
  filterAll: string;
}

/**
 * Resolves localized strings for bookmarks UI (menu, trigger, empty state).
 */
export function resolveBookmarksLocale(isRTL: boolean): BookmarksLocaleConfig {
  return isRTL
    ? {
        title: 'هوامش الصفحة',
        empty: 'لا توجد هوامش محفوظة بعد',
        triggerAria: 'فهرس هوامش الصفحة',
        closeAria: 'إغلاق الفهرس',
        jumpAria: 'انتقال للهامش',
        deleteAria: 'حذف الهامش',
        bookmarksTab: 'الهوامش',
        tocTab: 'فهرس العناوين',
        tocEmpty: 'لا توجد عناوين رئيسية في هذه الصفحة',
        exportBtn: 'نسخ كـ Markdown',
        copied: 'تم النسخ! ✓',
        filterAll: 'الكل',
      }
    : {
        title: 'Page Bookmarks',
        empty: 'No bookmarks saved yet',
        triggerAria: 'Page Bookmarks Index',
        closeAria: 'Close Index',
        jumpAria: 'Jump to bookmark',
        deleteAria: 'Delete bookmark',
        bookmarksTab: 'Bookmarks',
        tocTab: 'Headings',
        tocEmpty: 'No headings found on this page',
        exportBtn: 'Export Markdown',
        copied: 'Copied! ✓',
        filterAll: 'All',
      };
}

