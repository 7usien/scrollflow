/** tests/unit/reading.test.ts — src/core/reading.ts (FR-09) */
import { describe, it, expect } from 'vitest';
import { countWords, estimateReadingMinutes, screensOf } from '../../src/core/reading';

describe('countWords', () => {
  it('يعدّ الكلمات العربية والإنجليزية', () => {
    expect(countWords('واحد اثنان ثلاثة')).toBe(3);
    expect(countWords('one two three four')).toBe(4);
    expect(countWords('   ')).toBe(0);
    expect(countWords('')).toBe(0);
  });
});

describe('estimateReadingMinutes (FR-09)', () => {
  it('220 كلمة = دقيقة واحدة', () => {
    expect(estimateReadingMinutes(220)).toBe(1);
  });
  it('2200 كلمة = 10 دقائق', () => {
    expect(estimateReadingMinutes(2200)).toBe(10);
  });
  it('الحد الأدنى دقيقة واحدة', () => {
    expect(estimateReadingMinutes(0)).toBe(1);
    expect(estimateReadingMinutes(30)).toBe(1);
  });
});

describe('screensOf', () => {
  it('يحسب عدد الشاشات بمنزلة عشرية', () => {
    expect(screensOf(8000, 800)).toBe(10);
    expect(screensOf(7400, 1000)).toBeCloseTo(7.4, 5);
  });
  it('لا يقسم على صفر', () => {
    expect(screensOf(1000, 0)).toBe(0);
  });
});
