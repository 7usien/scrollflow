# ScrollFlow — AI Implementation & Hand-off Specification

> **Purpose:** This document is specifically engineered to be handed to another AI provider (Claude, OpenAI, Cursor, Copilot, etc.) or software engineer to implement, maintain, or extend **ScrollFlow** from scratch or within this codebase.

---

## 1. Quick Context for the AI Assistant

You are implementing or maintaining **ScrollFlow**, a production-grade Google Chrome Extension (Manifest V3) that provides a customizable reading progress bar, a direction-aware Back-to-Top button, automatic scroll position restoration, and completion celebrations.

### Core Architecture at a Glance
- **Build System**: Vite 5 + CRXJS Vite Plugin + TypeScript 5.
- **Manifest**: Manifest V3 (`manifest.json`), Service Worker (`src/background/service-worker.ts`), Content Scripts (`src/content/bootstrap.ts`), Popup (`src/popup/`), Options (`src/options/`).
- **Encapsulation**: Host element `#scrollflow-root` containing an open `ShadowRoot`. **Never** append overlay elements directly to the host document's body or DOM.
- **Pure Core Logic**: All mathematical, URL, storage, reading time, and visibility algorithms live in `src/core/` with **zero DOM dependencies** and are covered by 100% unit tests (`tests/unit/`).

---

## 2. Non-Negotiables & Hard Constraints

When writing or modifying code, you **must adhere to these rules without exception**:

1. **Zero Runtime Dependencies**: No React, Vue, Svelte, Lodash, or external libraries. Bundle size must remain under 35 KB gzipped.
2. **Zero Network Requests**: No `fetch()`, `XMLHttpRequest`, analytics, or external font/image downloads. Everything is local.
3. **Passive Event Listeners Only**: All `scroll`, `wheel`, `pointerdown`, and `touchstart` event listeners on `window` must use `{ passive: true }`. Never call `preventDefault()` on user scroll.
4. **Host Container Click-Through**: The `#scrollflow-root` host container appended to `documentElement` must have:
   ```typescript
   host.style.position = 'fixed';
   host.style.width = '0';
   host.style.height = '0';
   host.style.overflow = 'visible';
   host.style.pointerEvents = 'none'; // CRITICAL: Never block host page clicks
   ```
   Interactive elements inside the Shadow DOM (`.sf-rail`, `.sf-back-to-top[data-show="true"]`, `.sf-toast`) declare `pointer-events: auto`.
5. **No Layout Thrashing**: Never call `getComputedStyle()` or `.scrollHeight` inside continuous scroll loops or rapid mutation callbacks. Debounce and check if dimensions actually changed before notifying subscribers.
6. **TypeScript Strict**: `noImplicitAny: true`, no `any` types. Use `unknown` with type narrowing.
7. **Fail-Soft on Chrome APIs**: Always wrap `chrome.runtime.sendMessage` and `chrome.storage` operations in `try/catch` or `.catch(() => {})`.

---

## 3. Key Components & Implementation Details

