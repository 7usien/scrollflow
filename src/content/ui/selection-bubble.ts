// src/content/ui/selection-bubble.ts — Floating action badge appearing on text selection with color swatches
import { isValidSelection } from '../../core/bookmarks';
import type { BookmarkColor } from '../../shared/types';

export interface SelectionBubbleCallbacks {
  onCreateBookmark: (text: string, color?: BookmarkColor) => void;
  isRTL?: () => boolean;
}

export interface SelectionBubbleController {
  element: HTMLElement;
  destroy: () => void;
}

export function createSelectionBubble(
  container: ShadowRoot,
  callbacks: SelectionBubbleCallbacks
): SelectionBubbleController {
  const bubble = document.createElement('div');
  bubble.className = 'sf-selection-bubble';
  bubble.setAttribute('data-testid', 'selection-bubble');
  bubble.setAttribute('data-show', 'false');

  // Main Action Button
  const mainBtn = document.createElement('button');
  mainBtn.type = 'button';
  mainBtn.className = 'sf-selection-bubble-main';

  // Bookmark SVG Icon
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'sf-selection-bubble-icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'm19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z');
  svg.appendChild(path);

  const textSpan = document.createElement('span');
  textSpan.textContent = callbacks.isRTL?.() ? 'أضف هامشاً 🔖' : 'Bookmark 🔖';

  mainBtn.appendChild(svg);
  mainBtn.appendChild(textSpan);
  bubble.appendChild(mainBtn);

  // Divider
  const divider = document.createElement('div');
  divider.className = 'sf-selection-bubble-divider';
  bubble.appendChild(divider);

  // Color Swatches Container
  const colorsContainer = document.createElement('div');
  colorsContainer.className = 'sf-selection-bubble-colors';

  const colors: BookmarkColor[] = ['yellow', 'green', 'purple', 'blue', 'red'];
  for (const c of colors) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'sf-color-dot';
    dot.setAttribute('data-color', c);
    dot.setAttribute('data-testid', `color-dot-${c}`);
    dot.setAttribute('aria-label', c);

    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (currentSelectedText && isValidSelection(currentSelectedText)) {
        callbacks.onCreateBookmark(currentSelectedText, c);
      }
      hide();
    });

    colorsContainer.appendChild(dot);
  }

  bubble.appendChild(colorsContainer);
  container.appendChild(bubble);

  let currentSelectedText = '';
  let hideTimer: ReturnType<typeof setTimeout> | null = null;

  const hide = () => {
    bubble.setAttribute('data-show', 'false');
    currentSelectedText = '';
  };

  mainBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (currentSelectedText && isValidSelection(currentSelectedText)) {
      callbacks.onCreateBookmark(currentSelectedText, 'blue');
    }
    hide();
  });

  const handleSelection = () => {
    if (hideTimer) clearTimeout(hideTimer);

    // Wait a brief tick for mouseup to settle selection
    hideTimer = setTimeout(() => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        hide();
        return;
      }

      const text = selection.toString();
      if (!isValidSelection(text)) {
        hide();
        return;
      }

      // Check if selection anchor/focus is inside an editable input or within our own shadow host
      const anchorNode = selection.anchorNode;
      const element = anchorNode instanceof Element ? anchorNode : anchorNode?.parentElement;
      if (element) {
        const tagName = element.tagName.toLowerCase();
        const isEditable = (element instanceof HTMLElement && element.isContentEditable) || tagName === 'input' || tagName === 'textarea';
        if (isEditable || element.closest('#scrollflow-root')) {
          hide();
          return;
        }
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        hide();
        return;
      }

      currentSelectedText = text;
      textSpan.textContent = callbacks.isRTL?.() ? 'أضف هامشاً 🔖' : 'Bookmark 🔖';

      // Position bubble above the selection center
      const bubbleW = 210;
      const bubbleH = 34;

      let left = rect.left + rect.width / 2 - bubbleW / 2;
      let top = rect.top - bubbleH - 10;

      // Keep within viewport boundaries
      if (left < 10) left = 10;
      if (left + bubbleW > window.innerWidth - 10) {
        left = window.innerWidth - bubbleW - 10;
      }

      // If selection is too close to top of viewport, show bubble below
      if (top < 10) {
        top = rect.bottom + 10;
      }

      bubble.style.left = `${Math.round(left)}px`;
      bubble.style.top = `${Math.round(top)}px`;
      bubble.setAttribute('data-show', 'true');
    }, 150);
  };

  const handlePointerDownOutside = (e: MouseEvent) => {
    // If click is outside the bubble, hide
    const path = e.composedPath ? e.composedPath() : [];
    if (!path.includes(bubble)) {
      hide();
    }
  };

  document.addEventListener('selectionchange', handleSelection, { passive: true });
  document.addEventListener('pointerup', handleSelection, { passive: true });
  document.addEventListener('pointerdown', handlePointerDownOutside, { passive: true });

  const destroy = () => {
    if (hideTimer) clearTimeout(hideTimer);
    document.removeEventListener('selectionchange', handleSelection);
    document.removeEventListener('pointerup', handleSelection);
    document.removeEventListener('pointerdown', handlePointerDownOutside);
    bubble.remove();
  };

  return {
    element: bubble,
    destroy,
  };
}
