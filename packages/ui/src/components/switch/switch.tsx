'use client';

import { forwardRef, type ReactNode } from 'react';
import { Switch as BaseSwitch } from '@base-ui/react/switch';
import type { SwitchRootProps } from '@base-ui/react/switch';

import { cx } from '../../utils/cx';
import styles from './switch.module.css';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps extends Omit<
  SwitchRootProps,
  'children' | 'className' | 'nativeButton' | 'render'
> {
  className?: string;
  /** Control size. Defaults to `md`. */
  size?: SwitchSize;
  /** Label rendered beside the switch. */
  label?: ReactNode;
}

/** Base UI switch with token styling and an optional label. */
export const Switch = forwardRef<HTMLElement, SwitchProps>(function Switch(
  { size = 'md', label, className, ...rest },
  ref,
) {
  return (
    <label className={cx(styles.root, className)} data-size={size}>
      <BaseSwitch.Root ref={ref} {...rest} className={styles.track}>
        <BaseSwitch.Thumb className={styles.thumb} />
      </BaseSwitch.Root>
      {label ? <span className={styles.label}>{label}</span> : null}
    </label>
  );
});
