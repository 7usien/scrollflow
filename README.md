# ScrollFlow — Reading Progress & Scroll Position Companion

<div align="center">
  <h3>Vertical & Horizontal Reading Progress Indicator, Smart Scroll Restoration, and Back-to-Top Action for Google Chrome (Manifest V3)</h3>
  <p>مؤشر تقدّم قراءة رأسي وأفقي أنيق، حفظ واستعادة موضع التمرير، وزر الانتقال لأعلى الصفحة الذكي، واحتفال خفيف عند الإكمال.</p>
</div>

---

## 🌟 Highlights / أبرز المزايا

- **Zero Runtime Dependencies / صفر مكتبات خارجية**: No React, no Vue, no Lodash, no external confetti libraries. Pure native TypeScript and Web APIs. Bundle size $< 35\text{KB}$ gzipped.
- **Zero Network Requests / صفر طلبات شبكة**: 100% private. All processing and storage are local to your browser.
- **Isolated Shadow DOM / عزل تام**: Injected entirely inside an isolated `#scrollflow-root` Shadow DOM with `:host { all: initial }`. Zero style leaks or host page CSS collisions.
- **Back to Top Floating Action Button / زر الانتقال لأعلى الصفحة**:
  - Automatically appears near page bottom ($\ge 85\%$ or $\le 250\text{px}$ from end).
  - Directional intelligence: Displays **"الأعلى"** on the right for Arabic / RTL pages, and **"UP"** on the left for English / LTR pages.
  - Smooth native GPU scrolling back to top.
- **Smart Scroll Restoration / استعادة الموضع الذكية**: Automatically returns you to where you left off when revisiting articles and documentation, with instant abort if you interact with the page.
- **Customizable Themes & Geometries / تخصيص كامل للثيم والأبعاد**: 6 aesthetic color themes (Aurora, Sunset, Cyberpunk, Minimal, Glass, Mono), floating or full 100% bar lengths, and subtle or pill corner radii.
- **Completion Confetti & Milestone Pulses / احتفال ونبضات تفاعلية**: Micro-pulses at 25%, 50%, and 75%, and a lightweight Canvas confetti burst at 100% (respects `prefers-reduced-motion`).
- **Conceal Native Scrollbar & Smooth Scrolling / إخفاء شريط المتصفح وتصفح سلس**: Clean native OS scrollbar concealment and GPU-composited smooth scrolling.

---

## 🚀 Quickstart & Local Installation / التثبيت والتشغيل المحلي

### 1. Build the Extension / بناء المشروع
```bash
# Clone the repository
git clone https://github.com/7usien/scrollflow.git
cd scrollflow

# Install development dependencies
npm install

# Compile production bundle into dist/
npm run build
```

### 2. Load into Google Chrome / تحميل الإضافة في المتصفح
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Toggle **Developer mode** in the top-right corner to **ON**.
3. Click the **Load unpacked** button in the top-left toolbar.
4. Select the `dist/` folder inside the `scrollflow` project directory:
   ```text
   D:\ai-projects\scrollflow\dist
   ```
5. Pin **ScrollFlow** to your browser toolbar to access the quick settings popup.

---

## 🛠️ Commands & Scripts / أوامر التطوير والتحقق

| Command | Purpose |
|---|---|
| `npm run dev` | Starts Vite compiler in watch mode for live extension development. |
| `npm run build` | Builds optimized production bundle into `dist/`. |
| `npm run typecheck` | Strict TypeScript verification (`tsc --noEmit`). |
| `npm run lint` | ESLint static code analysis. |
| `npm run test` | Executes unit test suite across pure core logic using Vitest. |
| `npm run test:e2e` | Runs Playwright end-to-end headless browser test scenarios. |
| `npm run verify` | Runs `typecheck + lint + test` — required before every commit. |

---

## 📂 Project Architecture / هيكل المشروع

