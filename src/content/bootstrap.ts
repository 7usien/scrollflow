// src/content/bootstrap.ts — Main content script lifecycle, scroll loop, and communication (FR-01..FR-24)
import { MSG, type Req } from '../shared/messages';
import type { BookmarkColor, BookmarkEntry, Metrics, ScrollEntry, Settings, TocEntry } from '../shared/types';
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
import { setNativeScrollbarHidden } from './ui/native-scroll';
import { setSmoothScrollEnabled } from './ui/smooth-scroll';
import { createBackToTop, type BackToTopController } from './ui/back-to-top';
import { createSelectionBubble, type SelectionBubbleController } from './ui/selection-bubble';
import { createMarkersManager, type MarkersController } from './ui/markers';
import { createBookmarksMenu, type BookmarksMenuController } from './ui/bookmarks-menu';
import { createTocMinimap, type TocMinimapController } from './ui/toc-minimap';
import { createTocObserver, type TocObserverController } from './toc-observer';
import { computeZenVisualState, DEFAULT_ZEN_IDLE_TIMEOUT_MS } from '../core/zen';
import { createBookmarkEntry } from '../core/bookmarks';

let settings: Settings = { ...DEFAULT_SETTINGS };
let shadowCtx: ShadowContext | null = null;
let progressBar: ProgressBarController | null = null;
let toast: ToastController | null = null;
let milestoneTracker: MilestoneTracker | null = null;
let measureObserver: MeasureObserver | null = null;
let backToTop: BackToTopController | null = null;
let selectionBubble: SelectionBubbleController | null = null;
let markersManager: MarkersController | null = null;
let bookmarksMenu: BookmarksMenuController | null = null;
let tocMinimap: TocMinimapController | null = null;
let tocObserver: TocObserverController | null = null;

let currentBookmarks: BookmarkEntry[] = [];
let currentTocEntries: TocEntry[] = [];

let currentMetrics: Metrics = computeMetrics();
let currentUrl = window.location.href;
let userInteracted = false;
let smoothedProgress = 0;
let isOverlayTemporarilyHidden = false;

let saveTimer: ReturnType<typeof setTimeout> | null = null;
let lastProgressUpdateSent = 0;
let isTicking = false;

// Zen Mode State
let zenTimer: ReturnType<typeof setTimeout> | null = null;
let lastActivityTs = Date.now();
let isZenDimmed = false;
let isRailHovered = false;
let isRailScrubbing = false;

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

function checkIsRTL(): boolean {
  const docDir = (document.documentElement.dir || '').toLowerCase();
  const bodyDir = (document.body?.dir || '').toLowerCase();
  if (docDir === 'rtl' || bodyDir === 'rtl') return true;

  const lang = (document.documentElement.lang || document.body?.lang || '').toLowerCase();
  if (lang.startsWith('ar') || lang.startsWith('fa') || lang.startsWith('he') || lang.startsWith('ur')) {
    return true;
  }

  try {
    const computedDir = window.getComputedStyle(document.body || document.documentElement).direction;
    if (computedDir === 'rtl') return true;
  } catch {
    // Fail-soft
  }

  return false;
}

function pokeZenMode() {
  lastActivityTs = Date.now();

  if (!settings.zenMode) {
    if (isZenDimmed) {
      isZenDimmed = false;
      progressBar?.element.removeAttribute('data-zen');
      bookmarksMenu?.setZenState(false);
      tocMinimap?.setZenState(false);
    }
    if (zenTimer) {
      clearTimeout(zenTimer);
      zenTimer = null;
    }
    return;
  }

  if (isZenDimmed) {
    isZenDimmed = false;
    progressBar?.element.removeAttribute('data-zen');
    bookmarksMenu?.setZenState(false);
    tocMinimap?.setZenState(false);
  }

  if (zenTimer) {
    clearTimeout(zenTimer);
  }

  zenTimer = setTimeout(() => {
    const state = computeZenVisualState({
      zenModeEnabled: settings.zenMode,
      isHovered: isRailHovered,
      isScrubbing: isRailScrubbing,
      isMenuOpen: false,
      lastActivityTs,
      nowTs: Date.now(),
    });

    if (state === 'hidden') {
      isZenDimmed = true;
      progressBar?.element.setAttribute('data-zen', 'dimmed');
      bookmarksMenu?.setZenState(true);
      tocMinimap?.setZenState(true);
    }
  }, DEFAULT_ZEN_IDLE_TIMEOUT_MS);
}

