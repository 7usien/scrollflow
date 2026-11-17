// tests/unit/bookmarks.test.ts — Unit tests for pure bookmark core logic
import { describe, it, expect } from 'vitest';
import {
  isValidSelection,
  truncateSnippet,
  computeMarkerRatio,
  createBookmarkEntry,
  sortBookmarks,
  resolveBookmarksLocale,
} from '../../src/core/bookmarks';

describe('isValidSelection', () => {
  it('rejects null, undefined, and empty string', () => {
    expect(isValidSelection(null)).toBe(false);
    expect(isValidSelection(undefined)).toBe(false);
    expect(isValidSelection('')).toBe(false);
    expect(isValidSelection('   ')).toBe(false);
    expect(isValidSelection('a')).toBe(false); // Less than 2 chars
  });

  it('accepts valid text selections', () => {
    expect(isValidSelection('ok')).toBe(true);
    expect(isValidSelection('This is a highlighted sentence.')).toBe(true);
    expect(isValidSelection('نص تجريبي للتظليل')).toBe(true);
  });

  it('rejects excessively long selections', () => {
    const tooLong = 'x'.repeat(1501);
    expect(isValidSelection(tooLong)).toBe(false);
  });
});

describe('truncateSnippet', () => {
  it('normalizes internal whitespace and newlines', () => {
    expect(truncateSnippet('Hello \n\n  world   test')).toBe('Hello world test');
  });

  it('truncates text with ellipsis when exceeding maxLength', () => {
    const text = 'This is a longer sentence that will be cut off cleanly.';
    const result = truncateSnippet(text, 20);
    expect(result).toBe('This is a longer sen…');
    expect(result.endsWith('…')).toBe(true);
  });

  it('leaves short text as-is', () => {
    expect(truncateSnippet('Short note', 50)).toBe('Short note');
  });
});

describe('computeMarkerRatio', () => {
  it('returns 0 when maxScroll is 0 or negative', () => {
    expect(computeMarkerRatio(100, 0)).toBe(0);
    expect(computeMarkerRatio(100, -50)).toBe(0);
  });

  it('computes exact clamped ratio between 0 and 1', () => {
    expect(computeMarkerRatio(500, 1000)).toBe(0.5);
    expect(computeMarkerRatio(250, 1000)).toBe(0.25);
    expect(computeMarkerRatio(1200, 1000)).toBe(1.0);
    expect(computeMarkerRatio(-50, 1000)).toBe(0);
  });
});

describe('createBookmarkEntry', () => {
  it('creates a well-formed BookmarkEntry', () => {
    const entry = createBookmarkEntry({
      url: 'https://example.com/doc',
      text: 'Important note about architecture',
      scrollY: 600,
      maxScroll: 1200,
    });

    expect(entry.id).toMatch(/^bm_/);
    expect(entry.url).toBe('https://example.com/doc');
    expect(entry.text).toBe('Important note about architecture');
    expect(entry.scrollRatio).toBe(0.5);
    expect(entry.title).toBe('Important note about architecture');
    expect(entry.createdAt).toBeGreaterThan(0);
  });
});

describe('sortBookmarks', () => {
  it('sorts bookmarks vertically in ascending ratio order', () => {
    const b1 = createBookmarkEntry({ url: 'u', text: 'bottom', scrollY: 900, maxScroll: 1000 });
    const b2 = createBookmarkEntry({ url: 'u', text: 'top', scrollY: 100, maxScroll: 1000 });
    const b3 = createBookmarkEntry({ url: 'u', text: 'mid', scrollY: 500, maxScroll: 1000 });

    const sorted = sortBookmarks([b1, b2, b3]);
    expect(sorted[0].text).toBe('top');
    expect(sorted[1].text).toBe('mid');
    expect(sorted[2].text).toBe('bottom');
  });
});

describe('resolveBookmarksLocale', () => {
  it('resolves Arabic configuration for RTL pages', () => {
    const config = resolveBookmarksLocale(true);
    expect(config.title).toBe('هوامش الصفحة');
    expect(config.empty).toBe('لا توجد هوامش محفوظة بعد');
    expect(config.triggerAria).toBe('فهرس هوامش الصفحة');
    expect(config.bookmarksTab).toBe('الهوامش');
    expect(config.tocTab).toBe('فهرس العناوين');
    expect(config.exportBtn).toBe('نسخ كـ Markdown');
  });

  it('resolves English configuration for LTR pages', () => {
    const config = resolveBookmarksLocale(false);
    expect(config.title).toBe('Page Bookmarks');
    expect(config.empty).toBe('No bookmarks saved yet');
    expect(config.triggerAria).toBe('Page Bookmarks Index');
    expect(config.bookmarksTab).toBe('Bookmarks');
    expect(config.tocTab).toBe('Headings');
    expect(config.exportBtn).toBe('Export Markdown');
  });
});

