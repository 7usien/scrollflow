/**
 * ══════════════════════════════════════════════════════════════════════════
 * tests/e2e/core.spec.ts — السيناريوهات E1…E10 (PRD §14.2)
 * ══════════════════════════════════════════════════════════════════════════
 * المتطلبات المسبقة:
 *   1) `npm run build` ينتج dist/ (playwright.config.ts يشغّله عبر build أولًا)
 *   2) `playwright.config.ts` يضبط webServer:  command: 'node tests/fixtures/serve.mjs'
 *      و baseURL: 'http://localhost:4599'
 *   3) hooks الاختبار المتفق عليها في التنفيذ (إلزامية):
 *        - عنصر الجذر:        id="scrollflow-root"  (داخل ShadowRoot: data-testid="rail")
 *        - الشريط:            [data-testid="rail"]
 *        - التعبئة:           [data-testid="fill"]  (له --sf-progress)
 *        - التلميح:           [data-testid="toast"]
 *        - لوحة الإضافة:      لا شيء (نستخدم storage API مباشرة)
 *
 * ملاحظة: Playwright يخترق الـ open Shadow DOM تلقائيًا في محددات CSS.
 * ══════════════════════════════════════════════════════════════════════════
 */
import { test, expect, chromium, type BrowserContext, type Page } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const DIST = resolve(ROOT, 'dist');
const BASE = 'http://localhost:4599';

let context: BrowserContext;
let extensionId: string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let swWorker: any;

test.beforeAll(async () => {
  context = await chromium.launchPersistentContext('', {
    headless: false,
    args: [
      `--headless=new`,
      `--lang=ar`,
      `--enable-features=OverlayScrollbar`,
      `--disable-extensions-except=${DIST}`,
      `--load-extension=${DIST}`,
    ],
  });
  swWorker = context.serviceWorkers()[0];
  if (!swWorker) {
    swWorker = await context.waitForEvent('serviceworker', { timeout: 5000 }).catch(() => undefined);
  }
  if (swWorker) {
    extensionId = new URL(swWorker.url()).host;
    void extensionId;
  }
});

test.afterAll(async () => { await context?.close(); });

/** يفتح صفحة وينتظر ظهور جذر الإضافة */
async function open(path: string): Promise<Page> {
  const page = await context.newPage();
  await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#scrollflow-root', { state: 'attached', timeout: 5000 });
  return page;
}

const rail = (p: Page) => p.locator('[data-testid="rail"]');
const progress = (p: Page) =>
  p.evaluate(() => Number(getComputedStyle(document.getElementById('scrollflow-root')!
    .shadowRoot!.querySelector('[data-testid="fill"]')!).getPropertyValue('--sf-progress')) || 0);

async function scrollToRatio(p: Page, r: number) {
  await p.evaluate((ratio) => {
    const el = document.scrollingElement!;
    el.scrollTop = (el.scrollHeight - innerHeight) * ratio;
    window.dispatchEvent(new Event('scroll'));
  }, r);
  await p.waitForTimeout(450);
}

// ─────────────────────────────────────────────────────────────── E1
test('E1: الشريط يظهر ويتحرك مع التمرير (FR-01,05,06)', async () => {
  const page = await open('/long.html');
  await expect(rail(page)).toHaveCount(1);
  const p0 = await progress(page);
  expect(p0).toBeLessThan(0.02);

  await scrollToRatio(page, 0.5);
  await page.waitForTimeout(300);
  const p50 = await progress(page);
  expect(p50).toBeGreaterThan(0.44);
  expect(p50).toBeLessThan(0.56);

  await page.close();
});

// ─────────────────────────────────────────────────────────────── E2
test('E2: Confetti يظهر عند النهاية ثم يُنظَّف (FR-10, §6.6)', async () => {
  const page = await open('/long.html');
  expect(await page.locator('canvas').count()).toBe(0);

  await scrollToRatio(page, 1);
  await page.waitForTimeout(400);
  expect(await page.locator('canvas').count()).toBe(1);

  await page.waitForTimeout(3000); // مدة الاحتفال 1.6–2.2s + هامش
  expect(await page.locator('canvas').count()).toBe(0); // تنظيف كامل

  await page.close();
});

