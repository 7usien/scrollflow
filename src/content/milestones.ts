// src/content/milestones.ts — Milestones and celebration state tracking (FR-11, FR-12, PRD §11.8)
import { CELEBRATION_COOLDOWN_MS } from '../shared/types';

export interface MilestoneTracker {
  checkMilestones: (percent: number) => {
    milestoneCrossed: number | null;
    shouldCelebrate: boolean;
  };
  markCelebrated: () => void;
  reset: () => void;
}

export function createMilestoneTracker(): MilestoneTracker {
  const firedMilestones = new Set<number>();
  let celebrated = false;
  let lastCelebrationAt = 0;

  const MILESTONES = [25, 50, 75] as const;

  const checkMilestones = (percent: number) => {
    let milestoneCrossed: number | null = null;

    for (const m of MILESTONES) {
      if (percent >= m && !firedMilestones.has(m)) {
        firedMilestones.add(m);
        milestoneCrossed = m;
      }
    }

    const atBottom = percent >= 99.5;
    const canCelebrate =
      atBottom &&
      !celebrated &&
      Date.now() - lastCelebrationAt > CELEBRATION_COOLDOWN_MS;

    if (percent < 95) {
      celebrated = false;
    }

    return {
      milestoneCrossed,
      shouldCelebrate: canCelebrate,
    };
  };

  const markCelebrated = () => {
    celebrated = true;
    lastCelebrationAt = Date.now();
  };

  const reset = () => {
    firedMilestones.clear();
    celebrated = false;
    lastCelebrationAt = 0;
  };

  return {
    checkMilestones,
    markCelebrated,
    reset,
  };
}
