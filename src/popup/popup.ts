// src/popup/popup.ts — Popup logic, stats, switches, and site exclusions (FR-09, FR-25, FR-27, FR-29)
import { MSG } from '../shared/messages';
import type { Metrics, Settings, Position, BarLength, BarRadius } from '../shared/types';
import { screensOf, estimateReadingMinutes } from '../core/reading';

let currentHostname = '';
let isSiteEnabled = true;

const CIRCUMFERENCE = 251.3;

const donutArc = document.getElementById('donutArc') as SVGCircleElement | null;
const donutPct = document.getElementById('donutPct');
const statScreens = document.getElementById('statScreens');
const statTime = document.getElementById('statTime');
const siteBtn = document.getElementById('siteBtn');
const siteBtnText = document.getElementById('siteBtnText');
const restoreSwitch = document.getElementById('restoreSwitch');
const celebrateSwitch = document.getElementById('celebrateSwitch');
const themeSelect = document.getElementById('themeSelect') as HTMLSelectElement | null;
const positionSelect = document.getElementById('positionSelect') as HTMLSelectElement | null;
const lengthSelect = document.getElementById('lengthSelect') as HTMLSelectElement | null;
const radiusSelect = document.getElementById('radiusSelect') as HTMLSelectElement | null;
const shadowSwitch = document.getElementById('shadowSwitch');
const hideScrollbarSwitch = document.getElementById('hideScrollbarSwitch');
const smoothScrollSwitch = document.getElementById('smoothScrollSwitch');
const bookmarksSwitch = document.getElementById('bookmarksSwitch');
const optionsBtn = document.getElementById('optionsBtn');
const clearBtn = document.getElementById('clearBtn');
const popupBody = document.getElementById('popupBody');
const unsupportedNote = document.getElementById('unsupportedNote');

async function initPopup() {
  const isArabic = navigator.language.startsWith('ar');
  document.body.dir = isArabic ? 'rtl' : 'ltr';

  try {
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!activeTab?.id || !activeTab.url) {
      showUnsupported();
      return;
    }

    try {
      const u = new URL(activeTab.url);
      currentHostname = u.hostname.replace(/^www\./, '');
    } catch {
      showUnsupported();
      return;
    }

    const res = await chrome.runtime.sendMessage({
      type: MSG.GET_TAB_STATE,
      tabId: activeTab.id,
    });

    if (res?.ok && res.data) {
      const { percent, metrics, siteEnabled, settings } = res.data as {
        percent: number;
        metrics: Metrics | null;
        siteEnabled: boolean;
        settings: Settings;
      };

      isSiteEnabled = siteEnabled;

      applySettingsToUI(settings);
      renderProgress(percent, metrics);
      updateSiteBtn();
    } else {
      showUnsupported();
    }
  } catch {
    showUnsupported();
  }
}

function showUnsupported() {
  if (popupBody && unsupportedNote) {
    popupBody.classList.add('unsupported');
    unsupportedNote.style.display = 'block';
  }
}

function renderProgress(percent: number, metrics: Metrics | null) {
  const p = Math.max(0, Math.min(100, percent));
  if (donutArc) {
    const offset = CIRCUMFERENCE - (p / 100) * CIRCUMFERENCE;
    donutArc.style.strokeDashoffset = String(offset);
  }
  if (donutPct) {
    donutPct.textContent = `${p}%`;
  }

  if (metrics && statScreens && statTime) {
    const sc = screensOf(metrics.docHeight, metrics.viewportH);
    statScreens.textContent = `${sc.toFixed(1)} شاشة`;

    // Estimate word count approximately from docHeight (1 screen ~ 350 words)
    const approxWords = Math.round(sc * 350);
    const mins = estimateReadingMinutes(approxWords);
    statTime.textContent = `${mins} دقيقة`;
  }
}

function applySettingsToUI(s: Settings) {
  document.body.setAttribute('data-theme', s.theme);

  if (restoreSwitch) {
    restoreSwitch.setAttribute('aria-checked', String(s.restoreScroll));
  }
  if (celebrateSwitch) {
    celebrateSwitch.setAttribute('aria-checked', String(s.celebrate));
  }
  if (themeSelect) {
    themeSelect.value = s.theme;
  }
  if (positionSelect) {
    positionSelect.value = s.position || (s.side === 'left' ? 'left' : 'right');
  }
  if (lengthSelect) {
    lengthSelect.value = s.barLength || 'floating';
  }
  if (radiusSelect) {
    radiusSelect.value = s.barRadius || 'subtle';
  }
  if (shadowSwitch) {
    shadowSwitch.setAttribute('aria-checked', String(s.shadow !== false));
  }
  if (hideScrollbarSwitch) {
    hideScrollbarSwitch.setAttribute('aria-checked', String(s.hideNativeScrollbar));
  }
  if (smoothScrollSwitch) {
    smoothScrollSwitch.setAttribute('aria-checked', String(s.smoothScroll));
  }
  if (bookmarksSwitch) {
    bookmarksSwitch.setAttribute('aria-checked', String(s.bookmarks !== false));
  }
}

