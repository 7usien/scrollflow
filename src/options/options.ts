// src/options/options.ts — Full settings management, blocklist editor, and 9-language i18n
import { MSG } from '../shared/messages';
import type { Settings } from '../shared/types';
import { DEFAULT_SETTINGS } from '../shared/types';
import { sanitizeSettings } from '../shared/settings-schema';
import {
  getDictionary,
  getStoredLocale,
  setStoredLocale,
  resolveActiveLocale,
  type LocaleSetting,
  type SupportedLocale,
} from '../shared/i18n';

let currentSettings: Settings = { ...DEFAULT_SETTINGS };
let currentSetting: LocaleSetting = 'auto';
let currentLocale: SupportedLocale = 'en';

const langSelect = document.getElementById('langSelect') as HTMLSelectElement | null;

const themeSelect = document.getElementById('themeSelect') as HTMLSelectElement | null;
const positionSelect = document.getElementById('positionSelect') as HTMLSelectElement | null;
const lengthSelect = document.getElementById('lengthSelect') as HTMLSelectElement | null;
const radiusSelect = document.getElementById('radiusSelect') as HTMLSelectElement | null;
const contrastSelect = document.getElementById('contrastSelect') as HTMLSelectElement | null;

const blocklistInput = document.getElementById('blocklistInput') as HTMLInputElement | null;
const addBlocklistBtn = document.getElementById('addBlocklistBtn');
const blocklistUl = document.getElementById('blocklistUl');

const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile') as HTMLInputElement | null;
const clearPositionsBtn = document.getElementById('clearPositionsBtn');

// About and Support elements
const shareBtn = document.getElementById('shareBtn');
const shareToast = document.getElementById('shareToast');

function applyLocale(lang: SupportedLocale) {
  currentLocale = lang;
  const dict = getDictionary(lang);

  document.documentElement.lang = lang;
  document.documentElement.dir = dict.dir;
  document.body.dir = dict.dir;

  const t = dict.options;

  const setText = (id: string, text: string) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setText('pageTitle', t.pageTitle);
  setText('pageSubtitle', t.pageSubtitle);

  setText('secGeneral', t.secGeneral);
  setText('titleEnabled', t.titleEnabled);
  setText('descEnabled', t.descEnabled);
  setText('titleRestore', t.titleRestore);
  setText('descRestore', t.descRestore);
  setText('titleCelebrate', t.titleCelebrate);
  setText('descCelebrate', t.descCelebrate);
  setText('titleMilestones', t.titleMilestones);
  setText('descMilestones', t.descMilestones);
  setText('titleHideScrollbar', t.titleHideScrollbar);
  setText('descHideScrollbar', t.descHideScrollbar);
  setText('titleSmoothScroll', t.titleSmoothScroll);
  setText('descSmoothScroll', t.descSmoothScroll);
  setText('titleBookmarks', t.titleBookmarks);
  setText('descBookmarks', t.descBookmarks);
  setText('titleAutoToc', t.titleAutoToc);
  setText('descAutoToc', t.descAutoToc);
  setText('titleZenMode', t.titleZenMode);
  setText('descZenMode', t.descZenMode);
  setText('titleBadge', t.titleBadge);
  setText('descBadge', t.descBadge);
  setText('titleToasts', t.titleToasts);
  setText('descToasts', t.descToasts);
  setText('titleFileUrls', t.titleFileUrls);
  setText('descFileUrls', t.descFileUrls);

  setText('secAppearance', t.secAppearance);
  setText('titleTheme', t.titleTheme);
  setText('descTheme', t.descTheme);
  setText('titlePosition', t.titlePosition);
  setText('descPosition', t.descPosition);
  setText('titleLength', t.titleLength);
  setText('descLength', t.descLength);
  setText('titleRadius', t.titleRadius);
  setText('descRadius', t.descRadius);
  setText('titleShadow', t.titleShadow);
  setText('descShadow', t.descShadow);
  setText('titleContrast', t.titleContrast);
  setText('descContrast', t.descContrast);

  setText('secBlocklist', t.secBlocklist);
  setText('descBlocklist', t.descBlocklist);
  if (blocklistInput) blocklistInput.placeholder = t.blocklistPlaceholder;
  setText('addBlocklistBtn', t.addBlocklist);

  setText('secData', t.secData);
  setText('exportBtn', t.exportBtn);
  setText('importBtn', t.importBtn);
  setText('clearPositionsBtn', t.clearPositionsBtn);

  // About & Support Section
  setText('secAbout', t.secAbout.titleAbout);
  setText('aboutDesc', t.secAbout.descAbout);
  setText('supportTitle', t.secAbout.supportTitle);
  setText('supportDesc', t.secAbout.supportDesc);
  setText('patreonBtnText', t.secAbout.patreonBtn);
  setText('coffeeBtnText', t.secAbout.coffeeBtn);
  setText('emailContactLabel', t.secAbout.emailContactLabel);
  setText('rateShareTitle', t.secAbout.rateShareTitle);
  setText('rateShareDesc', t.secAbout.rateShareDesc);
  setText('rateStoreBtn', t.secAbout.rateStoreBtn);
  setText('shareBtnText', t.secAbout.shareBtn);

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
  updateSelect(contrastSelect, t.contrasts);

  if (langSelect) {
    langSelect.value = currentSetting;
    const autoOpt = langSelect.querySelector('option[value="auto"]');
    if (autoOpt) autoOpt.textContent = `🌐 ${t.langAuto}`;
  }

  renderBlocklist();
}

