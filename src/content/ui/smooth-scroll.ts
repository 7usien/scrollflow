// src/content/ui/smooth-scroll.ts — Safe, GPU-composited native smooth scrolling
const SMOOTH_STYLE_ID = 'sf-smooth-scroll-override';

const SMOOTH_SCROLL_CSS = `
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}
`;

export function setSmoothScrollEnabled(enabled: boolean): void {
  try {
    const existing = document.getElementById(SMOOTH_STYLE_ID);
    if (enabled) {
      if (!existing) {
        const style = document.createElement('style');
        style.id = SMOOTH_STYLE_ID;
        style.textContent = SMOOTH_SCROLL_CSS;
        (document.head || document.documentElement).appendChild(style);
      }
    } else {
      existing?.remove();
    }
  } catch {
    // Fail-soft: silent recovery
  }
}
