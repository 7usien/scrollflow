// src/content/ui/bookmarks-menu.ts — Bookmarks & TOC Quick Drawer inside Shadow DOM
import type { BookmarkColor, BookmarkEntry, TocEntry } from '../../shared/types';
import {
  BOOKMARK_COLORS,
  truncateSnippet,
  sortBookmarks,
  resolveBookmarksLocale,
} from '../../core/bookmarks';
import { formatBookmarksAsMarkdown } from '../../core/export';

export interface BookmarksMenuCallbacks {
  onJumpToBookmark: (bookmark: BookmarkEntry) => void;
  onDeleteBookmark: (id: string) => void;
  onHoverBookmark?: (id: string | null) => void;
  onJumpToToc?: (entry: TocEntry) => void;
  isRTL?: () => boolean;
}

export interface BookmarksMenuController {
  triggerElement: HTMLElement;
  menuElement: HTMLElement;
  render: (bookmarks: BookmarkEntry[], tocEntries?: TocEntry[]) => void;
  renderToc: (tocEntries: TocEntry[]) => void;
  setZenState: (isZen: boolean) => void;
  destroy: () => void;
}

export function createBookmarksMenu(
  container: ShadowRoot,
  callbacks: BookmarksMenuCallbacks
): BookmarksMenuController {
  let currentBookmarks: BookmarkEntry[] = [];
  let currentTocEntries: TocEntry[] = [];
  let activeTab: 'bookmarks' | 'toc' = 'bookmarks';
  let selectedColorFilter: BookmarkColor | 'all' = 'all';
  let isOpen = false;
  let isZenDimmed = false;

  // ── 1. Floating Trigger Button ──
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'sf-bookmarks-trigger';
  trigger.setAttribute('data-testid', 'bookmarks-trigger');
  trigger.setAttribute('data-show', 'false');

  // Trigger SVG Icon (Bookmark)
  const triggerSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  triggerSvg.setAttribute('class', 'sf-bookmarks-trigger-icon');
  triggerSvg.setAttribute('viewBox', '0 0 24 24');
  triggerSvg.setAttribute('aria-hidden', 'true');

  const triggerPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  triggerPath.setAttribute('d', 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z');
  triggerSvg.appendChild(triggerPath);
  trigger.appendChild(triggerSvg);

  const badge = document.createElement('span');
  badge.className = 'sf-bookmarks-badge';
  badge.textContent = '0';
  trigger.appendChild(badge);

  // ── 2. Floating Menu Card / Drawer ──
  const menu = document.createElement('div');
  menu.className = 'sf-bookmarks-menu';
  menu.setAttribute('data-testid', 'bookmarks-menu');
  menu.setAttribute('data-open', 'false');

  // Header
  const header = document.createElement('div');
  header.className = 'sf-bookmarks-menu-header';

  const titleWrap = document.createElement('div');
  titleWrap.className = 'sf-bookmarks-menu-title-wrap';

  const titleSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  titleSvg.setAttribute('class', 'sf-bookmarks-menu-title-icon');
  titleSvg.setAttribute('viewBox', '0 0 24 24');
  titleSvg.setAttribute('aria-hidden', 'true');

  const titlePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  titlePath.setAttribute('d', 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z');
  titleSvg.appendChild(titlePath);
  titleWrap.appendChild(titleSvg);

  const titleText = document.createElement('span');
  titleWrap.appendChild(titleText);

  const countSpan = document.createElement('span');
  countSpan.className = 'sf-bookmarks-menu-count';
  countSpan.textContent = '(0)';
  titleWrap.appendChild(countSpan);

  header.appendChild(titleWrap);

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'sf-bookmarks-menu-close';

  const closeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  closeSvg.setAttribute('class', 'sf-bookmarks-menu-close-icon');
  closeSvg.setAttribute('viewBox', '0 0 24 24');
  closeSvg.setAttribute('aria-hidden', 'true');

  const closeLine1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  closeLine1.setAttribute('x1', '18');
  closeLine1.setAttribute('y1', '6');
  closeLine1.setAttribute('x2', '6');
  closeLine1.setAttribute('y2', '18');
  closeSvg.appendChild(closeLine1);

  const closeLine2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  closeLine2.setAttribute('x1', '6');
  closeLine2.setAttribute('y1', '6');
  closeLine2.setAttribute('x2', '18');
  closeLine2.setAttribute('y2', '18');
  closeSvg.appendChild(closeLine2);

  closeBtn.appendChild(closeSvg);
  header.appendChild(closeBtn);
  menu.appendChild(header);

  // Tabs (Bookmarks vs TOC)
  const tabsWrap = document.createElement('div');
  tabsWrap.className = 'sf-menu-tabs';

  const bookmarksTabBtn = document.createElement('button');
  bookmarksTabBtn.type = 'button';
  bookmarksTabBtn.className = 'sf-menu-tab';
  bookmarksTabBtn.setAttribute('data-tab', 'bookmarks');
  bookmarksTabBtn.setAttribute('data-active', 'true');

  const tocTabBtn = document.createElement('button');
  tocTabBtn.type = 'button';
  tocTabBtn.className = 'sf-menu-tab';
  tocTabBtn.setAttribute('data-tab', 'toc');
  tocTabBtn.setAttribute('data-active', 'false');

  tabsWrap.appendChild(bookmarksTabBtn);
  tabsWrap.appendChild(tocTabBtn);
  tabsWrap.style.display = 'none'; // Separated into dedicated TOC Minimap
  menu.appendChild(tabsWrap);

  // Color Filter Bar
  const filterBar = document.createElement('div');
  filterBar.className = 'sf-menu-filters';
  menu.appendChild(filterBar);

  // Scrollable list
  const listEl = document.createElement('div');
  listEl.className = 'sf-bookmarks-menu-list';
  menu.appendChild(listEl);

  // Export Bar
  const exportBar = document.createElement('div');
  exportBar.className = 'sf-menu-export-bar';

  const exportBtn = document.createElement('button');
  exportBtn.type = 'button';
  exportBtn.className = 'sf-menu-export-btn';

  const exportSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  exportSvg.setAttribute('viewBox', '0 0 24 24');
  exportSvg.setAttribute('width', '13');
  exportSvg.setAttribute('height', '13');
  exportSvg.setAttribute('fill', 'none');
  exportSvg.setAttribute('stroke', 'currentColor');
  exportSvg.setAttribute('stroke-width', '2');
  exportSvg.setAttribute('aria-hidden', 'true');

  const exportPath1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  exportPath1.setAttribute('d', 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2');
  exportSvg.appendChild(exportPath1);

  const exportRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  exportRect.setAttribute('x', '8');
  exportRect.setAttribute('y', '2');
  exportRect.setAttribute('width', '8');
  exportRect.setAttribute('height', '4');
  exportRect.setAttribute('rx', '1');
  exportRect.setAttribute('ry', '1');
  exportSvg.appendChild(exportRect);

  const exportTextSpan = document.createElement('span');
  exportBtn.appendChild(exportSvg);
  exportBtn.appendChild(exportTextSpan);
  exportBar.appendChild(exportBtn);
  menu.appendChild(exportBar);

  container.appendChild(trigger);
  container.appendChild(menu);

  // ── Tab Event Handlers ──
  bookmarksTabBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    activeTab = 'bookmarks';
    bookmarksTabBtn.setAttribute('data-active', 'true');
    tocTabBtn.setAttribute('data-active', 'false');
    updateMenuContent();
  });

  tocTabBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    activeTab = 'toc';
    bookmarksTabBtn.setAttribute('data-active', 'false');
    tocTabBtn.setAttribute('data-active', 'true');
    updateMenuContent();
  });

  // ── Open / Close State Management ──
  const openMenu = () => {
    isOpen = true;
    menu.setAttribute('data-open', 'true');
    trigger.setAttribute('data-active', 'true');
    trigger.removeAttribute('data-zen');
  };

  const closeMenu = () => {
    isOpen = false;
    menu.setAttribute('data-open', 'false');
    trigger.removeAttribute('data-active');
    callbacks.onHoverBookmark?.(null);
    if (isZenDimmed) {
      trigger.setAttribute('data-zen', 'dimmed');
    }
  };

  const toggleMenu = () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  trigger.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
  });

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenu();
  });

  // Click outside to dismiss
  const handlePointerDownOutside = (e: PointerEvent) => {
    if (!isOpen) return;
    const path = e.composedPath();
    if (!path.includes(menu) && !path.includes(trigger)) {
      closeMenu();
    }
  };
  document.addEventListener('pointerdown', handlePointerDownOutside, { passive: true });

  // Escape key to dismiss
  const handleKeyDown = (e: KeyboardEvent) => {
    if (isOpen && e.key === 'Escape') {
      closeMenu();
    }
  };
  document.addEventListener('keydown', handleKeyDown);

  // ── Export Handler ──
  exportBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    if (currentBookmarks.length === 0) return;

    const isRtl = callbacks.isRTL ? callbacks.isRTL() : false;
    const locale = resolveBookmarksLocale(isRtl);

    const markdown = formatBookmarksAsMarkdown({
      pageTitle: document.title,
      url: window.location.href,
      bookmarks: currentBookmarks,
      locale: isRtl ? 'ar' : 'en',
    });

    try {
      await navigator.clipboard.writeText(markdown);
      exportTextSpan.textContent = locale.copied;
      setTimeout(() => {
        exportTextSpan.textContent = locale.exportBtn;
      }, 1600);
    } catch {
      // Fallback
      exportTextSpan.textContent = 'Error';
      setTimeout(() => {
        exportTextSpan.textContent = locale.exportBtn;
      }, 1200);
    }
  });

  // ── Render Filter Chips ──
  const renderFilterChips = () => {
    filterBar.replaceChildren();

    const colors: Array<BookmarkColor | 'all'> = ['all', 'yellow', 'green', 'purple', 'blue', 'red'];

    for (const color of colors) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'sf-filter-chip';
      chip.setAttribute('data-color', color);
      chip.setAttribute('data-active', selectedColorFilter === color ? 'true' : 'false');
      if (color !== 'all') {
        chip.style.backgroundColor = BOOKMARK_COLORS[color].hex;
      }

      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedColorFilter = color;
        renderFilterChips();
        updateMenuContent();
      });

      filterBar.appendChild(chip);
    }
  };

  // ── Update Content Based on Active Tab ──
  const updateMenuContent = () => {
    const isRtl = callbacks.isRTL ? callbacks.isRTL() : false;
    const locale = resolveBookmarksLocale(isRtl);

    bookmarksTabBtn.textContent = `${locale.bookmarksTab} (${currentBookmarks.length})`;
    tocTabBtn.textContent = `${locale.tocTab} (${currentTocEntries.length})`;
    exportTextSpan.textContent = locale.exportBtn;

    listEl.replaceChildren();

    if (activeTab === 'bookmarks') {
      filterBar.style.display = currentBookmarks.length > 0 ? 'flex' : 'none';
      exportBar.style.display = currentBookmarks.length > 0 ? 'flex' : 'none';

      const filtered = selectedColorFilter === 'all'
        ? currentBookmarks
        : currentBookmarks.filter((b) => (b.color || 'blue') === selectedColorFilter);

      if (filtered.length === 0) {
        const emptyEl = document.createElement('div');
        emptyEl.className = 'sf-bookmarks-menu-empty';
        emptyEl.textContent = locale.empty;
        listEl.appendChild(emptyEl);
        return;
      }

      for (const b of filtered) {
        const item = document.createElement('div');
        item.className = 'sf-bookmarks-menu-item';
        item.setAttribute('data-testid', `bookmarks-menu-item-${b.id}`);

        // Left: Dot + Pct badge + Snippet
        const contentWrap = document.createElement('div');
        contentWrap.className = 'sf-bookmarks-item-content';

        const dot = document.createElement('span');
        dot.className = 'sf-bookmarks-item-dot';
        dot.style.backgroundColor = BOOKMARK_COLORS[b.color || 'blue'].hex;
        contentWrap.appendChild(dot);

        const pctTag = document.createElement('span');
        pctTag.className = 'sf-bookmarks-item-pct';
        const pct = Math.round(b.scrollRatio * 100);
        pctTag.textContent = `${pct}%`;
        contentWrap.appendChild(pctTag);

        const snippet = document.createElement('span');
        snippet.className = 'sf-bookmarks-item-text';
        snippet.textContent = truncateSnippet(b.text, 55);
        snippet.setAttribute('title', b.text);
        contentWrap.appendChild(snippet);

        item.appendChild(contentWrap);

        // Right: Actions (Jump + Delete)
        const actions = document.createElement('div');
        actions.className = 'sf-bookmarks-item-actions';

        // Jump button
        const jumpBtn = document.createElement('button');
        jumpBtn.type = 'button';
        jumpBtn.className = 'sf-bookmarks-item-btn';
        jumpBtn.setAttribute('aria-label', locale.jumpAria);
        jumpBtn.setAttribute('title', locale.jumpAria);

        const jumpSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        jumpSvg.setAttribute('class', 'sf-bookmarks-item-icon');
        jumpSvg.setAttribute('viewBox', '0 0 24 24');
        jumpSvg.setAttribute('aria-hidden', 'true');

        const jumpLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        jumpLine.setAttribute('x1', '7');
        jumpLine.setAttribute('y1', '17');
        jumpLine.setAttribute('x2', '17');
        jumpLine.setAttribute('y2', '7');
        jumpSvg.appendChild(jumpLine);

        const jumpPoly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        jumpPoly.setAttribute('points', '7 7 17 7 17 17');
        jumpSvg.appendChild(jumpPoly);

        jumpBtn.appendChild(jumpSvg);
        actions.appendChild(jumpBtn);

        // Delete button
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'sf-bookmarks-item-btn delete';
        delBtn.setAttribute('aria-label', locale.deleteAria);
        delBtn.setAttribute('title', locale.deleteAria);

        const delSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        delSvg.setAttribute('class', 'sf-bookmarks-item-icon');
        delSvg.setAttribute('viewBox', '0 0 24 24');
        delSvg.setAttribute('aria-hidden', 'true');

        const delPoly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        delPoly.setAttribute('points', '3 6 5 6 21 6');
        delSvg.appendChild(delPoly);

        const delPath1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        delPath1.setAttribute('d', 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2');
        delSvg.appendChild(delPath1);

        delBtn.appendChild(delSvg);
        actions.appendChild(delBtn);

        item.appendChild(actions);

        // Interactive listeners
        item.addEventListener('mouseenter', () => {
          callbacks.onHoverBookmark?.(b.id);
        });

        item.addEventListener('mouseleave', () => {
          callbacks.onHoverBookmark?.(null);
        });

        item.addEventListener('click', () => {
          callbacks.onJumpToBookmark(b);
          closeMenu();
        });

        jumpBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          callbacks.onJumpToBookmark(b);
          closeMenu();
        });

        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          callbacks.onDeleteBookmark(b.id);
        });

        listEl.appendChild(item);
      }
    } else {
      // activeTab === 'toc'
      filterBar.style.display = 'none';
      exportBar.style.display = 'none';

      if (currentTocEntries.length === 0) {
        const emptyEl = document.createElement('div');
        emptyEl.className = 'sf-bookmarks-menu-empty';
        emptyEl.textContent = locale.tocEmpty;
        listEl.appendChild(emptyEl);
        return;
      }

      for (const entry of currentTocEntries) {
        const item = document.createElement('div');
        item.className = 'sf-bookmarks-menu-item';
        item.setAttribute('data-testid', `toc-menu-item-${entry.id}`);

        const contentWrap = document.createElement('div');
        contentWrap.className = 'sf-bookmarks-item-content';

        const pctTag = document.createElement('span');
        pctTag.className = 'sf-bookmarks-item-pct';
        const pct = Math.round(entry.scrollRatio * 100);
        pctTag.textContent = `${pct}%`;
        contentWrap.appendChild(pctTag);

        const titleSpan = document.createElement('span');
        titleSpan.className = 'sf-bookmarks-item-text';
        titleSpan.textContent = entry.text;
        titleSpan.setAttribute('title', entry.text);
        if (entry.level === 2) {
          titleSpan.style.paddingLeft = '8px';
        } else if (entry.level >= 3) {
          titleSpan.style.paddingLeft = '16px';
        }
        contentWrap.appendChild(titleSpan);

        item.appendChild(contentWrap);

        item.addEventListener('click', () => {
          callbacks.onJumpToToc?.(entry);
          closeMenu();
        });

        listEl.appendChild(item);
      }
    }
  };

  // ── Render ──
  const render = (bookmarks: BookmarkEntry[], tocEntries?: TocEntry[]) => {
    currentBookmarks = sortBookmarks(bookmarks);
    if (tocEntries) {
      currentTocEntries = tocEntries;
    }

    const bookmarkCount = currentBookmarks.length;

    badge.textContent = bookmarkCount.toString();
    countSpan.textContent = `(${bookmarkCount})`;

    const isRtl = callbacks.isRTL ? callbacks.isRTL() : false;
    const locale = resolveBookmarksLocale(isRtl);

    titleText.textContent = locale.title;
    trigger.setAttribute('aria-label', locale.triggerAria);
    trigger.setAttribute('title', `${locale.title} (${bookmarkCount})`);
    closeBtn.setAttribute('aria-label', locale.closeAria);

    trigger.setAttribute('data-show', bookmarkCount > 0 ? 'true' : 'false');

    if (bookmarkCount === 0 && isOpen) {
      closeMenu();
    }

    renderFilterChips();
    updateMenuContent();
  };

  const renderToc = (tocEntries: TocEntry[]) => {
    currentTocEntries = tocEntries;
    render(currentBookmarks, currentTocEntries);
  };

  const setZenState = (isZen: boolean) => {
    isZenDimmed = isZen;
    if (isZen && !isOpen) {
      trigger.setAttribute('data-zen', 'dimmed');
    } else {
      trigger.removeAttribute('data-zen');
    }
  };

  const destroy = () => {
    document.removeEventListener('pointerdown', handlePointerDownOutside);
    document.removeEventListener('keydown', handleKeyDown);
    callbacks.onHoverBookmark?.(null);
    trigger.remove();
    menu.remove();
  };

  return {
    triggerElement: trigger,
    menuElement: menu,
    render,
    renderToc,
    setZenState,
    destroy,
  };
}
