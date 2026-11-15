// src/shared/theme.ts — Design tokens and theme helper
import type { Settings, Theme } from './types';

export interface ThemeColors {
  brandStart: string;
  brandMid: string;
  brandEnd: string;
  done: string;
}

export const THEMES: Record<Theme, ThemeColors> = {
  aurora: {
    brandStart: '#6d5bff',
    brandMid: '#4e8cff',
    brandEnd: '#00d4ff',
    done: '#ffd166',
  },
  sunset: {
    brandStart: '#ff416c',
    brandMid: '#ff6b6b',
    brandEnd: '#ffb86b',
    done: '#ffd166',
  },
  cyberpunk: {
    brandStart: '#ff007f',
    brandMid: '#7928ca',
    brandEnd: '#00f0ff',
    done: '#00ff66',
  },
  minimal: {
    brandStart: '#64748b',
    brandMid: '#94a3b8',
    brandEnd: '#ffffff',
    done: '#38bdf8',
  },
  glass: {
    brandStart: 'rgba(255, 255, 255, 0.65)',
    brandMid: 'rgba(200, 225, 255, 0.85)',
    brandEnd: 'rgba(255, 255, 255, 0.95)',
    done: '#ffd166',
  },
  mono: {
    brandStart: '#8e9aaf',
    brandMid: '#b6bfd0',
    brandEnd: '#dde3ee',
    done: '#ffd166',
  },
};

export function applyThemeToHost(
  hostEl: HTMLElement,
  settings: Pick<Settings, 'theme' | 'side' | 'position' | 'orientation' | 'barLength' | 'barRadius' | 'shadow' | 'contrast'>,
  options?: { isLight?: boolean; isReduced?: boolean }
): void {
  const position = settings.position || (settings.side === 'left' ? 'left' : 'right');
  const orientation = settings.orientation || (position === 'top' || position === 'bottom' ? 'horizontal' : 'vertical');

  hostEl.setAttribute('data-theme', settings.theme);
  hostEl.setAttribute('data-side', settings.side);
  hostEl.setAttribute('data-position', position);
  hostEl.setAttribute('data-orientation', orientation);
  hostEl.setAttribute('data-length', settings.barLength || 'floating');
  hostEl.setAttribute('data-radius', settings.barRadius || 'subtle');
  hostEl.setAttribute('data-shadow', String(settings.shadow !== false));
  hostEl.setAttribute('data-contrast', settings.contrast);

  const isRtl = document.documentElement.dir === 'rtl' || document.body?.dir === 'rtl';
  if (isRtl) {
    hostEl.setAttribute('data-direction', 'rtl');
  } else {
    hostEl.removeAttribute('data-direction');
  }

  if (options?.isLight) {
    hostEl.setAttribute('data-scheme', 'light');
  } else {
    hostEl.removeAttribute('data-scheme');
  }

  if (options?.isReduced) {
    hostEl.setAttribute('data-reduced', 'true');
  } else {
    hostEl.removeAttribute('data-reduced');
  }
}