// ─────────────────────────────────────────────────────────────── E3
test('E3: استعادة موضع التمرير بعد إعادة التحميل (FR-18,19,22)', async () => {
  let page = await open('/long.html');
  await scrollToRatio(page, 0.6);
  const before = await page.evaluate(() => window.scrollY);
  await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
  await page.waitForTimeout(600); // يسمح للـ debounce/الحفظ بالوصول
  await page.close();

  page = await open('/long.html');
  await page.waitForTimeout(2500); // نافذة محاولات الاستعادة
  const after = await page.evaluate(() => window.scrollY);
  expect(Math.abs(after - before)).toBeLessThanOrEqual(8);

  await page.close();
});

// ─────────────────────────────────────────────────────────────── E4
test('E4: استثناء موقع يخفي الشريط ويبقى بعد reload (FR-27)', async () => {
  let page = await open('/long.html');
  await expect(rail(page)).toBeVisible();

  const worker = swWorker ?? context.serviceWorkers()[0];
  await worker.evaluate(() => chrome.storage.sync.get('settings', (s: { settings?: { blocklist?: string[] } }) => {
    const cur = s.settings ?? {};
    chrome.storage.sync.set({ settings: { ...cur, blocklist: ['localhost'] } });
  }));
  await page.waitForTimeout(600);

  // إخفاء فوري دون reload
  const opacity = await page.evaluate(() => {
    const r = document.getElementById('scrollflow-root')!.shadowRoot!
      .querySelector('[data-testid="rail"]') as HTMLElement;
    return getComputedStyle(r).opacity;
  });
  expect(Number(opacity)).toBeLessThan(0.05);
  await page.close();

  page = await open('/long.html');
  await page.waitForTimeout(1200);
  const opacity2 = await page.evaluate(() => {
    const root = document.getElementById('scrollflow-root');
    if (!root?.shadowRoot) return 0;
    const r = root.shadowRoot.querySelector('[data-testid="rail"]') as HTMLElement | null;
    return r ? Number(getComputedStyle(r).opacity) : 0;
  });
  expect(opacity2).toBeLessThan(0.05);

  // تنظيف
  await worker.evaluate(() => chrome.storage.sync.get('settings', (s: { settings?: { blocklist?: string[] } }) => {
    chrome.storage.sync.set({ settings: { ...s.settings, blocklist: [] } });
  }));
  await page.close();
});

// ─────────────────────────────────────────────────────────────── E5
test('E5: صفحة قصيرة ⇒ لا شريط (FR-02)', async () => {
  const page = await open('/short.html');
  await page.waitForTimeout(800);
  const visible = await page.evaluate(() => {
    const r = document.getElementById('scrollflow-root')?.shadowRoot
      ?.querySelector('[data-testid="rail"]') as HTMLElement | null;
    return r ? Number(getComputedStyle(r).opacity) > 0.05 : false;
  });
  expect(visible).toBe(false);
  await page.close();
});

// ─────────────────────────────────────────────────────────────── E6
test('E6: تنقّل SPA يصفّر الحالة ويستعيد موضع المسار الجديد (FR-23)', async () => {
  const page = await open('/spa.html');
  await scrollToRatio(page, 0.5);
  await page.evaluate(() => history.pushState({}, '', '/spa.html#/route-b'));
  await page.waitForTimeout(1200);
  const p = await progress(page);
  expect(p).toBeLessThan(0.1); // مسار جديد بلا موضع محفوظ ⇒ يبدأ من الأعلى
  await page.close();
});

// ─────────────────────────────────────────────────────────────── E7
test('E7: Infinite scroll يعيد حساب الطول (FR-03)', async () => {
  const page = await open('/infinite.html');
  const h1 = await page.evaluate(() => document.scrollingElement!.scrollHeight);
  await scrollToRatio(page, 1);
  await page.waitForTimeout(1500); // تُضاف كتل جديدة
  const h2 = await page.evaluate(() => document.scrollingElement!.scrollHeight);
  expect(h2).toBeGreaterThan(h1);
  const p = await progress(page);
  expect(p).toBeLessThan(0.98); // النسبة تنخفض منطقيًا بعد إضافة محتوى
  await page.close();
});

