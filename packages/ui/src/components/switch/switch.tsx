'use client';

import { forwardRef, useId, type ReactNode } from 'react';
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
  const generatedId = useId().replace(/:/g, '');
  const labelId = `switch-label-${generatedId}`;
  // A span with a switch role is not labelable, so the visible label has to be
  // referenced explicitly instead of relying on the wrapping element.
  const labelledBy =
    rest['aria-labelledby'] ?? (label && !rest['aria-label'] ? labelId : undefined);

  return (
    <label className={cx(styles.root, className)} data-size={size}>
      <BaseSwitch.Root ref={ref} {...rest} aria-labelledby={labelledBy} className={styles.track}>
        <BaseSwitch.Thumb className={styles.thumb} />
      </BaseSwitch.Root>
      {label ? (
        <span id={labelId} className={styles.label}>
          {label}
        </span>
      ) : null}
    </label>
  );
});
