import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';

import { cx } from '../../utils/cx';

import styles from './spinner.module.css';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Diameter of the ring. Defaults to `md`. */
  size?: SpinnerSize;
  /** Ring colour. Defaults to `currentColor` so the spinner inherits its surroundings. */
  color?: string;
  /**
   * Text announced through a status region. Pass `null` when adjacent text
   * already states the status, which marks the spinner as decorative.
   */
  label?: string | null;
}

/** Indeterminate progress indicator for an action that is already in flight. */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', color, label = 'Loading', className, style, 'aria-hidden': ariaHidden, ...rest },
  ref,
) {
  const decorative = label === null || ariaHidden === true || ariaHidden === 'true';
  const mergedStyle: CSSProperties | undefined = color ? { ...style, color } : style;

  return (
    <span
      ref={ref}
      className={cx(styles.root, className)}
      style={mergedStyle}
      data-size={size}
      role={decorative ? undefined : 'status'}
      aria-hidden={decorative ? true : undefined}
      {...rest}
    >
      <span className={styles.track} aria-hidden="true" />
      {decorative ? null : <span className={styles.label}>{label}</span>}
    </span>
  );
});
