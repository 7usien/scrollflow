// src/content/bootstrap.ts — Main content script lifecycle, scroll loop, and communication (FR-01..FR-24)
import { MSG, type Req } from '../shared/messages';
import type { Metrics, ScrollEntry, Settings } from '../shared/types';
import { DEFAULT_SETTINGS, SAVE_DEBOUNCE_MS } from '../shared/types';
import { sanitizeSettings } from '../shared/settings-schema';
import { computeProgress } from '../core/progress';
import { normalizeUrl, isExcluded } from '../core/url';
import { createShadowHost, type ShadowContext } from './ui/shadow-host';
import { createProgressBar, type ProgressBarController } from './ui/progress-bar';
import { createToast, type ToastController } from './ui/toast';
import { createMilestoneTracker, type MilestoneTracker } from './milestones';
import { burstConfetti } from './ui/confetti';
import { computeMetrics, observeMetrics, type MeasureObserver } from './measure';
import { tryRestore } from './restore';

let settings: Settings = { ...DEFAULT_SETTINGS };
let shadowCtx: ShadowContext | null = null;
let progressBar: ProgressBarController | null = null;
let toast: ToastController | null = null;
let milestoneTracker: MilestoneTracker | null = null;
let measureObserver: MeasureObserver | null = null;

let currentMetrics: Metrics = computeMetrics();
let currentUrl = window.location.href;
let userInteracted = false;
let smoothedProgress = 0;
let isOverlayTemporarilyHidden = false;

let saveTimer: ReturnType<typeof setTimeout> | null = null;
let lastProgressUpdateSent = 0;
let isTicking = false;

// ── 1. Init Sequence ──
async function init() {
  try {
    const res = await chrome.runtime.sendMessage({ type: MSG.SETTINGS_GET });
    if (res?.ok && res.data) {
      settings = sanitizeSettings(res.data);
    }
  } catch {
    settings = { ...DEFAULT_SETTINGS };
  }

  setupUI();
  setupEvents();
  startInitialMeasurementAndRestoration();
}

function shouldShowOverlay(): boolean {
  if (!settings.enabled || isOverlayTemporarilyHidden) return false;
  if (isExcluded(window.location.href, settings)) return false;
  return true;
}

function setupUI() {
  shadowCtx = createShadowHost(settings);
  progressBar = createProgressBar(shadowCtx.shadowRoot);
  toast = createToast(shadowCtx.shadowRoot);
  milestoneTracker = createMilestoneTracker();

  updateVisibility();
}

function updateVisibility() {
  if (!progressBar) return;
  const show = shouldShowOverlay();

  if (!show || !currentMetrics.scrollable) {
    progressBar.setState('hidden');
  } else {
    progressBar.setState('idle');
  }
}

// ── 2. Measurement & Restoration ──
async function startInitialMeasurementAndRestoration() {
  currentMetrics = computeMetrics();
  updateVisibility();

  if (shouldShowOverlay() && settings.restoreScroll) {
    try {
      const norm = normalizeUrl(window.location.href);
      const res = await chrome.runtime.sendMessage({
        type: MSG.GET_POSITION,
        url: norm,
      });

      if (res?.ok && res.data) {
        const entry = res.data as ScrollEntry;
        await tryRestore(
          entry,
          settings,
          () => userInteracted,
          () => {
            const restoredMsg = chrome.i18n.getMessage('toastRestored') || 'عدت إلى حيث توقفت';
            toast?.show(restoredMsg);
          }
        );
      }
    } catch {
      // Fail-soft: continue without restore
    }
  }

  // Recalculate metrics after restoration
  currentMetrics = computeMetrics();
  const initialProgress = computeProgress(currentMetrics.scrollY, currentMetrics.maxScroll);
  smoothedProgress = initialProgress;
  progressBar?.render(smoothedProgress);
  updateVisibility();
  sendProgressUpdate();

  // Start continuous observer for dynamic height (infinite scroll / resize)
  if (measureObserver) {
    measureObserver.disconnect();
  }
  measureObserver = observeMetrics((newMetrics) => {
    currentMetrics = newMetrics;
    updateVisibility();

    const targetProgress = computeProgress(currentMetrics.scrollY, currentMetrics.maxScroll);
    smoothedProgress = targetProgress;
    progressBar?.render(smoothedProgress);
    sendProgressUpdate();
  });
}

