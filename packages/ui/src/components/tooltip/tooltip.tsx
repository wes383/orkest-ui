'use client';

import {
  createContext,
  forwardRef,
  useContext,
  useId,
  type CSSProperties,
  type ReactElement,
} from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type {
  TooltipArrowProps as BaseTooltipArrowProps,
  TooltipPopupProps,
  TooltipPortalProps as BaseTooltipPortalProps,
  TooltipPositionerProps as BaseTooltipPositionerProps,
  TooltipProviderProps as BaseTooltipProviderProps,
  TooltipRootProps,
} from '@base-ui/react/tooltip';

import { cx } from '../../utils/cx';
import { Button, type ButtonProps } from '../button';
import styles from './tooltip.module.css';

const TooltipIdContext = createContext<string | null>(null);

export interface TooltipProviderProps extends BaseTooltipProviderProps {}

/** Provides shared hover timing for a group of tooltips. */
export function TooltipProvider({
  children,
  delay = 500,
  closeDelay = 0,
  timeout,
}: TooltipProviderProps) {
  return (
    <BaseTooltip.Provider
      delay={delay}
      closeDelay={closeDelay}
      timeout={timeout}
    >
      {children}
    </BaseTooltip.Provider>
  );
}

export type TooltipProps = TooltipRootProps;

/** Tooltip root with controlled and uncontrolled open state. */
export function Tooltip({ children, ...rest }: TooltipProps) {
  const generatedId = useId().replace(/:/g, '');
  const tooltipId = `tooltip-${generatedId}`;

  return (
    <TooltipIdContext.Provider value={tooltipId}>
      <BaseTooltip.Root {...rest}>{children}</BaseTooltip.Root>
    </TooltipIdContext.Provider>
  );
}

export interface TooltipTriggerProps extends ButtonProps {
  /** Replaces the default ghost Button. */
  render?: ReactElement;
  /** Delay before the tooltip opens on hover or focus, in milliseconds. */
  delay?: number;
  /** Delay before the tooltip closes, in milliseconds. */
  closeDelay?: number;
  /** Closes the tooltip when the trigger is clicked. */
  closeOnClick?: boolean;
}

/** Trigger that shows the tooltip on hover and keyboard focus. */
export const TooltipTrigger = forwardRef<
  HTMLButtonElement,
  TooltipTriggerProps
>(function TooltipTrigger(
  {
    variant = 'ghost',
    render,
    'aria-describedby': ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const tooltipId = useContext(TooltipIdContext);
  const describedBy = [ariaDescribedBy, tooltipId].filter(Boolean).join(' ');

  return (
    <BaseTooltip.Trigger
      ref={ref}
      render={render ?? <Button variant={variant} />}
      aria-describedby={describedBy || undefined}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  );
});

export type TooltipPortalProps = BaseTooltipPortalProps;

/** Renders the tooltip outside the parent stacking and overflow context. */
export const TooltipPortal = forwardRef<HTMLDivElement, TooltipPortalProps>(
  function TooltipPortal(props, ref) {
    return <BaseTooltip.Portal ref={ref} {...props} />;
  },
);

export interface TooltipContentProps
  extends Omit<TooltipPopupProps, 'className'> {
  className?: string;
  /** Side of the trigger the tooltip is placed on. Defaults to `top`. */
  side?: BaseTooltipPositionerProps['side'];
  /** Alignment relative to the trigger. Defaults to `center`. */
  align?: BaseTooltipPositionerProps['align'];
  /** Distance between the trigger and the tooltip. Defaults to `6`. */
  sideOffset?: BaseTooltipPositionerProps['sideOffset'];
  /** Offset along the alignment axis. Defaults to `0`. */
  alignOffset?: BaseTooltipPositionerProps['alignOffset'];
  /** Keeps the tooltip inside the viewport by the given padding. */
  collisionPadding?: BaseTooltipPositionerProps['collisionPadding'];
  /** Width of the tooltip surface. Defaults to fitting its content. */
  width?: CSSProperties['width'];
  /** Minimum width of the tooltip surface. */
  minWidth?: CSSProperties['minWidth'];
  /** Maximum width of the tooltip surface. Defaults to 15rem. */
  maxWidth?: CSSProperties['maxWidth'];
  /** Maximum height before the tooltip scrolls. */
  maxHeight?: CSSProperties['maxHeight'];
}

/** Tooltip surface with collision-aware positioning and animation. */
export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  function TooltipContent(
    {
      children,
      className,
      side = 'top',
      align = 'center',
      sideOffset = 6,
      alignOffset = 0,
      collisionPadding,
      width,
      minWidth,
      maxWidth,
      maxHeight,
      style,
      ...rest
    },
    ref,
  ) {
    const tooltipId = useContext(TooltipIdContext);

    return (
      <BaseTooltip.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        className={styles.positioner}
      >
        <BaseTooltip.Popup
          ref={ref}
          {...rest}
          id={tooltipId ?? undefined}
          role="tooltip"
          className={cx(styles.content, className)}
          style={{ ...style, width, minWidth, maxWidth, maxHeight }}
        >
          {children}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    );
  },
);

export interface TooltipArrowProps
  extends Omit<BaseTooltipArrowProps, 'className'> {
  className?: string;
}

/** Optional arrow pointing from the tooltip to its trigger. */
export const TooltipArrow = forwardRef<HTMLDivElement, TooltipArrowProps>(
  function TooltipArrow({ className, ...rest }, ref) {
    return (
      <BaseTooltip.Arrow
        ref={ref}
        {...rest}
        className={cx(styles.arrow, className)}
      />
    );
  },
);
