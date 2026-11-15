// src/content/ui/toast.ts — Hints and notifications (FR-15, FR-22, NFR-10)

export interface ToastController {
  show: (message: string) => void;
  destroy: () => void;
}

export function createToast(container: ShadowRoot): ToastController {
  const toast = document.createElement('div');
  toast.className = 'sf-toast';
  toast.setAttribute('data-testid', 'toast');
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');

  const dot = document.createElement('span');
  dot.className = 'dot';
  toast.appendChild(dot);

  const textNode = document.createElement('span');
  toast.appendChild(textNode);

  container.appendChild(toast);

  let hideTimer: ReturnType<typeof setTimeout> | null = null;

  const show = (message: string) => {
    if (hideTimer) {
      clearTimeout(hideTimer);
    }

    textNode.textContent = message;
    toast.setAttribute('data-show', 'true');

    hideTimer = setTimeout(() => {
      toast.removeAttribute('data-show');
      hideTimer = null;
    }, 2500);
  };

  const destroy = () => {
    if (hideTimer) clearTimeout(hideTimer);
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  };

  return {
    show,
    destroy,
  };
}
