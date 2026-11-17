// src/core/back-to-top.ts — Pure logic for Back to Top button visibility and locale resolution
export interface BackToTopLocaleConfig {
  text: string;
  ariaLabel: string;
  side: 'right' | 'left';
  dir: 'rtl' | 'ltr';
}

/**
 * Determines whether the Back to Top button should be visible.
 * Uses hysteresis (show at >=85% or within 250px of bottom, hide at <75%)
 * to avoid rapid flickering and ensure visibility on pages with large footers or fractional scaling.
 */
export function shouldShowBackToTop(
  progress: number,
  scrollable: boolean,
  currentlyVisible: boolean,
  showThreshold = 0.85,
  hideThreshold = 0.75,
  remainingPixels?: number
): boolean {
  if (!scrollable) {
    return false;
  }

  // If user is within 250px of the document bottom, show it reliably
  if (remainingPixels !== undefined && remainingPixels <= 250 && remainingPixels >= 0) {
    return true;
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
