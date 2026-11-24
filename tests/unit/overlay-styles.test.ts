/**
 * tests/unit/overlay-styles.test.ts — Regression tests for Shadow DOM pointer-events hygiene
 * Ensures hidden overlay elements and container gaps never intercept clicks on host page sidebars/buttons.
 */
import { describe, it, expect } from 'vitest';
import { OVERLAY_STYLES } from '../../src/content/ui/styles';

function getRuleBody(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, 'm');
  const match = OVERLAY_STYLES.match(regex);
  return match ? match[1] : '';
}

describe('OVERLAY_STYLES pointer-events hygiene', () => {
  it('disables pointer-events by default on all hidden floating overlays', () => {
    const hiddenByDefaultSelectors = [
      '.sf-selection-bubble',
      '.sf-marker-card',
      '.sf-bookmarks-trigger',
      '.sf-bookmarks-menu',
      '.sf-back-to-top',
      '.sf-toc-minimap',
      '.sf-minimap-card',
      '.sf-minimap-hover-pill',
      '.sf-toast',
    ];

    for (const selector of hiddenByDefaultSelectors) {
      const body = getRuleBody(selector);
      expect(body, `Expected rule for ${selector} to exist`).not.toBe('');
      expect(body, `${selector} must have pointer-events: none when hidden`).toMatch(
        /pointer-events\s*:\s*none\s*;/
      );
    }
  });

  it('enables pointer-events only when overlays are explicitly shown or open', () => {
    expect(getRuleBody('.sf-selection-bubble[data-show="true"]')).toMatch(
      /pointer-events\s*:\s*auto\s*;/
    );
    expect(getRuleBody('.sf-marker-card[data-show="true"]')).toMatch(
      /pointer-events\s*:\s*auto\s*;/
    );
    expect(getRuleBody('.sf-bookmarks-trigger[data-show="true"]')).toMatch(
      /pointer-events\s*:\s*auto\s*;/
    );
    expect(getRuleBody('.sf-bookmarks-menu[data-open="true"]')).toMatch(
      /pointer-events\s*:\s*auto\s*;/
    );
    expect(getRuleBody('.sf-back-to-top[data-show="true"]')).toMatch(
      /pointer-events\s*:\s*auto\s*;/
    );
    expect(getRuleBody('.sf-toc-minimap[data-expanded="true"] .sf-minimap-card')).toMatch(
      /pointer-events\s*:\s*auto\s*;/
    );
  });

  it('never enables pointer-events on the full .sf-toc-minimap container or empty track', () => {
    const shownMinimapBody = getRuleBody('.sf-toc-minimap[data-show="true"]');
    expect(shownMinimapBody).toMatch(/pointer-events\s*:\s*none\s*;/);
    expect(shownMinimapBody).not.toMatch(/pointer-events\s*:\s*auto\s*;/);

    const spineBody = getRuleBody('.sf-minimap-spine');
    expect(spineBody).toMatch(/pointer-events\s*:\s*none\s*;/);

    const trackBody = getRuleBody('.sf-minimap-spine-track');
    expect(trackBody).toMatch(/pointer-events\s*:\s*none\s*;/);
  });
});
