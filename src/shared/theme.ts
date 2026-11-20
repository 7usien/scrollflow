// src/shared/theme.ts — Design tokens and theme helper
import type { Position, Settings, Side, Theme } from './types';

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

export function resolveEffectivePosition(
  position: Position,
  side: Side,
  isRtl: boolean
): { position: 'right' | 'left' | 'top' | 'bottom'; orientation: 'vertical' | 'horizontal'; side: 'right' | 'left' } {
  if (position === 'top' || position === 'bottom') {
    return { position, orientation: 'horizontal', side: isRtl ? 'right' : 'left' };
  }

  if (position === 'auto') {
    const resolvedSide = isRtl ? 'right' : 'left';
    return { position: resolvedSide, orientation: 'vertical', side: resolvedSide };
  }

  if (position === 'left' || position === 'right') {
    return { position, orientation: 'vertical', side: position };
  }

  // Fallback to side
  if (side === 'auto') {
    const resolvedSide = isRtl ? 'right' : 'left';
    return { position: resolvedSide, orientation: 'vertical', side: resolvedSide };
  }

  const resolvedSide = side === 'left' ? 'left' : 'right';
  return { position: resolvedSide, orientation: 'vertical', side: resolvedSide };
}

export function applyThemeToHost(
  hostEl: HTMLElement,
  settings: Pick<Settings, 'theme' | 'side' | 'position' | 'orientation' | 'barLength' | 'barRadius' | 'shadow' | 'contrast'>,
  options?: { isLight?: boolean; isReduced?: boolean; isRTL?: boolean }
): void {
  const isRtl = options?.isRTL ?? (document.documentElement.dir === 'rtl' || document.body?.dir === 'rtl');
  const resolved = resolveEffectivePosition(settings.position, settings.side, isRtl);

  hostEl.setAttribute('data-theme', settings.theme);
  hostEl.setAttribute('data-side', resolved.side);
  hostEl.setAttribute('data-position', resolved.position);
  hostEl.setAttribute('data-orientation', resolved.orientation);
  hostEl.setAttribute('data-length', settings.barLength || 'floating');
  hostEl.setAttribute('data-radius', settings.barRadius || 'subtle');
  hostEl.setAttribute('data-shadow', String(settings.shadow !== false));
  hostEl.setAttribute('data-contrast', settings.contrast);

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
