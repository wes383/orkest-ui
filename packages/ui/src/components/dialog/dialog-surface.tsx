'use client';

import {
  createContext,
  forwardRef,
  useContext,
  type ReactNode,
} from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { DialogPopupProps } from '@base-ui/react/dialog';
import { X } from 'lucide-react';

import { Icon } from '../../primitives/icon';
import { cx } from '../../utils/cx';
import styles from './dialog.module.css';

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
