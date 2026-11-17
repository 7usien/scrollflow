// src/options/options.ts — Full settings management, blocklist editor, and bilingual localization (FR-27, FR-29)
import { MSG } from '../shared/messages';
import type { Contrast, Settings, Side, Position, Theme, BarLength, BarRadius } from '../shared/types';
import { DEFAULT_SETTINGS } from '../shared/types';
import { sanitizeSettings } from '../shared/settings-schema';

type Locale = 'ar' | 'en';

let currentSettings: Settings = { ...DEFAULT_SETTINGS };
let currentLocale: Locale = 'ar';

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
const langToggleBtn = document.getElementById('langToggleBtn');

const STRINGS = {
  ar: {
    pageTitle: 'ScrollFlow — الإعدادات',
    pageSubtitle: 'تخصيص مؤشر القراءة، الاستعادة، والاحتفال',
    langToggle: '🌐 English',
    secGeneral: 'عام',
    titleEnabled: 'تفعيل الإضافة بشكل عام',
    descEnabled: 'إظهار أو إخفاء المؤشر على جميع المواقع',
    titleRestore: 'استعادة موضع التمرير',
    descRestore: 'العودة تلقائيًا إلى حيث توقفت عند إعادة فتح الصفحة',
    titleCelebrate: 'احتفال عند الإكمال',
    descCelebrate: 'إطلاق Confetti خفيف عند الوصول لنهاية الصفحة',
    titleMilestones: 'نبضات المحطات',
    descMilestones: 'نبضة خفيفة على الشريط عند اجتياز 25% و 50% و 75%',
    titleHideScrollbar: 'إخفاء شريط المتصفح الأصلي',
    descHideScrollbar: 'إخفاء شريط التمرير التقليدي لنظام التشغيل واستخدام ScrollFlow بدلاً منه',
    titleSmoothScroll: 'التصفح السلس للصفحة',
    descSmoothScroll: 'جعل التمرير والتنقل بين أقسام الصفحة سلسًا وانسيابيًا (Smooth Scrolling)',
    titleBookmarks: 'هوامش ونقاط الصفحة',
    descBookmarks: 'إظهار خيار إضافة هامش عند تظليل النص وعرض نقاط التنقل على الشريط',
    titleAutoToc: 'فهرس العناوين التلقائي',
    descAutoToc: 'توليد نقاط وعلامات على الشريط بناءً على عناوين الصفحة (H1..H3) تلقائيًا',
    titleZenMode: 'وضع القراءة الهادئ (Zen Mode)',
    descZenMode: 'تلاشي وإخفاء الشريط تلقائيًا عند التوقف عن التمرير لإتاحة قراءة خالية من المشتتات',
    titleBadge: 'إظهار النسبة على الأيقونة',
    descBadge: 'عرض نسبة التقدّم الحالية على أيقونة الإضافة',
    titleToasts: 'التلميحات النصية',
    descToasts: 'إظهار إشعارات عند الاستعادة أو الإكمال',
    titleFileUrls: 'السماح لصفحات الملفات المحلية',
    descFileUrls: 'تشغيل الإضافة على روابط file://',
    secAppearance: 'المظهر والتخطيط',
    titleTheme: 'الستايل والثيم اللوني',
    descTheme: 'تدرّج ومظهر شريط القراءة',
    titlePosition: 'موضع وتخطيط الشريط',
    descPosition: 'اختيار الموضع الرأسي أو الأفقي للشريط',
    titleLength: 'امتداد وطول الشريط',
    descLength: 'كامل بنسبة 100% (بارتفاع أو عرض الشاشة كاملاً) أو عائم متمركز (60%)',
    titleRadius: 'انحناء زوايا الشريط',
    descRadius: 'تحديد شكل الحواف والزوايا للشريط والمؤشر',
    titleShadow: 'إظهار الظل والتوهج',
    descShadow: 'تفعيل الظل الزجاجي العائم وتوهج المؤشر أو استخدام مظهر مسطح (Flat)',
    titleContrast: 'مستوى التباين',
    descContrast: 'وضوح المسار على الخلفيات المختلفة',
    secBlocklist: 'المواقع المستثناة (Blocklist)',
    descBlocklist: 'المواقع التي لا يظهر فيها الشريط. يدعم النطاقات المباشرة مثل example.com أو النطاقات الفرعية مثل *.example.com.',
    blocklistPlaceholder: 'أدخل النطاق (مثال: docs.google.com)',
    addBlocklist: 'إضافة',
    removeBlocklist: 'إزالة',
    secData: 'إدارة البيانات',
    exportBtn: 'تصدير الإعدادات (JSON)',
    importBtn: 'استيراد الإعدادات',
    clearPositionsBtn: 'مسح بيانات التمرير المحفوظة',
    confirmClear: 'هل أنت متأكد من مسح جميع بيانات التمرير المحفوظة؟',
    alertCleared: 'تم مسح {n} موضع محفوظ.',
    alertImportSuccess: 'تم استيراد الإعدادات بنجاح.',
    alertImportError: 'الملف غير صالح أو تالف.',
    themes: {
      aurora: 'Aurora (تدرج كوني)',
      sunset: 'Sunset (غروب دافئ)',
      cyberpunk: 'Cyberpunk (نيون متوهج)',
      minimal: 'Minimal (نحيف وبسيط)',
      glass: 'Glass Pill (كبسولة زجاجية)',
      mono: 'Mono (رمادي كلاسيكي)',
    },
    positions: {
      right: 'يمين الشاشة (رأسي)',
      left: 'يسار الشاشة (رأسي)',
      top: 'أعلى الشاشة (أفقي)',
      bottom: 'أسفل الشاشة (أفقي)',
    },
    lengths: {
      floating: 'عائم متمركز (60%)',
      full: 'كامل 100% (امتداد كامل)',
    },
    radii: {
      subtle: 'دائرية خفيفة (6px - دائرية بعض الشيء)',
      pill: 'كبسولة دائرية كاملة (999px)',
      sharp: 'مستطيلة حادة (2px)',
    },
    contrasts: {
      normal: 'عادي',
      high: 'تباين عالٍ',
    },
  },
  en: {
    pageTitle: 'ScrollFlow — Settings',
    pageSubtitle: 'Customize reading progress, restoration, and celebration',
    langToggle: '🌐 العربية',
    secGeneral: 'General',
    titleEnabled: 'Enable extension globally',
    descEnabled: 'Show or hide reading indicator across all websites',
    titleRestore: 'Restore scroll position',
    descRestore: 'Automatically return to where you left off when reopening a page',
    titleCelebrate: 'Celebrate on complete',
    descCelebrate: 'Burst celebratory confetti upon reaching the bottom of a page',
    titleMilestones: 'Milestone pulses',
    descMilestones: 'Subtle rail pulse when crossing 25%, 50%, and 75%',
    titleHideScrollbar: 'Hide native scrollbar',
    descHideScrollbar: 'Hide OS default scrollbar and rely exclusively on ScrollFlow',
    titleSmoothScroll: 'Smooth page scrolling',
    descSmoothScroll: 'Make page scrolling and in-page anchor jumps silky smooth',
    titleBookmarks: 'Page margins & bookmarks',
    descBookmarks: 'Show bookmark bubble on text highlight and display rail navigation dots',
    titleAutoToc: 'Auto Table of Contents',
    descAutoToc: 'Automatically generate rail markers based on page headings (H1..H3)',
    titleZenMode: 'Zen Mode (Auto-Hide)',
    descZenMode: 'Smoothly fade out progress rail when idle to provide distraction-free reading',
    titleBadge: 'Show badge on icon',
    descBadge: 'Display current reading percentage badge on the extension toolbar icon',
    titleToasts: 'Toast notifications',
    descToasts: 'Show brief notifications on restoration or page completion',
    titleFileUrls: 'Allow on local file URLs',
    descFileUrls: 'Enable extension features on file:// URLs',
    secAppearance: 'Appearance & Layout',
    titleTheme: 'Theme & color palette',
    descTheme: 'Gradient styling and aesthetic theme of the progress bar',
    titlePosition: 'Bar position & layout',
    descPosition: 'Select vertical side or horizontal top/bottom placement',
    titleLength: 'Bar length',
    descLength: 'Full 100% (full height/width) or centered floating capsule (60%)',
    titleRadius: 'Corner radius',
    descRadius: 'Define corner curvature for the rail and thumb',
    titleShadow: 'Show shadow & glow',
    descShadow: 'Enable frosted glass shadow and thumb glow or use flat mode',
    titleContrast: 'Contrast level',
    descContrast: 'Visibility and contrast of the rail on varied backgrounds',
    secBlocklist: 'Excluded Sites (Blocklist)',
    descBlocklist: 'Sites where ScrollFlow overlay is disabled. Supports direct domains like example.com or wildcards like *.example.com.',
    blocklistPlaceholder: 'Enter domain (e.g. docs.google.com)',
    addBlocklist: 'Add',
    removeBlocklist: 'Remove',
    secData: 'Data Management',
    exportBtn: 'Export settings (JSON)',
    importBtn: 'Import settings',
    clearPositionsBtn: 'Clear saved scroll positions',
    confirmClear: 'Are you sure you want to clear all saved scroll positions?',
    alertCleared: 'Cleared {n} saved positions.',
    alertImportSuccess: 'Settings imported successfully.',
    alertImportError: 'Invalid or corrupted settings file.',
    themes: {
      aurora: 'Aurora (Cosmic Gradient)',
      sunset: 'Sunset (Warm Coral)',
      cyberpunk: 'Cyberpunk (Neon Glow)',
      minimal: 'Minimal (Sleek Slate)',
      glass: 'Glass Pill (Frosted Capsule)',
      mono: 'Mono (Classic Gray)',
    },
    positions: {
      right: 'Right Screen (Vertical)',
      left: 'Left Screen (Vertical)',
      top: 'Top Screen (Horizontal)',
      bottom: 'Bottom Screen (Horizontal)',
    },
    lengths: {
      floating: 'Centered Floating (60%)',
      full: 'Full 100% (Full Height/Width)',
    },
    radii: {
      subtle: 'Subtle Rounded (6px)',
      pill: 'Full Capsule (999px)',
      sharp: 'Sharp Rectangle (2px)',
    },
    contrasts: {
      normal: 'Normal',
      high: 'High Contrast',
    },
  },
};

