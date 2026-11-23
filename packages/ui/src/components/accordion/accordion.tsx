'use client';

import { forwardRef, type ReactNode } from 'react';
import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import type {
  AccordionItemProps as BaseItemProps,
  AccordionPanelProps as BasePanelProps,
  AccordionRootProps as BaseRootProps,
  AccordionTriggerProps as BaseTriggerProps,
} from '@base-ui/react/accordion';
import { ChevronDown, type LucideIcon } from 'lucide-react';

import { Icon } from '../../primitives/icon';
import { cx } from '../../utils/cx';
import styles from './accordion.module.css';

export interface AccordionProps extends Omit<BaseRootProps<string>, 'className'> {
  className?: string;
}

/**
 * Groups collapsible items under one expansion rule. Use `multiple` to allow
 * several open panels and `value`/`defaultValue` to control the open items.
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  { className, ...rest },
  ref,
) {
  return <BaseAccordion.Root ref={ref} {...rest} className={cx(styles.root, className)} />;
});

export interface AccordionItemProps extends Omit<BaseItemProps, 'className' | 'value'> {
  className?: string;
  /** Stable value used by the root `value` array. */
  value: string;
}

/** One trigger and panel pair. */
export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { className, ...rest },
  ref,
) {
  return <BaseAccordion.Item ref={ref} {...rest} className={cx(styles.item, className)} />;
});

export interface AccordionTriggerProps extends Omit<BaseTriggerProps, 'className' | 'children'> {
  className?: string;
  children?: ReactNode;
  /** Chevron rendered after the label. Pass `null` to hide it. */
  icon?: LucideIcon | null;
}

/** Heading-wrapped button that expands the matching panel. */
export const AccordionTrigger = forwardRef<HTMLElement, AccordionTriggerProps>(
  function AccordionTrigger(
    { className, icon: IconComponent = ChevronDown, children, render, ...rest },
    ref,
  ) {
    return (
      <BaseAccordion.Header className={styles.header}>
        {render ? (
          <BaseAccordion.Trigger ref={ref} render={render} {...rest} className={className} />
        ) : (
          <BaseAccordion.Trigger ref={ref} {...rest} className={cx(styles.trigger, className)}>
            <span className={styles.label}>{children}</span>
            {IconComponent ? <Icon className={styles.icon} icon={IconComponent} size="sm" /> : null}
          </BaseAccordion.Trigger>
        )}
      </BaseAccordion.Header>
    );
  },
);

export interface AccordionPanelProps extends Omit<BasePanelProps, 'className'> {
  className?: string;
}

/** Animated content panel for one accordion item. */
export const AccordionPanel = forwardRef<HTMLDivElement, AccordionPanelProps>(
  function AccordionPanel({ className, children, ...rest }, ref) {
    return (
      <BaseAccordion.Panel ref={ref} {...rest} className={cx(styles.panel, className)}>
        <div className={styles.content}>{children}</div>
      </BaseAccordion.Panel>
    );
  },
);
