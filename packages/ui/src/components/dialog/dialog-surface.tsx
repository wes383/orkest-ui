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

let scrollbarWidthUsers = 0;

/**
 * The scrollbar gutter sits outside the fixed overlay while the modal scroll
 * lock is active. Publish its width so the overlay can extend over it without
 * changing the page layout or causing a shift when the dialog closes.
 */
function useDialogScrollbarWidth(enabled: boolean): void {
  useIsoLayoutEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const html = document.documentElement;

    function apply() {
      const probe = document.createElement('div');
      probe.style.cssText =
        'position:fixed;top:0;left:0;width:100px;height:100px;overflow:scroll;visibility:hidden;pointer-events:none;';
      document.body.appendChild(probe);
      const scrollbarWidth = probe.offsetWidth - probe.clientWidth;
      probe.remove();
      html.style.setProperty(
        '--orkest-dialog-scrollbar-width',
        `${scrollbarWidth}px`,
      );
    }

    scrollbarWidthUsers += 1;
    apply();
    window.addEventListener('resize', apply);

    return () => {
      window.removeEventListener('resize', apply);
      scrollbarWidthUsers -= 1;

      if (scrollbarWidthUsers === 0) {
        html.style.removeProperty('--orkest-dialog-scrollbar-width');
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
    useDialogScrollbarWidth(isModal);

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