// ── 3. Scroll Loop & rAF Lerp ──
function tick() {
  if (!progressBar) return;

  currentMetrics = computeMetrics();
  const target = computeProgress(currentMetrics.scrollY, currentMetrics.maxScroll);

  // Lerp smoothing (PRD §11.2)
  smoothedProgress += (target - smoothedProgress) * 0.28;
  if (Math.abs(target - smoothedProgress) < 0.001) {
    smoothedProgress = target;
  }

  progressBar.render(smoothedProgress);

  const pct = smoothedProgress * 100;

  if (milestoneTracker) {
    const { milestoneCrossed, shouldCelebrate } = milestoneTracker.checkMilestones(pct);

    if (milestoneCrossed !== null && settings.milestones) {
      progressBar.pulse();
    }

    if (shouldCelebrate && settings.celebrate) {
      milestoneTracker.markCelebrated();
      progressBar.setState('complete');

      const isShort = currentMetrics.screens < 2;
      burstConfetti(shadowCtx!.shadowRoot, {
        isShort,
        onComplete: () => {
          progressBar?.setState('active');
        },
      });

      if (settings.showToasts) {
        const completeMsg = chrome.i18n.getMessage('toastComplete') || 'أكملت الصفحة 🎉';
        toast?.show(completeMsg);
      }
    } else if (progressBar.element.getAttribute('data-state') !== 'hover') {
      if (pct >= 99.5) {
        progressBar.setState('complete');
      } else {
        progressBar.setState('active');
      }
    }
  }

  sendProgressUpdate();

  // Continue lerping if not close enough
  if (Math.abs(target - smoothedProgress) >= 0.001) {
    requestAnimationFrame(tick);
  } else {
    isTicking = false;
    setTimeout(() => {
      if (!isTicking && progressBar?.element.getAttribute('data-state') !== 'hover') {
        progressBar?.setState('idle');
      }
    }, 600);
  }
}

function handleScroll() {
  userInteracted = true;

  if (!isTicking) {
    isTicking = true;
    requestAnimationFrame(tick);
  }

  scheduleSave();
}

// ── 4. Position Saving (Debounce 400ms + Flush) ──
function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    flushSave();
  }, SAVE_DEBOUNCE_MS);
}

function flushSave(targetUrl = currentUrl) {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }

  if (!userInteracted && window.scrollY < 60) return;
  if (!settings.restoreScroll) return;

  const m = computeMetrics();
  const norm = normalizeUrl(targetUrl);
  const ratio = computeProgress(m.scrollY, m.maxScroll);

  const entry: ScrollEntry = {
    url: norm,
    scrollY: m.scrollY,
    scrollRatio: ratio,
    docHeight: m.docHeight,
    viewportH: m.viewportH,
    ts: Date.now(),
  };

  chrome.runtime
    .sendMessage({
      type: MSG.SAVE_POSITION,
      ...entry,
    })
    .catch(() => {});
}

// ── 5. Throttled Progress Update to Background ──
function sendProgressUpdate() {
  const now = Date.now();
  if (now - lastProgressUpdateSent < 1000 && smoothedProgress < 0.995) {
    return;
  }
  lastProgressUpdateSent = now;

  const pct = Math.round(smoothedProgress * 100);
  const payload: Req[typeof MSG.PROGRESS_UPDATE] = {
    url: currentUrl,
    percent: pct,
    scrollable: currentMetrics.scrollable && shouldShowOverlay(),
    metrics: currentMetrics,
  };

  chrome.runtime
    .sendMessage({
      type: MSG.PROGRESS_UPDATE,
      ...payload,
    })
    .catch(() => {});
}

// ── 6. Event Listeners & SPA ──
function setupEvents() {
  window.addEventListener('scroll', handleScroll, { passive: true });

  window.addEventListener('pagehide', () => flushSave(), { capture: true });
  window.addEventListener('beforeunload', () => flushSave());

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      flushSave();
    }
  });

  // Listen for direct chrome.storage.sync changes (e.g. from tests or options)
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.settings) {
      settings = sanitizeSettings(changes.settings.newValue);
      shadowCtx?.updateTheme(settings);
      updateVisibility();
    }
  });

  // Listen for messages from Service Worker
  chrome.runtime.onMessage.addListener((message) => {
    switch (message.type) {
      case MSG.NAV_CHANGED: {
        // SPA navigation (FR-23)
        flushSave(currentUrl);
        currentUrl = window.location.href;
        userInteracted = false;
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        smoothedProgress = 0;
        progressBar?.render(0);
        milestoneTracker?.reset();

        startInitialMeasurementAndRestoration();
        break;
      }

      case MSG.SETTINGS_CHANGED: {
        settings = sanitizeSettings(message.settings);
        shadowCtx?.updateTheme(settings);
        updateVisibility();
        break;
      }

      case MSG.TOGGLE_OVERLAY: {
        isOverlayTemporarilyHidden = !isOverlayTemporarilyHidden;
        updateVisibility();
        break;
      }
    }
  });
}

// Bootstrap execution
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
