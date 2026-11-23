import { forwardRef, type HTMLAttributes } from 'react';

import { cx } from '../../utils/cx';

import styles from './visually-hidden.module.css';

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLSpanElement> {}

/**
 * Removes content from the visual layout while keeping it available to
 * assistive technology. Do not place focusable elements inside it.
 */
export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  function VisuallyHidden({ className, ...rest }, ref) {
    return <span ref={ref} className={cx(styles.root, className)} {...rest} />;
  },
);
