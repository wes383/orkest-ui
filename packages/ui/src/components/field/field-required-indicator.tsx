'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cx } from '../../utils/cx';
import styles from './field.module.css';

export interface FieldRequiredIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual marker. Defaults to an asterisk. */
  children?: ReactNode;
  /** Screen-reader text that carries the required meaning. */
  srLabel?: string;
}

/** Decorative required marker with a separate accessible description. */
export const FieldRequiredIndicator = forwardRef<HTMLSpanElement, FieldRequiredIndicatorProps>(
  function FieldRequiredIndicator(
    { children = '*', srLabel = 'Required', className, ...rest },
    ref,
  ) {
    return (
      <span ref={ref} {...rest} className={cx(styles.requiredIndicator, className)}>
        <span aria-hidden="true">{children}</span>
        <span className={styles.srOnly}>{srLabel}</span>
      </span>
    );
  },
);
