'use client';

import {
  createContext,
  forwardRef,
  useContext,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type {
  DialogDescriptionProps as BaseDialogDescriptionProps,
  DialogPopupProps,
  DialogTitleProps as BaseDialogTitleProps,
} from '@base-ui/react/dialog';
import { X } from 'lucide-react';

import { Icon } from '../../primitives/icon';
import { cx } from '../../utils/cx';
import { Button, type ButtonProps } from '../button';
import { Dialog, type DialogProps } from '../dialog';
import styles from './sheet.module.css';

export type SheetSide = 'right' | 'left' | 'top' | 'bottom';
export type SheetSize = 'sm' | 'md' | 'lg';

const SheetModalContext = createContext(true);

export type SheetProps = DialogProps;

/**
 * Dialog root anchored to a viewport edge. It shares the Dialog focus trap,
 * scroll lock, Escape handling, and overlay dismissal.
 */
export function Sheet({ modal = true, ...rest }: SheetProps) {
  return (
    <SheetModalContext.Provider value={modal === true}>
      <Dialog modal={modal} {...rest} />
    </SheetModalContext.Provider>
  );
}

export interface SheetTriggerProps extends ButtonProps {
  /** Replaces the default outline button. */
  render?: ReactElement;
}

/** Button that opens the surrounding sheet. */
export const SheetTrigger = forwardRef<HTMLButtonElement, SheetTriggerProps>(function SheetTrigger(
  { variant = 'outline', render, ...rest },
  ref,
) {
  return (
    <BaseDialog.Trigger
      ref={ref}
      render={render ?? <Button variant={variant} />}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  );
});

export interface SheetContentProps extends Omit<DialogPopupProps, 'children' | 'className'> {
  children?: ReactNode;
  className?: string;
  /** Viewport edge the sheet is anchored to. Defaults to `right`. */
  side?: SheetSide;
  /** Width preset for left and right sheets, height preset for top and bottom. */
  size?: SheetSize;
  /** Shows the built-in close action. Defaults to `true`. */
  showCloseButton?: boolean;
  /** Accessible name for the built-in close action. */
  closeLabel?: string;
}

/** Edge panel rendered in a portal with a backdrop and a slide-in transition. */
export const SheetContent = forwardRef<HTMLDivElement, SheetContentProps>(function SheetContent(
  {
    children,
    className,
    side = 'right',
    size = 'md',
    showCloseButton = true,
    closeLabel = 'Close',
    ...rest
  },
  ref,
) {
  const isModal = useContext(SheetModalContext);

  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className={styles.overlay} data-sheet-overlay="" />
      <BaseDialog.Popup
        ref={ref}
        {...rest}
        className={cx(styles.content, className)}
        data-side={side}
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
    </BaseDialog.Portal>
  );
});

export type SheetHeaderProps = HTMLAttributes<HTMLDivElement>;

/** Groups the title and description. */
export const SheetHeader = forwardRef<HTMLDivElement, SheetHeaderProps>(function SheetHeader(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} {...rest} className={cx(styles.header, className)} />;
});

export interface SheetTitleProps extends Omit<BaseDialogTitleProps, 'className'> {
  className?: string;
}

/** Accessible sheet title. Renders an `h2` by default. */
export const SheetTitle = forwardRef<HTMLHeadingElement, SheetTitleProps>(function SheetTitle(
  { className, ...rest },
  ref,
) {
  return <BaseDialog.Title ref={ref} {...rest} className={cx(styles.title, className)} />;
});

export interface SheetDescriptionProps extends Omit<BaseDialogDescriptionProps, 'className'> {
  className?: string;
}

/** Supporting text associated through aria-describedby. */
export const SheetDescription = forwardRef<HTMLParagraphElement, SheetDescriptionProps>(
  function SheetDescription({ className, ...rest }, ref) {
    return (
      <BaseDialog.Description ref={ref} {...rest} className={cx(styles.description, className)} />
    );
  },
);

export type SheetBodyProps = HTMLAttributes<HTMLDivElement>;

/** Scrollable sheet content area between the header and footer. */
export const SheetBody = forwardRef<HTMLDivElement, SheetBodyProps>(function SheetBody(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} {...rest} className={cx(styles.body, className)} />;
});

export type SheetFooterProps = HTMLAttributes<HTMLDivElement>;

/** Action row aligned to the end of the sheet. */
export const SheetFooter = forwardRef<HTMLDivElement, SheetFooterProps>(function SheetFooter(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} {...rest} className={cx(styles.footer, className)} />;
});

export interface SheetCloseProps extends ButtonProps {
  /** Replaces the default secondary button. */
  render?: ReactElement;
}

/** Button that closes the surrounding sheet. */
export const SheetClose = forwardRef<HTMLButtonElement, SheetCloseProps>(function SheetClose(
  { variant = 'secondary', render, ...rest },
  ref,
) {
  return (
    <BaseDialog.Close
      ref={ref}
      render={render ?? <Button variant={variant} />}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  );
});
