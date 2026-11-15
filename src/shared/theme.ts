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
    brandStart: '#ff6b9a',
    brandMid: '#ff8f80',
    brandEnd: '#ffb86b',
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
  settings: Pick<Settings, 'theme' | 'side' | 'contrast'>,
  options?: { isLight?: boolean; isReduced?: boolean }
): void {
  hostEl.setAttribute('data-theme', settings.theme);
  hostEl.setAttribute('data-side', settings.side);
  hostEl.setAttribute('data-contrast', settings.contrast);

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
