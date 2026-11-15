'use client';

import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useLayoutEffect,
  type ReactNode,
} from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { DialogPopupProps } from '@base-ui/react/dialog';
import { X } from 'lucide-react';

import { Icon } from '../../primitives/icon';
import { cx } from '../../utils/cx';
import styles from './dialog.module.css';

const useIsoLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Base UI's scroll lock keeps a stable scrollbar gutter while the dialog is open.
 * Remove that gutter and compensate with padding so the page does not shift and
 * the fixed overlay can cover the full viewport.
 */
function useScrollbarCompensation(enabled: boolean): void {
  useIsoLayoutEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const html = document.documentElement;
    const previousPaddingRight = html.style.paddingRight;
    let timeout = 0;

    function apply() {
      if (html.style.scrollbarGutter === 'auto') {
        return;
      }

      const probe = document.createElement('div');
      probe.style.cssText =
        'position:fixed;top:0;left:0;width:100px;height:100px;overflow:scroll;visibility:hidden;pointer-events:none;';
      document.body.appendChild(probe);
      const scrollbarWidth = probe.offsetWidth - probe.clientWidth;
      probe.remove();

      if (scrollbarWidth <= 0) {
        html.style.removeProperty('padding-right');
        return;
      }

      html.style.setProperty('scrollbar-gutter', 'auto', 'important');
      html.style.paddingRight = `${scrollbarWidth}px`;
    }

    function scheduleApply() {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(apply, 0);
    }

    // Base UI applies its scroll lock asynchronously. Reapply after its style
    // changes so the reserved gutter does not outlive the compensation.
    const observer = new MutationObserver(() => {
      if (html.style.scrollbarGutter !== 'auto') {
        apply();
      }
    });
    observer.observe(html, {
      attributes: true,
      attributeFilter: ['style'],
    });

    scheduleApply();
    window.addEventListener('resize', scheduleApply);

    return () => {
      window.clearTimeout(timeout);
      observer.disconnect();
      window.removeEventListener('resize', scheduleApply);
      html.style.paddingRight = previousPaddingRight;

      if (html.style.scrollbarGutter === 'auto') {
        html.style.removeProperty('scrollbar-gutter');
      }
    };
  }, [enabled]);
}

const DialogModalContext = createContext(true);

/** Shares the modal state with the surface so it can expose aria-modal. */
export function DialogModalProvider({
  modal,
  children,
}: {
  modal: boolean;
  children: ReactNode;
}) {
  return (
    <DialogModalContext.Provider value={modal}>
      {children}
    </DialogModalContext.Provider>
  );
}

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DialogSurfaceProps
  extends Omit<DialogPopupProps, 'children' | 'className'> {
  children?: ReactNode;
  className?: string;
  /** Maximum width preset. Defaults to `md`. */
  size?: DialogSize;
  /** Shows the built-in close action. Defaults to `true`. */
  showCloseButton?: boolean;
  /** Accessible name for the built-in close action. */
  closeLabel?: string;
}

/** Shared viewport and popup used by Dialog and Alert Dialog. */
export const DialogSurface = forwardRef<HTMLDivElement, DialogSurfaceProps>(
  function DialogSurface(
    {
      children,
      size = 'md',
      showCloseButton = true,
      closeLabel = 'Close',
      className,
      ...rest
    },
    ref,
  ) {
    const isModal = useContext(DialogModalContext);
    useScrollbarCompensation(isModal);

    return (
      <BaseDialog.Viewport className={styles.viewport} data-size={size}>
        <BaseDialog.Popup
          ref={ref}
          {...rest}
          className={cx(styles.content, className)}
          data-size={size}
          data-close-button={showCloseButton || undefined}
          aria-modal={isModal || undefined}
        >
          {children}
          {showCloseButton ? (
            <BaseDialog.Close
              className={styles.closeButton}
              aria-label={closeLabel}
            >
              <Icon icon={X} size="sm" />
            </BaseDialog.Close>
          ) : null}
        </BaseDialog.Popup>
      </BaseDialog.Viewport>
    );
  },
);
