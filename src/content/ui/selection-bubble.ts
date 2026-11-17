// src/content/ui/selection-bubble.ts — Floating action badge appearing on text selection
import { isValidSelection } from '../../core/bookmarks';

export interface SelectionBubbleCallbacks {
  onCreateBookmark: (text: string) => void;
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
  const bubble = document.createElement('button');
  bubble.type = 'button';
  bubble.className = 'sf-selection-bubble';
  bubble.setAttribute('data-testid', 'selection-bubble');
  bubble.setAttribute('data-show', 'false');

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

  bubble.appendChild(svg);
  bubble.appendChild(textSpan);
  container.appendChild(bubble);

  let currentSelectedText = '';
  let hideTimer: ReturnType<typeof setTimeout> | null = null;

  const hide = () => {
    bubble.setAttribute('data-show', 'false');
    currentSelectedText = '';
  };

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (currentSelectedText && isValidSelection(currentSelectedText)) {
      callbacks.onCreateBookmark(currentSelectedText);
    }
    hide();
  };

  bubble.addEventListener('click', handleClick);

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

      // Position bubble centered above selection (or below if too close to viewport top)
      const bubbleWidth = 120;
      const bubbleHeight = 32;

      let left = rect.left + rect.width / 2 - bubbleWidth / 2;
      left = Math.max(10, Math.min(window.innerWidth - bubbleWidth - 10, left));

      let top = rect.top - bubbleHeight - 8;
      if (top < 10) {
        top = rect.bottom + 8; // flip below selection
      }

      bubble.style.left = `${left}px`;
      bubble.style.top = `${top}px`;
      bubble.setAttribute('data-show', 'true');
    }, 120);
  };

  const handlePointerDown = (e: MouseEvent) => {
    // If clicking outside bubble and selection, dismiss bubble
    const target = e.target as Node | null;
    if (target && !bubble.contains(target)) {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        hide();
      }
    }
  };

  document.addEventListener('selectionchange', handleSelection, { passive: true });
  window.addEventListener('pointerup', handleSelection, { passive: true });
  window.addEventListener('pointerdown', handlePointerDown, { passive: true });

  const destroy = () => {
    if (hideTimer) clearTimeout(hideTimer);
    document.removeEventListener('selectionchange', handleSelection);
    window.removeEventListener('pointerup', handleSelection);
    window.removeEventListener('pointerdown', handlePointerDown);
    bubble.removeEventListener('click', handleClick);
    if (bubble.parentNode) {
      bubble.parentNode.removeChild(bubble);
    }
  };

  return {
    element: bubble,
    destroy,
  };
}
