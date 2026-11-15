/**
 * tests/unit/url.test.ts — يختبر src/core/url.ts  (FR-17, FR-27, FR-28, PRD §10.3)
 */
import { describe, it, expect } from 'vitest';
import { normalizeUrl, isExcluded, matchesHostPattern } from '../../src/core/url';

describe('normalizeUrl', () => {
  it('يحذف معاملات التتبّع ويحافظ على المفيدة', () => {
    expect(normalizeUrl('https://example.com/post?utm_source=tw&b=2&fbclid=xyz'))
      .toBe('https://example.com/post?b=2');
  });
  it('يحذف الـ hash العادي', () => {
    expect(normalizeUrl('https://example.com/doc#section-3')).toBe('https://example.com/doc');
  });
  it('يحافظ على hash-routing للـ SPA', () => {
    expect(normalizeUrl('https://app.example.com/#/inbox/42')).toBe('https://app.example.com/#/inbox/42');
  });
  it('يحذف الشرطة الأخيرة الزائدة', () => {
    expect(normalizeUrl('https://example.com/a/')).toBe('https://example.com/a');
    expect(normalizeUrl('https://example.com/')).toBe('https://example.com/');
  });
  it('يعيد النص كما هو عند رابط غير صالح دون رمي خطأ', () => {
    expect(() => normalizeUrl('not a url')).not.toThrow();
  });
});

describe('matchesHostPattern (FR-27)', () => {
  it('نطاق مجرّد يطابق النطاق وكل نطاقاته الفرعية', () => {
    expect(matchesHostPattern('example.com', 'example.com')).toBe(true);
    expect(matchesHostPattern('example.com', 'www.example.com')).toBe(true);
    expect(matchesHostPattern('example.com', 'docs.example.com')).toBe(true);
    expect(matchesHostPattern('example.com', 'notexample.com')).toBe(false);
  });
  it('نمط *.  يطابق النطاقات الفرعية فقط', () => {
    expect(matchesHostPattern('*.example.com', 'docs.example.com')).toBe(true);
    expect(matchesHostPattern('*.example.com', 'example.com')).toBe(false);
  });
});

describe('isExcluded (FR-28)', () => {
  const base = { blocklist: [] as string[], allowFileUrls: false };
  it('يستثني صفحات المتصفح الداخلية', () => {
    for (const u of ['chrome://settings', 'chrome-extension://abc/popup.html',
                     'about:blank', 'edge://flags', 'view-source:https://x.com']) {
      expect(isExcluded(u, base)).toBe(true);
    }
  });
  it('يستثني متجر الإضافات', () => {
    expect(isExcluded('https://chromewebstore.google.com/detail/x', base)).toBe(true);
  });
  it('يستثني file:// إلا إذا سُمح', () => {
    expect(isExcluded('file:///home/user/a.html', base)).toBe(true);
    expect(isExcluded('file:///home/user/a.html', { ...base, allowFileUrls: true })).toBe(false);
  });
  it('يطبّق قائمة الاستثناء مع تجاهل www.', () => {
    const s = { ...base, blocklist: ['mail.google.com'] };
    expect(isExcluded('https://mail.google.com/mail/u/0/', s)).toBe(true);
    expect(isExcluded('https://WWW.mail.google.com/x', s)).toBe(true);
    expect(isExcluded('https://docs.google.com/document/d/1', s)).toBe(false);
  });
  it('يسمح بالصفحات العادية', () => {
    expect(isExcluded('https://ar.wikipedia.org/wiki/قراءة', base)).toBe(false);
  });
});