// ─────────────────────────────────────────────────────────────── E8
test('E8: prefers-reduced-motion يمنع Canvas ويُظهر تلميحًا (FR-13)', async () => {
  const ctx = await context.newPage();
  await ctx.emulateMedia({ reducedMotion: 'reduce' });
  await ctx.goto(BASE + '/long.html', { waitUntil: 'domcontentloaded' });
  await ctx.waitForSelector('#scrollflow-root', { state: 'attached' });
  await scrollToRatio(ctx, 1);
  await ctx.waitForTimeout(400);
  expect(await ctx.locator('canvas').count()).toBe(0);
  await expect(ctx.locator('[data-testid="toast"]')).toContainText(/أكملت|نهاية|Page completed/);
  await ctx.close();
});

// ─────────────────────────────────────────────────────────────── E9
test('E9: نافذة ضيقة 320px — الشريط لا يغطي المحتوى (NFR-10)', async () => {
  const page = await open('/long.html');
  await page.setViewportSize({ width: 320, height: 640 });
  await page.waitForTimeout(400);
  const box = await rail(page).boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeLessThanOrEqual(12); // ≤ 10px + هامش
  expect(box!.x).toBeGreaterThan(320 - 12);
  await page.close();
});

// ─────────────────────────────────────────────────────────────── E10
test('E10: حاوية تمرير داخلية ⇒ لا شريط (FR-33)', async () => {
  const page = await open('/nested-scroll.html');
  await page.waitForTimeout(900);
  const visible = await page.evaluate(() => {
    const r = document.getElementById('scrollflow-root')?.shadowRoot
      ?.querySelector('[data-testid="rail"]') as HTMLElement | null;
    return r ? Number(getComputedStyle(r).opacity) > 0.05 : false;
  });
  expect(visible).toBe(false);
  await page.close();
});

// ─────────────────────────────────────────────────────────────── E11
test('E11: إخفاء السكرول الأصلي وحقن الستايل التلقائي', async () => {
  const page = await open('/long.html');
  await page.waitForTimeout(400);
  const hasStyle = await page.evaluate(() => {
    const el = document.getElementById('sf-native-scroll-override');
    return el !== null && getComputedStyle(document.documentElement).scrollbarWidth === 'none';
  });
  expect(hasStyle).toBe(true);
  await page.close();
});

// ─────────────────────────────────────────────────────────────── E12
test('E12: التخطيط الأفقي (Top) وتغيير المحاذاة', async () => {
  const worker = swWorker ?? context.serviceWorkers()[0];
  await worker.evaluate(async () => {
    const stored = await chrome.storage.sync.get('settings');
    const s = (stored?.settings as Record<string, unknown>) || {};
    s.position = 'top';
    s.orientation = 'horizontal';
    await chrome.storage.sync.set({ settings: s });
  });

  const page = await open('/long.html');
  await page.waitForTimeout(500);

  const orientation = await page.evaluate(() => {
    return document.getElementById('scrollflow-root')?.getAttribute('data-orientation');
  });
  expect(orientation).toBe('horizontal');

  const box = await rail(page).boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y).toBeLessThan(30);
  expect(box!.width).toBeGreaterThan(100);

  // Restore to right
  await worker.evaluate(async () => {
    const stored = await chrome.storage.sync.get('settings');
    const s = (stored?.settings as Record<string, unknown>) || {};
    s.position = 'right';
    s.orientation = 'vertical';
    await chrome.storage.sync.set({ settings: s });
  });
  await page.close();
});

