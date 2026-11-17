// src/core/zen.ts — Pure logic and state machine for Zen / Auto-Hide Mode
export interface ZenStateContext {
  zenModeEnabled: boolean;
  isHovered: boolean;
  isScrubbing: boolean;
  isMenuOpen: boolean;
  lastActivityTs: number;
  nowTs: number;
  idleTimeoutMs?: number;
}

export type ZenVisualState = 'visible' | 'hidden';

export const DEFAULT_ZEN_IDLE_TIMEOUT_MS = 2500;

/**
 * Computes whether the progress bar and rail elements should be visible or faded out in Zen mode.
 */
export function computeZenVisualState(ctx: ZenStateContext): ZenVisualState {
  // If Zen mode is disabled, always keep visible
  if (!ctx.zenModeEnabled) {
    return 'visible';
  }

  // Active user interaction always forces visibility
  if (ctx.isHovered || ctx.isScrubbing || ctx.isMenuOpen) {
    return 'visible';
  }

  const timeout = ctx.idleTimeoutMs ?? DEFAULT_ZEN_IDLE_TIMEOUT_MS;
  const elapsed = ctx.nowTs - ctx.lastActivityTs;

  if (elapsed >= timeout) {
    return 'hidden';
  }

  return 'visible';
}
