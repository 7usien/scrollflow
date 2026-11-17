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

/* ── Selection Action Bubble ── */
.sf-selection-bubble {
  position: fixed;
  z-index: calc(var(--sf-z) + 10);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--sf-surface);
  border: 1px solid var(--sf-border);
  border-radius: var(--sf-radius, 999px);
  backdrop-filter: var(--sf-blur);
  -webkit-backdrop-filter: var(--sf-blur);
  color: var(--sf-text);
  font-family: var(--sf-font);
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  pointer-events: auto;
  opacity: 0;
  transform: translateY(6px) scale(0.92);
  transition:
    opacity 160ms var(--sf-ease),
    transform 160ms var(--sf-ease-pop),
    background 150ms var(--sf-ease),
    border-color 150ms var(--sf-ease);
}

.sf-selection-bubble[data-show="true"] {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.sf-selection-bubble:hover {
  background: rgba(255, 255, 255, 0.18);
  border-color: var(--sf-brand-mid);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.4), 0 0 10px 1px var(--sf-brand-end);
}

:host([data-scheme="light"]) .sf-selection-bubble:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: var(--sf-brand-start);
}

.sf-selection-bubble-icon {
  width: 13px;
  height: 13px;
  stroke: var(--sf-brand-end);
  fill: none;
  flex-shrink: 0;
}

/* ── Rail Marker Dots & Bookmark Tabs ── */
.sf-marker {
  position: absolute;
  top: calc(var(--sf-marker-progress, 0) * 100%);
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--sf-brand-end);
  box-shadow: 0 0 6px 1px var(--sf-brand-end);
  cursor: pointer;
  pointer-events: auto;
  z-index: 2;
  transition:
    transform 150ms var(--sf-ease),
    box-shadow 150ms var(--sf-ease),
    background 150ms var(--sf-ease);
}

/* Generous invisible hitbox for effortless targeting */
.sf-marker::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 28px;
  border-radius: 6px;
  pointer-events: auto;
}

/* Protruding bookmark tab flag pointing towards page content */
.sf-marker::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 4px;
  background: var(--sf-brand-end);
  border-radius: 3px 0 0 3px;
  opacity: 0.85;
  transition: width 150ms var(--sf-ease), opacity 150ms var(--sf-ease), background 150ms var(--sf-ease);
  pointer-events: auto;
}

:host([data-side="left"]) .sf-marker::after,
:host([data-position="left"]) .sf-marker::after {
  right: auto;
  left: 50%;
  border-radius: 0 3px 3px 0;
}

.sf-marker:hover,
.sf-marker[data-active="true"] {
  transform: translate(-50%, -50%) scale(1.6);
  background: #ffffff;
  box-shadow: 0 0 10px 2px var(--sf-brand-mid);
  z-index: 3;
}

.sf-marker:hover::after,
.sf-marker[data-active="true"]::after {
  width: 14px;
  opacity: 1;
  background: #ffffff;
  box-shadow: 0 0 8px var(--sf-brand-mid);
}

/* ── Marker Preview Card ── */
.sf-marker-card {
  position: absolute;
  top: calc(var(--sf-marker-progress, 0) * 100%);
  transform: translateY(-50%);
  right: calc(100% + 12px);
  width: max-content;
  max-width: 260px;
  min-width: 160px;
  background: var(--sf-surface);
  border: 1px solid var(--sf-border);
  border-radius: 12px;
  backdrop-filter: var(--sf-blur);
  -webkit-backdrop-filter: var(--sf-blur);
  box-shadow: var(--sf-shadow);
  padding: 10px 12px;
  color: var(--sf-text);
  font-family: var(--sf-font);
  font-size: 11px;
  line-height: 1.45;
  pointer-events: auto;
  z-index: 10;
  opacity: 0;
  transform: translateY(-50%) scale(0.95);
  transition: opacity 160ms var(--sf-ease), transform 160ms var(--sf-ease);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:host([data-side="left"]) .sf-marker-card,
:host([data-position="left"]) .sf-marker-card {
  right: auto;
  left: calc(100% + 12px);
}

.sf-marker-card[data-show="true"] {
  opacity: 1;
  transform: translateY(-50%) scale(1);
}

.sf-marker-card-text {
  color: var(--sf-text);
  font-size: 12px;
  font-weight: 500;
  word-break: break-word;
  max-height: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.sf-marker-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-top: 1px solid var(--sf-border);
  padding-top: 6px;
  font-size: 10px;
  color: var(--sf-text-dim);
}

.sf-marker-card-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  color: var(--sf-text-dim);
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  transition: color 120ms, background 120ms;
}

