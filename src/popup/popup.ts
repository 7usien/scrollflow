// src/popup/popup.ts — Popup logic, stats, switches, site exclusions, and 9-language i18n
import { MSG } from '../shared/messages';
import type { Metrics, Settings } from '../shared/types';
import { screensOf, estimateReadingMinutes } from '../core/reading';
import {
  getDictionary,
  getStoredLocale,
  setStoredLocale,
  resolveActiveLocale,
  type LocaleSetting,
  type SupportedLocale,
} from '../shared/i18n';

let currentHostname = '';
let isSiteEnabled = true;
let currentSetting: LocaleSetting = 'auto';
let currentLocale: SupportedLocale = 'en';
let currentMetrics: Metrics | null = null;
let currentPercent = 0;

const CIRCUMFERENCE = 251.3;

const donutArc = document.getElementById('donutArc') as SVGCircleElement | null;
const donutPct = document.getElementById('donutPct');
const statScreens = document.getElementById('statScreens');
const statTime = document.getElementById('statTime');
const lblScreens = document.getElementById('lblScreens');
const lblTime = document.getElementById('lblTime');

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
const autoTocSwitch = document.getElementById('autoTocSwitch');
const zenModeSwitch = document.getElementById('zenModeSwitch');
const optionsBtn = document.getElementById('optionsBtn');
const clearBtn = document.getElementById('clearBtn');
const popupBody = document.getElementById('popupBody');
const unsupportedNote = document.getElementById('unsupportedNote');
const langSelect = document.getElementById('langSelect') as HTMLSelectElement | null;

const lblRestore = document.getElementById('lblRestore');
const lblCelebrate = document.getElementById('lblCelebrate');
const lblTheme = document.getElementById('lblTheme');
const lblPosition = document.getElementById('lblPosition');
const lblLength = document.getElementById('lblLength');
const lblRadius = document.getElementById('lblRadius');
const lblShadow = document.getElementById('lblShadow');
const lblHideScrollbar = document.getElementById('lblHideScrollbar');
const lblSmoothScroll = document.getElementById('lblSmoothScroll');
const lblBookmarks = document.getElementById('lblBookmarks');
const lblAutoToc = document.getElementById('lblAutoToc');
const lblZenMode = document.getElementById('lblZenMode');

function applyLocale(lang: SupportedLocale) {
  currentLocale = lang;
  const dict = getDictionary(lang);

  document.documentElement.lang = lang;
  document.documentElement.dir = dict.dir;
  document.body.dir = dict.dir;

  const t = dict.popup;

  if (lblScreens) lblScreens.textContent = t.lblScreens;
  if (lblTime) lblTime.textContent = t.lblTime;

  if (lblRestore) lblRestore.textContent = t.lblRestore;
  if (lblCelebrate) lblCelebrate.textContent = t.lblCelebrate;
  if (lblTheme) lblTheme.textContent = t.lblTheme;
  if (lblPosition) lblPosition.textContent = t.lblPosition;
  if (lblLength) lblLength.textContent = t.lblLength;
  if (lblRadius) lblRadius.textContent = t.lblRadius;
  if (lblShadow) lblShadow.textContent = t.lblShadow;
  if (lblHideScrollbar) lblHideScrollbar.textContent = t.lblHideScrollbar;
  if (lblSmoothScroll) lblSmoothScroll.textContent = t.lblSmoothScroll;
  if (lblBookmarks) lblBookmarks.textContent = t.lblBookmarks;
  if (lblAutoToc) lblAutoToc.textContent = t.lblAutoToc;
  if (lblZenMode) lblZenMode.textContent = t.lblZenMode;

  if (clearBtn) clearBtn.textContent = t.clearBtn;
  if (unsupportedNote) unsupportedNote.textContent = t.unsupported;

  const updateSelect = (select: HTMLSelectElement | null, map: Record<string, string>) => {
    if (!select) return;
    for (const opt of Array.from(select.options)) {
      if (map[opt.value]) opt.textContent = map[opt.value];
    }
  };

  updateSelect(themeSelect, t.themes);
  updateSelect(positionSelect, t.positions);
  updateSelect(lengthSelect, t.lengths);
  updateSelect(radiusSelect, t.radii);

  if (langSelect) {
    langSelect.value = currentSetting;
  }

  updateSiteBtn();
  renderProgress(currentPercent, currentMetrics);
}

