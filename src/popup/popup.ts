// src/popup/popup.ts — Popup logic, stats, switches, site exclusions, and bilingual localization (FR-09, FR-25, FR-27, FR-29)
import { MSG } from '../shared/messages';
import type { Metrics, Settings, Position, BarLength, BarRadius, Theme } from '../shared/types';
import { screensOf, estimateReadingMinutes } from '../core/reading';

type Locale = 'ar' | 'en';

let currentHostname = '';
let isSiteEnabled = true;
let currentLocale: Locale = 'ar';
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
const langToggleBtn = document.getElementById('langToggleBtn');

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

const POPUP_STRINGS = {
  ar: {
    langBtn: 'EN',
    lblScreens: 'طول الصفحة',
    lblTime: 'وقت قراءة مُقدَّر',
    screensSuffix: 'شاشة',
    minsSuffix: 'دقيقة',
    minSingle: 'أقل من دقيقة',
    sitePause: 'إيقاف على {site}',
    siteEnable: 'تفعيل على {site}',
    siteDefault: 'هذا الموقع',
    lblRestore: 'استعادة موضع التمرير',
    lblCelebrate: 'احتفال عند الإكمال',
    lblTheme: 'الستايل',
    lblPosition: 'الموضع',
    lblLength: 'امتداد الشريط',
    lblRadius: 'انحناء الحواف',
    lblShadow: 'إظهار الظل والتوهج',
    lblHideScrollbar: 'إخفاء سكرول المتصفح',
    lblSmoothScroll: 'تصفح سلس للصفحة',
    lblBookmarks: 'هوامش ونقاط الصفحة',
    lblAutoToc: 'فهرس العناوين',
    lblZenMode: 'وضع القراءة الهادئ',
    unsupported: 'الصفحة غير قابلة للقياس أو لا تدعم الإضافة هنا.',
    clearBtn: 'مسح بيانات التمرير',
    confirmClear: 'هل تريد بالتأكيد مسح جميع مواضع التمرير المحفوظة؟',
    alertCleared: 'تم مسح {count} موضع محفوظ.',
    themes: {
      aurora: 'Aurora (تدرج كوني)',
      sunset: 'Sunset (غروب دافئ)',
      cyberpunk: 'Cyberpunk (نيون متوهج)',
      minimal: 'Minimal (نحيف وبسيط)',
      glass: 'Glass Pill (كبسولة زجاجية)',
      mono: 'Mono (رمادي كلاسيكي)',
    },
    positions: {
      right: 'يمين (رأسي)',
      left: 'يسار (رأسي)',
      top: 'أعلى (أفقي)',
      bottom: 'أسفل (أفقي)',
    },
    lengths: {
      floating: 'عائم متمركز (60%)',
      full: 'كامل 100%',
    },
    radii: {
      subtle: 'دائرية خفيفة (6px)',
      pill: 'كبسولة كاملة (999px)',
      sharp: 'مستطيلة حادة (2px)',
    },
  },
  en: {
    langBtn: 'عربي',
    lblScreens: 'Page length',
    lblTime: 'Est. reading time',
    screensSuffix: 'screens',
    minsSuffix: 'min',
    minSingle: '< 1 min',
    sitePause: 'Pause on {site}',
    siteEnable: 'Enable on {site}',
    siteDefault: 'this site',
    lblRestore: 'Restore scroll position',
    lblCelebrate: 'Celebrate on complete',
    lblTheme: 'Theme & style',
    lblPosition: 'Bar position',
    lblLength: 'Bar length',
    lblRadius: 'Corner radius',
    lblShadow: 'Show shadow & glow',
    lblHideScrollbar: 'Hide native scrollbar',
    lblSmoothScroll: 'Smooth page scrolling',
    lblBookmarks: 'Page margins & markers',
    lblAutoToc: 'Auto Headings TOC',
    lblZenMode: 'Zen Mode (Auto-Hide)',
    unsupported: 'Page cannot be measured or does not support ScrollFlow.',
    clearBtn: 'Clear scroll data',
    confirmClear: 'Are you sure you want to clear all saved scroll positions?',
    alertCleared: 'Cleared {count} saved positions.',
    themes: {
      aurora: 'Aurora (Cosmic Gradient)',
      sunset: 'Sunset (Warm Coral)',
      cyberpunk: 'Cyberpunk (Neon Glow)',
      minimal: 'Minimal (Sleek Slate)',
      glass: 'Glass Pill (Frosted Capsule)',
      mono: 'Mono (Classic Gray)',
    },
    positions: {
      right: 'Right (Vertical)',
      left: 'Left (Vertical)',
      top: 'Top (Horizontal)',
      bottom: 'Bottom (Horizontal)',
    },
    lengths: {
      floating: 'Centered Floating (60%)',
      full: 'Full 100%',
    },
    radii: {
      subtle: 'Subtle Rounded (6px)',
      pill: 'Full Capsule (999px)',
      sharp: 'Sharp Rectangle (2px)',
    },
  },
};

