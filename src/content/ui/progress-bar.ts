// src/content/ui/progress-bar.ts — Progress bar rail, fill, thumb, label, states, and interactive scrubbing
import type { BarState, Orientation } from '../../shared/types';

export interface ProgressBarCallbacks {
  getMaxScroll?: () => number;
  onScrub?: (ratio: number) => void;
  getOrientation?: () => Orientation;
  isRTL?: () => boolean;
}

export interface ProgressBarController {
  element: HTMLElement;
  fillElement: HTMLElement;
  labelElement: HTMLElement;
  render: (progress: number) => void;
  setState: (state: BarState) => void;
  pulse: () => void;
  destroy: () => void;
}

export function createProgressBar(
  container: ShadowRoot,
  callbacks?: ProgressBarCallbacks
): ProgressBarController {
  const rail = document.createElement('div');
  rail.className = 'sf-rail';
  rail.setAttribute('data-testid', 'rail');
  rail.setAttribute('role', 'progressbar');
  rail.setAttribute('aria-valuemin', '0');
  rail.setAttribute('aria-valuemax', '100');
  rail.setAttribute('aria-valuenow', '0');
  rail.setAttribute('aria-label', 'نسبة قراءة الصفحة');
  rail.setAttribute('data-state', 'idle');
  rail.style.setProperty('--sf-progress', '0');

  const fill = document.createElement('div');
  fill.className = 'sf-fill';
  fill.setAttribute('data-testid', 'fill');
  fill.style.setProperty('--sf-progress', '0');
  rail.appendChild(fill);

  const thumb = document.createElement('div');
  thumb.className = 'sf-thumb';
  rail.appendChild(thumb);

  const label = document.createElement('div');
  label.className = 'sf-label';
  label.textContent = '0%';
  rail.appendChild(label);

  let isDragging = false;

  // Hover interaction for label and active state
  rail.addEventListener('mouseenter', () => {
    if (!isDragging && rail.getAttribute('data-state') !== 'hidden') {
      rail.setAttribute('data-state', 'hover');
    }
  });

  rail.addEventListener('mouseleave', () => {
    if (!isDragging && rail.getAttribute('data-state') === 'hover') {
      rail.setAttribute('data-state', 'idle');
    }
  });

  // ── Scrubbing & Pointer Capture ──
  const computeScrubRatio = (e: PointerEvent): number => {
    const rect = rail.getBoundingClientRect();
    const orientation = callbacks?.getOrientation ? callbacks.getOrientation() : 'vertical';
    const rtl = callbacks?.isRTL ? callbacks.isRTL() : false;

    if (orientation === 'horizontal') {
      if (rect.width <= 0) return 0;
      const offset = rtl ? rect.right - e.clientX : e.clientX - rect.left;
      return Math.min(1, Math.max(0, offset / rect.width));
    } else {
      if (rect.height <= 0) return 0;
      const offset = e.clientY - rect.top;
      return Math.min(1, Math.max(0, offset / rect.height));
    }
  };

  const handlePointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    if (rail.getAttribute('data-state') === 'hidden') return;
    isDragging = true;
    try {
      rail.setPointerCapture(e.pointerId);
    } catch {
      // Fail-soft
    }
    rail.setAttribute('data-state', 'active');
    const ratio = computeScrubRatio(e);
    render(ratio);
    const max = callbacks?.getMaxScroll ? callbacks.getMaxScroll() : 0;
    if (max > 0) {
      window.scrollTo({ top: ratio * max, behavior: 'instant' });
    }
    callbacks?.onScrub?.(ratio);
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!isDragging) return;
    const ratio = computeScrubRatio(e);
    render(ratio);
    const max = callbacks?.getMaxScroll ? callbacks.getMaxScroll() : 0;
    if (max > 0) {
      window.scrollTo({ top: ratio * max, behavior: 'instant' });
    }
    callbacks?.onScrub?.(ratio);
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (!isDragging) return;
    isDragging = false;
    try {
      rail.releasePointerCapture(e.pointerId);
    } catch {
      // Fail-soft
    }
    rail.setAttribute('data-state', 'idle');
  };

  rail.addEventListener('pointerdown', handlePointerDown, { passive: true });
  rail.addEventListener('pointermove', handlePointerMove, { passive: true });
  rail.addEventListener('pointerup', handlePointerUp, { passive: true });
  rail.addEventListener('pointercancel', handlePointerUp, { passive: true });

  container.appendChild(rail);

  let pulseTimer: ReturnType<typeof setTimeout> | null = null;

  const render = (progress: number) => {
    const clamped = Math.min(1, Math.max(0, progress));
    const strVal = String(clamped);
    rail.style.setProperty('--sf-progress', strVal);
    fill.style.setProperty('--sf-progress', strVal);

    const pct = Math.round(clamped * 100);
    rail.setAttribute('aria-valuenow', String(pct));
    label.textContent = `${pct}%`;
  };

  const setState = (state: BarState) => {
    rail.setAttribute('data-state', state);
    if (state === 'hidden') {
      rail.setAttribute('data-hidden', 'true');
    } else {
      rail.removeAttribute('data-hidden');
    }
  };

  const pulse = () => {
    rail.setAttribute('data-pulse', 'true');
    if (pulseTimer) clearTimeout(pulseTimer);
    pulseTimer = setTimeout(() => {
      rail.removeAttribute('data-pulse');
      pulseTimer = null;
    }, 240);
  };

  const destroy = () => {
    if (pulseTimer) clearTimeout(pulseTimer);
    rail.removeEventListener('pointerdown', handlePointerDown);
    rail.removeEventListener('pointermove', handlePointerMove);
    rail.removeEventListener('pointerup', handlePointerUp);
    rail.removeEventListener('pointercancel', handlePointerUp);
    if (rail.parentNode) {
      rail.parentNode.removeChild(rail);
    }
  };

  return {
    element: rail,
    fillElement: fill,
    labelElement: label,
    render,
    setState,
    pulse,
    destroy,
  };
}
