// src/background/service-worker.ts — Central message router, state manager, and commands
import { MSG, type Req } from '../shared/messages';
import type { Metrics } from '../shared/types';
import { getSettings, patchSettings, listenSettingsSync } from './settings';
import { savePosition, getPosition, clearPositions, prunePositions, addBookmark, removeBookmark, getBookmarks } from './store';
import { updateBadge, clearTabBadge } from './badge';
import { initNavWatch } from './nav-watch';

interface TabStateCache {
  percent: number;
  metrics: Metrics | null;
  scrollable: boolean;
  url: string;
}

const tabStates = new Map<number, TabStateCache>();

// Initialize modules
listenSettingsSync();
initNavWatch();

// Handle messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tabId = sender.tab?.id;

  const handle = async () => {
    switch (message.type) {
      case MSG.PROGRESS_UPDATE: {
        const payload = message as Req[typeof MSG.PROGRESS_UPDATE];
        if (tabId !== undefined) {
          tabStates.set(tabId, {
            percent: payload.percent,
            metrics: payload.metrics,
            scrollable: payload.scrollable,
            url: payload.url,
          });
          const settings = await getSettings();
          if (settings.showBadge) {
            updateBadge(tabId, payload.percent, payload.scrollable);
          } else {
            clearTabBadge(tabId);
          }
        }
        return { ok: true, data: null };
      }

      case MSG.GET_TAB_STATE: {
        const payload = message as Req[typeof MSG.GET_TAB_STATE];
        const targetTabId = payload.tabId;
        const state = tabStates.get(targetTabId);
        const settings = await getSettings();

        let siteEnabled = settings.enabled;
        if (state?.url) {
          try {
            const host = new URL(state.url).hostname.replace(/^www\./, '');
            if (settings.blocklist.some((b) => b === host || host.endsWith(`.${b}`))) {
              siteEnabled = false;
            }
          } catch {
            // Invalid URL
          }
        }

        return {
          ok: true,
          data: {
            percent: state?.percent ?? 0,
            metrics: state?.metrics ?? null,
            siteEnabled,
            settings,
          },
        };
      }

      case MSG.SETTINGS_GET: {
        const settings = await getSettings();
        return { ok: true, data: settings };
      }

      case MSG.SETTINGS_PATCH: {
        const payload = message as Req[typeof MSG.SETTINGS_PATCH];
        const updated = await patchSettings(payload.patch);
        return { ok: true, data: updated };
      }

      case MSG.SITE_TOGGLE: {
        const payload = message as Req[typeof MSG.SITE_TOGGLE];
        const settings = await getSettings();
        const normHost = payload.hostname.toLowerCase().replace(/^www\./, '');
        let newBlocklist = [...settings.blocklist];

        if (payload.enabled) {
          // Remove from blocklist
          newBlocklist = newBlocklist.filter((h) => h !== normHost);
        } else {
          // Add to blocklist if not present
          if (!newBlocklist.includes(normHost)) {
            newBlocklist.push(normHost);
          }
        }

        const updated = await patchSettings({ blocklist: newBlocklist });
        return { ok: true, data: updated };
      }

      case MSG.SAVE_POSITION: {
        const payload = message as Req[typeof MSG.SAVE_POSITION];
        await savePosition(payload);
        return { ok: true, data: null };
      }

      case MSG.GET_POSITION: {
        const payload = message as Req[typeof MSG.GET_POSITION];
        const entry = await getPosition(payload.url);
        return { ok: true, data: entry };
      }

      case MSG.CLEAR_POSITIONS: {
        const cleared = await clearPositions();
        return { ok: true, data: { cleared } };
      }

      case MSG.BOOKMARK_ADD: {
        const payload = message as Req[typeof MSG.BOOKMARK_ADD];
        const saved = await addBookmark(payload.bookmark);
        return { ok: true, data: saved };
      }

      case MSG.BOOKMARK_REMOVE: {
        const payload = message as Req[typeof MSG.BOOKMARK_REMOVE];
        const removed = await removeBookmark(payload.url, payload.id);
        return { ok: true, data: { removed } };
      }

      case MSG.BOOKMARK_GET: {
        const payload = message as Req[typeof MSG.BOOKMARK_GET];
        const bookmarks = await getBookmarks(payload.url);
        return { ok: true, data: bookmarks };
      }

      default:
        return { ok: false, error: `Unknown message type: ${message.type}` };
    }
  };

  handle()
    .then((res) => sendResponse(res))
    .catch((err) => sendResponse({ ok: false, error: String(err) }));

  return true; // Keep message channel open for async response
});

// Commands shortcut listener (Alt+Shift+P)
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-overlay') {
    try {
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (activeTab?.id !== undefined) {
        chrome.tabs.sendMessage(activeTab.id, { type: MSG.TOGGLE_OVERLAY }).catch(() => {});
      }
    } catch {
      // Ignore
    }
  }
});

// Clean up tab state when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  tabStates.delete(tabId);
  clearTabBadge(tabId);
});

// Prune old positions on startup and install
chrome.runtime.onStartup.addListener(() => {
  prunePositions().catch(() => {});
});

chrome.runtime.onInstalled.addListener(() => {
  prunePositions().catch(() => {});
});
