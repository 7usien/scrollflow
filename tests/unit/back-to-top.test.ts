// tests/unit/back-to-top.test.ts — Unit tests for Back to Top pure core logic
import { describe, it, expect } from 'vitest';
import { shouldShowBackToTop, resolveBackToTopLocale } from '../../src/core/back-to-top';

describe('shouldShowBackToTop', () => {
  it('returns false when page is not scrollable', () => {
    expect(shouldShowBackToTop(1.0, false, false)).toBe(false);
    expect(shouldShowBackToTop(0.98, false, true)).toBe(false);
  });

  it('shows when progress reaches or exceeds show threshold (>= 85%)', () => {
    expect(shouldShowBackToTop(0.84, true, false)).toBe(false);
    expect(shouldShowBackToTop(0.85, true, false)).toBe(true);
    expect(shouldShowBackToTop(0.95, true, false)).toBe(true);
    expect(shouldShowBackToTop(1.0, true, false)).toBe(true);
  });

  it('keeps visible between 75% and 85% due to hysteresis when already visible', () => {
    // Was visible, scrolls up slightly to 80% -> should remain visible
    expect(shouldShowBackToTop(0.80, true, true)).toBe(true);
    expect(shouldShowBackToTop(0.75, true, true)).toBe(true);
  });

  it('hides when progress drops below hide threshold (< 75%)', () => {
    expect(shouldShowBackToTop(0.74, true, true)).toBe(false);
    expect(shouldShowBackToTop(0.50, true, true)).toBe(false);
    expect(shouldShowBackToTop(0.0, true, true)).toBe(false);
  });

  it('shows when within 250px of bottom even if progress percentage is lower', () => {
    expect(shouldShowBackToTop(0.70, true, false, 0.85, 0.75, 200)).toBe(true);
    expect(shouldShowBackToTop(0.60, true, false, 0.85, 0.75, 250)).toBe(true);
    expect(shouldShowBackToTop(0.60, true, false, 0.85, 0.75, 300)).toBe(false);
  });

  it('respects custom show and hide thresholds if provided', () => {
    expect(shouldShowBackToTop(0.85, true, false, 0.80, 0.70)).toBe(true);
    expect(shouldShowBackToTop(0.75, true, true, 0.80, 0.70)).toBe(true);
    expect(shouldShowBackToTop(0.69, true, true, 0.80, 0.70)).toBe(false);
  });
});

describe('resolveBackToTopLocale', () => {
  it('resolves Arabic configuration for RTL pages', () => {
    const config = resolveBackToTopLocale(true);
    expect(config.text).toBe('الأعلى');
    expect(config.side).toBe('right');
    expect(config.dir).toBe('rtl');
    expect(config.ariaLabel).toBe('الرجوع إلى أعلى الصفحة');
  });

  it('resolves English configuration for LTR pages', () => {
    const config = resolveBackToTopLocale(false);
    expect(config.text).toBe('UP');
    expect(config.side).toBe('left');
    expect(config.dir).toBe('ltr');
    expect(config.ariaLabel).toBe('Scroll to top of page');
  });
});
