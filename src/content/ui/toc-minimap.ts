// src/content/ui/toc-minimap.ts — Interactive Document Outline & Minimap alongside Scroll Rail
import type { TocEntry } from '../../shared/types';
import { computeActiveHeadingIndex } from '../../core/toc';
import { truncateSnippet } from '../../core/bookmarks';

export interface TocMinimapCallbacks {
  onJumpToHeading: (entry: TocEntry) => void;
  isRTL?: () => boolean;
}

export interface TocMinimapController {
  element: HTMLElement;
  render: (entries: TocEntry[]) => void;
  updateScroll: (scrollY: number) => void;
  setZenState: (isZen: boolean) => void;
  destroy: () => void;
}

export function createTocMinimap(
  container: ShadowRoot,
  callbacks: TocMinimapCallbacks
): TocMinimapController {
  let entries: TocEntry[] = [];
  let activeIndex = -1;
  let isExpanded = false;
  let collapseTimer: ReturnType<typeof setTimeout> | null = null;

  // ── Main Container ──
  const root = document.createElement('aside');
  root.className = 'sf-toc-minimap';
  root.setAttribute('data-testid', 'toc-minimap');
  root.setAttribute('data-expanded', 'false');
  root.setAttribute('data-show', 'false');

  // ── 1. Compact Minimap Spine (Vertical Rail of Section Bars) ──
  const spine = document.createElement('div');
  spine.className = 'sf-minimap-spine';
  spine.setAttribute('aria-label', 'Document Outline Minimap');
  spine.setAttribute('role', 'navigation');

  // Spine trigger icon at the top
  const spineTrigger = document.createElement('button');
  spineTrigger.type = 'button';
  spineTrigger.className = 'sf-minimap-spine-btn';
  spineTrigger.setAttribute('title', 'فهرس العناوين / Table of Contents');
  spineTrigger.setAttribute('aria-label', 'Toggle Table of Contents Outline');

  const spineSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  spineSvg.setAttribute('viewBox', '0 0 24 24');
  spineSvg.setAttribute('width', '13');
  spineSvg.setAttribute('height', '13');
  spineSvg.setAttribute('fill', 'none');
  spineSvg.setAttribute('stroke', 'currentColor');
  spineSvg.setAttribute('stroke-width', '2.2');

  const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line1.setAttribute('x1', '3'); line1.setAttribute('y1', '6'); line1.setAttribute('x2', '21'); line1.setAttribute('y2', '6');
  const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line2.setAttribute('x1', '7'); line2.setAttribute('y1', '12'); line2.setAttribute('x2', '21'); line2.setAttribute('y2', '12');
  const line3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line3.setAttribute('x1', '10'); line3.setAttribute('y1', '18'); line3.setAttribute('x2', '21'); line3.setAttribute('y2', '18');

  spineSvg.appendChild(line1);
  spineSvg.appendChild(line2);
  spineSvg.appendChild(line3);
  spineTrigger.appendChild(spineSvg);
  spine.appendChild(spineTrigger);

  // Track area for heading bars
  const spineTrack = document.createElement('div');
  spineTrack.className = 'sf-minimap-spine-track';
  spine.appendChild(spineTrack);

  // Active section tooltip pill (shows when hovering spine)
  const hoverPill = document.createElement('div');
  hoverPill.className = 'sf-minimap-hover-pill';
  hoverPill.setAttribute('data-show', 'false');
  root.appendChild(hoverPill);

  // ── 2. Expanded Glass Outline Card ──
  const card = document.createElement('div');
  card.className = 'sf-minimap-card';

  // Card Header
  const header = document.createElement('div');
  header.className = 'sf-minimap-header';

  const titleWrap = document.createElement('div');
  titleWrap.className = 'sf-minimap-title-wrap';

  const titleIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  titleIcon.setAttribute('viewBox', '0 0 24 24');
  titleIcon.setAttribute('width', '14');
  titleIcon.setAttribute('height', '14');
  titleIcon.setAttribute('fill', 'none');
  titleIcon.setAttribute('stroke', 'var(--sf-brand-end)');
  titleIcon.setAttribute('stroke-width', '2.2');
  const tLine1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  tLine1.setAttribute('x1', '4'); tLine1.setAttribute('y1', '6'); tLine1.setAttribute('x2', '20'); tLine1.setAttribute('y2', '6');
  const tLine2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  tLine2.setAttribute('x1', '8'); tLine2.setAttribute('y1', '12'); tLine2.setAttribute('x2', '20'); tLine2.setAttribute('y2', '12');
  const tLine3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  tLine3.setAttribute('x1', '12'); tLine3.setAttribute('y1', '18'); tLine3.setAttribute('x2', '20'); tLine3.setAttribute('y2', '18');
  titleIcon.appendChild(tLine1);
  titleIcon.appendChild(tLine2);
  titleIcon.appendChild(tLine3);
  titleWrap.appendChild(titleIcon);

  const titleText = document.createElement('span');
  titleWrap.appendChild(titleText);

  const countBadge = document.createElement('span');
  countBadge.className = 'sf-minimap-badge';
  titleWrap.appendChild(countBadge);
  header.appendChild(titleWrap);

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'sf-minimap-close-btn';
  closeBtn.setAttribute('aria-label', 'Collapse Outline');
  closeBtn.textContent = '✕';
  header.appendChild(closeBtn);
  card.appendChild(header);

  // Card Items List
  const listEl = document.createElement('div');
  listEl.className = 'sf-minimap-list';
  card.appendChild(listEl);

  root.appendChild(spine);
  root.appendChild(card);
  container.appendChild(root);

  // ── Expand & Collapse Management ──
  const expand = () => {
    if (collapseTimer) {
      clearTimeout(collapseTimer);
      collapseTimer = null;
    }
    isExpanded = true;
    root.setAttribute('data-expanded', 'true');
    hoverPill.setAttribute('data-show', 'false');
  };

  const collapse = () => {
    if (collapseTimer) {
      clearTimeout(collapseTimer);
    }
    collapseTimer = setTimeout(() => {
      isExpanded = false;
      root.setAttribute('data-expanded', 'false');
      collapseTimer = null;
    }, 180);
  };

  const toggleExpand = () => {
    if (isExpanded) {
      isExpanded = false;
      root.setAttribute('data-expanded', 'false');
    } else {
      expand();
    }
  };

  spineTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleExpand();
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isExpanded = false;
    root.setAttribute('data-expanded', 'false');
  });

  // Hover to expand on desktop
  root.addEventListener('mouseenter', () => {
    expand();
  });

  root.addEventListener('mouseleave', () => {
    collapse();
  });

  // ── Render Items ──
  const tickElements: HTMLElement[] = [];
  const listItemElements: HTMLElement[] = [];

  const render = (newEntries: TocEntry[]) => {
    entries = newEntries;
    const count = entries.length;

    const isRtl = callbacks.isRTL ? callbacks.isRTL() : false;
    titleText.textContent = isRtl ? 'فهرس المقال' : 'Document Outline';
    countBadge.textContent = count.toString();
    card.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    hoverPill.setAttribute('dir', isRtl ? 'rtl' : 'ltr');

    // Show only if there are valid headings
    root.setAttribute('data-show', count > 0 ? 'true' : 'false');
    if (count === 0) {
      isExpanded = false;
      root.setAttribute('data-expanded', 'false');
      return;
    }

    // 1. Render Spine Ticks
    spineTrack.replaceChildren();
    tickElements.length = 0;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const tick = document.createElement('div');
      tick.className = 'sf-spine-tick';
      tick.setAttribute('data-level', String(entry.level));
      tick.style.setProperty('--sf-spine-pct', (entry.scrollRatio * 100).toFixed(1) + '%');
      tick.setAttribute('data-active', i === activeIndex ? 'true' : 'false');

      tick.addEventListener('mouseenter', () => {
        if (!isExpanded) {
          hoverPill.textContent = truncateSnippet(entry.text, 40);
          hoverPill.style.top = (entry.scrollRatio * 100).toFixed(1) + '%';
          hoverPill.setAttribute('data-show', 'true');
        }
      });

      tick.addEventListener('mouseleave', () => {
        hoverPill.setAttribute('data-show', 'false');
      });

      tick.addEventListener('click', (e) => {
        e.stopPropagation();
        callbacks.onJumpToHeading(entry);
      });

      spineTrack.appendChild(tick);
      tickElements.push(tick);
    }

    // 2. Render Card List Items
    listEl.replaceChildren();
    listItemElements.length = 0;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const item = document.createElement('div');
      item.className = 'sf-minimap-item';
      item.setAttribute('data-level', String(entry.level));
      item.setAttribute('data-active', i === activeIndex ? 'true' : 'false');

      const content = document.createElement('div');
      content.className = 'sf-minimap-item-content';

      const indicator = document.createElement('span');
      indicator.className = 'sf-minimap-item-indicator';
      content.appendChild(indicator);

      const textSpan = document.createElement('span');
      textSpan.className = 'sf-minimap-item-text';
      textSpan.textContent = entry.text;
      textSpan.setAttribute('title', entry.text);
      content.appendChild(textSpan);

      item.appendChild(content);

      item.addEventListener('click', (e) => {
        e.stopPropagation();
        callbacks.onJumpToHeading(entry);
      });

      listEl.appendChild(item);
      listItemElements.push(item);
    }
  };

  // ── Scroll Spy ──
  const updateScroll = (scrollY: number) => {
    if (entries.length === 0) return;
    const newActive = computeActiveHeadingIndex(entries, scrollY);
    if (newActive === activeIndex) return;

    activeIndex = newActive;

    // Update active tick in spine
    for (let i = 0; i < tickElements.length; i++) {
      tickElements[i].setAttribute('data-active', i === activeIndex ? 'true' : 'false');
    }

    // Update active item in list
    for (let i = 0; i < listItemElements.length; i++) {
      const isActive = i === activeIndex;
      listItemElements[i].setAttribute('data-active', isActive ? 'true' : 'false');
      if (isActive && isExpanded) {
        // Subtle scroll inside list if item is offscreen
        listItemElements[i].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  };

  const setZenState = (isZen: boolean) => {
    if (isZen && !isExpanded) {
      root.setAttribute('data-zen', 'dimmed');
    } else {
      root.removeAttribute('data-zen');
    }
  };

  const destroy = () => {
    if (collapseTimer) {
      clearTimeout(collapseTimer);
      collapseTimer = null;
    }
    root.remove();
  };

  return {
    element: root,
    render,
    updateScroll,
    setZenState,
    destroy,
  };
}
