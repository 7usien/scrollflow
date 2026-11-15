/**
 * tests/unit/storage-model.test.ts — src/core/storage-model.ts
 * FR-24 (TTL 90 يومًا + سقف 1500 سجل LRU) · FR-16
 */
import { describe, it, expect } from 'vitest';
import { makeEntry, applyTtl, applyLruCap, MAX_ENTRIES, TTL_MS } from '../../src/core/storage-model';
import type { ScrollEntry } from '../../src/shared/types';

const DAY = 86_400_000;
const now = 1_800_000_000_000;

function entry(i: number, ageDays = 0): ScrollEntry {
  return {
    url: `https://example.com/p/${i}`,
    scrollY: 1000 + i,
    scrollRatio: 0.5,
    docHeight: 9000,
    viewportH: 900,
    ts: now - ageDays * DAY,
  };
}

describe('makeEntry', () => {
  it('ينتج سجلًا صحيحًا من قياسات الصفحة', () => {
    const e = makeEntry({ url: 'https://a.com/x', scrollY: 900, maxScroll: 1800, docHeight: 2700, viewportH: 900 }, now);
    expect(e.url).toBe('https://a.com/x');
    expect(e.scrollRatio).toBeCloseTo(0.5, 5);
    expect(e.docHeight).toBe(2700);
    expect(e.ts).toBe(now);
  });
});

describe('applyTtl (FR-24)', () => {
  it('يحذف السجلات الأقدم من 90 يومًا', () => {
    const fresh = entry(1, 89);
    const stale = entry(2, 91);
    const out = applyTtl([fresh, stale], now);
    expect(out.map(e => e.url)).toEqual([fresh.url]);
  });
  it('TTL يساوي 90 يومًا بالمللي ثانية', () => {
    expect(TTL_MS).toBe(90 * DAY);
  });
});

describe('applyLruCap (FR-24)', () => {
  it('يحتفظ بالحد الأقصى ويحذف الأقدم استخدامًا', () => {
    const list = Array.from({ length: MAX_ENTRIES + 1 }, (_, i) => entry(i, i * 0.01));
    const out = applyLruCap(list);
    expect(out).toHaveLength(MAX_ENTRIES);
    // الأحدث استخدامًا هو صاحب أصغر ageDays = entry(0) — يجب أن يبقى
    expect(out.some(e => e.url === entry(0).url)).toBe(true);
    // الأقدم (الأكبر ageDays) يجب أن يُحذف
    expect(out.some(e => e.url === entry(MAX_ENTRIES).url)).toBe(false);
  });
  it('لا يغيّر القوائم الأصغر من السقف', () => {
    const list = [entry(1), entry(2)];
    expect(applyLruCap(list)).toHaveLength(2);
  });
});
