'use client';

import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type CSSProperties,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type Ref,
} from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import type {
  MenuCheckboxItemProps,
  MenuGroupLabelProps,
  MenuGroupProps,
  MenuItemProps,
  MenuLinkItemProps,
  MenuPopupProps,
  MenuPortalProps,
  MenuPositionerProps,
  MenuRadioGroupChangeEventDetails,
  MenuRadioGroupProps,
  MenuRadioItemProps,
  MenuRootProps,
  MenuSubmenuRootProps,
  MenuSubmenuTriggerProps,
} from '@base-ui/react/menu';
import { Check, ChevronRight, type LucideIcon } from 'lucide-react';

import { Icon } from '../../primitives/icon';
import { cx } from '../../utils/cx';
import { Button, type ButtonProps } from '../button';
import styles from './dropdown-menu.module.css';

export type DropdownMenuProps = MenuRootProps;

interface DropdownMenuFocusRingContextValue {
  suppressFocusRing: boolean;
  setSuppressFocusRing: (value: boolean) => void;
}

const DropdownMenuFocusRingContext =
  createContext<DropdownMenuFocusRingContextValue | null>(null);

/** Root of a dropdown menu with controlled and uncontrolled open state. */
export function DropdownMenu({
  children,
  onOpenChange,
  ...rest
}: DropdownMenuProps) {
  const [suppressFocusRing, setSuppressFocusRing] = useState(false);

  function handleOpenChange(
    nextOpen: boolean,
    eventDetails: Parameters<NonNullable<MenuRootProps['onOpenChange']>>[1],
  ) {
    onOpenChange?.(nextOpen, eventDetails);

    if (eventDetails.isCanceled) {
      return;
    }

    if (nextOpen) {
      setSuppressFocusRing(false);
    } else if (eventDetails.reason === 'item-press') {
      setSuppressFocusRing(true);
    }
  }

  return (
    <DropdownMenuFocusRingContext.Provider
      value={{ suppressFocusRing, setSuppressFocusRing }}
    >
      <BaseMenu.Root {...rest} onOpenChange={handleOpenChange}>
        {children}
      </BaseMenu.Root>
    </DropdownMenuFocusRingContext.Provider>
  );
}

export interface DropdownMenuTriggerProps extends ButtonProps {
  /** Replaces the default secondary Button. */
  render?: ReactElement;
  /** Opens the menu when the trigger is hovered. */
  openOnHover?: boolean;
  /** Delay before a hover-opened menu appears, in milliseconds. */
  delay?: number;
  /** Delay before a hover-opened menu closes, in milliseconds. */
  closeDelay?: number;
}

/** Button that opens the surrounding dropdown menu. */
export const DropdownMenuTrigger = forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(function DropdownMenuTrigger(
  { variant = 'secondary', render, className, onBlur, ...rest },
  ref,
) {
  const focusRing = useContext(DropdownMenuFocusRingContext);

  return (
    <BaseMenu.Trigger
      ref={ref}
      render={render ?? <Button variant={variant} />}
      className={cx(styles.trigger, className)}
      data-focus-ring={focusRing?.suppressFocusRing ? 'none' : undefined}
      onBlur={(event) => {
        focusRing?.setSuppressFocusRing(false);
        onBlur?.(event);
      }}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  );
});

export type DropdownMenuPortalProps = MenuPortalProps;

/** Renders the menu outside the parent stacking and overflow context. */
export const DropdownMenuPortal = forwardRef<
  HTMLDivElement,
  DropdownMenuPortalProps
>(function DropdownMenuPortal(props, ref) {
  return <BaseMenu.Portal ref={ref} {...props} />;
});

export interface DropdownMenuContentProps
  extends Omit<MenuPopupProps, 'className'> {
  className?: string;
  /** Side of the trigger the menu is placed on. Defaults to `bottom`. */
  side?: MenuPositionerProps['side'];
  /** Alignment relative to the trigger. Defaults to `start`. */
  align?: MenuPositionerProps['align'];
  /** Distance between the trigger and the menu. Defaults to `6`. */
  sideOffset?: MenuPositionerProps['sideOffset'];
  /** Offset along the alignment axis. Defaults to `0`. */
  alignOffset?: MenuPositionerProps['alignOffset'];
  /** Keeps the menu inside the viewport by the given padding. */
  collisionPadding?: MenuPositionerProps['collisionPadding'];
  /** Minimum width of the menu surface. */
  minWidth?: CSSProperties['minWidth'];
  /** Maximum width of the menu surface. */
  maxWidth?: CSSProperties['maxWidth'];
  /** Maximum height before the menu scrolls. */
  maxHeight?: CSSProperties['maxHeight'];
}

