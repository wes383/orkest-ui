'use client';

import {
  forwardRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type {
  DialogBackdropProps,
  DialogDescriptionProps as BaseDialogDescriptionProps,
  DialogPortalProps as BaseDialogPortalProps,
  DialogRootProps,
  DialogTitleProps as BaseDialogTitleProps,
} from '@base-ui/react/dialog';

import { cx } from '../../utils/cx';
import { Button, type ButtonProps } from '../button';
import {
  DialogSurface,
  DialogModalProvider,
  type DialogSurfaceProps,
} from './dialog-surface';
import styles from './dialog.module.css';

export type { DialogSize } from './dialog-surface';

export interface DialogProps
  extends Omit<
    DialogRootProps,
    'children' | 'handle' | 'modal' | 'disablePointerDismissal' | 'onOpenChange'
  > {
  children?: ReactNode;
  /** Modal behavior. Modal dialogs trap focus and lock page scroll. */
  modal?: DialogRootProps['modal'];
  /** Closes the dialog when the backdrop is pressed. Defaults to `true`. */
  closeOnOverlayClick?: boolean;
  /** Closes the dialog when Escape is pressed. Defaults to `true`. */
  closeOnEscape?: boolean;
  onOpenChange?: DialogRootProps['onOpenChange'];
}

/** Modal or non-modal dialog root with controlled and uncontrolled state. */
export function Dialog({
  children,
  modal = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  onOpenChange,
  ...rest
}: DialogProps) {
  function handleOpenChange(
    nextOpen: boolean,
    details: Parameters<NonNullable<DialogRootProps['onOpenChange']>>[1],
  ) {
    if (!nextOpen && details.reason === 'escape-key' && !closeOnEscape) {
      details.cancel();
      return;
    }

    onOpenChange?.(nextOpen, details);
  }

  return (
    <DialogModalProvider modal={modal === true}>
      <BaseDialog.Root
        {...rest}
        modal={modal}
        disablePointerDismissal={!closeOnOverlayClick}
        onOpenChange={handleOpenChange}
      >
        {children}
      </BaseDialog.Root>
    </DialogModalProvider>
  );
}

export interface DialogTriggerProps extends ButtonProps {
  /** Replaces the default primary button. */
  render?: ReactElement;
}

/** Button that opens the surrounding dialog. */
export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  function DialogTrigger(
    { variant = 'primary', render, ...rest },
    ref,
  ) {
    return (
      <BaseDialog.Trigger
        ref={ref}
        render={render ?? <Button variant={variant} />}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      />
    );
  },
);

export type DialogPortalProps = BaseDialogPortalProps;

/** Renders the dialog outside the parent stacking and overflow context. */
export const DialogPortal = forwardRef<HTMLDivElement, DialogPortalProps>(
  function DialogPortal(props, ref) {
    return <BaseDialog.Portal ref={ref} {...props} />;
  },
);

export interface DialogOverlayProps
  extends Omit<DialogBackdropProps, 'className'> {
  className?: string;
}

/** Modal backdrop rendered beneath the dialog content. */
export const DialogOverlay = forwardRef<HTMLDivElement, DialogOverlayProps>(
  function DialogOverlay({ className, ...rest }, ref) {
    return (
      <BaseDialog.Backdrop
        ref={ref}
        {...rest}
        className={cx(styles.overlay, className)}
      />
    );
  },
);

export type DialogContentProps = DialogSurfaceProps;

/** Dialog surface with viewport centering, scrolling, and an optional close action. */
export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent(props, ref) {
    return <DialogSurface ref={ref} {...props} />;
  },
);

export type DialogHeaderProps = HTMLAttributes<HTMLDivElement>;

/** Groups the title and description. */
export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  function DialogHeader({ className, ...rest }, ref) {
    return (
      <div ref={ref} {...rest} className={cx(styles.header, className)} />
    );
  },
);

export interface DialogTitleProps
  extends Omit<BaseDialogTitleProps, 'className'> {
  className?: string;
}

/** Accessible dialog title. Renders an `h2` by default. */
export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  function DialogTitle({ className, ...rest }, ref) {
    return (
      <BaseDialog.Title
        ref={ref}
        {...rest}
        className={cx(styles.title, className)}
      />
    );
  },
);

export interface DialogDescriptionProps
  extends Omit<BaseDialogDescriptionProps, 'className'> {
  className?: string;
}

/** Supporting dialog text associated through aria-describedby. */
export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
>(function DialogDescription({ className, ...rest }, ref) {
  return (
    <BaseDialog.Description
      ref={ref}
      {...rest}
      className={cx(styles.description, className)}
    />
  );
});

export type DialogBodyProps = HTMLAttributes<HTMLDivElement>;

/** Scrollable dialog content area. */
export const DialogBody = forwardRef<HTMLDivElement, DialogBodyProps>(
  function DialogBody({ className, ...rest }, ref) {
    return <div ref={ref} {...rest} className={cx(styles.body, className)} />;
  },
);

export type DialogFooterProps = HTMLAttributes<HTMLDivElement>;

/** Action row aligned to the end of the dialog. */
export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  function DialogFooter({ className, ...rest }, ref) {
    return (
      <div ref={ref} {...rest} className={cx(styles.footer, className)} />
    );
  },
);

export interface DialogCloseProps extends ButtonProps {
  /** Replaces the default secondary button. */
  render?: ReactElement;
}

/** Button that closes the surrounding dialog. */
export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  function DialogClose(
    { variant = 'secondary', render, ...rest },
    ref,
  ) {
    return (
      <BaseDialog.Close
        ref={ref}
        render={render ?? <Button variant={variant} />}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      />
    );
  },
);
