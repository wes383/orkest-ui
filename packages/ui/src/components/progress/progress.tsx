'use client';

import { forwardRef, type ReactNode } from 'react';
import { Progress as BaseProgress } from '@base-ui/react/progress';
import type { ProgressRootProps } from '@base-ui/react/progress';

import { cx } from '../../utils/cx';
import styles from './progress.module.css';

export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressProps extends Omit<ProgressRootProps, 'children' | 'className'> {
  className?: string;
  /** Label shown above the track. It also names the progress bar for assistive technology. */
  label?: ReactNode;
  /** Shows the formatted value at the end of the header. */
  showValue?: boolean;
  /** Track height. Defaults to `md`. */
  size?: ProgressSize;
}

/**
 * Progress bar for determinate tasks. Pass `value={null}` for work whose
 * completion cannot be measured.
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { className, label, showValue = false, size = 'md', ...rest },
  ref,
) {
  const hasLabel = label !== undefined && label !== null;

  return (
    <BaseProgress.Root ref={ref} {...rest} className={cx(styles.root, className)} data-size={size}>
      {hasLabel || showValue ? (
        <div className={styles.header}>
          {hasLabel ? (
            <BaseProgress.Label className={styles.label}>{label}</BaseProgress.Label>
          ) : null}
          {showValue ? <BaseProgress.Value className={styles.value} /> : null}
        </div>
      ) : null}
      <BaseProgress.Track className={styles.track}>
        <BaseProgress.Indicator className={styles.indicator} />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
});
