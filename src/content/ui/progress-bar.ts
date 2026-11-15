// src/content/ui/progress-bar.ts — Progress bar rail, fill, thumb, label, and states (FR-05, FR-06, FR-07)
import type { BarState } from '../../shared/types';

export interface ProgressBarController {
  element: HTMLElement;
  fillElement: HTMLElement;
  labelElement: HTMLElement;
  render: (progress: number) => void;
  setState: (state: BarState) => void;
  pulse: () => void;
  destroy: () => void;
}

export function createProgressBar(container: ShadowRoot): ProgressBarController {
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

  // Hover interaction for label and active state
  rail.addEventListener('mouseenter', () => {
    if (rail.getAttribute('data-state') !== 'hidden') {
      rail.setAttribute('data-state', 'hover');
    }
  });

  rail.addEventListener('mouseleave', () => {
    if (rail.getAttribute('data-state') === 'hover') {
      rail.setAttribute('data-state', 'idle');
    }
  });

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
