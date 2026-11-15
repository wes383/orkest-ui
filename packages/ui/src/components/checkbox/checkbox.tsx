'use client';

import { forwardRef, type ReactNode } from 'react';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import type { CheckboxRootProps } from '@base-ui/react/checkbox';

import { cx } from '../../utils/cx';
import styles from './checkbox.module.css';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps
  extends Omit<
    CheckboxRootProps,
    'children' | 'className' | 'nativeButton' | 'render'
  > {
  className?: string;
  /** Control size. Defaults to `md`. */
  size?: CheckboxSize;
  /** Label rendered beside the control. */
  label?: ReactNode;
}

/** Base UI checkbox with token styling and an optional label. */
export const Checkbox = forwardRef<HTMLElement, CheckboxProps>(
  function Checkbox({ size = 'md', label, className, ...rest }, ref) {
    return (
      <label className={cx(styles.root, className)} data-size={size}>
        <BaseCheckbox.Root ref={ref} {...rest} className={styles.control}>
          <BaseCheckbox.Indicator keepMounted className={styles.indicator} />
        </BaseCheckbox.Root>
        {label ? <span className={styles.label}>{label}</span> : null}
      </label>
    );
  },
);
