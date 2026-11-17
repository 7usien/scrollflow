// src/content/ui/markers.ts — Vertical navigation dots, TOC ticks, and preview cards along the scrollbar rail
import type { BookmarkEntry, TocEntry } from '../../shared/types';
import { truncateSnippet, BOOKMARK_COLORS } from '../../core/bookmarks';

export interface MarkersCallbacks {
  onJumpToBookmark: (bookmark: BookmarkEntry) => void;
  onDeleteBookmark: (id: string) => void;
  onJumpToToc?: (entry: TocEntry) => void;
  isRTL?: () => boolean;
}

export interface MarkersController {
  render: (bookmarks: BookmarkEntry[]) => void;
  renderToc: (tocEntries: TocEntry[]) => void;
  highlight: (id: string | null) => void;
  highlightToc: (id: string | null) => void;
  destroy: () => void;
}

export function createMarkersManager(
  railElement: HTMLElement,
  callbacks: MarkersCallbacks
): MarkersController {
  let currentBookmarks: BookmarkEntry[] = [];
  const markerElements = new Map<string, HTMLElement>();
  const tocElements = new Map<string, HTMLElement>();

  // Single shared card for previewing hovered marker or TOC entry
  const card = document.createElement('div');
  card.className = 'sf-marker-card';
  card.setAttribute('data-testid', 'marker-card');
  card.setAttribute('data-show', 'false');

  const textEl = document.createElement('div');
  textEl.className = 'sf-marker-card-text';
  card.appendChild(textEl);

  const footerEl = document.createElement('div');
  footerEl.className = 'sf-marker-card-footer';

  const pctSpan = document.createElement('span');
  pctSpan.textContent = '0%';
  footerEl.appendChild(pctSpan);

  const actionsEl = document.createElement('div');
  actionsEl.style.display = 'flex';
  actionsEl.style.gap = '4px';

  const jumpBtn = document.createElement('button');
  jumpBtn.type = 'button';
  jumpBtn.className = 'sf-marker-card-btn';
  jumpBtn.textContent = 'انتقال ↗';
  actionsEl.appendChild(jumpBtn);

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'sf-marker-card-btn delete';
  deleteBtn.textContent = 'حذف 🗑️';
  actionsEl.appendChild(deleteBtn);

  footerEl.appendChild(actionsEl);
  card.appendChild(footerEl);
  railElement.appendChild(card);

  let activeBookmark: BookmarkEntry | null = null;
  let activeToc: TocEntry | null = null;
  let hideCardTimer: ReturnType<typeof setTimeout> | null = null;

  const showCard = (bookmark: BookmarkEntry) => {
    if (hideCardTimer) clearTimeout(hideCardTimer);
    activeBookmark = bookmark;
    activeToc = null;

    const isRtl = callbacks.isRTL?.();
    jumpBtn.textContent = isRtl ? 'انتقال ↗' : 'Jump ↗';
    deleteBtn.textContent = isRtl ? 'حذف 🗑️' : 'Delete 🗑️';
    deleteBtn.style.display = 'inline-flex';

    textEl.textContent = truncateSnippet(bookmark.text, 140);
    const pct = Math.round(bookmark.scrollRatio * 100);
    pctSpan.textContent = `${pct}%`;

    card.style.setProperty('--sf-marker-progress', bookmark.scrollRatio.toString());
    card.setAttribute('data-show', 'true');
  };

  const showTocCard = (toc: TocEntry) => {
    if (hideCardTimer) clearTimeout(hideCardTimer);
    activeToc = toc;
    activeBookmark = null;

    const isRtl = callbacks.isRTL?.();
    jumpBtn.textContent = isRtl ? 'انتقال ↗' : 'Jump ↗';
    deleteBtn.style.display = 'none';

    textEl.textContent = `[H${toc.level}] ${truncateSnippet(toc.text, 120)}`;
    const pct = Math.round(toc.scrollRatio * 100);
    pctSpan.textContent = `${pct}%`;

    card.style.setProperty('--sf-marker-progress', toc.scrollRatio.toString());
    card.setAttribute('data-show', 'true');
  };

  const scheduleHideCard = () => {
    hideCardTimer = setTimeout(() => {
      card.setAttribute('data-show', 'false');
      activeBookmark = null;
      activeToc = null;
    }, 200);
  };

  card.addEventListener('mouseenter', () => {
    if (hideCardTimer) clearTimeout(hideCardTimer);
  });
  card.addEventListener('mouseleave', scheduleHideCard);

  jumpBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (activeBookmark) {
      callbacks.onJumpToBookmark(activeBookmark);
    } else if (activeToc && callbacks.onJumpToToc) {
      callbacks.onJumpToToc(activeToc);
    }
    card.setAttribute('data-show', 'false');
  });

  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (activeBookmark) {
      callbacks.onDeleteBookmark(activeBookmark.id);
    }
    card.setAttribute('data-show', 'false');
  });

  const clearDots = () => {
    for (const el of markerElements.values()) {
      el.remove();
    }
    markerElements.clear();
  };

  const clearTocTicks = () => {
    for (const el of tocElements.values()) {
      el.remove();
    }
    tocElements.clear();
  };

  const render = (bookmarks: BookmarkEntry[]) => {
    currentBookmarks = bookmarks;
    clearDots();

    for (const b of currentBookmarks) {
      const dot = document.createElement('div');
      dot.className = 'sf-marker';
      dot.setAttribute('data-testid', `marker-${b.id}`);
      dot.setAttribute('title', b.title || b.text.slice(0, 30));
      dot.style.setProperty('--sf-marker-progress', b.scrollRatio.toString());

      const colorHex = b.color ? BOOKMARK_COLORS[b.color]?.hex : undefined;
      if (colorHex) {
        dot.style.setProperty('--sf-marker-color', colorHex);
      }

      dot.addEventListener('mouseenter', () => showCard(b));
      dot.addEventListener('mouseleave', scheduleHideCard);

      dot.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
      });

      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        callbacks.onJumpToBookmark(b);
      });

      railElement.appendChild(dot);
      markerElements.set(b.id, dot);
    }
  };

  const renderToc = (entries: TocEntry[]) => {
    clearTocTicks();

    for (const t of entries) {
      const tick = document.createElement('div');
      tick.className = 'sf-toc-tick';
      tick.setAttribute('data-testid', `toc-tick-${t.id}`);
      tick.setAttribute('data-level', String(t.level));
      tick.style.setProperty('--sf-toc-progress', t.scrollRatio.toString());
      tick.setAttribute('title', `[H${t.level}] ${t.text}`);

      tick.addEventListener('mouseenter', () => showTocCard(t));
      tick.addEventListener('mouseleave', scheduleHideCard);

      tick.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
      });

      tick.addEventListener('click', (e) => {
        e.stopPropagation();
        callbacks.onJumpToToc?.(t);
      });

      railElement.appendChild(tick);
      tocElements.set(t.id, tick);
    }
  };

  const highlight = (id: string | null) => {
    for (const [markId, el] of markerElements.entries()) {
      if (id && markId === id) {
        el.setAttribute('data-active', 'true');
      } else {
        el.removeAttribute('data-active');
      }
    }
  };

  const highlightToc = (id: string | null) => {
    for (const [tocId, el] of tocElements.entries()) {
      if (id && tocId === id) {
        el.setAttribute('data-active', 'true');
      } else {
        el.removeAttribute('data-active');
      }
    }
  };

  const destroy = () => {
    if (hideCardTimer) clearTimeout(hideCardTimer);
    clearDots();
    clearTocTicks();
    card.remove();
  };

  return {
    render,
    renderToc,
    highlight,
    highlightToc,
    destroy,
  };
}
