'use client';

import { forwardRef, type ReactNode } from 'react';
import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import type {
  CollapsiblePanelProps as BasePanelProps,
  CollapsibleRootProps as BaseRootProps,
  CollapsibleTriggerProps as BaseTriggerProps,
} from '@base-ui/react/collapsible';
import { ChevronDown, type LucideIcon } from 'lucide-react';

import { Icon } from '../../primitives/icon';
import { cx } from '../../utils/cx';
import styles from './collapsible.module.css';

export interface CollapsibleProps extends Omit<BaseRootProps, 'className'> {
  className?: string;
}

/** Single expandable region with controlled and uncontrolled state. */
export const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(function Collapsible(
  { className, ...rest },
  ref,
) {
  return <BaseCollapsible.Root ref={ref} {...rest} className={cx(styles.root, className)} />;
});

export interface CollapsibleTriggerProps extends Omit<BaseTriggerProps, 'className' | 'children'> {
  className?: string;
  children?: ReactNode;
  /** Chevron rendered after the label. Pass `null` to hide it. */
  icon?: LucideIcon | null;
}

/** Button that toggles the panel. */
export const CollapsibleTrigger = forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  function CollapsibleTrigger(
    { className, icon: IconComponent = ChevronDown, children, render, ...rest },
    ref,
  ) {
    if (render) {
      return <BaseCollapsible.Trigger ref={ref} render={render} {...rest} className={className} />;
    }

    return (
      <BaseCollapsible.Trigger ref={ref} {...rest} className={cx(styles.trigger, className)}>
        <span className={styles.label}>{children}</span>
        {IconComponent ? <Icon className={styles.icon} icon={IconComponent} size="sm" /> : null}
      </BaseCollapsible.Trigger>
    );
  },
);

export interface CollapsiblePanelProps extends Omit<BasePanelProps, 'className'> {
  className?: string;
}

/** Animated panel that holds the collapsible content. */
export const CollapsiblePanel = forwardRef<HTMLDivElement, CollapsiblePanelProps>(
  function CollapsiblePanel({ className, children, ...rest }, ref) {
    return (
      <BaseCollapsible.Panel ref={ref} {...rest} className={cx(styles.panel, className)}>
        <div className={styles.content}>{children}</div>
      </BaseCollapsible.Panel>
    );
  },
);