.sf-marker-card-btn:hover {
  color: var(--sf-text);
  background: rgba(255, 255, 255, 0.1);
}

.sf-marker-card-btn.delete:hover {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.15);
}

/* ── Bookmarks Quick Index Trigger ── */
.sf-bookmarks-trigger {
  position: fixed;
  top: calc(var(--sf-rail-top) - 34px);
  right: calc(var(--sf-rail-inset) - 9px);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--sf-surface);
  border: 1px solid var(--sf-border);
  backdrop-filter: var(--sf-blur);
  -webkit-backdrop-filter: var(--sf-blur);
  box-shadow: var(--sf-shadow);
  color: var(--sf-brand-end);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: calc(var(--sf-z) + 1);
  pointer-events: none;
  opacity: 0;
  transform: scale(0.85);
  transition:
    opacity 180ms var(--sf-ease),
    transform 180ms var(--sf-ease-pop),
    background 150ms var(--sf-ease),
    border-color 150ms var(--sf-ease),
    color 150ms var(--sf-ease);
}

/* 44x44px touch target compliance */
.sf-bookmarks-trigger::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 44px;
  min-height: 44px;
}

:host([data-side="left"]) .sf-bookmarks-trigger,
:host([data-position="left"]) .sf-bookmarks-trigger {
  right: auto;
  left: calc(var(--sf-rail-inset) - 9px);
}

:host([data-orientation="horizontal"]) .sf-bookmarks-trigger {
  top: 14px;
  right: 14px;
}

:host([data-orientation="horizontal"][data-position="bottom"]) .sf-bookmarks-trigger {
  top: auto;
  bottom: 14px;
}

.sf-bookmarks-trigger[data-show="true"] {
  opacity: 1;
  pointer-events: auto;
  transform: scale(1);
}

.sf-bookmarks-trigger:hover,
.sf-bookmarks-trigger[data-active="true"] {
  background: rgba(255, 255, 255, 0.18);
  border-color: var(--sf-brand-mid);
  color: #ffffff;
  box-shadow: 0 0 10px 1px var(--sf-brand-mid);
}

:host([data-scheme="light"]) .sf-bookmarks-trigger:hover {
  background: rgba(255, 255, 255, 0.95);
  color: var(--sf-brand-start);
}

.sf-bookmarks-trigger-icon {
  width: 13px;
  height: 13px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
}

.sf-bookmarks-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 14px;
  height: 14px;
  padding: 0 3px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--sf-brand-start), var(--sf-brand-end));
  color: #ffffff;
  font-family: var(--sf-font);
  font-size: 9px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
}

:host([data-side="left"]) .sf-bookmarks-badge,
:host([data-position="left"]) .sf-bookmarks-badge {
  right: auto;
  left: -4px;
}

/* ── Bookmarks Quick Index Drawer / Menu ── */
.sf-bookmarks-menu {
  position: fixed;
  top: var(--sf-rail-top);
  right: calc(var(--sf-rail-inset) + 24px);
  width: 270px;
  max-height: min(440px, 70vh);
  background: var(--sf-surface);
  border: 1px solid var(--sf-border);
  border-radius: 14px;
  backdrop-filter: var(--sf-blur);
  -webkit-backdrop-filter: var(--sf-blur);
  box-shadow: var(--sf-shadow);
  color: var(--sf-text);
  font-family: var(--sf-font);
  display: flex;
  flex-direction: column;
  z-index: calc(var(--sf-z) + 10);
  pointer-events: none;
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
  transform-origin: top right;
  transition:
    opacity 180ms var(--sf-ease),
    transform 180ms var(--sf-ease-pop);
}

