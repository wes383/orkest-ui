'use client';

import { forwardRef, type ReactNode } from 'react';
import { Slider as BaseSlider } from '@base-ui/react/slider';
import type { SliderRootProps } from '@base-ui/react/slider';

import { cx } from '../../utils/cx';
import styles from './slider.module.css';

export type SliderSize = 'sm' | 'md' | 'lg';

export interface SliderProps extends Omit<
  SliderRootProps<number | readonly number[]>,
  'children' | 'className'
> {
  className?: string;
  /** Label shown above the control and associated with every thumb. */
  label?: ReactNode;
  /** Shows the formatted value or range at the end of the header. */
  showValue?: boolean;
  /** Control size. Defaults to `md`. */
  size?: SliderSize;
}

function countThumbs(
  value: number | readonly number[] | undefined,
  defaultValue: number | readonly number[] | undefined,
): number {
  if (Array.isArray(value)) {
    return value.length;
  }

  // A controlled scalar always renders a single thumb, even when an unused
  // defaultValue array is also passed.
  if (value !== undefined) {
    return 1;
  }

  if (Array.isArray(defaultValue)) {
    return defaultValue.length;
  }

  return 1;
}

/**
 * Slider for a single value or a range. Pass an array to `value` or
 * `defaultValue` to render one thumb per entry.
 */
export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  { className, label, showValue = false, size = 'md', value, defaultValue, ...rest },
  ref,
) {
  const thumbCount = countThumbs(value, defaultValue);
  const hasLabel = label !== undefined && label !== null;

  return (
    <BaseSlider.Root<number | readonly number[]>
      ref={ref}
      {...rest}
      value={value}
      defaultValue={defaultValue}
      className={cx(styles.root, className)}
      data-size={size}
    >
      {hasLabel || showValue ? (
        <div className={styles.header}>
          {hasLabel ? <BaseSlider.Label className={styles.label}>{label}</BaseSlider.Label> : null}
          {showValue ? <BaseSlider.Value className={styles.value} /> : null}
        </div>
      ) : null}
      <BaseSlider.Control className={styles.control}>
        <BaseSlider.Track className={styles.track}>
          <BaseSlider.Indicator className={styles.indicator} />
          {Array.from({ length: thumbCount }, (_, index) => (
            <BaseSlider.Thumb key={index} index={index} className={styles.thumb} />
          ))}
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
});
