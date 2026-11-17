// src/content/ui/markers.ts — Vertical navigation dots and preview cards along the scrollbar rail
import type { BookmarkEntry } from '../../shared/types';
import { truncateSnippet } from '../../core/bookmarks';

export interface MarkersCallbacks {
  onJumpToBookmark: (bookmark: BookmarkEntry) => void;
  onDeleteBookmark: (id: string) => void;
  isRTL?: () => boolean;
}

export interface MarkersController {
  render: (bookmarks: BookmarkEntry[]) => void;
  destroy: () => void;
}

export function createMarkersManager(
  railElement: HTMLElement,
  callbacks: MarkersCallbacks
): MarkersController {
  let currentBookmarks: BookmarkEntry[] = [];
  const markerElements = new Map<string, HTMLElement>();

  // Single shared card for previewing hovered marker
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
  let hideCardTimer: ReturnType<typeof setTimeout> | null = null;

  const showCard = (bookmark: BookmarkEntry) => {
    if (hideCardTimer) clearTimeout(hideCardTimer);
    activeBookmark = bookmark;

    const isRtl = callbacks.isRTL?.();
    jumpBtn.textContent = isRtl ? 'انتقال ↗' : 'Jump ↗';
    deleteBtn.textContent = isRtl ? 'حذف 🗑️' : 'Delete 🗑️';

    textEl.textContent = truncateSnippet(bookmark.text, 140);
    const pct = Math.round(bookmark.scrollRatio * 100);
    pctSpan.textContent = `${pct}%`;

    card.style.setProperty('--sf-marker-progress', bookmark.scrollRatio.toString());
    card.setAttribute('data-show', 'true');
  };

  const scheduleHideCard = () => {
    hideCardTimer = setTimeout(() => {
      card.setAttribute('data-show', 'false');
      activeBookmark = null;
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

  const render = (bookmarks: BookmarkEntry[]) => {
    currentBookmarks = bookmarks;
    clearDots();

    for (const b of currentBookmarks) {
      const dot = document.createElement('div');
      dot.className = 'sf-marker';
      dot.setAttribute('data-testid', `marker-${b.id}`);
      dot.setAttribute('title', b.title || b.text.slice(0, 30));
      dot.style.setProperty('--sf-marker-progress', b.scrollRatio.toString());

      dot.addEventListener('mouseenter', () => showCard(b));
      dot.addEventListener('mouseleave', scheduleHideCard);

      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        callbacks.onJumpToBookmark(b);
      });

      railElement.appendChild(dot);
      markerElements.set(b.id, dot);
    }
  };

  const destroy = () => {
    if (hideCardTimer) clearTimeout(hideCardTimer);
    clearDots();
    card.remove();
  };

  return {
    render,
    destroy,
  };
}
