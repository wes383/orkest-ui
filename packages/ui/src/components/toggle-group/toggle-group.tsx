'use client';

import { forwardRef, type ReactNode } from 'react';
import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import type { ToggleProps } from '@base-ui/react/toggle';
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import type { ToggleGroupProps as BaseToggleGroupProps } from '@base-ui/react/toggle-group';

import { cx } from '../../utils/cx';
import styles from './toggle-group.module.css';

export type ToggleGroupSize = 'sm' | 'md' | 'lg';
export type ToggleGroupVariant = 'ghost' | 'segmented' | 'outline';

export interface ToggleGroupProps extends Omit<BaseToggleGroupProps<string>, 'className'> {
  className?: string;
  /** Control size. Defaults to `md`. */
  size?: ToggleGroupSize;
  /** Visual style. Defaults to `ghost`. */
  variant?: ToggleGroupVariant;
}

/** Group of toggle buttons that share a pressed value. */
export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(function ToggleGroup(
  { className, size = 'md', variant = 'ghost', children, ...rest },
  ref,
) {
  return (
    <BaseToggleGroup
      ref={ref}
      {...rest}
      className={cx(styles.root, className)}
      data-size={size}
      data-variant={variant}
    >
      {children}
    </BaseToggleGroup>
  );
});

export interface ToggleGroupItemProps extends Omit<ToggleProps<string>, 'className' | 'children'> {
  className?: string;
  children: ReactNode;
}

/** Individual toggle inside a `ToggleGroup`. */
export const ToggleGroupItem = forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  function ToggleGroupItem({ className, children, ...rest }, ref) {
    return (
      <BaseToggle ref={ref} {...rest} className={cx(styles.item, className)}>
        {children}
      </BaseToggle>
    );
  },
);
