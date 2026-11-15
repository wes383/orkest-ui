'use client';

import { forwardRef, type ReactElement, type ReactNode } from 'react';
import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import type { AlertDialogRootProps } from '@base-ui/react/alert-dialog';

import { Button, type ButtonProps } from '../button';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  type DialogDescriptionProps,
  type DialogFooterProps,
  type DialogHeaderProps,
  type DialogOverlayProps,
  type DialogPortalProps,
  type DialogTitleProps,
} from './dialog';
import {
  DialogSurface,
  type DialogSize,
  type DialogSurfaceProps,
} from './dialog-surface';

export interface AlertDialogProps
  extends Omit<
    AlertDialogRootProps,
    'children' | 'handle' | 'onOpenChange'
  > {
  children?: ReactNode;
  onOpenChange?: AlertDialogRootProps['onOpenChange'];
}

/**
 * Alert dialog root. Escape and outside presses cannot dismiss the dialog, so
 * the user must choose one of the rendered actions.
 */
export function AlertDialog({
  children,
  onOpenChange,
  ...rest
}: AlertDialogProps) {
  function handleOpenChange(
    nextOpen: boolean,
    details: Parameters<
      NonNullable<AlertDialogRootProps['onOpenChange']>
    >[1],
  ) {
    if (!nextOpen && details.reason === 'escape-key') {
      details.cancel();
      return;
    }

    onOpenChange?.(nextOpen, details);
  }

  return (
    <BaseAlertDialog.Root {...rest} onOpenChange={handleOpenChange}>
      {children}
    </BaseAlertDialog.Root>
  );
}

export interface AlertDialogTriggerProps extends ButtonProps {
  /** Replaces the default secondary button. */
  render?: ReactElement;
}

/** Button that opens the surrounding alert dialog. */
export const AlertDialogTrigger = forwardRef<
  HTMLButtonElement,
  AlertDialogTriggerProps
>(function AlertDialogTrigger(
  { variant = 'secondary', render, ...rest },
  ref,
) {
  return (
    <BaseAlertDialog.Trigger
      ref={ref}
      render={render ?? <Button variant={variant} />}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  );
});

export const AlertDialogPortal = DialogPortal;
export type AlertDialogPortalProps = DialogPortalProps;

export const AlertDialogOverlay = DialogOverlay;
export type AlertDialogOverlayProps = DialogOverlayProps;

export interface AlertDialogContentProps
  extends Omit<DialogSurfaceProps, 'showCloseButton' | 'closeLabel'> {
  /** Alert dialogs are compact by default. */
  size?: DialogSize;
}

/** Alert dialog surface. It never renders the built-in close action. */
export const AlertDialogContent = forwardRef<
  HTMLDivElement,
  AlertDialogContentProps
>(function AlertDialogContent({ size = 'sm', ...rest }, ref) {
  return (
    <DialogSurface
      ref={ref}
      {...rest}
      size={size}
      showCloseButton={false}
    />
  );
});

export const AlertDialogHeader = DialogHeader;
export type AlertDialogHeaderProps = DialogHeaderProps;

export const AlertDialogTitle = DialogTitle;
export type AlertDialogTitleProps = DialogTitleProps;

export const AlertDialogDescription = DialogDescription;
export type AlertDialogDescriptionProps = DialogDescriptionProps;

export const AlertDialogFooter = DialogFooter;
export type AlertDialogFooterProps = DialogFooterProps;

export interface AlertDialogCancelProps extends ButtonProps {
  /** Replaces the default secondary button. */
  render?: ReactElement;
}

/** Cancel action. Closes the dialog without confirming. */
export const AlertDialogCancel = forwardRef<
  HTMLButtonElement,
  AlertDialogCancelProps
>(function AlertDialogCancel(
  { variant = 'secondary', render, ...rest },
  ref,
) {
  return (
    <BaseAlertDialog.Close
      ref={ref}
      render={render ?? <Button variant={variant} />}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  );
});

export interface AlertDialogActionProps extends ButtonProps {
  /** Replaces the default destructive button. */
  render?: ReactElement;
}

/** Confirming action. Closes the dialog when pressed. */
export const AlertDialogAction = forwardRef<
  HTMLButtonElement,
  AlertDialogActionProps
>(function AlertDialogAction(
  { variant = 'destructive', render, ...rest },
  ref,
) {
  return (
    <BaseAlertDialog.Close
      ref={ref}
      render={render ?? <Button variant={variant} />}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  );
});