async function loadOptions() {
  currentSetting = await getStoredLocale();
  currentLocale = resolveActiveLocale(currentSetting);
  applyLocale(currentLocale);

  try {
    const res = await chrome.runtime.sendMessage({ type: MSG.SETTINGS_GET });
    if (res?.ok && res.data) {
      currentSettings = sanitizeSettings(res.data);
    }
  } catch {
    currentSettings = { ...DEFAULT_SETTINGS };
  }

  renderSettings();
  renderBlocklist();
}

function renderSettings() {
  setSwitch('enabledSwitch', currentSettings.enabled);
  setSwitch('restoreSwitch', currentSettings.restoreScroll);
  setSwitch('celebrateSwitch', currentSettings.celebrate);
  setSwitch('milestonesSwitch', currentSettings.milestones);
  setSwitch('hideScrollbarSwitch', currentSettings.hideNativeScrollbar);
  setSwitch('smoothScrollSwitch', currentSettings.smoothScroll);
  setSwitch('bookmarksSwitch', currentSettings.bookmarks !== false);
  setSwitch('autoTocSwitch', currentSettings.autoToc !== false);
  setSwitch('zenModeSwitch', currentSettings.zenMode === true);
  setSwitch('shadowSwitch', currentSettings.shadow !== false);
  setSwitch('badgeSwitch', currentSettings.showBadge);
  setSwitch('toastsSwitch', currentSettings.showToasts);

  if (themeSelect) themeSelect.value = currentSettings.theme;
  if (positionSelect) positionSelect.value = currentSettings.position;
  if (lengthSelect) lengthSelect.value = currentSettings.barLength || 'floating';
  if (radiusSelect) radiusSelect.value = currentSettings.barRadius || 'subtle';
  if (contrastSelect) contrastSelect.value = currentSettings.contrast;

  checkFileUrlPermission();
}

async function checkFileUrlPermission() {
  try {
    const allowed = await chrome.extension.isAllowedFileSchemeAccess();
    setSwitch('fileUrlsSwitch', allowed);
  } catch {
    setSwitch('fileUrlsSwitch', false);
  }
}

function setSwitch(id: string, active: boolean) {
  const el = document.getElementById(id);
  if (!el) return;
  if (active) {
    el.classList.add('active');
    el.setAttribute('aria-checked', 'true');
  } else {
    el.classList.remove('active');
    el.setAttribute('aria-checked', 'false');
  }
}

async function patch(partial: Partial<Settings>) {
  try {
    await chrome.runtime.sendMessage({
      type: MSG.SETTINGS_PATCH,
      patch: partial,
    });
  } catch {
    // fail-soft
  }
}

function bindSwitch(id: string, key: keyof Settings) {
  const el = document.getElementById(id);
  if (!el) return;
  const toggle = async () => {
    const nextVal = !currentSettings[key];
    (currentSettings as unknown as Record<string, unknown>)[key] = nextVal;
    setSwitch(id, nextVal);
    await patch({ [key]: nextVal });
  };
  el.addEventListener('click', toggle);
  el.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle();
    }
  });
}

bindSwitch('enabledSwitch', 'enabled');
bindSwitch('restoreSwitch', 'restoreScroll');
bindSwitch('celebrateSwitch', 'celebrate');
bindSwitch('milestonesSwitch', 'milestones');
bindSwitch('hideScrollbarSwitch', 'hideNativeScrollbar');
bindSwitch('smoothScrollSwitch', 'smoothScroll');
bindSwitch('bookmarksSwitch', 'bookmarks');
bindSwitch('autoTocSwitch', 'autoToc');
bindSwitch('zenModeSwitch', 'zenMode');
bindSwitch('shadowSwitch', 'shadow');
bindSwitch('badgeSwitch', 'showBadge');
bindSwitch('toastsSwitch', 'showToasts');

