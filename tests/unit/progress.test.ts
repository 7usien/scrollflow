/**
 * tests/unit/progress.test.ts
 * يختبر src/core/progress.ts — يُسلَّم جاهزًا ويجب أن يصبح أخضر بـ T04.
 * PRD: FR-01, FR-02, FR-04
 */
import { describe, it, expect } from 'vitest';
import { clamp01, computeProgress, isScrollable, computeMetricsFrom } from '../../src/core/progress';

describe('clamp01', () => {
  it('يحصر بين 0 و 1', () => {
    expect(clamp01(-0.5)).toBe(0);
    expect(clamp01(0.42)).toBe(0.42);
    expect(clamp01(1.9)).toBe(1);
    expect(clamp01(NaN)).toBe(0);
  });
});

describe('computeProgress (FR-04)', () => {
  it('يعيد 0 عند عدم وجود تمرير', () => {
    expect(computeProgress(0, 0)).toBe(0);
    expect(computeProgress(500, 0)).toBe(0);
  });
  it('يحسب النسبة الخطية', () => {
    expect(computeProgress(0, 1000)).toBe(0);
    expect(computeProgress(500, 1000)).toBe(0.5);
    expect(computeProgress(1000, 1000)).toBe(1);
  });
  it('لا يتجاوز الحدود عند قيم شاذة', () => {
    expect(computeProgress(-40, 1000)).toBe(0);
    expect(computeProgress(1200, 1000)).toBe(1);
  });
});

describe('isScrollable (FR-02)', () => {
  it('يرفض التمرير التافه (أقل من 20% من الشاشة)', () => {
    expect(isScrollable(100, 800)).toBe(false);
    expect(isScrollable(159, 800)).toBe(false);
  });
  it('يقبل التمرير الحقيقي', () => {
    expect(isScrollable(160, 800)).toBe(true);
    expect(isScrollable(4000, 800)).toBe(true);
  });
});

describe('computeMetricsFrom (FR-01)', () => {
  it('يحسب maxScroll و screens', () => {
    const m = computeMetricsFrom({ docHeight: 8000, viewportH: 800, scrollY: 1600 });
    expect(m.maxScroll).toBe(7200);
    expect(m.screens).toBeCloseTo(10, 5);
    expect(m.scrollable).toBe(true);
    expect(m.scrollY).toBe(1600);
  });
  it('maxScroll لا يكون سالبًا عندما تكون الصفحة أقصر من الشاشة', () => {
    const m = computeMetricsFrom({ docHeight: 400, viewportH: 800, scrollY: 0 });
    expect(m.maxScroll).toBe(0);
    expect(m.scrollable).toBe(false);
  });
});
