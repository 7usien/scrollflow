// src/content/ui/shadow-host.ts — Isolated ShadowRoot container (NFR-09, NFR-15, PRD §9.6)
import { OVERLAY_STYLES } from './styles';
import { applyThemeToHost } from '../../shared/theme';
import type { Settings } from '../../shared/types';

const ROOT_ID = 'scrollflow-root';

export interface ShadowContext {
  host: HTMLElement;
  shadowRoot: ShadowRoot;
  destroy: () => void;
  updateTheme: (settings: Settings) => void;
}

function detectIsRTL(): boolean {
  const docDir = (document.documentElement.dir || '').toLowerCase();
  const bodyDir = (document.body?.dir || '').toLowerCase();
  if (docDir === 'rtl' || bodyDir === 'rtl') return true;

  const lang = (document.documentElement.lang || document.body?.lang || '').toLowerCase();
  if (lang.startsWith('ar') || lang.startsWith('fa') || lang.startsWith('he') || lang.startsWith('ur')) {
    return true;
  }

  try {
    const computedDir = window.getComputedStyle(document.body || document.documentElement).direction;
    if (computedDir === 'rtl') return true;
  } catch {
    // Fail-soft
  }

  return false;
}

export function createShadowHost(settings: Settings, callbacks?: { isRTL?: () => boolean }): ShadowContext {
  const existing = document.getElementById(ROOT_ID);
  if (existing) {
    existing.remove();
  }

  const host = document.createElement('div');
  host.id = ROOT_ID;
  host.style.position = 'fixed';
  host.style.zIndex = '2147483000';
  host.style.top = '0';
  host.style.left = '0';
  host.style.width = '0';
  host.style.height = '0';
  host.style.overflow = 'visible';
  host.style.pointerEvents = 'none';

  // Fallback for transform on documentElement
  try {
    const htmlTransform = window.getComputedStyle(document.documentElement).transform;
    if (htmlTransform && htmlTransform !== 'none') {
      host.style.position = 'absolute';
      host.style.top = `${window.scrollY}px`;
      window.addEventListener(
        'scroll',
        () => {
          host.style.top = `${window.scrollY}px`;
        },
        { passive: true }
      );
    }
  } catch {
    // Ignore style computation errors
  }

  const shadowRoot = host.attachShadow({ mode: 'open' });

  const styleEl = document.createElement('style');
  styleEl.textContent = OVERLAY_STYLES;
  shadowRoot.appendChild(styleEl);

  const isLight = detectLightBackground();
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isRtl = callbacks?.isRTL ? callbacks.isRTL() : detectIsRTL();

  applyThemeToHost(host, settings, { isLight, isReduced, isRTL: isRtl });

  // Attach to documentElement
  document.documentElement.appendChild(host);

  const updateTheme = (newSettings: Settings) => {
    const currentIsLight = detectLightBackground();
    const currentIsReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const currentIsRTL = callbacks?.isRTL ? callbacks.isRTL() : detectIsRTL();
    applyThemeToHost(host, newSettings, {
      isLight: currentIsLight,
      isReduced: currentIsReduced,
      isRTL: currentIsRTL,
    });
  };

  const destroy = () => {
    if (host.parentNode) {
      host.parentNode.removeChild(host);
    }
  };

  return {
    host,
    shadowRoot,
    destroy,
    updateTheme,
  };
}

function detectLightBackground(): boolean {
  try {
    const bodyBg = window.getComputedStyle(document.body || document.documentElement).backgroundColor;
    if (bodyBg && bodyBg !== 'transparent' && bodyBg !== 'rgba(0, 0, 0, 0)') {
      const match = bodyBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (match) {
        const r = Number(match[1]);
        const g = Number(match[2]);
        const b = Number(match[3]);
        // Perceived luminance formula (WCAG)
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.6;
      }
    }
  } catch {
    // Fail-soft
  }
  return false;
}
