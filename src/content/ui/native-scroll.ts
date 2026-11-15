// src/content/ui/native-scroll.ts — Safe, reversible hiding of native OS scrollbar
const OVERRIDE_STYLE_ID = 'sf-native-scroll-override';

const HIDE_SCROLLBAR_CSS = `
html, body {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}
html::-webkit-scrollbar,
body::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  background: transparent !important;
}
`;

export function setNativeScrollbarHidden(hidden: boolean): void {
  try {
    const existing = document.getElementById(OVERRIDE_STYLE_ID);
    if (hidden) {
      if (!existing) {
        const style = document.createElement('style');
        style.id = OVERRIDE_STYLE_ID;
        style.textContent = HIDE_SCROLLBAR_CSS;
        (document.head || document.documentElement).appendChild(style);
      }
    } else {
      existing?.remove();
    }
  } catch {
    // Fail-soft: silent recovery
  }
}
