// src/core/bookmarks.ts — Pure logic for bookmarks / margins management (FR-36..FR-42)
import type { BookmarkEntry } from '../shared/types';
import { clamp01 } from './progress';

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
  scrollY: number;
  maxScroll: number;
  selector?: string;
  createdAt?: number;
}): BookmarkEntry {
  const { url, text, scrollY, maxScroll, selector } = params;
  const id = params.id || `bm_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const title = params.title || truncateSnippet(text, 40);
  const scrollRatio = computeMarkerRatio(scrollY, maxScroll);
  const createdAt = params.createdAt || Date.now();

  return {
    id,
    url,
    text: text.trim(),
    title,
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
