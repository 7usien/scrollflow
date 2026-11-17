// tests/unit/zen.test.ts — Unit tests for pure Zen mode logic
import { describe, it, expect } from 'vitest';
import { computeZenVisualState, type ZenStateContext } from '../../src/core/zen';

describe('computeZenVisualState', () => {
  it('returns visible when zenMode is disabled regardless of idle time', () => {
    const ctx: ZenStateContext = {
      zenModeEnabled: false,
      isHovered: false,
      isScrubbing: false,
      isMenuOpen: false,
      lastActivityTs: 1000,
      nowTs: 10000, // 9s elapsed
    };
    expect(computeZenVisualState(ctx)).toBe('visible');
  });

  it('keeps visible during active scrolling/activity within timeout window', () => {
    const ctx: ZenStateContext = {
      zenModeEnabled: true,
      isHovered: false,
      isScrubbing: false,
      isMenuOpen: false,
      lastActivityTs: 5000,
      nowTs: 6000, // 1s elapsed < 2.5s
    };
    expect(computeZenVisualState(ctx)).toBe('visible');
  });

  it('fades to hidden after idle timeout is reached when zenMode is enabled', () => {
    const ctx: ZenStateContext = {
      zenModeEnabled: true,
      isHovered: false,
      isScrubbing: false,
      isMenuOpen: false,
      lastActivityTs: 5000,
      nowTs: 7600, // 2.6s elapsed >= 2.5s
    };
    expect(computeZenVisualState(ctx)).toBe('hidden');
  });

  it('stays visible even after idle timeout if user is hovering rail or scrubbing or menu is open', () => {
    const base: ZenStateContext = {
      zenModeEnabled: true,
      isHovered: true,
      isScrubbing: false,
      isMenuOpen: false,
      lastActivityTs: 5000,
      nowTs: 10000,
    };
    expect(computeZenVisualState(base)).toBe('visible');

    expect(computeZenVisualState({ ...base, isHovered: false, isScrubbing: true })).toBe('visible');
    expect(computeZenVisualState({ ...base, isHovered: false, isMenuOpen: true })).toBe('visible');
  });
});
