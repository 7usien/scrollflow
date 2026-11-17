// src/background/nav-watch.ts — SPA history state navigation watcher (FR-23)
import { MSG } from '../shared/messages';

export function initNavWatch(): void {
  if (chrome.webNavigation) {
    const notifyTab = (details: { frameId: number; tabId: number; url: string }) => {
      if (details.frameId === 0) {
        chrome.tabs
          .sendMessage(details.tabId, {
            type: MSG.NAV_CHANGED,
            url: details.url,
          })
          .catch(() => {
            // Tab content script may not be ready or closed
          });
      }
    };

    if (chrome.webNavigation.onHistoryStateUpdated) {
      chrome.webNavigation.onHistoryStateUpdated.addListener(notifyTab);
    }
  }
}
