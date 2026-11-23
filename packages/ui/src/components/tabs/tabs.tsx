'use client';

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import type {
  TabsIndicatorProps as BaseTabsIndicatorProps,
  TabsListProps as BaseTabsListProps,
  TabsPanelProps as BaseTabsPanelProps,
  TabsRootProps,
  TabsTabProps as BaseTabsTabProps,
} from '@base-ui/react/tabs';
import type { LucideIcon } from 'lucide-react';

import { Icon, type IconSize } from '../../primitives/icon';
import { assignRef } from '../../utils/assign-ref';
import { cx } from '../../utils/cx';
import styles from './tabs.module.css';

export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsVariant = 'underline' | 'pills' | 'enclosed';
export type TabsSize = 'sm' | 'md' | 'lg';
export type TabsActivationMode = 'automatic' | 'manual';

const TabsDisabledContext = createContext(false);
const TabsSizeContext = createContext<TabsSize>('md');

const iconSizeByTabsSize: Record<TabsSize, IconSize> = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
};

type TabsListKeyDownEvent = Parameters<NonNullable<BaseTabsListProps['onKeyDown']>>[0];

function isTabDisabled(tab: HTMLElement | undefined): boolean {
  return tab?.getAttribute('aria-disabled') === 'true';
}

/**
 * Base UI keeps disabled tabs focusable so assistive technology can discover
 * them. Arrow navigation therefore lands on them without activating them. Move
 * focus on to the next enabled tab so disabled tabs are skipped.
 */
function findEnabledTabIndex(
  tabs: HTMLElement[],
  startIndex: number,
  step: 1 | -1,
  wrap: boolean,
): number | undefined {
  const count = tabs.length;

  for (let offset = 0; offset < count; offset += 1) {
    const index = startIndex + offset * step;

    if (!wrap && (index < 0 || index >= count)) {
      return undefined;
    }

    const wrappedIndex = ((index % count) + count) % count;
    if (!isTabDisabled(tabs[wrappedIndex])) {
      return wrappedIndex;
    }
  }

  return undefined;
}

export interface TabsProps extends Omit<TabsRootProps, 'className'> {
  className?: string;
  /**
   * Disables pointer and keyboard interaction for the tab list while keeping
   * the active panel visible. Individual tabs can still be disabled with the
   * `disabled` prop on `TabsTrigger`.
   */
  disabled?: boolean;
}

/** Root that owns the selected tab value. */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { className, disabled = false, ...rest },
  ref,
) {
  return (
    <TabsDisabledContext.Provider value={disabled}>
      <BaseTabs.Root
        ref={ref}
        {...rest}
        className={cx(styles.root, className)}
        data-disabled={disabled || undefined}
      />
    </TabsDisabledContext.Provider>
  );
});

export interface TabsListProps extends Omit<BaseTabsListProps, 'className'> {
  className?: string;
  /** Visual style of the tab list. Defaults to `underline`. */
  variant?: TabsVariant;
  /** Tab size. Defaults to `md`. */
  size?: TabsSize;
  /** Stretches the list and divides its width between the tabs. */
  fullWidth?: boolean;
  /**
   * `automatic` activates a tab when it receives focus; `manual` waits for
   * Enter or Space. Defaults to `automatic`.
   */
  activationMode?: TabsActivationMode;
  /** Wraps keyboard focus at the ends of the list. Defaults to `true`. */
  loop?: boolean;
}

