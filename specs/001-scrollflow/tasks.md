# tasks.md — ScrollFlow v1.0 (قائمة عمل تنفيذية)

**كيفية الاستخدام:** نفّذ بالترتيب. لا تبدأ مهمة قبل إتمام تبعياتها. عند الإنجاز: `- [x]` + التاريخ + رقم الـ commit.
**التفاصيل الكاملة لكل مهمة:** `PRD-ScrollFlow.md §16`. هذا الملف هو نسخة العمل اليومية.

---

## المرحلة 0 — التأسيس

- [ ] **T01 — Scaffold** · تبعية: —
  - الملفات: `package.json, tsconfig.json, vite.config.ts, .eslintrc.cjs, .prettierrc, vitest.config.ts, playwright.config.ts`
  - الحزم: `vite @crxjs/vite-plugin typescript vitest @playwright/test eslint prettier @types/chrome`
  - **AC:** `npm run build` ينتج `dist/` تُحمَّل في `chrome://extensions` بلا أخطاء · `npm run verify` أخضر على مشروع فارغ.

- [ ] **T02 — Manifest + Icons + Locales** · تبعية: T01
  - الملفات: `manifest.json, public/icons/icon{16,32,48,128}.png, _locales/{ar,en}/messages.json`
  - **AC:** أيقونة الإضافة تظهر، الاسم/الوصف يتبعان اللغة، لا تحذير صلاحيات غير مبرّر.

- [ ] **T03 — Shared layer** · تبعية: T01
  - الملفات: `src/shared/{types.ts,messages.ts,settings-schema.ts,theme.ts}`
  - **AC:** نسخ حرفي من `contracts/*` · `settings-schema.ts` يصدّر `DEFAULT_SETTINGS` مطابقًا لـ PRD §10.1 · `readSettings()` تُرجع افتراضيات عند بيانات تالفة.

---

## المرحلة 1 — النواة النقية (`src/core`, بلا DOM)

- [ ] **T04 — progress.ts** · FR-01,02,04 · تبعية: T03
  - الدوال: `clamp01, computeProgress, computeMetricsFrom, isScrollable`
  - **AC:** `tests/unit/progress.test.ts` أخضر بالكامل (يُسلَّم جاهزًا في `tests/unit/`).

- [ ] **T05 — url.ts** · FR-17,27,28 · تبعية: T03
  - الدوال: `normalizeUrl, isExcluded, matchesHostPattern`
  - **AC:** `tests/unit/url.test.ts` أخضر (يشمل `#/route`, utm/fbclid, `www.`, `chrome://`, `*.example.com`).

- [ ] **T06 — storage-model.ts** · FR-24 · تبعية: T03
  - الدوال: `applyTtl, applyLruCap, makeEntry`
  - **AC:** `tests/unit/storage-model.test.ts` أخضر (1501 سجل ➜ 1500، 91 يومًا ➜ حذف).

- [ ] **T07 — reading.ts** · FR-09 · تبعية: T03
  - الدوال: `countWords, estimateReadingMinutes, screensOf`
  - **AC:** `tests/unit/reading.test.ts` أخضر (220 wpm، حد أدنى 1 دقيقة).

---

## المرحلة 2 — Service Worker

- [ ] **T08 — settings.ts** · FR-30 · تبعية: T03
  - **AC:** `SETTINGS_PATCH` تُدمج جزئيًا وتُبثّ `SETTINGS_CHANGED` لكل التبويبات ≤ 500ms · كتابة `storage.sync` مع `version:1`.

- [ ] **T09 — store.ts** · FR-16,24,25 · تبعية: T06
  - **AC:** `SAVE_POSITION`/`GET_POSITION`/`CLEAR_POSITIONS` تعمل · `chrome.runtime.onStartup` ينظّف TTL+LRU.

- [ ] **T10 — badge.ts** · FR-08 · تبعية: T08
  - **AC:** badge يعرض النسبة، throttle 1000ms، `✓` لثلاث ثوانٍ عند 100%، فارغ للصفحات غير القابلة للتمرير.