### A. Progress Bar Rail & Fill (`src/content/ui/progress-bar.ts`)
- Mounted inside `ShadowRoot`.
- Rail element: `sf-rail` with `role="progressbar"`, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-valuenow`.
- Renders progress using GPU-accelerated `transform: scaleY(...)` (or `scaleX(...)` for horizontal).
- Supports interactive scrubbing: on pointer down, captures pointer via `setPointerCapture(e.pointerId)` and calculates ratio relative to rail bounding rect.
- States: `idle`, `active`, `hover`, `milestone`, `complete`, `hidden`.

### B. Back to Top Button (`src/content/ui/back-to-top.ts` & `src/core/back-to-top.ts`)
- Floating pill/button located at bottom corner.
- **Trigger Logic**:
  ```typescript
  export function shouldShowBackToTop(
    progress: number,
    scrollable: boolean,
    currentlyVisible: boolean,
    showThreshold = 0.85,
    hideThreshold = 0.75,
    remainingPixels?: number
  ): boolean {
    if (!scrollable) return false;
    // Show if within 250px of bottom even if progress calculation is lower due to large footers
    if (remainingPixels !== undefined && remainingPixels <= 250 && remainingPixels >= 0) return true;
    if (currentlyVisible) return progress >= hideThreshold;
    return progress >= showThreshold;
  }
  ```
- **RTL / Language Handling**:
  - Arabic / RTL pages: Positioned at **bottom-right** (`data-position="right"`), label **"الأعلى"** with upward SVG arrow.
  - English / LTR pages: Positioned at **bottom-left** (`data-position="left"`), label **"UP"** with upward SVG arrow.
  - Detects RTL via `dir="rtl"` on `<html>` or `<body>`, `lang="ar"` (or `fa`, `he`, `ur`), and computed `direction: rtl`.
- **Click Behavior**: Calls `window.scrollTo({ top: 0, behavior })` and `(document.scrollingElement || document.documentElement).scrollTo({ top: 0, behavior })`.

### C. Scroll Restoration Engine (`src/content/restore.ts`)
- Listens for user interaction (`pointerdown`, `keydown`, `wheel`, `touchstart`) and immediately sets `userInteracted = true`.
- If `userInteracted` is true or if `window.scrollY > 40px`, **aborts restoration immediately**.
- Normalizes URLs (strips query tracking parameters like `utm_*`, `fbclid`).
- Checks height stability: if current document height is within $\pm 15\%$ of saved height, restores absolute `scrollY`. If height changed significantly, restores proportionally via `scrollRatio * maxScroll`.

### D. Single-Page Application (SPA) Safety (`src/background/nav-watch.ts` & `bootstrap.ts`)
- **Crucial Rule**: Background listens to `chrome.webNavigation.onHistoryStateUpdated`.
- **Do NOT** listen to `onReferenceFragmentUpdated` for navigation resets, because fragment updates are in-page hash anchors (e.g. `<a href="#section">`).
- **Do NOT** call `window.scrollTo(0)` when receiving `MSG.NAV_CHANGED`. SPA routers manage page scroll. Calling `window.scrollTo(0)` breaks in-page navigation and user scroll state.
- On `NAV_CHANGED`, simply flush previous URL save, reset internal progress trackers, and measure the new view.

### E. Confetti Physics Engine (`src/content/ui/confetti.ts`)
- Viewport-sized `<canvas>` mounted inside Shadow DOM with `pointer-events: none`.
- Simulates $N = \text{clamp}(60, \lfloor\text{viewportWidth} / 10\rfloor, 140)$ particles with gravity ($0.45$), drag ($0.985$), and rotational spin.
- Auto-terminates and cleans up canvas element after all particles leave the screen or fade out.
- Respects `prefers-reduced-motion: reduce` by suppressing canvas and displaying an accessible toast notification instead.

---

## 4. Verification & Testing Playbook

Run these commands in order to verify full implementation compliance:

```bash
# 1. Typecheck (Zero TypeScript errors permitted)
npm run typecheck

# 2. Linter (Zero ESLint warnings/errors permitted)
npm run lint

# 3. Unit Tests (All core logic tests must pass)
npm run test

# 4. Mandatory Pre-Commit Gate
npm run verify

# 5. Production Build
npm run build
```

---

## 5. Ready-to-Use Prompt for Another AI Provider

Copy and paste the following prompt when instructing another AI provider to work on this project:

```text
You are working on the "ScrollFlow" Chrome Extension (Manifest V3) repository.
Before writing any code:
1. Review PRD.md for complete functional requirements (FR-01 to FR-35) and mathematical models.
2. Review AI_HANDOFF.md for strict non-negotiable architectural constraints and common pitfalls.
3. Review contracts/types.ts and contracts/messages.ts for data schemas.
4. Keep zero runtime dependencies (bundle < 35KB gzipped), zero network requests, and full Shadow DOM encapsulation (:host { all: initial } with #scrollflow-root pointer-events: none).
5. Ensure all unit tests pass with `npm run verify` and the production bundle builds cleanly with `npm run build`.
```
