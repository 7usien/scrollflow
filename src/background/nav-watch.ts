// src/background/nav-watch.ts — SPA history state navigation watcher (FR-23)
import { MSG } from '../shared/messages';

export function initNavWatch(): void {
  if (chrome.webNavigation && chrome.webNavigation.onHistoryStateUpdated) {
    chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
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
    });
  }
}