function updateSiteBtn() {
  if (!siteBtnText) return;
  if (isSiteEnabled) {
    siteBtnText.textContent = `إيقاف على ${currentHostname || 'هذا الموقع'}`;
  } else {
    siteBtnText.textContent = `تفعيل على ${currentHostname || 'هذا الموقع'}`;
  }
}

// ── Event Handlers ──
restoreSwitch?.addEventListener('click', async () => {
  const cur = restoreSwitch.getAttribute('aria-checked') === 'true';
  const next = !cur;
  restoreSwitch.setAttribute('aria-checked', String(next));
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { restoreScroll: next },
  });
});

celebrateSwitch?.addEventListener('click', async () => {
  const cur = celebrateSwitch.getAttribute('aria-checked') === 'true';
  const next = !cur;
  celebrateSwitch.setAttribute('aria-checked', String(next));
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { celebrate: next },
  });
});

themeSelect?.addEventListener('change', async () => {
  const newTheme = themeSelect.value as Settings['theme'];
  document.body.setAttribute('data-theme', newTheme);
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { theme: newTheme },
  });
});

positionSelect?.addEventListener('change', async () => {
  const newPos = positionSelect.value as Position;
  const newSide = newPos === 'left' ? 'left' : 'right';
  const newOrientation = (newPos === 'top' || newPos === 'bottom') ? 'horizontal' : 'vertical';
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { position: newPos, side: newSide, orientation: newOrientation },
  });
});

lengthSelect?.addEventListener('change', async () => {
  const newLen = lengthSelect.value as BarLength;
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { barLength: newLen },
  });
});

radiusSelect?.addEventListener('change', async () => {
  const newRad = radiusSelect.value as BarRadius;
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { barRadius: newRad },
  });
});

shadowSwitch?.addEventListener('click', async () => {
  const cur = shadowSwitch.getAttribute('aria-checked') === 'true';
  const next = !cur;
  shadowSwitch.setAttribute('aria-checked', String(next));
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { shadow: next },
  });
});

hideScrollbarSwitch?.addEventListener('click', async () => {
  const cur = hideScrollbarSwitch.getAttribute('aria-checked') === 'true';
  const next = !cur;
  hideScrollbarSwitch.setAttribute('aria-checked', String(next));
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { hideNativeScrollbar: next },
  });
});

smoothScrollSwitch?.addEventListener('click', async () => {
  const cur = smoothScrollSwitch.getAttribute('aria-checked') === 'true';
  const next = !cur;
  smoothScrollSwitch.setAttribute('aria-checked', String(next));
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { smoothScroll: next },
  });
});

bookmarksSwitch?.addEventListener('click', async () => {
  const cur = bookmarksSwitch.getAttribute('aria-checked') === 'true';
  const next = !cur;
  bookmarksSwitch.setAttribute('aria-checked', String(next));
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { bookmarks: next },
  });
});

siteBtn?.addEventListener('click', async () => {
  if (!currentHostname) return;
  const nextEnabled = !isSiteEnabled;
  isSiteEnabled = nextEnabled;
  updateSiteBtn();

  await chrome.runtime.sendMessage({
    type: MSG.SITE_TOGGLE,
    hostname: currentHostname,
    enabled: nextEnabled,
  });
});

optionsBtn?.addEventListener('click', () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('src/options/options.html'));
  }
});

clearBtn?.addEventListener('click', async () => {
  const confirmed = window.confirm('هل تريد بالتأكيد مسح جميع مواضع التمرير المحفوظة؟');
  if (confirmed) {
    const res = await chrome.runtime.sendMessage({ type: MSG.CLEAR_POSITIONS });
    const count = res?.ok ? res.data?.cleared ?? 0 : 0;
    alert(`تم مسح ${count} موضع محفوظ.`);
  }
});

initPopup();