async function initPopup() {
  currentSetting = await getStoredLocale();
  currentLocale = resolveActiveLocale(currentSetting);
  applyLocale(currentLocale);

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
      currentPercent = percent;
      currentMetrics = metrics;

      applySettingsToUI(settings);
      updateSiteBtn();
      renderProgress(percent, metrics);
    } else {
      showUnsupported();
    }
  } catch {
    showUnsupported();
  }
}

function showUnsupported() {
  if (popupBody) {
    const rows = popupBody.querySelectorAll('.row, .donut-row, .site-btn');
    rows.forEach((r) => ((r as HTMLElement).style.display = 'none'));
  }
  if (unsupportedNote) {
    unsupportedNote.style.display = 'block';
  }
}

function renderProgress(percent: number, metrics: Metrics | null) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  if (donutArc) {
    const offset = CIRCUMFERENCE - (p / 100) * CIRCUMFERENCE;
    donutArc.style.strokeDashoffset = String(offset);
  }
  if (donutPct) {
    donutPct.textContent = `${p}%`;
  }

  const dict = getDictionary(currentLocale);
  const t = dict.popup;

  if (metrics && statScreens && statTime) {
    const sc = screensOf(metrics.docHeight, metrics.viewportH);
    statScreens.textContent = `${sc.toFixed(1)} ${t.screensSuffix}`;

    const approxWords = Math.round(sc * 350);
    const mins = estimateReadingMinutes(approxWords);
    statTime.textContent = mins <= 1 ? t.minSingle : `${mins} ${t.minsSuffix}`;
  }
}

function applySettingsToUI(s: Settings) {
  document.body.setAttribute('data-theme', s.theme);

  if (restoreSwitch) {
    restoreSwitch.classList.toggle('active', s.restoreScroll);
    restoreSwitch.setAttribute('aria-checked', String(s.restoreScroll));
  }
  if (celebrateSwitch) {
    celebrateSwitch.classList.toggle('active', s.celebrate);
    celebrateSwitch.setAttribute('aria-checked', String(s.celebrate));
  }
  if (themeSelect) {
    themeSelect.value = s.theme;
  }
  if (positionSelect) {
    positionSelect.value = s.position;
  }
  if (lengthSelect) {
    lengthSelect.value = s.barLength || 'floating';
  }
  if (radiusSelect) {
    radiusSelect.value = s.barRadius || 'subtle';
  }
  if (shadowSwitch) {
    shadowSwitch.classList.toggle('active', s.shadow !== false);
    shadowSwitch.setAttribute('aria-checked', String(s.shadow !== false));
  }
  if (hideScrollbarSwitch) {
    hideScrollbarSwitch.classList.toggle('active', s.hideNativeScrollbar);
    hideScrollbarSwitch.setAttribute('aria-checked', String(s.hideNativeScrollbar));
  }
  if (smoothScrollSwitch) {
    smoothScrollSwitch.classList.toggle('active', s.smoothScroll);
    smoothScrollSwitch.setAttribute('aria-checked', String(s.smoothScroll));
  }
  if (bookmarksSwitch) {
    bookmarksSwitch.classList.toggle('active', s.bookmarks !== false);
    bookmarksSwitch.setAttribute('aria-checked', String(s.bookmarks !== false));
  }
  if (autoTocSwitch) {
    autoTocSwitch.classList.toggle('active', s.autoToc !== false);
    autoTocSwitch.setAttribute('aria-checked', String(s.autoToc !== false));
  }
  if (zenModeSwitch) {
    zenModeSwitch.classList.toggle('active', s.zenMode === true);
    zenModeSwitch.setAttribute('aria-checked', String(s.zenMode === true));
  }
}

function updateSiteBtn() {
  if (!siteBtnText) return;
  const dict = getDictionary(currentLocale);
  const t = dict.popup;
  const site = currentHostname || t.siteDefault;
  if (isSiteEnabled) {
    siteBtnText.textContent = t.sitePause.replace('{site}', site);
  } else {
    siteBtnText.textContent = t.siteEnable.replace('{site}', site);
  }
  if (siteBtn) {
    siteBtn.setAttribute('data-disabled', String(!isSiteEnabled));
  }
}

