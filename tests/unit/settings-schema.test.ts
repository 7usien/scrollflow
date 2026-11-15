/**
 * tests/unit/settings-schema.test.ts — Unit tests for sanitizeSettings and settings schema
 */
import { describe, it, expect } from 'vitest';
import { sanitizeSettings, DEFAULT_SETTINGS } from '../../src/shared/settings-schema';

describe('sanitizeSettings', () => {
  it('يعيد القيم الافتراضية عند تمرير null أو undefined أو كائن فارغ', () => {
    expect(sanitizeSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(sanitizeSettings(undefined)).toEqual(DEFAULT_SETTINGS);
    expect(sanitizeSettings({})).toEqual(DEFAULT_SETTINGS);
  });

  it('يقبل ويثبت الثيمات الجديدة المعتمدة', () => {
    expect(sanitizeSettings({ theme: 'cyberpunk' }).theme).toBe('cyberpunk');
    expect(sanitizeSettings({ theme: 'minimal' }).theme).toBe('minimal');
    expect(sanitizeSettings({ theme: 'glass' }).theme).toBe('glass');
    expect(sanitizeSettings({ theme: 'sunset' }).theme).toBe('sunset');
    expect(sanitizeSettings({ theme: 'invalid-theme' }).theme).toBe('aurora');
  });

  it('يضبط الموضع والتخطيط الأفقي والرأسي بشكل متسق', () => {
    const top = sanitizeSettings({ position: 'top' });
    expect(top.position).toBe('top');
    expect(top.orientation).toBe('horizontal');

    const bottom = sanitizeSettings({ position: 'bottom' });
    expect(bottom.position).toBe('bottom');
    expect(bottom.orientation).toBe('horizontal');

    const left = sanitizeSettings({ position: 'left' });
    expect(left.position).toBe('left');
    expect(left.orientation).toBe('vertical');

    const right = sanitizeSettings({ position: 'right' });
    expect(right.position).toBe('right');
    expect(right.orientation).toBe('vertical');
  });

  it('يحافظ على إعدادات إخفاء السكرول والسكرول السلس', () => {
    const custom = sanitizeSettings({
      hideNativeScrollbar: false,
      smoothScroll: false,
    });
    expect(custom.hideNativeScrollbar).toBe(false);
    expect(custom.smoothScroll).toBe(false);

    const defaults = sanitizeSettings({});
    expect(defaults.hideNativeScrollbar).toBe(true);
    expect(defaults.smoothScroll).toBe(false);
  });
});
