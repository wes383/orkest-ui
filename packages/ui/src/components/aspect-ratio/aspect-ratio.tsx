import { forwardRef, type HTMLAttributes } from 'react';

import { cx } from '../../utils/cx';

import styles from './aspect-ratio.module.css';

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Width-to-height ratio, for example `'16 / 9'` or `1.5`. Defaults to
   * `16 / 9`. A caller-provided `style` wins when both set the ratio.
   */
  ratio?: number | string;
}

/** Reserves a fixed width-to-height ratio for its content. */
export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio(
  { ratio = '16 / 9', className, style, ...rest },
  ref,
) {
  const resolvedRatio = typeof ratio === 'number' ? String(ratio) : ratio;

  return (
    <div
      ref={ref}
      className={cx(styles.root, className)}
      style={{ aspectRatio: resolvedRatio, ...style }}
      {...rest}
    />
  );
});