/** Menu surface with collision-aware positioning, scrolling, and animation. */
export const DropdownMenuContent = forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(function DropdownMenuContent(
  {
    children,
    className,
    side = 'bottom',
    align = 'start',
    sideOffset = 6,
    alignOffset = 0,
    collisionPadding,
    minWidth,
    maxWidth,
    maxHeight,
    style,
    ...rest
  },
  ref,
) {
  return (
    <BaseMenu.Positioner
      side={side}
      align={align}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      collisionPadding={collisionPadding}
      className={styles.positioner}
    >
      <BaseMenu.Popup
        ref={ref}
        {...rest}
        className={cx(styles.content, className)}
        style={{ ...style, minWidth, maxWidth, maxHeight }}
      >
        {children}
      </BaseMenu.Popup>
    </BaseMenu.Positioner>
  );
});

export type DropdownMenuItemVariant = 'default' | 'destructive';

export interface DropdownMenuItemProps extends Omit<MenuItemProps, 'className'> {
  className?: string;
  /** Visual treatment. `destructive` marks irreversible actions. */
  variant?: DropdownMenuItemVariant;
  /** Decorative Lucide icon rendered before the label. */
  leftIcon?: LucideIcon;
  /**
   * Aligns the label with items that render a leading icon or indicator.
   * Use it when a group mixes items with and without icons.
   */
  inset?: boolean;
}

/** Interactive menu item that closes the menu when activated. */
export const DropdownMenuItem = forwardRef<HTMLElement, DropdownMenuItemProps>(
  function DropdownMenuItem(
    {
      children,
      className,
      variant = 'default',
      leftIcon,
      inset = false,
      ...rest
    },
    ref,
  ) {
    return (
      <BaseMenu.Item
        ref={ref}
        {...rest}
        className={cx(styles.item, className)}
        data-variant={variant}
        data-inset={inset || undefined}
      >
        {leftIcon ? (
          <span className={styles.itemIcon}>
            <Icon icon={leftIcon} size="sm" />
          </span>
        ) : null}
        <span className={styles.itemContent}>{children}</span>
      </BaseMenu.Item>
    );
  },
);

export interface DropdownMenuLinkItemProps
  extends Omit<MenuLinkItemProps, 'className'> {
  className?: string;
  /** Visual treatment. `destructive` marks irreversible actions. */
  variant?: DropdownMenuItemVariant;
  /** Decorative Lucide icon rendered before the label. */
  leftIcon?: LucideIcon;
  /**
   * Aligns the label with items that render a leading icon or indicator.
   * Use it when a group mixes items with and without icons.
   */
  inset?: boolean;
}

/** Menu item rendered as a link that closes the menu when followed. */
export const DropdownMenuLinkItem = forwardRef<
  HTMLAnchorElement,
  DropdownMenuLinkItemProps
>(function DropdownMenuLinkItem(
  {
    children,
    className,
    variant = 'default',
    leftIcon,
    inset = false,
    closeOnClick = true,
    ...rest
  },
  ref,
) {
  return (
    <BaseMenu.LinkItem
      ref={ref as Ref<Element>}
      {...rest}
      closeOnClick={closeOnClick}
      className={cx(styles.item, className)}
      data-variant={variant}
      data-inset={inset || undefined}
    >
      {leftIcon ? (
        <span className={styles.itemIcon}>
          <Icon icon={leftIcon} size="sm" />
        </span>
      ) : null}
      <span className={styles.itemContent}>{children}</span>
    </BaseMenu.LinkItem>
  );
});

export interface DropdownMenuGroupProps extends Omit<MenuGroupProps, 'className'> {
  className?: string;
}

/** Groups related menu items. */
export const DropdownMenuGroup = forwardRef<HTMLDivElement, DropdownMenuGroupProps>(
  function DropdownMenuGroup({ className, ...rest }, ref) {
    return (
      <BaseMenu.Group
        ref={ref}
        {...rest}
        className={cx(styles.group, className)}
      />
    );
  },
);

export interface DropdownMenuLabelProps
  extends Omit<MenuGroupLabelProps, 'className'> {
  className?: string;
}

/** Accessible label for a group or radio group. */
export const DropdownMenuLabel = forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  function DropdownMenuLabel({ className, ...rest }, ref) {
    return (
      <BaseMenu.GroupLabel
        ref={ref}
        {...rest}
        className={cx(styles.label, className)}
      />
    );
  },
);

export type DropdownMenuSeparatorProps = ComponentPropsWithoutRef<'div'>;

/** Horizontal divider between menu sections. */
export const DropdownMenuSeparator = forwardRef<
  HTMLDivElement,
  DropdownMenuSeparatorProps
>(function DropdownMenuSeparator({ className, ...rest }, ref) {
  return (
    <BaseMenu.Separator
      ref={ref}
      {...rest}
      className={cx(styles.separator, className)}
    />
  );
});

export interface DropdownMenuCheckboxItemProps
  extends Omit<MenuCheckboxItemProps, 'className'> {
  className?: string;
}

/** Menu item that toggles a setting and keeps the menu open. */
export const DropdownMenuCheckboxItem = forwardRef<
  HTMLElement,
  DropdownMenuCheckboxItemProps