:host([data-side="left"]) .sf-bookmarks-menu,
:host([data-position="left"]) .sf-bookmarks-menu {
  right: auto;
  left: calc(var(--sf-rail-inset) + 24px);
  transform-origin: top left;
}

:host([data-orientation="horizontal"]) .sf-bookmarks-menu {
  top: 48px;
  right: 14px;
}

:host([data-orientation="horizontal"][data-position="bottom"]) .sf-bookmarks-menu {
  top: auto;
  bottom: 48px;
  transform-origin: bottom right;
}

.sf-bookmarks-menu[data-open="true"] {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0) scale(1);
}

.sf-bookmarks-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px 10px;
  border-bottom: 1px solid var(--sf-border);
}

.sf-bookmarks-menu-title-wrap {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 700;
  color: var(--sf-text);
}

.sf-bookmarks-menu-title-icon {
  width: 14px;
  height: 14px;
  stroke: var(--sf-brand-end);
  fill: none;
  stroke-width: 2.2;
}

.sf-bookmarks-menu-count {
  font-size: 11px;
  color: var(--sf-text-dim);
  font-weight: 500;
}

.sf-bookmarks-menu-close {
  background: transparent;
  border: none;
  color: var(--sf-text-dim);
  cursor: pointer;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 120ms, color 120ms;
}

.sf-bookmarks-menu-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--sf-text);
}

:host([data-scheme="light"]) .sf-bookmarks-menu-close:hover {
  background: rgba(0, 0, 0, 0.08);
}

.sf-bookmarks-menu-close-icon {
  width: 14px;
  height: 14px;
  stroke: currentColor;
  stroke-width: 2;
}

.sf-bookmarks-menu-list {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
  max-height: 350px;
}

.sf-bookmarks-menu-list::-webkit-scrollbar {
  width: 4px;
}
.sf-bookmarks-menu-list::-webkit-scrollbar-thumb {
  background: var(--sf-border);
  border-radius: 4px;
}

.sf-bookmarks-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid transparent;
  cursor: pointer;
  min-height: 44px;
  transition: background 130ms var(--sf-ease), border-color 130ms var(--sf-ease), transform 120ms var(--sf-ease);
}

.sf-bookmarks-menu-item:hover {
  background: rgba(255, 255, 255, 0.10);
  border-color: var(--sf-border);
  transform: translateX(-2px);
}

:host([data-side="left"]) .sf-bookmarks-menu-item:hover,
:host([data-position="left"]) .sf-bookmarks-menu-item:hover {
  transform: translateX(2px);
}

:host([data-scheme="light"]) .sf-bookmarks-menu-item {
  background: rgba(0, 0, 0, 0.03);
}

:host([data-scheme="light"]) .sf-bookmarks-menu-item:hover {
  background: rgba(0, 0, 0, 0.06);
}

.sf-bookmarks-item-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.sf-bookmarks-item-pct {
  font-size: 10px;
  font-weight: 700;
  color: var(--sf-brand-end);
  background: rgba(0, 212, 255, 0.12);
  padding: 2px 5px;
  border-radius: 5px;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

.sf-bookmarks-item-text {
  font-size: 11px;
  font-weight: 500;
  color: var(--sf-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.sf-bookmarks-item-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.sf-bookmarks-item-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--sf-text-dim);
  width: 24px;
  height: 24px;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color 120ms, background 120ms;
}

.sf-bookmarks-item-btn:hover {
  color: var(--sf-text);
  background: rgba(255, 255, 255, 0.12);
}

:host([data-scheme="light"]) .sf-bookmarks-item-btn:hover {
  background: rgba(0, 0, 0, 0.08);
}

.sf-bookmarks-item-btn.delete:hover {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.15);
}

.sf-bookmarks-item-icon {
  width: 13px;
  height: 13px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
}

.sf-bookmarks-menu-empty {
  padding: 24px 16px;
  text-align: center;
  font-size: 11px;
  color: var(--sf-text-dim);
  line-height: 1.5;
}
`;
