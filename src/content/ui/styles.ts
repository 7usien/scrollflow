// src/content/ui/styles.ts — Complete Shadow DOM styles matching design/tokens.css & preview.html

export const OVERLAY_STYLES = `
:host {
  all: initial;

  /* ── Brand (Aurora = default) ── */
  --sf-brand-start: #6d5bff;
  --sf-brand-mid:   #4e8cff;
  --sf-brand-end:   #00d4ff;
  --sf-done:        #ffd166;

  /* ── Confetti ── */
  --sf-confetti-1: #6d5bff;
  --sf-confetti-2: #00d4ff;
  --sf-confetti-3: #34e5a0;
  --sf-confetti-4: #ffd166;
  --sf-confetti-5: #ff6b9a;

  /* ── Surfaces ── */
  --sf-track:       rgba(255, 255, 255, 0.14);
  --sf-surface:     rgba(17, 20, 32, 0.55);
  --sf-border:      rgba(255, 255, 255, 0.10);
  --sf-text:        #e9ecf5;
  --sf-text-dim:    #9aa3b8;
  --sf-blur:        blur(12px);
  --sf-shadow:      0 8px 32px rgba(0, 0, 0, 0.28);
  --sf-thumb-glow:  0 0 10px 2px var(--sf-brand-end);
  --sf-thumb-bg:    #ffffff;

  /* ── Geometry ── */
  --sf-rail-w:        6px;
  --sf-rail-w-active: 8px;
  --sf-rail-w-hover:  10px;
  --sf-rail-h:        60vh;
  --sf-rail-top:      20vh;
  --sf-rail-inset:    6px;
  --sf-thumb:         12px;
  --sf-radius:        6px;

  /* ── Typography ── */
  --sf-font: Inter, "Segoe UI", system-ui, -apple-system, "Noto Sans Arabic", sans-serif;
  --sf-fs-label: 11px;

  /* ── Motion ── */
  --sf-ease:    cubic-bezier(0.4, 0, 0.2, 1);
  --sf-ease-pop:cubic-bezier(0.34, 1.56, 0.64, 1);
  --sf-t-fast:  180ms;
  --sf-t-pulse: 240ms;
  --sf-t-toast: 220ms;

  /* ── Layer ── */
  --sf-z: 2147483000;

  font-family: var(--sf-font);
  user-select: none;
  -webkit-user-select: none;
}

:host([data-scheme="light"]) {
  --sf-track:   rgba(15, 18, 30, 0.10);
  --sf-surface: rgba(255, 255, 255, 0.72);
  --sf-border:  rgba(15, 18, 30, 0.08);
  --sf-text:    #141824;
  --sf-text-dim:#5b6478;
  --sf-shadow:  0 8px 32px rgba(15, 18, 30, 0.14);
}

/* ── Border Radius Tokens ── */
:host([data-radius="subtle"]),
:host(:not([data-radius])) {
  --sf-radius: 6px;
}

:host([data-radius="pill"]) {
  --sf-radius: 999px;
}

:host([data-radius="sharp"]) {
  --sf-radius: 2px;
}

/* ── Theme: Sunset ── */
:host([data-theme="sunset"]) {
  --sf-brand-start: #ff416c;
  --sf-brand-mid:   #ff6b6b;
  --sf-brand-end:   #ffb86b;
  --sf-done:        #ffd166;
  --sf-track:       rgba(255, 220, 200, 0.16);
  --sf-thumb-glow:  0 0 10px 2px #ff6b6b;
  --sf-thumb-bg:    #fffdfa;
}
:host([data-theme="sunset"][data-scheme="light"]) {
  --sf-track:       rgba(60, 20, 10, 0.10);
}

/* ── Theme: Cyberpunk ── */
:host([data-theme="cyberpunk"]) {
  --sf-brand-start: #ff007f;
  --sf-brand-mid:   #7928ca;
  --sf-brand-end:   #00f0ff;
  --sf-done:        #00ff66;
  --sf-track:       rgba(0, 5, 16, 0.75);
  --sf-thumb-glow:  0 0 6px #00f0ff, 0 0 16px rgba(0, 240, 255, 0.7);
  --sf-thumb-bg:    #00f0ff;
}
:host([data-theme="cyberpunk"]) .sf-rail {
  box-shadow: inset 0 0 0 1px rgba(0, 240, 255, 0.35);
}

/* ── Theme: Minimal ── */
:host([data-theme="minimal"]) {
  --sf-brand-start: #64748b;
  --sf-brand-mid:   #94a3b8;
  --sf-brand-end:   #ffffff;
  --sf-done:        #38bdf8;
  --sf-track:       rgba(255, 255, 255, 0.10);
  --sf-thumb-glow:  0 1px 4px rgba(0, 0, 0, 0.5);
  --sf-thumb-bg:    #f8fafc;
  --sf-rail-w:      4px;
  --sf-rail-w-hover:7px;
  --sf-thumb:       9px;
}
:host([data-theme="minimal"][data-scheme="light"]) {
  --sf-brand-start: #94a3b8;
  --sf-brand-mid:   #475569;
  --sf-brand-end:   #0f172a;
  --sf-track:       rgba(0, 0, 0, 0.08);
  --sf-thumb-bg:    #0f172a;
}

/* ── Theme: Glass Pill ── */
:host([data-theme="glass"]) {
  --sf-brand-start: rgba(255, 255, 255, 0.65);
  --sf-brand-mid:   rgba(200, 225, 255, 0.85);
  --sf-brand-end:   rgba(255, 255, 255, 0.95);
  --sf-done:        #ffd166;
  --sf-track:       rgba(255, 255, 255, 0.12);
  --sf-rail-w:      12px;
  --sf-rail-w-hover:14px;
  --sf-thumb:       10px;
  --sf-thumb-bg:    #ffffff;
  --sf-thumb-glow:  0 2px 8px rgba(0, 0, 0, 0.25);
}
:host([data-theme="glass"]) .sf-rail {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.28);
}

/* ── Theme: Mono ── */
:host([data-theme="mono"]) {
  --sf-brand-start: #8e9aaf;
  --sf-brand-mid:   #b6bfd0;
  --sf-brand-end:   #dde3ee;
  --sf-thumb-glow:  0 0 8px rgba(221, 227, 238, 0.6);
}

/* ── High Contrast ── */
:host([data-contrast="high"]) {
  --sf-track: rgba(255, 255, 255, 0.30);
}
:host([data-contrast="high"][data-scheme="light"]) {
  --sf-track: rgba(15, 18, 30, 0.28);
}

/* ── Media queries ── */
@media (max-width: 480px) {
  :host {
    --sf-rail-inset: 4px;
    --sf-rail-w: 4px;
  }
}

@media (prefers-reduced-motion: reduce) {
  :host {
    --sf-t-fast: 0ms;
    --sf-t-pulse: 0ms;
    --sf-t-toast: 0ms;
  }
}

:host([data-reduced="true"]) {
  --sf-t-fast: 0ms;
  --sf-t-pulse: 0ms;
  --sf-t-toast: 0ms;
}

/* ── Base Rail ── */
.sf-rail {
  position: fixed;
  border-radius: var(--sf-radius);
  background: var(--sf-track);
  backdrop-filter: var(--sf-blur);
  -webkit-backdrop-filter: var(--sf-blur);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
  z-index: var(--sf-z);
  opacity: 0.55;
  cursor: pointer;
  touch-action: none;
  box-sizing: border-box;
}

.sf-rail[data-hidden="true"],
.sf-rail[data-state="hidden"] {
  opacity: 0 !important;
  pointer-events: none;
  width: 0 !important;
  height: 0 !important;
}

/* ── Orientation: Vertical (Right / Left) ── */
:host(:not([data-orientation="horizontal"])) .sf-rail {
  top: var(--sf-rail-top);
  height: var(--sf-rail-h);
  width: var(--sf-rail-w);
  right: var(--sf-rail-inset);
  left: auto;
  transition: opacity var(--sf-t-fast) var(--sf-ease), width var(--sf-t-fast) var(--sf-ease);
}

:host(:not([data-orientation="horizontal"])[data-length="full"]) .sf-rail {
  top: 0;
  height: 100vh;
}

:host([data-side="left"]:not([data-orientation="horizontal"])) .sf-rail,
:host([data-position="left"]:not([data-orientation="horizontal"])) .sf-rail {
  right: auto;
  left: var(--sf-rail-inset);
}

:host(:not([data-orientation="horizontal"])) .sf-rail[data-state="active"] {
  opacity: 1;
  width: var(--sf-rail-w-active);
}

:host(:not([data-orientation="horizontal"])) .sf-rail[data-state="hover"],
:host(:not([data-orientation="horizontal"])) .sf-rail:hover {
  opacity: 1;
  width: var(--sf-rail-w-hover);
}

:host(:not([data-orientation="horizontal"])) .sf-fill {
  position: absolute;
  inset: 0;
  border-radius: var(--sf-radius);
  background: linear-gradient(180deg, var(--sf-brand-start), var(--sf-brand-mid), var(--sf-brand-end));
  transform-origin: top center;
  transform: scaleY(var(--sf-progress, 0));
  will-change: transform;
  transition: transform 90ms linear;
}

:host(:not([data-orientation="horizontal"])) .sf-thumb {
  position: absolute;
  left: 50%;
  top: calc(var(--sf-progress, 0) * 100%);
  width: var(--sf-thumb);
  height: var(--sf-thumb);
  border-radius: 50%;
  background: var(--sf-thumb-bg);
  box-shadow: var(--sf-thumb-glow);
  transform: translate(-50%, -50%);
  transition: top 90ms linear, box-shadow var(--sf-t-fast) var(--sf-ease);
  pointer-events: none;
}

:host(:not([data-orientation="horizontal"])) .sf-label {
  position: absolute;
  top: calc(var(--sf-progress, 0) * 100%);
  right: calc(100% + 10px);
  left: auto;
  transform: translateY(-50%);
}

:host([data-side="left"]:not([data-orientation="horizontal"])) .sf-label,
:host([data-position="left"]:not([data-orientation="horizontal"])) .sf-label {
  right: auto;
  left: calc(100% + 10px);
}

/* ── Orientation: Horizontal (Top / Bottom) ── */
:host([data-orientation="horizontal"]) .sf-rail {
  left: 50%;
  transform: translateX(-50%);
  width: min(60vw, 840px);
  height: var(--sf-rail-w);
  top: var(--sf-rail-inset);
  bottom: auto;
  transition: opacity var(--sf-t-fast) var(--sf-ease), height var(--sf-t-fast) var(--sf-ease);
}

:host([data-orientation="horizontal"][data-length="full"]) .sf-rail {
  left: 0;
  right: 0;
  width: 100vw;
  transform: none;
}

:host([data-orientation="horizontal"][data-position="bottom"]) .sf-rail {
  top: auto;
  bottom: var(--sf-rail-inset);
}

:host([data-orientation="horizontal"][data-position="top"][data-length="full"]) .sf-rail {
  top: 0;
}

:host([data-orientation="horizontal"][data-position="bottom"][data-length="full"]) .sf-rail {
  bottom: 0;
}

:host([data-orientation="horizontal"]) .sf-rail[data-state="active"] {
  opacity: 1;
  height: var(--sf-rail-w-active);
}

:host([data-orientation="horizontal"]) .sf-rail[data-state="hover"],
:host([data-orientation="horizontal"]) .sf-rail:hover {
  opacity: 1;
  height: var(--sf-rail-w-hover);
}

:host([data-orientation="horizontal"]) .sf-fill {
  position: absolute;
  inset: 0;
  border-radius: var(--sf-radius);
  background: linear-gradient(90deg, var(--sf-brand-start), var(--sf-brand-mid), var(--sf-brand-end));
  transform-origin: left center;
  transform: scaleX(var(--sf-progress, 0));
  will-change: transform;
  transition: transform 90ms linear;
}

:host([data-orientation="horizontal"]) .sf-thumb {
  position: absolute;
  top: 50%;
  left: calc(var(--sf-progress, 0) * 100%);
  width: var(--sf-thumb);
  height: var(--sf-thumb);
  border-radius: 50%;
  background: var(--sf-thumb-bg);
  box-shadow: var(--sf-thumb-glow);
  transform: translate(-50%, -50%);
  transition: left 90ms linear, box-shadow var(--sf-t-fast) var(--sf-ease);
  pointer-events: none;
}

:host([data-orientation="horizontal"]) .sf-label {
  position: absolute;
  left: calc(var(--sf-progress, 0) * 100%);
  top: calc(100% + 10px);
  bottom: auto;
  transform: translateX(-50%);
}

:host([data-orientation="horizontal"][data-position="bottom"]) .sf-label {
  top: auto;
  bottom: calc(100% + 10px);
}

/* RTL for Horizontal */
:host([dir="rtl"][data-orientation="horizontal"]) .sf-fill,
:host([data-direction="rtl"][data-orientation="horizontal"]) .sf-fill {
  transform-origin: right center;
  background: linear-gradient(270deg, var(--sf-brand-start), var(--sf-brand-mid), var(--sf-brand-end));
}

:host([dir="rtl"][data-orientation="horizontal"]) .sf-thumb,
:host([data-direction="rtl"][data-orientation="horizontal"]) .sf-thumb {
  left: auto;
  right: calc(var(--sf-progress, 0) * 100%);
}

:host([dir="rtl"][data-orientation="horizontal"]) .sf-label,
:host([data-direction="rtl"][data-orientation="horizontal"]) .sf-label {
  left: auto;
  right: calc(var(--sf-progress, 0) * 100%);
  transform: translateX(50%);
}

/* ── Complete state ── */
.sf-rail[data-state="complete"] .sf-fill {
  background: var(--sf-done) !important;
}

.sf-rail[data-state="complete"] .sf-thumb {
  box-shadow: 0 0 14px 3px var(--sf-done);
}

/* ── Shadow Toggle ── */
:host([data-shadow="false"]) .sf-rail {
  box-shadow: none !important;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

:host([data-shadow="false"]) .sf-thumb {
  box-shadow: none !important;
}

:host([data-shadow="false"]) .sf-label {
  box-shadow: none !important;
}

/* ── Label Base ── */
.sf-label {
  background: var(--sf-surface);
  border: 1px solid var(--sf-border);
  backdrop-filter: var(--sf-blur);
  -webkit-backdrop-filter: var(--sf-blur);
  color: var(--sf-text);
  font-family: var(--sf-font);
  font-size: var(--sf-fs-label);
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 8px;
  white-space: nowrap;
  direction: ltr;
  opacity: 0;
  transition: opacity var(--sf-t-fast) var(--sf-ease);
  pointer-events: none;
  z-index: calc(var(--sf-z) + 1);
}

.sf-rail:hover .sf-label,
.sf-rail[data-state="hover"] .sf-label,
.sf-rail[data-state="active"] .sf-label {
  opacity: 1;
}

/* ── Milestone Pulse ── */
.sf-rail[data-pulse="true"] {
  animation: sf-pulse var(--sf-t-pulse) var(--sf-ease-pop);
}

@keyframes sf-pulse {
  0%   { transform: scale(1);    filter: drop-shadow(0 0 0 transparent); }
  45%  { transform: scale(1.12); filter: drop-shadow(0 0 10px var(--sf-brand-end)); }
  100% { transform: scale(1);    filter: drop-shadow(0 0 0 transparent); }
}

:host([data-orientation="horizontal"]:not([data-length="full"])) .sf-rail[data-pulse="true"] {
  animation: sf-pulse-h var(--sf-t-pulse) var(--sf-ease-pop);
}

@keyframes sf-pulse-h {
  0%   { transform: translateX(-50%) scale(1);    filter: drop-shadow(0 0 0 transparent); }
  45%  { transform: translateX(-50%) scale(1.08); filter: drop-shadow(0 0 10px var(--sf-brand-end)); }
  100% { transform: translateX(-50%) scale(1);    filter: drop-shadow(0 0 0 transparent); }
}

:host([data-orientation="horizontal"][data-length="full"]) .sf-rail[data-pulse="true"] {
  animation: sf-pulse-h-full var(--sf-t-pulse) var(--sf-ease-pop);
}

@keyframes sf-pulse-h-full {
  0%   { filter: drop-shadow(0 0 0 transparent); }
  45%  { filter: drop-shadow(0 0 12px var(--sf-brand-end)); }
  100% { filter: drop-shadow(0 0 0 transparent); }
}

/* ── Toast ── */
.sf-toast {
  position: fixed;
  z-index: var(--sf-z);
  bottom: 26px;
  right: 26px;
  display: flex;
  align-items: center;
  gap: 9px;
  background: var(--sf-surface);
  border: 1px solid var(--sf-border);
  backdrop-filter: var(--sf-blur);
  -webkit-backdrop-filter: var(--sf-blur);
  color: var(--sf-text);
  font-family: var(--sf-font);
  font-size: 13px;
  font-weight: 600;
  padding: 10px 15px;
  border-radius: 12px;
  box-shadow: var(--sf-shadow);
  opacity: 0;
  transform: translateY(8px);
  pointer-events: none;
  transition: opacity var(--sf-t-toast) var(--sf-ease), transform var(--sf-t-toast) var(--sf-ease);
}

:host([data-side="left"]) .sf-toast,
:host([data-position="left"]) .sf-toast {
  right: auto;
  left: 26px;
}

.sf-toast[data-show="true"] {
  opacity: 1;
  transform: translateY(0);
}

.sf-toast .dot {
  width: 9px;
  height: 9px;
  border-radius: 2px;
  background: linear-gradient(135deg, var(--sf-brand-start), var(--sf-brand-end));
  box-shadow: 0 0 8px var(--sf-brand-end);
  transform: rotate(45deg);
}

/* ── Confetti Canvas ── */
.sf-confetti-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: calc(var(--sf-z) - 1);
}

/* ── Back To Top Button ── */
.sf-back-to-top {
  position: fixed;
  bottom: 24px;
  z-index: var(--sf-z);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 40px;
  min-width: 44px;
  padding: 8px 16px;
  box-sizing: border-box;
  background: var(--sf-surface);
  border: 1px solid var(--sf-border);
  border-radius: var(--sf-radius);
  backdrop-filter: var(--sf-blur);
  -webkit-backdrop-filter: var(--sf-blur);
  color: var(--sf-text);
  font-family: var(--sf-font);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  box-shadow: var(--sf-shadow);
  opacity: 0;
  pointer-events: none;
  transform: translateY(12px) scale(0.95);
  transition:
    opacity var(--sf-t-fast) var(--sf-ease),
    transform var(--sf-t-fast) var(--sf-ease),
    background var(--sf-t-fast) var(--sf-ease),
    border-color var(--sf-t-fast) var(--sf-ease),
    box-shadow var(--sf-t-fast) var(--sf-ease);
  outline: none;
  user-select: none;
  -webkit-user-select: none;
}

:host([data-radius="pill"]) .sf-back-to-top {
  border-radius: 999px;
}

.sf-back-to-top[data-position="right"] {
  right: 24px;
  left: auto;
  direction: rtl;
}

.sf-back-to-top[data-position="left"] {
  left: 24px;
  right: auto;
  direction: ltr;
}

.sf-back-to-top[data-show="true"] {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0) scale(1);
}

.sf-back-to-top:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: var(--sf-brand-mid);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35), 0 0 12px 1px var(--sf-brand-end);
  transform: translateY(-2px) scale(1.02);
}

:host([data-scheme="light"]) .sf-back-to-top:hover {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 24px rgba(15, 18, 30, 0.16), 0 0 10px 1px var(--sf-brand-end);
}

.sf-back-to-top:active {
  transform: translateY(0) scale(0.97);
}

.sf-back-to-top:focus-visible {
  box-shadow: 0 0 0 2px var(--sf-brand-end);
}

.sf-back-to-top-icon {
  display: inline-block;
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  stroke: var(--sf-brand-end);
  transition: transform var(--sf-t-fast) var(--sf-ease);
}

.sf-back-to-top:hover .sf-back-to-top-icon {
  transform: translateY(-2px);
}

@media (prefers-reduced-motion: reduce) {
  .sf-back-to-top {
    transition: none !important;
    transform: none !important;
  }
  .sf-back-to-top:hover {
    transform: none !important;
  }
  .sf-back-to-top:hover .sf-back-to-top-icon {
    transform: none !important;
  }
}

:host([data-reduced="true"]) .sf-back-to-top {
  transition: none !important;
  transform: none !important;
}
:host([data-reduced="true"]) .sf-back-to-top:hover {
  transform: none !important;
}
`;
