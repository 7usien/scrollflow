/**
 * tests/unit/settings-schema.test.ts — Unit tests for sanitizeSettings and settings schema
 */
import { describe, it, expect } from 'vitest';
import { sanitizeSettings, DEFAULT_SETTINGS } from '../../src/shared/settings-schema';
import { resolveEffectivePosition } from '../../src/shared/theme';
import type { BarLength, BarRadius } from '../../src/shared/types';

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

    const right = sanitizeSettings({ version: 2, position: 'right' });
    expect(right.position).toBe('right');
    expect(right.orientation).toBe('vertical');

    const auto = sanitizeSettings({ position: 'auto' });
    expect(auto.position).toBe('auto');
    expect(auto.orientation).toBe('vertical');
  });

  it('يرقّي إعدادات الإصدار 1 القديمة تلقائيًا إلى الإصدار 2 مع تحويل الموضع الافتراضي القديم إلى auto', () => {
    // Legacy v1 with default 'right' migrates to 'auto'
    const legacyV1 = sanitizeSettings({ version: 1, position: 'right', side: 'right' });
    expect(legacyV1.version).toBe(2);
    expect(legacyV1.position).toBe('auto');
    expect(legacyV1.side).toBe('auto');

    // Unversioned legacy with default 'right' migrates to 'auto'
    const legacyUnversioned = sanitizeSettings({ position: 'right' });
    expect(legacyUnversioned.version).toBe(2);
    expect(legacyUnversioned.position).toBe('auto');
    expect(legacyUnversioned.side).toBe('auto');

    // Legacy v1 with explicitly chosen 'left' or 'top' is preserved
    const legacyCustom = sanitizeSettings({ version: 1, position: 'left', side: 'left' });
    expect(legacyCustom.version).toBe(2);
    expect(legacyCustom.position).toBe('left');
    expect(legacyCustom.side).toBe('left');

    // Version 2 explicit 'right' is strictly respected
    const explicitV2 = sanitizeSettings({ version: 2, position: 'right' });
    expect(explicitV2.version).toBe(2);
    expect(explicitV2.position).toBe('right');
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

  it('يضبط خيارات طول الشريط وانحناء الحواف والظل بشكل صحيح', () => {
    const full = sanitizeSettings({ barLength: 'full', barRadius: 'subtle', shadow: false });
    expect(full.barLength).toBe('full');
    expect(full.barRadius).toBe('subtle');
    expect(full.shadow).toBe(false);

    const pill = sanitizeSettings({ barRadius: 'pill', shadow: true });
    expect(pill.barRadius).toBe('pill');
    expect(pill.shadow).toBe(true);

    const sharp = sanitizeSettings({ barRadius: 'sharp' });
    expect(sharp.barRadius).toBe('sharp');

    const invalid = sanitizeSettings({ barLength: 'huge' as unknown as BarLength, barRadius: 'round' as unknown as BarRadius });
    expect(invalid.barLength).toBe('floating');
    expect(invalid.barRadius).toBe('subtle');
  });

  it('يحلل الموضع الفعلي تلقائيًا حسب لغة واتجاه الصفحة (RTL / LTR)', () => {
    // Auto on RTL page -> right
    expect(resolveEffectivePosition('auto', 'auto', true).position).toBe('right');
    expect(resolveEffectivePosition('auto', 'auto', true).orientation).toBe('vertical');

    // Auto on LTR page -> left
    expect(resolveEffectivePosition('auto', 'auto', false).position).toBe('left');
    expect(resolveEffectivePosition('auto', 'auto', false).orientation).toBe('vertical');

    // Explicit manual positions are preserved regardless of page direction
    expect(resolveEffectivePosition('right', 'right', false).position).toBe('right');
    expect(resolveEffectivePosition('left', 'left', true).position).toBe('left');
    expect(resolveEffectivePosition('top', 'auto', true).position).toBe('top');
    expect(resolveEffectivePosition('top', 'auto', true).orientation).toBe('horizontal');
    expect(resolveEffectivePosition('bottom', 'auto', false).position).toBe('bottom');
    expect(resolveEffectivePosition('bottom', 'auto', false).orientation).toBe('horizontal');
  });
});
