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
  --sf-track:   rgba(255, 255, 255, 0.14);
  --sf-surface: rgba(17, 20, 32, 0.55);
  --sf-border:  rgba(255, 255, 255, 0.10);
  --sf-text:    #e9ecf5;
  --sf-text-dim:#9aa3b8;
  --sf-blur:    blur(12px);
  --sf-shadow:  0 8px 32px rgba(0, 0, 0, 0.28);

  /* ── Geometry ── */
  --sf-rail-w:        6px;
  --sf-rail-w-active: 8px;
  --sf-rail-w-hover:  10px;
  --sf-rail-h:       60vh;
  --sf-rail-top:     20vh;
  --sf-rail-inset:   6px;
  --sf-thumb:        12px;
  --sf-radius:       999px;

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
}

:host([data-scheme="light"]) {
  --sf-track:   rgba(15, 18, 30, 0.10);
  --sf-surface: rgba(255, 255, 255, 0.72);
  --sf-border:  rgba(15, 18, 30, 0.08);
  --sf-text:    #141824;
  --sf-text-dim:#5b6478;
  --sf-shadow:  0 8px 32px rgba(15, 18, 30, 0.14);
}

:host([data-theme="sunset"]) {
  --sf-brand-start: #ff6b9a;
  --sf-brand-mid:   #ff8f80;
  --sf-brand-end:   #ffb86b;
}

:host([data-theme="mono"]) {
  --sf-brand-start: #8e9aaf;
  --sf-brand-mid:   #b6bfd0;
  --sf-brand-end:   #dde3ee;
}

:host([data-contrast="high"]) {
  --sf-track: rgba(255, 255, 255, 0.30);
}

:host([data-contrast="high"][data-scheme="light"]) {
  --sf-track: rgba(15, 18, 30, 0.28);
}

:host([data-side="left"]) .sf-rail {
  right: auto;
  left: var(--sf-rail-inset);
}

:host([data-side="left"]) .sf-label {
  right: auto;
  left: calc(100% + 10px);
}

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

/* ── Rail ── */
.sf-rail {
  position: fixed;
  top: var(--sf-rail-top);
  right: var(--sf-rail-inset);
  height: var(--sf-rail-h);
  width: var(--sf-rail-w);
  border-radius: var(--sf-radius);
  background: var(--sf-track);
  backdrop-filter: var(--sf-blur);
  -webkit-backdrop-filter: var(--sf-blur);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
  z-index: var(--sf-z);
  opacity: 0.55;
  transition: opacity var(--sf-t-fast) var(--sf-ease), width var(--sf-t-fast) var(--sf-ease);
  cursor: default;
  box-sizing: border-box;
}

.sf-rail[data-state="active"] {
  opacity: 1;
  width: var(--sf-rail-w-active);
}

.sf-rail[data-state="hover"],
.sf-rail:hover {
  opacity: 1;
  width: var(--sf-rail-w-hover);
}

.sf-rail[data-hidden="true"],
.sf-rail[data-state="hidden"] {
  opacity: 0 !important;
  pointer-events: none;
  width: 0 !important;
}

/* ── Fill ── */
.sf-fill {
  position: absolute;
  inset: 0;
  border-radius: var(--sf-radius);
  background: linear-gradient(180deg, var(--sf-brand-start), var(--sf-brand-mid), var(--sf-brand-end));
  transform-origin: top center;
  transform: scaleY(var(--sf-progress, 0));
  will-change: transform;
  transition: transform 90ms linear;
}

.sf-rail[data-state="complete"] .sf-fill {
  background: var(--sf-done);
}

/* ── Thumb ── */
.sf-thumb {
  position: absolute;
  left: 50%;
  top: calc(var(--sf-progress, 0) * 100%);
  width: var(--sf-thumb);
  height: var(--sf-thumb);
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0 10px 2px var(--sf-brand-end);
  transform: translate(-50%, -50%);
  transition: top 90ms linear, box-shadow var(--sf-t-fast) var(--sf-ease);
}

.sf-rail[data-state="complete"] .sf-thumb {
  box-shadow: 0 0 14px 3px var(--sf-done);
}

/* ── Label ── */
.sf-label {
  position: absolute;
  top: calc(var(--sf-progress, 0) * 100%);
  right: calc(100% + 10px);
  transform: translateY(-50%);
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
}

.sf-rail:hover .sf-label,
.sf-rail[data-state="hover"] .sf-label {
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

:host([data-side="left"]) .sf-toast {
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
`;
