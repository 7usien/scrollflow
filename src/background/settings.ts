// src/background/settings.ts — Settings persistence and broadcast (FR-30)
import { DEFAULT_SETTINGS, type Settings } from '../shared/types';
import { sanitizeSettings } from '../shared/settings-schema';
import { MSG } from '../shared/messages';

let cachedSettings: Settings | null = null;

export async function getSettings(): Promise<Settings> {
  if (cachedSettings) return cachedSettings;

  try {
    const res = await chrome.storage.sync.get('settings');
    cachedSettings = sanitizeSettings(res?.settings);
    return cachedSettings;
  } catch {
    cachedSettings = { ...DEFAULT_SETTINGS };
    return cachedSettings;
  }
}

export async function patchSettings(patch: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const updated = sanitizeSettings({ ...current, ...patch });

  try {
    await chrome.storage.sync.set({ settings: updated });
    cachedSettings = updated;
  } catch (err) {
    console.error('Failed to save settings to chrome.storage.sync:', err);
  }

  await broadcastSettings(updated);
  return updated;
}

export async function broadcastSettings(settings: Settings): Promise<void> {
  try {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (tab.id !== undefined) {
        chrome.tabs.sendMessage(tab.id, {
          type: MSG.SETTINGS_CHANGED,
          settings,
        }).catch(() => {
          // Tab might not have a content script loaded or is closing — silent ignore
        });
      }
    }
  } catch {
    // Ignore tab query failures
  }
}

export function listenSettingsSync(): void {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.settings) {
      cachedSettings = sanitizeSettings(changes.settings.newValue);
    }
  });
}