```text
scrollflow/
├── manifest.json              # Chrome Manifest V3 configuration
├── PRD.md                     # Comprehensive Product Requirements Document
├── AI_HANDOFF.md              # Technical hand-off guide for AI providers
├── DECISIONS.md               # Architecture Decision Records (ADR)
├── contracts/                 # Types, message contracts & schema specifications
│   ├── types.ts
│   ├── messages.ts
│   └── settings.schema.json
├── _locales/                  # Internationalization (Arabic & English)
│   ├── ar/messages.json
│   └── en/messages.json
├── src/
│   ├── core/                  # Pure logic (Zero DOM dependencies, 100% unit-tested)
│   │   ├── progress.ts        # Progress calculation & scrollability checks
│   │   ├── back-to-top.ts     # Thresholds, hysteresis & RTL/LTR resolution
│   │   ├── url.ts             # URL normalization & exclusion matching
│   │   ├── storage-model.ts   # TTL (90d) and LRU (1500) management
│   │   └── reading.ts         # Reading time & viewport screens computation
│   ├── content/               # Content script injected into web pages
│   │   ├── bootstrap.ts       # Lifecycle orchestration & scroll event loop
│   │   ├── measure.ts         # Document dimension measurement & resize observer
│   │   ├── restore.ts         # Safe scroll position restoration engine
│   │   ├── milestones.ts      # Milestone pulses & celebration tracking
│   │   └── ui/                # UI components isolated inside Shadow Root
│   │       ├── shadow-host.ts # Isolated #scrollflow-root host container
│   │       ├── styles.ts      # Complete CSS styles injected into Shadow Root
│   │       ├── progress-bar.ts# Rail, fill, thumb, label & interactive scrubbing
│   │       ├── back-to-top.ts # Floating action button component
│   │       ├── native-scroll.ts# Native scrollbar concealment
│   │       ├── smooth-scroll.ts# Smooth page scrolling
│   │       ├── toast.ts       # Status toast alerts
│   │       └── confetti.ts    # Lightweight Canvas particle engine
│   ├── background/            # Background Service Worker
│   │   ├── service-worker.ts  # Message router & keyboard command listener
│   │   ├── settings.ts        # Settings persistence & tab broadcasting
│   │   ├── store.ts           # Scroll position storage & cleanup
│   │   ├── badge.ts           # Extension icon percentage badge
│   │   └── nav-watch.ts       # SPA history state watcher
│   ├── popup/                 # Toolbar extension popup (Donut progress & controls)
│   └── options/               # Detailed settings and customization page
├── tests/
│   ├── unit/                  # Unit tests (Vitest)
│   └── e2e/                   # Integration browser tests (Playwright)
└── dist/                      # Final production build ready for Chrome
```

---

## 🎨 Design System & Visual Tokens

The extension's visual design is defined by CSS custom properties scoped strictly to `:host`:

```css
:host {
  /* Brand Gradients (Aurora default) */
  --sf-brand-start: #6d5bff;
  --sf-brand-mid:   #4e8cff;
  --sf-brand-end:   #00d4ff;
  --sf-done:        #ffd166;

  /* Surfaces & Glassmorphism */
  --sf-track:       rgba(255, 255, 255, 0.14);
  --sf-surface:     rgba(17, 20, 32, 0.55);
  --sf-border:      rgba(255, 255, 255, 0.10);
  --sf-text:        #e9ecf5;
  --sf-text-dim:    #9aa3b8;
  --sf-blur:        blur(12px);
  --sf-shadow:      0 8px 32px rgba(0, 0, 0, 0.28);

  /* Geometry & Typography */
  --sf-rail-w:      6px;
  --sf-rail-h:      60vh;
  --sf-radius:      6px; /* 6px subtle, 999px pill, 2px sharp */
  --sf-font:        Inter, "Segoe UI", system-ui, -apple-system, sans-serif;
}
```

---

## 🔒 Privacy & Permissions

ScrollFlow strictly abides by minimal permission principles:
- **`storage`**: Local storage for user preferences and saved reading positions.
- **`activeTab`**: To inject the progress overlay when interacting with the extension.
- **`webNavigation`**: Specifically restricted to `onHistoryStateUpdated` for single-page applications (SPA).
- **Zero Remote Connections**: No network permissions (`fetch`, `XMLHttpRequest`, or external CDNs).

---

## 📄 License
MIT License. Built with ❤️ for productive, distraction-free reading.
