'use client';

import {
  Children,
  forwardRef,
  isValidElement,
  type CSSProperties,
  type ReactElement,
} from 'react';
import { Popover as BasePopover } from '@base-ui/react/popover';
import type {
  PopoverArrowProps as BasePopoverArrowProps,
  PopoverDescriptionProps as BasePopoverDescriptionProps,
  PopoverPopupProps,
  PopoverPortalProps as BasePopoverPortalProps,
  PopoverPositionerProps as BasePopoverPositionerProps,
  PopoverRootProps,
  PopoverTitleProps as BasePopoverTitleProps,
} from '@base-ui/react/popover';

import { cx } from '../../utils/cx';
import { Button, type ButtonProps } from '../button';
import styles from './popover.module.css';

export type PopoverProps = PopoverRootProps;

/** Popover root with controlled and uncontrolled open state. */
export function Popover(props: PopoverProps) {
  return <BasePopover.Root {...props} />;
}

export interface PopoverTriggerProps extends ButtonProps {
  /** Replaces the default secondary Button. */
  render?: ReactElement;
  /** Opens the popover when the trigger is hovered. */
  openOnHover?: boolean;
  /** Delay before a hover-opened popover appears, in milliseconds. */
  delay?: number;
  /** Delay before a hover-opened popover closes, in milliseconds. */
  closeDelay?: number;
}

/** Button that toggles the surrounding popover. */
export const PopoverTrigger = forwardRef<
  HTMLButtonElement,
  PopoverTriggerProps
>(function PopoverTrigger({ variant = 'secondary', render, ...rest }, ref) {
  return (
    <BasePopover.Trigger
      ref={ref}
      render={render ?? <Button variant={variant} />}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  );
});

export type PopoverPortalProps = BasePopoverPortalProps;

/** Renders the popover outside the parent stacking and overflow context. */
export const PopoverPortal = forwardRef<HTMLDivElement, PopoverPortalProps>(
  function PopoverPortal(props, ref) {
    return <BasePopover.Portal ref={ref} {...props} />;
  },
);

export interface PopoverPositionerProps
  extends Omit<BasePopoverPositionerProps, 'className'> {
  className?: string;
}

/** Positions the popover against its trigger and handles viewport collisions. */
export const PopoverPositioner = forwardRef<
  HTMLDivElement,
  PopoverPositionerProps
>(function PopoverPositioner(
  {
    className,
    side = 'bottom',
    align = 'center',
    sideOffset = 8,
    alignOffset = 0,
    ...rest
  },
  ref,
) {
  return (
    <BasePopover.Positioner
      ref={ref}
      {...rest}
      side={side}
      align={align}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      className={cx(styles.positioner, className)}
    />
  );
});

export interface PopoverContentProps
  extends Omit<PopoverPopupProps, 'className'> {
  className?: string;
  /** Width of the popover surface. Defaults to fitting its content. */
  width?: CSSProperties['width'];
  /** Minimum width of the popover surface. */
  minWidth?: CSSProperties['minWidth'];
  /** Maximum width of the popover surface. Defaults to 25rem. */
  maxWidth?: CSSProperties['maxWidth'];
  /** Maximum height before the popover scrolls. */
  maxHeight?: CSSProperties['maxHeight'];
}

/**
 * Popover surface. It renders `role="dialog"` by default; pass `role="region"`
 * or `role="group"` when the content is not dialog-like.
 */
export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent(
    {
      children,
      className,
      width,
      minWidth,
      maxWidth,
      maxHeight,
      style,
      ...rest
    },
    ref,
  ) {
    const childArray = Children.toArray(children);
    const arrow = childArray.find(
      (child) => isValidElement(child) && child.type === PopoverArrow,
    );
    const bodyChildren = arrow
      ? childArray.filter((child) => child !== arrow)
      : childArray;

    return (
      <BasePopover.Popup
        ref={ref}
        {...rest}
        className={cx(styles.content, className)}
        style={{ ...style, width, minWidth, maxWidth, maxHeight }}
      >
        {arrow}
        <div className={styles.body}>{bodyChildren}</div>
      </BasePopover.Popup>
    );
  },
);

export interface PopoverArrowProps
  extends Omit<BasePopoverArrowProps, 'className'> {
  className?: string;
}

/** Optional arrow pointing from the popover to its trigger. */
export const PopoverArrow = forwardRef<HTMLDivElement, PopoverArrowProps>(
  function PopoverArrow({ className, children, ...rest }, ref) {
    return (
      <BasePopover.Arrow
        ref={ref}
        {...rest}
        className={cx(styles.arrow, className)}
      >
        {children ?? (
          <svg
            className={styles.arrowSvg}
            viewBox="0 0 12 6"
            aria-hidden="true"
          >
            <rect
              className={styles.arrowFill}
              x="0"
              y="5"
              width="12"
              height="2"
            />
            <path
              className={styles.arrowShape}
              d="M0 6 L5.1 0.9 Q6 0 6.9 0.9 L12 6"
            />
          </svg>
        )}
      </BasePopover.Arrow>
    );
  },
);

export interface PopoverTitleProps
  extends Omit<BasePopoverTitleProps, 'className'> {
  className?: string;
}

/** Accessible popover title. Renders an `h2` by default. */
export const PopoverTitle = forwardRef<HTMLHeadingElement, PopoverTitleProps>(
  function PopoverTitle({ className, ...rest }, ref) {
    return (
      <BasePopover.Title
        ref={ref}
        {...rest}
        className={cx(styles.title, className)}
      />
    );
  },
);

export interface PopoverDescriptionProps
  extends Omit<BasePopoverDescriptionProps, 'className'> {
  className?: string;
}

/** Supporting popover text associated through aria-describedby. */
export const PopoverDescription = forwardRef<
  HTMLParagraphElement,
  PopoverDescriptionProps
>(function PopoverDescription({ className, ...rest }, ref) {
  return (
    <BasePopover.Description
      ref={ref}
      {...rest}
      className={cx(styles.description, className)}
    />
  );
});

export interface PopoverCloseProps extends ButtonProps {
  /** Replaces the default secondary Button. */
  render?: ReactElement;
}

/** Button that closes the surrounding popover. */
export const PopoverClose = forwardRef<HTMLButtonElement, PopoverCloseProps>(
  function PopoverClose({ variant = 'secondary', render, ...rest }, ref) {
    return (
      <BasePopover.Close
        ref={ref}
        render={render ?? <Button variant={variant} />}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      />
    );
  },
);
