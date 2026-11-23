import { forwardRef, type HTMLAttributes } from 'react';

import { cx } from '../../utils/cx';

import styles from './kbd.module.css';

export type KbdSize = 'sm' | 'md';

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Chip size. Defaults to `md`. */
  size?: KbdSize;
}

/** Keyboard key hint rendered as a native `kbd` element. */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { size = 'md', className, ...rest },
  ref,
) {
  return <kbd ref={ref} className={cx(styles.root, className)} data-size={size} {...rest} />;
});