function updateTocObserver() {
  if (settings.autoToc && shouldShowOverlay() && currentMetrics.scrollable) {
    if (!tocObserver) {
      tocObserver = createTocObserver();
      tocObserver.start((entries) => {
        currentTocEntries = entries;
        tocMinimap?.render(currentTocEntries);
        tocMinimap?.updateScroll(currentMetrics.scrollY);
        markersManager?.renderToc(currentTocEntries);
        bookmarksMenu?.renderToc(currentTocEntries);
      });
    } else {
      const entries = tocObserver.scan();
      currentTocEntries = entries;
      tocMinimap?.render(currentTocEntries);
      tocMinimap?.updateScroll(currentMetrics.scrollY);
      markersManager?.renderToc(currentTocEntries);
      bookmarksMenu?.renderToc(currentTocEntries);
    }
  } else {
    if (tocObserver) {
      tocObserver.destroy();
      tocObserver = null;
      currentTocEntries = [];
      tocMinimap?.render([]);
      markersManager?.renderToc([]);
      bookmarksMenu?.renderToc([]);
    }
  }
}

function setupUI() {
  shadowCtx = createShadowHost(settings);
  progressBar = createProgressBar(shadowCtx.shadowRoot, {
    getMaxScroll: () => currentMetrics.maxScroll,
    getOrientation: () => settings.orientation,
    isRTL: checkIsRTL,
    onScrub: (ratio) => {
      userInteracted = true;
      isRailScrubbing = true;
      pokeZenMode();
      smoothedProgress = ratio;
      sendProgressUpdate();
      scheduleSave();
    },
  });

  progressBar.element.addEventListener('mouseenter', () => {
    isRailHovered = true;
    pokeZenMode();
  });

  progressBar.element.addEventListener('mouseleave', () => {
    isRailHovered = false;
    pokeZenMode();
  });

  toast = createToast(shadowCtx.shadowRoot);
  milestoneTracker = createMilestoneTracker();
  backToTop = createBackToTop(shadowCtx.shadowRoot, {
    isRTL: checkIsRTL,
  });

  const handleJumpToToc = (entry: TocEntry) => {
    userInteracted = true;
    pokeZenMode();
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: entry.scrollY, behavior: isReduced ? 'instant' : 'smooth' });
  };

  tocMinimap = createTocMinimap(shadowCtx.shadowRoot, {
    isRTL: checkIsRTL,
    onJumpToHeading: handleJumpToToc,
  });

  if (settings.bookmarks) {
    const handleJumpToBookmark = (b: BookmarkEntry) => {
      userInteracted = true;
      pokeZenMode();
      const targetY = b.scrollRatio * currentMetrics.maxScroll;
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: targetY, behavior: isReduced ? 'instant' : 'smooth' });
    };

    const handleDeleteBookmark = async (id: string) => {
      currentBookmarks = currentBookmarks.filter((b) => b.id !== id);
      markersManager?.render(currentBookmarks);
      bookmarksMenu?.render(currentBookmarks, currentTocEntries);
      try {
        const norm = normalizeUrl(currentUrl);
        await chrome.runtime.sendMessage({
          type: MSG.BOOKMARK_REMOVE,
          url: norm,
          id,
        });
        const deletedMsg = chrome.i18n.getMessage('bookmarkDeleted') || 'تم حذف الهامش';
        toast?.show(deletedMsg);
      } catch {
        // fail-soft
      }
    };

    markersManager = createMarkersManager(progressBar.element, {
      isRTL: checkIsRTL,
      onJumpToBookmark: handleJumpToBookmark,
      onDeleteBookmark: handleDeleteBookmark,
      onJumpToToc: handleJumpToToc,
    });

    bookmarksMenu = createBookmarksMenu(shadowCtx.shadowRoot, {
      isRTL: checkIsRTL,
      onJumpToBookmark: handleJumpToBookmark,
      onDeleteBookmark: handleDeleteBookmark,
      onJumpToToc: handleJumpToToc,
      onHoverBookmark: (id) => {
        markersManager?.highlight(id);
      },
    });

    selectionBubble = createSelectionBubble(shadowCtx.shadowRoot, {
      isRTL: checkIsRTL,
      onCreateBookmark: async (text, color?: BookmarkColor) => {
        const entry = createBookmarkEntry({
          url: normalizeUrl(currentUrl),
          text,
          color,
          scrollY: currentMetrics.scrollY,
          maxScroll: currentMetrics.maxScroll,
        });
        currentBookmarks.push(entry);
        markersManager?.render(currentBookmarks);
        bookmarksMenu?.render(currentBookmarks, currentTocEntries);
        try {
          await chrome.runtime.sendMessage({
            type: MSG.BOOKMARK_ADD,
            bookmark: entry,
          });
          const toastMsg = chrome.i18n.getMessage('bookmarkAdded') || 'تم حفظ الهامش 🔖';
          toast?.show(toastMsg);
        } catch {
          // fail-soft
        }
      },
    });
  }

  updateVisibility();
  updateTocObserver();
  pokeZenMode();
}