>(function DropdownMenuCheckboxItem({ children, className, ...rest }, ref) {
  return (
    <BaseMenu.CheckboxItem
      ref={ref}
      {...rest}
      className={cx(styles.item, className)}
    >
      <span className={styles.indicatorSlot}>
        <BaseMenu.CheckboxItemIndicator className={styles.itemIndicator}>
          <Icon icon={Check} size="sm" />
        </BaseMenu.CheckboxItemIndicator>
      </span>
      <span className={styles.itemContent}>{children}</span>
    </BaseMenu.CheckboxItem>
  );
});

export interface DropdownMenuRadioGroupProps
  extends Omit<
    MenuRadioGroupProps,
    'className' | 'value' | 'defaultValue' | 'onValueChange'
  > {
  className?: string;
  /** Controlled selected value. */
  value?: string;
  /** Initial selected value for uncontrolled usage. */
  defaultValue?: string;
  /** Called with the next selected value. */
  onValueChange?: (
    value: string,
    eventDetails: MenuRadioGroupChangeEventDetails,
  ) => void;
}

/** Groups radio items that keep the menu open when selected. */
export const DropdownMenuRadioGroup = forwardRef<
  HTMLDivElement,
  DropdownMenuRadioGroupProps
>(function DropdownMenuRadioGroup(
  { className, value, defaultValue, onValueChange, ...rest },
  ref,
) {
  return (
    <BaseMenu.RadioGroup
      ref={ref}
      {...rest}
      className={cx(styles.group, className)}
      value={value}
      defaultValue={defaultValue}
      onValueChange={
        onValueChange as MenuRadioGroupProps['onValueChange'] | undefined
      }
    />
  );
});

export interface DropdownMenuRadioItemProps
  extends Omit<MenuRadioItemProps, 'className' | 'value'> {
  className?: string;
  /** Value selected in the surrounding radio group. */
  value: string;
}

/** Menu item that selects one value from a radio group. */
export const DropdownMenuRadioItem = forwardRef<
  HTMLElement,
  DropdownMenuRadioItemProps
>(function DropdownMenuRadioItem({ children, className, value, ...rest }, ref) {
  return (
    <BaseMenu.RadioItem
      ref={ref}
      {...rest}
      value={value}
      className={cx(styles.item, className)}
    >
      <span className={styles.indicatorSlot}>
        <BaseMenu.RadioItemIndicator className={styles.itemIndicator}>
          <span className={styles.radioDot} />
        </BaseMenu.RadioItemIndicator>
      </span>
      <span className={styles.itemContent}>{children}</span>
    </BaseMenu.RadioItem>
  );
});

export type DropdownMenuSubProps = MenuSubmenuRootProps;

/** Groups a submenu trigger and its content. */
export function DropdownMenuSub(props: DropdownMenuSubProps) {
  return <BaseMenu.SubmenuRoot {...props} />;
}

export interface DropdownMenuSubTriggerProps
  extends Omit<MenuSubmenuTriggerProps, 'className'> {
  className?: string;
  /** Decorative Lucide icon rendered before the label. */
  leftIcon?: LucideIcon;
  /**
   * Aligns the label with items that render a leading icon or indicator.
   * Use it when a group mixes items with and without icons.
   */
  inset?: boolean;
}

/** Menu item that opens a nested submenu. */
export const DropdownMenuSubTrigger = forwardRef<
  HTMLElement,
  DropdownMenuSubTriggerProps
>(function DropdownMenuSubTrigger(
  { children, className, leftIcon, inset = false, ...rest },
  ref,
) {
  return (
    <BaseMenu.SubmenuTrigger
      ref={ref}
      {...rest}
      className={cx(styles.item, className)}
      data-inset={inset || undefined}
    >
      {leftIcon ? (
        <span className={styles.itemIcon}>
          <Icon icon={leftIcon} size="sm" />
        </span>
      ) : null}
      <span className={styles.itemContent}>{children}</span>
      <Icon icon={ChevronRight} size="sm" className={styles.submenuChevron} />
    </BaseMenu.SubmenuTrigger>
  );
});

export interface DropdownMenuSubContentProps extends DropdownMenuContentProps {}

/** Submenu surface rendered in its own portal and positioner. */
export const DropdownMenuSubContent = forwardRef<
  HTMLDivElement,
  DropdownMenuSubContentProps
>(function DropdownMenuSubContent(
  {
    children,
    className,
    side,
    align = 'start',
    sideOffset = 4,
    alignOffset = -4,
    collisionPadding,
    minWidth,
    maxWidth,
    maxHeight,
    style,
    ...rest
  },
  ref,
) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        className={styles.positioner}
      >
        <BaseMenu.Popup
          ref={ref}
          {...rest}
          className={cx(styles.content, className)}
          style={{ ...style, minWidth, maxWidth, maxHeight }}
        >
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
});

export interface DropdownMenuShortcutProps
  extends ComponentPropsWithoutRef<'kbd'> {}

/** Visual keyboard shortcut hint aligned to the end of a menu item. */
export const DropdownMenuShortcut = forwardRef<
  HTMLElement,
  DropdownMenuShortcutProps
>(function DropdownMenuShortcut({ className, ...rest }, ref) {
  return (
    <kbd
      ref={ref}
      {...rest}
      aria-hidden="true"
      className={cx(styles.shortcut, className)}
    />
  );
});