document.getElementById('fileUrlsSwitch')?.addEventListener('click', () => {
  chrome.tabs.create({ url: 'chrome://extensions/?id=' + chrome.runtime.id });
});

themeSelect?.addEventListener('change', async (e) => {
  const val = (e.target as HTMLSelectElement).value as Settings['theme'];
  currentSettings.theme = val;
  await patch({ theme: val });
});

positionSelect?.addEventListener('change', async (e) => {
  const val = (e.target as HTMLSelectElement).value as Settings['position'];
  currentSettings.position = val;
  await patch({ position: val });
});

lengthSelect?.addEventListener('change', async (e) => {
  const val = (e.target as HTMLSelectElement).value as Settings['barLength'];
  currentSettings.barLength = val;
  await patch({ barLength: val });
});

radiusSelect?.addEventListener('change', async (e) => {
  const val = (e.target as HTMLSelectElement).value as Settings['barRadius'];
  currentSettings.barRadius = val;
  await patch({ barRadius: val });
});

contrastSelect?.addEventListener('change', async (e) => {
  const val = (e.target as HTMLSelectElement).value as Settings['contrast'];
  currentSettings.contrast = val;
  await patch({ contrast: val });
});

function renderBlocklist() {
  if (!blocklistUl) return;
  blocklistUl.innerHTML = '';
  const dict = getDictionary(currentLocale);

  for (const host of currentSettings.blocklist) {
    const li = document.createElement('li');
    li.className = 'blocklist-item';

    const span = document.createElement('span');
    span.textContent = host;

    const btn = document.createElement('button');
    btn.className = 'btn-remove';
    btn.textContent = dict.options.removeBlocklist;
    btn.setAttribute('aria-label', `${dict.options.removeBlocklist} ${host}`);
    btn.addEventListener('click', async () => {
      currentSettings.blocklist = currentSettings.blocklist.filter((h) => h !== host);
      await patch({ blocklist: currentSettings.blocklist });
      renderBlocklist();
    });

    li.appendChild(span);
    li.appendChild(btn);
    blocklistUl.appendChild(li);
  }
}

addBlocklistBtn?.addEventListener('click', async () => {
  if (!blocklistInput) return;
  const raw = blocklistInput.value.trim().toLowerCase();
  if (!raw) return;

  const clean = raw.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
  if (clean && !currentSettings.blocklist.includes(clean)) {
    currentSettings.blocklist.push(clean);
    await patch({ blocklist: currentSettings.blocklist });
    renderBlocklist();
  }
  blocklistInput.value = '';
});

blocklistInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addBlocklistBtn?.click();
  }
});

// Language Select listener
langSelect?.addEventListener('change', async () => {
  const val = (langSelect.value || 'auto') as LocaleSetting;
  currentSetting = val;
  await setStoredLocale(val);
  const effective = resolveActiveLocale(val);
  applyLocale(effective);
});

// Share button click handler
shareBtn?.addEventListener('click', async () => {
  const shareUrl = 'https://chromewebstore.google.com/detail/scrollflow';
  try {
    await navigator.clipboard.writeText(shareUrl);
    if (shareToast) {
      const dict = getDictionary(currentLocale);
      shareToast.textContent = dict.options.secAbout.shareCopied;
      shareToast.style.display = 'inline-block';
      setTimeout(() => {
        if (shareToast) shareToast.style.display = 'none';
      }, 3000);
    }
  } catch {
    // Fail soft if clipboard restricted
  }
});

// Export JSON
exportBtn?.addEventListener('click', () => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentSettings, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute('href', dataStr);
  dlAnchor.setAttribute('download', 'scrollflow-settings.json');
  dlAnchor.click();
  dlAnchor.remove();
});

// Import JSON
importBtn?.addEventListener('click', () => {
  importFile?.click();
});

importFile?.addEventListener('change', (e) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const dict = getDictionary(currentLocale);
  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const content = event.target?.result as string;
      const parsed = JSON.parse(content);
      const sanitized = sanitizeSettings(parsed);
      await patch(sanitized);
      currentSettings = sanitized;
      renderSettings();
      renderBlocklist();
      alert(dict.options.alertImportSuccess);
    } catch {
      alert(dict.options.alertImportError);
    }
  };
  reader.readAsText(file);
});

// Clear positions
clearPositionsBtn?.addEventListener('click', async () => {
  const dict = getDictionary(currentLocale);
  if (confirm(dict.options.confirmClear)) {
    const res = await chrome.runtime.sendMessage({ type: MSG.CLEAR_POSITIONS });
    const count = res?.ok ? res.data?.cleared ?? 0 : 0;
    alert(dict.options.alertCleared.replace('{n}', String(count)));
  }
});

loadOptions();