async function loadBookmarks() {
  if (!settings.bookmarks) return;
  try {
    const norm = normalizeUrl(currentUrl);
    const res = await chrome.runtime.sendMessage({
      type: MSG.BOOKMARK_GET,
      url: norm,
    });
    if (res?.ok && Array.isArray(res.data)) {
      currentBookmarks = res.data;
      markersManager?.render(currentBookmarks);
      bookmarksMenu?.render(currentBookmarks, currentTocEntries);
    }
  } catch {
    // fail-soft
  }
}

function updateVisibility() {
  if (!progressBar) return;
  const show = shouldShowOverlay();

  if (!show || !currentMetrics.scrollable) {
    progressBar.setState('hidden');
    backToTop?.reset();
    selectionBubble?.element.style.setProperty('display', 'none');
    bookmarksMenu?.triggerElement.style.setProperty('display', 'none');
    tocMinimap?.element.style.setProperty('display', 'none');
    setNativeScrollbarHidden(false);
    setSmoothScrollEnabled(false);
  } else {
    progressBar.setState('idle');
    selectionBubble?.element.style.removeProperty('display');
    bookmarksMenu?.triggerElement.style.removeProperty('display');
    tocMinimap?.element.style.removeProperty('display');
    const remainingPixels = Math.max(0, currentMetrics.maxScroll - currentMetrics.scrollY);
    backToTop?.update(smoothedProgress, true, remainingPixels);
    setNativeScrollbarHidden(settings.hideNativeScrollbar);
    setSmoothScrollEnabled(settings.smoothScroll);
  }

  updateTocObserver();
  pokeZenMode();
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
  const remainingInitial = Math.max(0, currentMetrics.maxScroll - currentMetrics.scrollY);
  backToTop?.update(smoothedProgress, currentMetrics.scrollable && shouldShowOverlay(), remainingInitial);
  updateVisibility();
  sendProgressUpdate();
  loadBookmarks();
  updateTocObserver();

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
    const remainingObs = Math.max(0, currentMetrics.maxScroll - currentMetrics.scrollY);
    backToTop?.update(smoothedProgress, currentMetrics.scrollable && shouldShowOverlay(), remainingObs);
    if (currentBookmarks.length > 0) {
      markersManager?.render(currentBookmarks);
    }
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

      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isReduced) {
        if (settings.showToasts) {
          const completeMsg = chrome.i18n.getMessage('toastComplete') || 'أكملت الصفحة 🎉';
          toast?.show(completeMsg);
        }
      } else if (shadowCtx) {
        const isShort = currentMetrics.screens < 2;
        burstConfetti(shadowCtx.shadowRoot, {
          isShort,
          onComplete: () => {
            progressBar?.setState('active');
          },
        });
      }
    } else if (progressBar.element.getAttribute('data-state') !== 'hover') {
      if (pct >= 99.5) {
        progressBar.setState('complete');
      } else {
        progressBar.setState('active');
      }
    }
  }

  const remainingTick = Math.max(0, currentMetrics.maxScroll - currentMetrics.scrollY);
  backToTop?.update(smoothedProgress, currentMetrics.scrollable && shouldShowOverlay(), remainingTick);
  tocMinimap?.updateScroll(currentMetrics.scrollY);
  sendProgressUpdate();

  // Continue lerping if not close enough
  if (Math.abs(target - smoothedProgress) >= 0.001) {
    requestAnimationFrame(tick);
  } else {
    isTicking = false;
    isRailScrubbing = false;
    setTimeout(() => {
      if (!isTicking && progressBar?.element.getAttribute('data-state') !== 'hover') {
        progressBar?.setState('idle');
      }
    }, 600);
  }
}