- [ ] **T11 — nav-watch.ts** · FR-23 · تبعية: T08
  - **AC:** `onHistoryStateUpdated` مع `frameId===0` تُرسل `NAV_CHANGED` مرة واحدة لكل تغيير مسار.

- [ ] **T12 — service-worker.ts (Router + Commands)** · تبعية: T08–T11
  - **AC:** كل رسائل PRD §9.4 مستجيبة بـ `{ok,data?,error?}` · `Alt+Shift+P` يرسل `TOGGLE_OVERLAY` للتبويب النشط.

---

## المرحلة 3 — الشريط (Overlay)

- [ ] **T13 — shadow-host.ts** · NFR-09,15 · تبعية: T02
  - **AC:** جذر Shadow واحد على `documentElement` · `:host{all:initial}` · كشف `transform` على `html` والتحويل إلى `position:absolute` + `top:scrollY` كخطة بديلة · لا تسرّب أنماط على 3 مواقع (Wikipedia/MDN/YouTube).

- [ ] **T14 — progress-bar.ts** · FR-05,06 · تبعية: T13,T04
  - API: `createBar(root, theme)`, `render(progress)`, `setState(state)`, `destroy()`
  - **AC:** يُرسم بـ `transform: scaleY(var(--sf-progress))` فقط · لا `height` ولا `top` في حلقة الرسم · E1 أخضر.

- [ ] **T15 — حالات الشريط** · FR-07 · تبعية: T14
  - **AC:** idle/active/hover/milestone/complete مطابقة لـ PRD §6.4 والملموسة في `design/preview.html` · تسمية `%62` تظهر عند Hover.

- [ ] **T16 — toast.ts** · FR-15,22 · تبعية: T13
  - **AC:** «عدت إلى حيث توقفت» و«أكملت الصفحة 🎉» · `aria-live="polite"` · إخفاء تلقائي 2.5s · لا تراكم (استبدال لا تكديس).

- [ ] **T17 — measure.ts** · FR-01,02,03 · تبعية: T04
  - **AC:** `ResizeObserver` على `documentElement`+`body` · `MutationObserver` مُقيَّد 200ms · إعادة حساب ≤ 200ms · E7 (infinite scroll) أخضر.

---

## المرحلة 4 — التمرير والحفظ والاستعادة والاحتفال

- [ ] **T18 — bootstrap.ts (تسلسل البدء)** · FR-05 · تبعية: T08,T14,T17
  - **AC:** الشريط يظهر ≤ 300ms من `document_idle` · الترتيب: settings ➜ isExcluded ➜ restore ➜ measure ➜ mount · مستمع scroll واحد فقط `passive`.

- [ ] **T19 — حلقة التمرير** · FR-06,08 · تبعية: T18
  - **AC:** `rAF` + `lerp(0.28)` · `PROGRESS_UPDATE` throttle 1000ms · **قياس:** script time/frame < 1ms p95 في Performance panel على 5 مواقع (يُسجَّل في REPORT.md).

- [ ] **T20 — الحفظ** · FR-16 · تبعية: T18,T09
  - **AC:** debounce 400ms · flush على `pagehide` + `visibilitychange:hidden` + `beforeunload` (مرة واحدة، بلا تكرار) · لا حفظ إن لم يتفاعل المستخدم.

- [ ] **T21 — restore.ts** · FR-18,19,20,21,22 · تبعية: T20
  - **AC:** التزام حرفي بـ PRD §11.5 · 6 شروط إلغاء · قبول ≤ 8px · سقف 5s · **E3 أخضر**.

- [ ] **T22 — milestones.ts** · FR-11,12 · تبعية: T15
  - **AC:** نبضة واحدة عند 25/50/75 لأول مرة فقط · إعادة التفعيل بعد نزول النسبة تحت 95%.

