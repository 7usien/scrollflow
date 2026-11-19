// tests/unit/toc.test.ts — Unit tests for pure TOC logic
import { describe, it, expect } from 'vitest';
import { isValidHeading, computeTocEntries, computeActiveHeadingIndex, type RawHeading } from '../../src/core/toc';

describe('isValidHeading', () => {
  it('rejects empty, null, or undefined headings', () => {
    expect(isValidHeading(null)).toBe(false);
    expect(isValidHeading(undefined)).toBe(false);
    expect(isValidHeading('')).toBe(false);
    expect(isValidHeading('   ')).toBe(false);
    expect(isValidHeading('a')).toBe(false); // < 2 chars
  });

  it('rejects generic boilerplate headings', () => {
    expect(isValidHeading('التعليقات')).toBe(false);
    expect(isValidHeading('Share this')).toBe(false);
    expect(isValidHeading('Privacy Policy')).toBe(false);
    expect(isValidHeading('سياسة الخصوصية')).toBe(false);
  });

  it('accepts meaningful section titles', () => {
    expect(isValidHeading('1. Introduction to AI')).toBe(true);
    expect(isValidHeading('المبحث الأول: نشأة النظم')).toBe(true);
    expect(isValidHeading('Features and Specifications')).toBe(true);
  });
});

describe('computeTocEntries', () => {
  it('returns empty array when headings are empty or page is not scrollable', () => {
    expect(computeTocEntries([], 1000)).toEqual([]);
    expect(computeTocEntries([{ tagName: 'H2', text: 'Intro', offsetTop: 200, isVisible: true }], 0)).toEqual([]);
  });

  it('filters out invisible or invalid headings and maps ratios correctly', () => {
    const raw: RawHeading[] = [
      { tagName: 'H2', text: 'Chapter 1: The Beginning', offsetTop: 250, isVisible: true },
      { tagName: 'H3', text: 'Comments', offsetTop: 400, isVisible: true }, // ignored boilerplate
      { tagName: 'H2', text: 'Hidden Chapter', offsetTop: 500, isVisible: false }, // invisible
      { tagName: 'H2', text: 'Chapter 2: Scaling Up', offsetTop: 750, isVisible: true },
    ];

    const entries = computeTocEntries(raw, 1000);
    expect(entries.length).toBe(2);
    expect(entries[0].text).toBe('Chapter 1: The Beginning');
    expect(entries[0].scrollRatio).toBe(0.25);
    expect(entries[0].level).toBe(2);

    expect(entries[1].text).toBe('Chapter 2: Scaling Up');
    expect(entries[1].scrollRatio).toBe(0.75);
  });

  it('sorts headings vertically and limits maximum entries', () => {
    const raw: RawHeading[] = [];
    for (let i = 0; i < 30; i++) {
      raw.push({
        tagName: 'H2',
        text: `Section ${30 - i}`, // reverse order
        offsetTop: (30 - i) * 100,
        isVisible: true,
      });
    }

    const entries = computeTocEntries(raw, 3000, 10);
    expect(entries.length).toBe(10);
    expect(entries[0].scrollRatio).toBeLessThan(entries[9].scrollRatio);
  });
});

describe('computeActiveHeadingIndex', () => {
  const entries = [
    { id: '1', level: 1, text: 'Intro', scrollY: 100, scrollRatio: 0.1 },
    { id: '2', level: 2, text: 'Architecture', scrollY: 600, scrollRatio: 0.3 },
    { id: '3', level: 2, text: 'Benchmarks', scrollY: 1200, scrollRatio: 0.6 },
    { id: '4', level: 1, text: 'Conclusion', scrollY: 1800, scrollRatio: 0.9 },
  ];

  it('returns -1 for empty entries', () => {
    expect(computeActiveHeadingIndex([], 200)).toBe(-1);
  });

  it('activates the first heading when near the top', () => {
    expect(computeActiveHeadingIndex(entries, 0)).toBe(0);
  });

  it('tracks active section as user scrolls down', () => {
    expect(computeActiveHeadingIndex(entries, 500)).toBe(1); // 500 + 120 = 620 >= 600
    expect(computeActiveHeadingIndex(entries, 1100)).toBe(2); // 1100 + 120 = 1220 >= 1200
    expect(computeActiveHeadingIndex(entries, 2000)).toBe(3); // past conclusion
  });
});
