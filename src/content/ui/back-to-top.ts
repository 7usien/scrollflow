// src/content/ui/back-to-top.ts — Floating "Back to Top" (UP / الأعلى) button inside Shadow DOM
import { shouldShowBackToTop, resolveBackToTopLocale } from '../../core/back-to-top';

export interface BackToTopCallbacks {
  isRTL?: () => boolean;
  onScrollToTop?: () => void;
}

export interface BackToTopController {
  element: HTMLElement;
  update: (progress: number, scrollable: boolean) => void;
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

  const setLocale = (isRTL: boolean) => {
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
    window.scrollTo({
      top: 0,
      behavior: isReduced ? 'instant' : 'smooth',
    });
    button.blur();
    callbacks?.onScrollToTop?.();
  };

  button.addEventListener('click', handleClick);

  const update = (progress: number, scrollable: boolean) => {
    // If callbacks provide isRTL, update locale dynamically in case DOM dir changed
    if (callbacks?.isRTL) {
      setLocale(callbacks.isRTL());
    }

    const nextVisible = shouldShowBackToTop(progress, scrollable, isCurrentlyVisible);
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
