// src/background/store.ts — Position persistence with TTL & LRU pruning (FR-16, FR-24, FR-25, FR-36)
import type { ScrollEntry, BookmarkEntry } from '../shared/types';
import { applyTtl, applyLruCap } from '../core/storage-model';

const POS_PREFIX = 'pos:';
const MARKS_PREFIX = 'marks:';

export async function savePosition(entry: ScrollEntry): Promise<void> {
  const key = `${POS_PREFIX}${entry.url}`;
  try {
    await chrome.storage.local.set({ [key]: entry });
  } catch (err) {
    console.error('Failed to save scroll position to storage.local:', err);
  }
}

export async function getPosition(url: string): Promise<ScrollEntry | null> {
  const key = `${POS_PREFIX}${url}`;
  try {
    const res = await chrome.storage.local.get(key);
    return (res?.[key] as ScrollEntry) || null;
  } catch {
    return null;
  }
}

export async function addBookmark(bookmark: BookmarkEntry): Promise<BookmarkEntry> {
  const key = `${MARKS_PREFIX}${bookmark.url}`;
  try {
    const res = await chrome.storage.local.get(key);
    const existing: BookmarkEntry[] = Array.isArray(res?.[key]) ? res[key] : [];
    const filtered = existing.filter((b) => b.id !== bookmark.id);
    filtered.push(bookmark);
    await chrome.storage.local.set({ [key]: filtered });
    return bookmark;
  } catch (err) {
    console.error('Failed to save bookmark to storage.local:', err);
    return bookmark;
  }
}

export async function removeBookmark(url: string, id: string): Promise<boolean> {
  const key = `${MARKS_PREFIX}${url}`;
  try {
    const res = await chrome.storage.local.get(key);
    const existing: BookmarkEntry[] = Array.isArray(res?.[key]) ? res[key] : [];
    const filtered = existing.filter((b) => b.id !== id);
    if (filtered.length === 0) {
      await chrome.storage.local.remove(key);
    } else {
      await chrome.storage.local.set({ [key]: filtered });
    }
    return true;
  } catch (err) {
    console.error('Failed to remove bookmark from storage.local:', err);
    return false;
  }
}

export async function getBookmarks(url: string): Promise<BookmarkEntry[]> {
  const key = `${MARKS_PREFIX}${url}`;
  try {
    const res = await chrome.storage.local.get(key);
    return Array.isArray(res?.[key]) ? res[key] : [];
  } catch {
    return [];
  }
}

export async function clearPositions(): Promise<number> {
  try {
    const all = await chrome.storage.local.get(null);
    const posKeys = Object.keys(all).filter((k) => k.startsWith(POS_PREFIX));
    if (posKeys.length > 0) {
      await chrome.storage.local.remove(posKeys);
    }
    return posKeys.length;
  } catch (err) {
    console.error('Failed to clear positions:', err);
    return 0;
  }
}

export async function prunePositions(): Promise<void> {
  try {
    const all = await chrome.storage.local.get(null);
    const posKeys = Object.keys(all).filter((k) => k.startsWith(POS_PREFIX));
    if (posKeys.length === 0) return;

    const entries: ScrollEntry[] = [];
    for (const k of posKeys) {
      const val = all[k];
      if (val && typeof val === 'object' && 'ts' in val) {
        entries.push(val as ScrollEntry);
      }
    }

    const ttlFiltered = applyTtl(entries, Date.now());
    const capped = applyLruCap(ttlFiltered);
    const validUrls = new Set(capped.map((e) => `${POS_PREFIX}${e.url}`));

    const keysToRemove = posKeys.filter((k) => !validUrls.has(k));
    if (keysToRemove.length > 0) {
      await chrome.storage.local.remove(keysToRemove);
    }
  } catch (err) {
    console.error('Failed to prune storage positions:', err);
  }
}
