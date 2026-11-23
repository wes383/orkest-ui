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

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Base UI's modal scroll lock reserves a stable scrollbar gutter. Remove the
 * gutter while the lock is active and compensate with padding so the page
 * width stays the same. Restore both as soon as Base UI releases the lock so
 * closing the modal does not shift the page.
 */
export function useModalScrollbarCompensation(enabled: boolean): void {
  useIsoLayoutEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const html = document.documentElement;
    const previousPaddingRight = html.style.paddingRight;
    let compensating = false;

    function measureScrollbarWidth() {
      const probe = document.createElement('div');
      probe.style.cssText =
        'position:fixed;top:0;left:0;width:100px;height:100px;overflow:scroll;visibility:hidden;pointer-events:none;';
      document.body.appendChild(probe);
      const width = probe.offsetWidth - probe.clientWidth;
      probe.remove();
      return width;
    }

    function removeCompensation() {
      if (!compensating) {
        return;
      }

      compensating = false;
      html.style.paddingRight = previousPaddingRight;

      if (html.style.scrollbarGutter === 'auto') {
        html.style.removeProperty('scrollbar-gutter');
      }
    }

    function sync() {
      if (html.style.overflowY !== 'hidden') {
        removeCompensation();
        return;
      }

      if (compensating) {
        return;
      }

      const scrollbarWidth = measureScrollbarWidth();

      if (scrollbarWidth <= 0) {
        return;
      }

      compensating = true;
      html.style.setProperty('scrollbar-gutter', 'auto', 'important');
      html.style.paddingRight = `${scrollbarWidth}px`;
    }

    const observer = new MutationObserver(sync);
    observer.observe(html, {
      attributes: true,
      attributeFilter: ['style'],
    });
    sync();

    return () => {
      observer.disconnect();
      removeCompensation();
    };
  }, [enabled]);
}

const DialogModalContext = createContext(true);

/** Shares the modal state with the surface so it can expose aria-modal. */
export function DialogModalProvider({ modal, children }: { modal: boolean; children: ReactNode }) {
  return <DialogModalContext.Provider value={modal}>{children}</DialogModalContext.Provider>;
}

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DialogSurfaceProps extends Omit<DialogPopupProps, 'children' | 'className'> {
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
export const DialogSurface = forwardRef<HTMLDivElement, DialogSurfaceProps>(function DialogSurface(
  { children, size = 'md', showCloseButton = true, closeLabel = 'Close', className, ...rest },
  ref,
) {
  const isModal = useContext(DialogModalContext);
  useModalScrollbarCompensation(isModal);

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
          <BaseDialog.Close className={styles.closeButton} aria-label={closeLabel}>
            <Icon icon={X} size="sm" />
          </BaseDialog.Close>
        ) : null}
      </BaseDialog.Popup>
    </BaseDialog.Viewport>
  );
});
