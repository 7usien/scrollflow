// src/core/back-to-top.ts — Pure logic for Back to Top button visibility and locale resolution
export interface BackToTopLocaleConfig {
  text: string;
  ariaLabel: string;
  side: 'right' | 'left';
  dir: 'rtl' | 'ltr';
}

/**
 * Determines whether the Back to Top button should be visible.
 * Uses hysteresis (show at >=95%, hide at <90%) to avoid rapid flickering near the threshold.
 */
export function shouldShowBackToTop(
  progress: number,
  scrollable: boolean,
  currentlyVisible: boolean,
  showThreshold = 0.95,
  hideThreshold = 0.90
): boolean {
  if (!scrollable) {
    return false;
  }

  if (currentlyVisible) {
    return progress >= hideThreshold;
  }

  return progress >= showThreshold;
}

/**
 * Resolves labels, accessibility text, direction, and side based on page RTL orientation.
 */
export function resolveBackToTopLocale(isRTL: boolean): BackToTopLocaleConfig {
  if (isRTL) {
    return {
      text: 'الأعلى',
      ariaLabel: 'الرجوع إلى أعلى الصفحة',
      side: 'right',
      dir: 'rtl',
    };
  }

  return {
    text: 'UP',
    ariaLabel: 'Scroll to top of page',
    side: 'left',
    dir: 'ltr',
  };
}