function applyLocale(lang: Locale) {
  currentLocale = lang;
  const isRTL = lang === 'ar';
  document.documentElement.lang = lang;
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.body.dir = isRTL ? 'rtl' : 'ltr';

  const t = STRINGS[lang];

  const setText = (id: string, text: string) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setText('pageTitle', t.pageTitle);
  setText('pageSubtitle', t.pageSubtitle);
  setText('langToggleBtn', t.langToggle);

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

  renderBlocklist();
}

async function loadOptions() {
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

  const t = STRINGS[currentLocale];

  for (const domain of currentSettings.blocklist) {
    const li = document.createElement('li');
    li.className = 'blocklist-item';

    const span = document.createElement('span');
    span.textContent = domain;
    li.appendChild(span);

    const btn = document.createElement('button');
    btn.className = 'btn-remove';
    btn.textContent = t.removeBlocklist;
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
bindSwitch('bookmarksSwitch', 'bookmarks');
bindSwitch('autoTocSwitch', 'autoToc');
bindSwitch('zenModeSwitch', 'zenMode');
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

// Language Switcher
langToggleBtn?.addEventListener('click', async () => {
  const nextLocale: Locale = currentLocale === 'ar' ? 'en' : 'ar';
  try {
    await chrome.storage.local.set({ sf_ui_locale: nextLocale });
  } catch {
    // fail-soft
  }
  applyLocale(nextLocale);
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

  const t = STRINGS[currentLocale];
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
      alert(t.alertImportSuccess);
    } catch {
      alert(t.alertImportError);
    }
  };
  reader.readAsText(file);
});

// Clear positions
clearPositionsBtn?.addEventListener('click', async () => {
  const t = STRINGS[currentLocale];
  if (confirm(t.confirmClear)) {
    const res = await chrome.runtime.sendMessage({ type: MSG.CLEAR_POSITIONS });
    const count = res?.ok ? res.data?.cleared ?? 0 : 0;
    alert(t.alertCleared.replace('{n}', String(count)));
  }
});

loadOptions();
