// src/content/ui/back-to-top.ts — Floating "Back to Top" (UP / الأعلى) button inside Shadow DOM
import { shouldShowBackToTop, resolveBackToTopLocale } from '../../core/back-to-top';

export interface BackToTopCallbacks {
  isRTL?: () => boolean;
  onScrollToTop?: () => void;
}

export interface BackToTopController {
  element: HTMLElement;
  update: (progress: number, scrollable: boolean, remainingPixels?: number) => void;
  setLocale: (isRTL: boolean) => void;
  reset: () => void;
  destroy: () => void;
}

export function createBackToTop(
  container: ShadowRoot,
  callbacks?: BackToTopCallbacks
): BackToTopController {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'sf-back-to-top';
  button.setAttribute('data-testid', 'back-to-top');
  button.setAttribute('data-show', 'false');

  // SVG Upward Arrow
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'sf-back-to-top-icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2.5');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'm18 15-6-6-6 6');
  svg.appendChild(path);

  const textSpan = document.createElement('span');
  textSpan.className = 'sf-back-to-top-text';

  button.appendChild(svg);
  button.appendChild(textSpan);
  container.appendChild(button);

  let isCurrentlyVisible = false;
  let currentRTL: boolean | null = null;

  const setLocale = (isRTL: boolean) => {
    currentRTL = isRTL;
    const config = resolveBackToTopLocale(isRTL);
    textSpan.textContent = config.text;
    button.setAttribute('aria-label', config.ariaLabel);
    button.setAttribute('data-position', config.side);
    button.setAttribute('dir', config.dir);
  };

  // Initial locale setup
  const initialRTL = callbacks?.isRTL ? callbacks.isRTL() : false;
  setLocale(initialRTL);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior: ScrollBehavior = isReduced ? 'instant' : 'smooth';
    window.scrollTo({
      top: 0,
      behavior,
    });
    const scrollEl = document.scrollingElement || document.documentElement;
    if (scrollEl && scrollEl.scrollTop > 0) {
      try {
        scrollEl.scrollTo({ top: 0, behavior });
      } catch {
        // fail-soft
      }
    }
    button.blur();
    callbacks?.onScrollToTop?.();
  };

  button.addEventListener('click', handleClick);

  const update = (progress: number, scrollable: boolean, remainingPixels?: number) => {
    // Only update locale if RTL state changed to prevent unnecessary layout/DOM churn
    if (callbacks?.isRTL) {
      const nextRTL = callbacks.isRTL();
      if (nextRTL !== currentRTL) {
        setLocale(nextRTL);
      }
    }

    const nextVisible = shouldShowBackToTop(progress, scrollable, isCurrentlyVisible, 0.85, 0.75, remainingPixels);
    if (nextVisible !== isCurrentlyVisible) {
      isCurrentlyVisible = nextVisible;
      button.setAttribute('data-show', isCurrentlyVisible ? 'true' : 'false');
    }
  };

  const reset = () => {
    isCurrentlyVisible = false;
    button.setAttribute('data-show', 'false');
  };

  const destroy = () => {
    button.removeEventListener('click', handleClick);
    if (button.parentNode) {
      button.parentNode.removeChild(button);
    }
  };

  return {
    element: button,
    update,
    setLocale,
    reset,
    destroy,
  };
}
