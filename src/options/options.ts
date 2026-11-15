// src/options/options.ts — Full settings management and blocklist editor (FR-27, FR-29)
import { MSG } from '../shared/messages';
import type { Contrast, Settings, Side, Position, Theme, BarLength, BarRadius } from '../shared/types';
import { DEFAULT_SETTINGS } from '../shared/types';
import { sanitizeSettings } from '../shared/settings-schema';

let currentSettings: Settings = { ...DEFAULT_SETTINGS };

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

async function loadOptions() {
  const isArabic = navigator.language.startsWith('ar');
  document.body.dir = isArabic ? 'rtl' : 'ltr';

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
  setSwitch('shadowSwitch', currentSettings.shadow !== false);
  setSwitch('badgeSwitch', currentSettings.showBadge);
  setSwitch('toastsSwitch', currentSettings.showToasts);
  setSwitch('fileUrlsSwitch', currentSettings.allowFileUrls);

  if (themeSelect) themeSelect.value = currentSettings.theme;
  if (positionSelect) {
    positionSelect.value = currentSettings.position || (currentSettings.side === 'left' ? 'left' : 'right');
  }
  if (lengthSelect) lengthSelect.value = currentSettings.barLength || 'floating';
  if (radiusSelect) radiusSelect.value = currentSettings.barRadius || 'subtle';
  if (contrastSelect) contrastSelect.value = currentSettings.contrast;
}

function setSwitch(id: string, value: boolean) {
  const el = document.getElementById(id);
  if (el) {
    el.setAttribute('aria-checked', String(value));
  }
}

async function patch(partial: Partial<Settings>) {
  currentSettings = { ...currentSettings, ...partial };
  try {
    await chrome.runtime.sendMessage({
      type: MSG.SETTINGS_PATCH,
      patch: partial,
    });
  } catch (err) {
    console.error('Failed to patch settings:', err);
  }
}

function renderBlocklist() {
  if (!blocklistUl) return;
  blocklistUl.innerHTML = '';

  for (const domain of currentSettings.blocklist) {
    const li = document.createElement('li');
    li.className = 'blocklist-item';

    const span = document.createElement('span');
    span.textContent = domain;
    li.appendChild(span);

    const btn = document.createElement('button');
    btn.className = 'btn-remove';
    btn.textContent = 'إزالة';
    btn.addEventListener('click', async () => {
      const updated = currentSettings.blocklist.filter((d) => d !== domain);
      await patch({ blocklist: updated });
      renderBlocklist();
    });
    li.appendChild(btn);

    blocklistUl.appendChild(li);
  }
}

// ── Event Bindings ──
function bindSwitch(id: string, key: keyof Settings) {
  const el = document.getElementById(id);
  el?.addEventListener('click', async () => {
    const cur = el.getAttribute('aria-checked') === 'true';
    const next = !cur;
    el.setAttribute('aria-checked', String(next));
    await patch({ [key]: next });
  });
}

bindSwitch('enabledSwitch', 'enabled');
bindSwitch('restoreSwitch', 'restoreScroll');
bindSwitch('celebrateSwitch', 'celebrate');
bindSwitch('milestonesSwitch', 'milestones');
bindSwitch('hideScrollbarSwitch', 'hideNativeScrollbar');
bindSwitch('smoothScrollSwitch', 'smoothScroll');
bindSwitch('shadowSwitch', 'shadow');
bindSwitch('badgeSwitch', 'showBadge');
bindSwitch('toastsSwitch', 'showToasts');
bindSwitch('fileUrlsSwitch', 'allowFileUrls');

themeSelect?.addEventListener('change', () => {
  patch({ theme: themeSelect.value as Theme });
});

positionSelect?.addEventListener('change', () => {
  const newPos = positionSelect.value as Position;
  const newSide: Side = newPos === 'left' ? 'left' : 'right';
  const newOrientation = newPos === 'top' || newPos === 'bottom' ? 'horizontal' : 'vertical';
  patch({ position: newPos, side: newSide, orientation: newOrientation });
});

lengthSelect?.addEventListener('change', () => {
  patch({ barLength: lengthSelect?.value as BarLength });
});

radiusSelect?.addEventListener('change', () => {
  patch({ barRadius: radiusSelect?.value as BarRadius });
});

contrastSelect?.addEventListener('change', () => {
  patch({ contrast: contrastSelect.value as Contrast });
});

addBlocklistBtn?.addEventListener('click', async () => {
  if (!blocklistInput) return;
  const val = blocklistInput.value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  if (!val) return;

  if (!currentSettings.blocklist.includes(val)) {
    const updated = [...currentSettings.blocklist, val];
    await patch({ blocklist: updated });
    renderBlocklist();
    blocklistInput.value = '';
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
      alert('تم استيراد الإعدادات بنجاح.');
    } catch {
      alert('الملف غير صالح أو تالف.');
    }
  };
  reader.readAsText(file);
});

// Clear positions
clearPositionsBtn?.addEventListener('click', async () => {
  if (confirm('هل أنت متأكد من مسح جميع بيانات التمرير المحفوظة؟')) {
    const res = await chrome.runtime.sendMessage({ type: MSG.CLEAR_POSITIONS });
    const count = res?.ok ? res.data?.cleared ?? 0 : 0;
    alert(`تم مسح ${count} موضع محفوظ.`);
  }
});

loadOptions();