- [ ] **T23 — confetti.ts** · FR-10,13,14 · تبعية: T13,T22
  - **AC:** مطابقة أرقام PRD §6.6 حرفيًا · Canvas واحد dpr-aware · تنظيف كامل + `cancelAnimationFrame` · **لا تسرّب:** 20 احتفالًا متتاليًا ➜ `document.querySelectorAll('canvas').length` يعود لأصله · reduced-motion ➜ لا Canvas.

- [ ] **T24 — دعم SPA** · FR-23 · تبعية: T11,T21
  - **AC:** عند `NAV_CHANGED`: حفظ القديم ➜ تصفير المحطات/الاحتفال/التفاعل ➜ استعادة الجديد ➜ measure · **E6 أخضر**.

---

## المرحلة 5 — الأسطح

- [ ] **T25 — popup UI** · FR-09 · تبعية: T08,T12
  - **AC:** بصريًا مطابق لقسم الـ popup في `design/preview.html` · 340×420 · RTL/LTR · حالات فارغة/مستثناة/صفحة متصفح.

- [ ] **T26 — popup logic** · FR-25,27,29 · تبعية: T25
  - **AC:** كل toggles تعمل فورًا · استثناء الموقع بلا reload · مسح البيانات بتأكيد · الحالة تتحدّث إن تغيّر التبويب.

- [ ] **T27 — options** · FR-29 · تبعية: T08
  - **AC:** كل حقول `Settings` قابلة للتعديل · blocklist يدعم `*.domain` · تصدير/استيراد JSON بصيغة `contracts/settings.schema.json`.

- [ ] **T28 — Action icon + Command** · FR-31 · تبعية: T12
  - **AC:** `Alt+Shift+P` يبدّل الظهور في التبويب الحالي فقط (حتى بعد reload يُبقى القرار للجلسة).

---

## المرحلة 6 — الصقل والتسليم

- [ ] **T29 — الوصولية** · NFR-10 · تبعية: T25,T14
  - **AC:** axe بلا أخطاء حرجة على popup/options · `role="progressbar"` + `aria-valuenow` على الشريط · تنقّل كيبورد كامل · تباين ≥ 4.5:1 للثيمات الثلاثة.

- [ ] **T30 — E2E** · تبعية: T13–T26
  - **AC:** `tests/e2e/core.spec.ts` (E1–E10) أخضر بالكامل على `tests/fixtures/*` **دون شبكة**.

- [ ] **T31 — الأداء** · NFR-01..04 · تبعية: T19,T23
  - **AC:** تقرير في REPORT.md: script time/frame p95، هل توقف العمل عند hidden، حجم الحزمة النهائي.

- [ ] **T32 — التسليم** · تبعية: الكل
  - **AC:** `README.md` (تثبيت/بناء/اختبار) · `docs/privacy-policy.md` محدَّث · `REPORT.md` بجدول FR-01…FR-35 · `DECISIONS.md` مكتمل · لقطات شاشة من `design/preview.html` وشاشات حقيقية.

---

## ✅ بوابة التسليم النهائية (Final Gate — لا اجتياز بدونها)

| # | الشرط | كيف تُثبته |
|---|---|---|
| 1 | كل FR-01…FR-35 منفّذ | جدول في `REPORT.md` |
| 2 | `npm run verify` أخضر | مخرجات الطرفية |
| 3 | كل E1–E10 أخضر | `npm run test:e2e` |
| 4 | الحزمة < 30KB | حجم `dist/` مضغوطًا |
| 5 | صفر طلبات شبكة | Network panel خالٍ على 5 مواقع |
| 6 | صفر أخطاء console على المواقع المضيفة | لقطات |
| 7 | مطابقة بصرية | مقارنة مع `design/preview.html` |
| 8 | 20 احتفالًا بلا تسرّب | عدد الـ canvas ثابت |
| 9 | reduced-motion لا يشغّل Canvas | اختبار E8 |
| 10 | الاستعادة تعمل على Wikipedia وتفشل بنعومة على YouTube | ملاحظة موثّقة |