function handleScroll() {
  userInteracted = true;
  pokeZenMode();
  tocMinimap?.updateScroll(window.scrollY);

  if (shouldShowOverlay() && currentMetrics.scrollable) {
    progressBar?.setState('active');
  }

  if (!isTicking && !document.hidden) {
    isTicking = true;
    requestAnimationFrame(tick);
  }

  scheduleSave();
}

// ── 4. Position Saving (Debounced & Flush) ──
function scheduleSave() {
  if (saveTimer) {
    clearTimeout(saveTimer);
  }
  saveTimer = setTimeout(() => {
    flushSave();
  }, SAVE_DEBOUNCE_MS);
}

function flushSave(targetUrl?: string) {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }

  if (!settings.restoreScroll || !shouldShowOverlay() || !userInteracted) {
    return;
  }

  const urlToSave = targetUrl || currentUrl;
  const entry: ScrollEntry = {
    url: normalizeUrl(urlToSave),
    scrollY: currentMetrics.scrollY,
    scrollRatio: computeProgress(currentMetrics.scrollY, currentMetrics.maxScroll),
    docHeight: currentMetrics.docHeight,
    viewportH: currentMetrics.viewportH,
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

  const markInteracted = () => {
    userInteracted = true;
    pokeZenMode();
  };
  window.addEventListener('pointerdown', markInteracted, { passive: true, capture: true });
  window.addEventListener('pointermove', pokeZenMode, { passive: true });
  window.addEventListener('keydown', markInteracted, { passive: true, capture: true });
  window.addEventListener('wheel', markInteracted, { passive: true, capture: true });
  window.addEventListener('touchstart', markInteracted, { passive: true, capture: true });

  window.addEventListener('pagehide', () => flushSave(), { capture: true });
  window.addEventListener('beforeunload', () => flushSave());

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      flushSave();
      if (zenTimer) {
        clearTimeout(zenTimer);
        zenTimer = null;
      }
    } else {
      pokeZenMode();
    }
  });

  // Listen for direct chrome.storage.sync changes (e.g. from tests or options)
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.settings) {
      settings = sanitizeSettings(changes.settings.newValue);
      shadowCtx?.updateTheme(settings);
      updateVisibility();
      updateTocObserver();
      pokeZenMode();
    }
  });

  // Listen for messages from Service Worker
  chrome.runtime.onMessage.addListener((message) => {
    switch (message.type) {
      case MSG.NAV_CHANGED: {
        // SPA navigation (FR-23)
        // If the URL is unchanged or just a fragment/hash, ignore it to prevent disrupting in-page browsing
        if (message.url && message.url === currentUrl) {
          break;
        }

        flushSave(currentUrl);
        currentUrl = window.location.href;
        userInteracted = false;
        smoothedProgress = 0;
        progressBar?.render(0);
        milestoneTracker?.reset();
        backToTop?.reset();
        currentBookmarks = [];
        currentTocEntries = [];
        markersManager?.render([]);
        markersManager?.renderToc([]);
        bookmarksMenu?.render([], []);

        startInitialMeasurementAndRestoration();
        break;
      }

      case MSG.SETTINGS_CHANGED: {
        settings = sanitizeSettings(message.settings);
        shadowCtx?.updateTheme(settings);
        updateVisibility();
        updateTocObserver();
        pokeZenMode();
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