function applyLocale(lang: Locale) {
  currentLocale = lang;
  const isRTL = lang === 'ar';
  document.documentElement.lang = lang;
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.body.dir = isRTL ? 'rtl' : 'ltr';

  const t = POPUP_STRINGS[lang];

  if (langToggleBtn) langToggleBtn.textContent = t.langBtn;
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

  updateSiteBtn();
  renderProgress(currentPercent, currentMetrics);
}

async function initPopup() {
  try {
    const res = await chrome.storage.local.get('sf_ui_locale');
    if (res?.sf_ui_locale === 'en' || res?.sf_ui_locale === 'ar') {
      currentLocale = res.sf_ui_locale;
    } else {
      currentLocale = 'ar';
    }
  } catch {
    currentLocale = 'ar';
  }

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
  currentPercent = percent;
  currentMetrics = metrics;

  const p = Math.max(0, Math.min(100, percent));
  if (donutArc) {
    const offset = CIRCUMFERENCE - (p / 100) * CIRCUMFERENCE;
    donutArc.style.strokeDashoffset = String(offset);
  }
  if (donutPct) {
    donutPct.textContent = `${p}%`;
  }

  const t = POPUP_STRINGS[currentLocale];

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
  if (autoTocSwitch) {
    autoTocSwitch.setAttribute('aria-checked', String(s.autoToc !== false));
  }
  if (zenModeSwitch) {
    zenModeSwitch.setAttribute('aria-checked', String(s.zenMode === true));
  }
}

function updateSiteBtn() {
  if (!siteBtnText) return;
  const t = POPUP_STRINGS[currentLocale];
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
  const theme = themeSelect.value as Theme;
  document.body.setAttribute('data-theme', theme);
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { theme },
  });
});

positionSelect?.addEventListener('change', async () => {
  const newPos = positionSelect.value as Position;
  const newSide = newPos === 'left' ? 'left' : 'right';
  const newOrientation = newPos === 'top' || newPos === 'bottom' ? 'horizontal' : 'vertical';
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { position: newPos, side: newSide, orientation: newOrientation },
  });
});

lengthSelect?.addEventListener('change', async () => {
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { barLength: lengthSelect.value as BarLength },
  });
});

radiusSelect?.addEventListener('change', async () => {
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { barRadius: radiusSelect.value as BarRadius },
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

autoTocSwitch?.addEventListener('click', async () => {
  const cur = autoTocSwitch.getAttribute('aria-checked') === 'true';
  const next = !cur;
  autoTocSwitch.setAttribute('aria-checked', String(next));
  await chrome.runtime.sendMessage({
    type: MSG.SETTINGS_PATCH,
    patch: { autoToc: next },
  });
});

zenModeSwitch?.addEventListener('click', async () => {
  const cur = zenModeSwitch.getAttribute('aria-checked') === 'true';
  const next = !cur;
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

// Language Toggle
langToggleBtn?.addEventListener('click', async () => {
  const nextLocale: Locale = currentLocale === 'ar' ? 'en' : 'ar';
  try {
    await chrome.storage.local.set({ sf_ui_locale: nextLocale });
  } catch {
    // fail-soft
  }
  applyLocale(nextLocale);
});

optionsBtn?.addEventListener('click', () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('src/options/options.html'));
  }
});

clearBtn?.addEventListener('click', async () => {
  const t = POPUP_STRINGS[currentLocale];
  const confirmed = window.confirm(t.confirmClear);
  if (confirmed) {
    const res = await chrome.runtime.sendMessage({ type: MSG.CLEAR_POSITIONS });
    const count = res?.ok ? res.data?.cleared ?? 0 : 0;
    alert(t.alertCleared.replace('{count}', String(count)));
  }
});

initPopup();