/** Container for the tab triggers and the optional indicator. */
export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  {
    children,
    className,
    variant = 'underline',
    size = 'md',
    fullWidth = false,
    activationMode = 'automatic',
    loop = true,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const tabsDisabled = useContext(TabsDisabledContext);
  const listRef = useRef<HTMLDivElement | null>(null);

  const setListRef = useCallback(
    (node: HTMLDivElement | null) => {
      listRef.current = node;
      assignRef(ref, node);
    },
    [ref],
  );

  // React 18 drops `inert` when it is passed as a boolean, which would leave a disabled
  // list focusable for consumers on the older major. Set the attribute directly instead.
  useEffect(() => {
    const node = listRef.current;

    if (!node) {
      return;
    }

    if (tabsDisabled) {
      node.setAttribute('inert', '');
      return;
    }

    node.removeAttribute('inert');
  }, [tabsDisabled]);

  function handleKeyDown(event: TabsListKeyDownEvent) {
    onKeyDown?.(event);

    const key = event.key;

    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)) {
      return;
    }

    const list = event.currentTarget;

    // Base UI focuses the next tab in a microtask. Event handlers from
    // `elementProps` run first, so wait two microtasks before correcting the
    // focus target.
    queueMicrotask(() => {
      queueMicrotask(() => {
        const active = list.ownerDocument.activeElement;

        if (!(active instanceof HTMLElement) || !list.contains(active)) {
          return;
        }

        if (!isTabDisabled(active)) {
          return;
        }

        const tabs = Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]'));
        const index = tabs.indexOf(active);

        if (index === -1) {
          return;
        }

        let startIndex: number;
        let step: 1 | -1;
        let wrap = loop;

        if (key === 'Home') {
          startIndex = 0;
          step = 1;
          wrap = false;
        } else if (key === 'End') {
          startIndex = tabs.length - 1;
          step = -1;
          wrap = false;
        } else if (key === 'ArrowRight' || key === 'ArrowDown') {
          startIndex = index + 1;
          step = 1;
        } else {
          startIndex = index - 1;
          step = -1;
        }

        const targetIndex = findEnabledTabIndex(tabs, startIndex, step, wrap);

        if (targetIndex !== undefined) {
          tabs[targetIndex]?.focus();
        }
      });
    });
  }

  return (
    <BaseTabs.List
      ref={setListRef}
      {...rest}
      activateOnFocus={activationMode === 'automatic'}
      loopFocus={loop}
      aria-disabled={tabsDisabled || undefined}
      onKeyDown={handleKeyDown}
      className={cx(styles.list, className)}
      data-variant={variant}
      data-size={size}
      data-full-width={fullWidth || undefined}
    >
      <TabsSizeContext.Provider value={size}>{children}</TabsSizeContext.Provider>
    </BaseTabs.List>
  );
});

export interface TabsTriggerProps extends Omit<BaseTabsTabProps, 'className'> {
  className?: string;
  /** Decorative Lucide icon rendered before the label. */
  icon?: LucideIcon;
  /** Count or status marker rendered after the label. */
  badge?: ReactNode;
}

/** Individual tab trigger. */
export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger(
  { className, icon, badge, disabled, children, ...rest },
  ref,
) {
  const size = useContext(TabsSizeContext);

  return (
    <BaseTabs.Tab ref={ref} {...rest} disabled={disabled} className={cx(styles.trigger, className)}>
      {icon ? <Icon icon={icon} size={iconSizeByTabsSize[size]} /> : null}
      <span className={styles.label}>{children}</span>
      {badge !== undefined && badge !== null ? <span className={styles.badge}>{badge}</span> : null}
    </BaseTabs.Tab>
  );
});

export interface TabsContentProps extends Omit<BaseTabsPanelProps, 'className'> {
  className?: string;
}

/** Panel shown while its matching tab is active. */
export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(function TabsContent(
  { className, ...rest },
  ref,
) {
  return <BaseTabs.Panel ref={ref} {...rest} className={cx(styles.content, className)} />;
});

export interface TabsIndicatorProps extends Omit<BaseTabsIndicatorProps, 'className'> {
  className?: string;
}

/**
 * Optional moving indicator. Place it inside `TabsList` to animate a line or
 * surface beneath the active tab.
 */
export const TabsIndicator = forwardRef<HTMLSpanElement, TabsIndicatorProps>(function TabsIndicator(
  { className, ...rest },
  ref,
) {
  return <BaseTabs.Indicator ref={ref} {...rest} className={cx(styles.indicator, className)} />;
});
