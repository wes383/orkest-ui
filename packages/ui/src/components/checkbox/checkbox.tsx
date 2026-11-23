'use client';

import { forwardRef, useId, type ReactNode } from 'react';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import type { CheckboxRootProps } from '@base-ui/react/checkbox';

import { cx } from '../../utils/cx';
import styles from './checkbox.module.css';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps extends Omit<
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
export const Checkbox = forwardRef<HTMLElement, CheckboxProps>(function Checkbox(
  { size = 'md', label, className, ...rest },
  ref,
) {
  const generatedId = useId().replace(/:/g, '');
  const labelId = `checkbox-label-${generatedId}`;
  // A span with a checkbox role is not labelable, so the visible label has to be
  // referenced explicitly instead of relying on the wrapping element.
  const labelledBy =
    rest['aria-labelledby'] ?? (label && !rest['aria-label'] ? labelId : undefined);

  return (
    <label className={cx(styles.root, className)} data-size={size}>
      <BaseCheckbox.Root
        ref={ref}
        {...rest}
        aria-labelledby={labelledBy}
        className={styles.control}
      >
        <BaseCheckbox.Indicator keepMounted className={styles.indicator}>
          <svg className={styles.check} viewBox="0 0 12 12" aria-hidden="true">
            <path className={styles.checkPath} d="M2.5 6.5 5 9l4.5-6" />
          </svg>
          <span className={styles.dash} aria-hidden="true" />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {label ? (
        <span id={labelId} className={styles.label}>
          {label}
        </span>
      ) : null}
    </label>
  );
});