// ── Event Handlers ──
restoreSwitch?.addEventListener('click', async () => {
  const cur = restoreSwitch.getAttribute('aria-checked') === 'true';
  const next = !cur;
  restoreSwitch.classList.toggle('active', next);
  restoreSwitch.setAttribute('aria-checked', String(next));
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { restoreScroll: next },
  });
});

celebrateSwitch?.addEventListener('click', async () => {
  const cur = celebrateSwitch.getAttribute('aria-checked') === 'true';
  const next = !cur;
  celebrateSwitch.classList.toggle('active', next);
  celebrateSwitch.setAttribute('aria-checked', String(next));
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { celebrate: next },
  });
});

themeSelect?.addEventListener('change', async (e) => {
  const val = (e.target as HTMLSelectElement).value as Settings['theme'];
  document.body.setAttribute('data-theme', val);
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { theme: val },
  });
});

positionSelect?.addEventListener('change', async (e) => {
  const val = (e.target as HTMLSelectElement).value as Settings['position'];
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { position: val },
  });
});

lengthSelect?.addEventListener('change', async (e) => {
  const val = (e.target as HTMLSelectElement).value as Settings['barLength'];
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { barLength: val },
  });
});

radiusSelect?.addEventListener('change', async (e) => {
  const val = (e.target as HTMLSelectElement).value as Settings['barRadius'];
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { barRadius: val },
  });
});

shadowSwitch?.addEventListener('click', async () => {
  const cur = shadowSwitch.getAttribute('aria-checked') === 'true';
  const next = !cur;
  shadowSwitch.classList.toggle('active', next);
  shadowSwitch.setAttribute('aria-checked', String(next));
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { shadow: next },
  });
});

hideScrollbarSwitch?.addEventListener('click', async () => {
  const cur = hideScrollbarSwitch.getAttribute('aria-checked') === 'true';
  const next = !cur;
  hideScrollbarSwitch.classList.toggle('active', next);
  hideScrollbarSwitch.setAttribute('aria-checked', String(next));
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { hideNativeScrollbar: next },
  });
});

smoothScrollSwitch?.addEventListener('click', async () => {
  const cur = smoothScrollSwitch.getAttribute('aria-checked') === 'true';
  const next = !cur;
  smoothScrollSwitch.classList.toggle('active', next);
  smoothScrollSwitch.setAttribute('aria-checked', String(next));
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { smoothScroll: next },
  });
});

bookmarksSwitch?.addEventListener('click', async () => {
  const cur = bookmarksSwitch.getAttribute('aria-checked') === 'true';
  const next = !cur;
  bookmarksSwitch.classList.toggle('active', next);
  bookmarksSwitch.setAttribute('aria-checked', String(next));
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { bookmarks: next },
  });
});

autoTocSwitch?.addEventListener('click', async () => {
  const cur = autoTocSwitch.getAttribute('aria-checked') === 'true';
  const next = !cur;
  autoTocSwitch.classList.toggle('active', next);
  autoTocSwitch.setAttribute('aria-checked', String(next));
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { autoToc: next },
  });
});

zenModeSwitch?.addEventListener('click', async () => {
  const cur = zenModeSwitch.getAttribute('aria-checked') === 'true';
  const next = !cur;
  zenModeSwitch.classList.toggle('active', next);
  zenModeSwitch.setAttribute('aria-checked', String(next));
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { zenMode: next },
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

// Language Select handler
langSelect?.addEventListener('change', async () => {
  const val = (langSelect.value || 'auto') as LocaleSetting;
  currentSetting = val;
  await setStoredLocale(val);
  const effective = resolveActiveLocale(val);
  applyLocale(effective);
});

optionsBtn?.addEventListener('click', () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('src/options/options.html'));
  }
});

clearBtn?.addEventListener('click', async () => {
  const dict = getDictionary(currentLocale);
  const t = dict.popup;
  const confirmed = window.confirm(t.confirmClear);
  if (confirmed) {
    const res = await chrome.runtime.sendMessage({ type: MSG.CLEAR_POSITIONS });
    const count = res?.ok ? res.data?.cleared ?? 0 : 0;
    alert(t.alertCleared.replace('{count}', String(count)));
  }
});

initPopup();
