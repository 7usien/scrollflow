// tests/unit/export.test.ts — Unit tests for pure export logic
import { describe, it, expect } from 'vitest';
import { formatBookmarksAsMarkdown, formatBookmarksAsText } from '../../src/core/export';
import { createBookmarkEntry } from '../../src/core/bookmarks';

describe('formatBookmarksAsMarkdown', () => {
  it('formats empty bookmarks list gracefully', () => {
    const md = formatBookmarksAsMarkdown({
      pageTitle: 'Test Page',
      url: 'https://example.com',
      bookmarks: [],
      locale: 'ar',
    });

    expect(md).toContain('# [Test Page](https://example.com)');
    expect(md).toContain('لا توجد هوامش محفوظة');
  });

  it('formats multiple sorted bookmarks with percentage and color labels in Arabic', () => {
    const b1 = createBookmarkEntry({
      url: 'https://example.com',
      text: 'First section text',
      scrollY: 100,
      maxScroll: 1000,
      color: 'yellow',
    });
    const b2 = createBookmarkEntry({
      url: 'https://example.com',
      text: 'Second section text',
      scrollY: 500,
      maxScroll: 1000,
      color: 'green',
    });

    const md = formatBookmarksAsMarkdown({
      pageTitle: 'Guide to Architecture',
      url: 'https://example.com/arch',
      bookmarks: [b2, b1], // unordered
      locale: 'ar',
    });

    expect(md).toContain('# [Guide to Architecture](https://example.com/arch)');
    expect(md).toContain('- **[10%]** (مهم) "First section text"');
    expect(md).toContain('- **[50%]** (اقتباس) "Second section text"');
    // Ensure b1 comes before b2 in the output
    const idx1 = md.indexOf('[10%]');
    const idx2 = md.indexOf('[50%]');
    expect(idx1).toBeLessThan(idx2);
  });

  it('formats in English when locale is en', () => {
    const b = createBookmarkEntry({
      url: 'https://example.com',
      text: 'Sample quote',
      scrollY: 300,
      maxScroll: 1000,
      color: 'purple',
    });

    const md = formatBookmarksAsMarkdown({
      pageTitle: 'Docs',
      url: 'https://example.com/doc',
      bookmarks: [b],
      locale: 'en',
    });

    expect(md).toContain('Exported via ScrollFlow (Bookmarks: 1)');
    expect(md).toContain('- **[30%]** (Note) "Sample quote"');
  });
});

describe('formatBookmarksAsText', () => {
  it('formats bookmarks as clean plaintext', () => {
    const b = createBookmarkEntry({
      url: 'https://example.com',
      text: 'Clean text snippet',
      scrollY: 250,
      maxScroll: 1000,
    });

    const txt = formatBookmarksAsText({
      pageTitle: 'My Page',
      url: 'https://example.com',
      bookmarks: [b],
    });

    expect(txt).toContain('My Page (https://example.com)');
    expect(txt).toContain('[25%] Clean text snippet');
  });
});