// ─────────────────────────────────────────────────────────────── E13
test('E13: الستايلات المتعددة (Cyberpunk, Minimal, Glass)', async () => {
  const worker = swWorker ?? context.serviceWorkers()[0];
  await worker.evaluate(async () => {
    const stored = await chrome.storage.sync.get('settings');
    const s = (stored?.settings as Record<string, unknown>) || {};
    s.theme = 'cyberpunk';
    await chrome.storage.sync.set({ settings: s });
  });

  const page = await open('/long.html');
  await page.waitForTimeout(500);

  const appliedTheme = await page.evaluate(() => {
    return document.getElementById('scrollflow-root')?.getAttribute('data-theme');
  });
  expect(appliedTheme).toBe('cyberpunk');

  // Restore theme
  await worker.evaluate(async () => {
    const stored = await chrome.storage.sync.get('settings');
    const s = (stored?.settings as Record<string, unknown>) || {};
    s.theme = 'aurora';
    await chrome.storage.sync.set({ settings: s });
  });
  await page.close();
});

// ─────────────────────────────────────────────────────────────── E14
test('E14: السحب التفاعلي والـ Pointer Capture للتنقل', async () => {
  const page = await open('/long.html');
  await page.waitForTimeout(500);

  const rBox = await rail(page).boundingBox();
  expect(rBox).not.toBeNull();

  // Click near the middle of the rail
  await page.mouse.move(rBox!.x + rBox!.width / 2, rBox!.y + rBox!.height * 0.5);
  await page.mouse.down();
  await page.waitForTimeout(200);
  await page.mouse.up();
  await page.waitForTimeout(300);

  const scrolledY = await page.evaluate(() => window.scrollY);
  expect(scrolledY).toBeGreaterThan(100);

  await page.close();
});

// ─────────────────────────────────────────────────────────────── E15
test('E15: امتداد كامل 100% للشريط، حواف دائرية خفيفة، وإلغاء الظل', async () => {
  const worker = swWorker ?? context.serviceWorkers()[0];
  await worker.evaluate(async () => {
    const stored = await chrome.storage.sync.get('settings');
    const s = (stored?.settings as Record<string, unknown>) || {};
    s.barLength = 'full';
    s.barRadius = 'subtle';
    s.shadow = false;
    await chrome.storage.sync.set({ settings: s });
  });

  const page = await open('/long.html');
  await page.waitForTimeout(500);

  // 1. Verify attributes and geometry for Vertical Full (100vh)
  const hostLength = await page.evaluate(() => {
    const root = document.getElementById('scrollflow-root');
    return root?.getAttribute('data-length');
  });
  expect(hostLength).toBe('full');

  const boxV = await rail(page).boundingBox();
  expect(boxV).not.toBeNull();
  expect(boxV!.y).toBeLessThanOrEqual(5);
  expect(boxV!.height).toBeGreaterThan(600);

  // 2. Verify subtle border-radius (6px) and no-shadow
  const { radius, shadow } = await page.evaluate(() => {
    const r = document.getElementById('scrollflow-root')?.shadowRoot
      ?.querySelector('[data-testid="rail"]') as HTMLElement;
    const style = getComputedStyle(r);
    return {
      radius: style.borderRadius,
      shadow: style.boxShadow,
    };
  });
  expect(radius).toBe('6px');
  expect(shadow).toBe('none');

  // 3. Test Horizontal Full (100vw)
  await worker.evaluate(async () => {
    const stored = await chrome.storage.sync.get('settings');
    const s = (stored?.settings as Record<string, unknown>) || {};
    s.position = 'top';
    s.orientation = 'horizontal';
    await chrome.storage.sync.set({ settings: s });
  });
  await page.waitForTimeout(400);

  const boxH = await rail(page).boundingBox();
  expect(boxH).not.toBeNull();
  expect(boxH!.x).toBeLessThanOrEqual(5);
  expect(boxH!.width).toBeGreaterThan(700);

  // Restore defaults
  await worker.evaluate(async () => {
    const stored = await chrome.storage.sync.get('settings');
    const s = (stored?.settings as Record<string, unknown>) || {};
    s.barLength = 'floating';
    s.barRadius = 'subtle';
    s.shadow = true;
    s.position = 'right';
    s.orientation = 'vertical';
    await chrome.storage.sync.set({ settings: s });
  });
  await page.close();
});
