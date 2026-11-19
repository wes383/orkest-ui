'use client';

import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';

import { cx } from '../../utils/cx';
import { useFieldsetContext, useFieldsetLegendRegistration } from './field-context';
import styles from './field.module.css';

export interface LegendProps extends HTMLAttributes<HTMLLegendElement> {
  children?: ReactNode;
}

/** Native fieldset legend, associated with the surrounding Fieldset. */
export const Legend = forwardRef<HTMLLegendElement, LegendProps>(function Legend(
  { id: idProp, className, children, ...rest },
  ref,
) {
  const fieldset = useFieldsetContext();
  const generatedId = useId().replace(/:/g, '');
  const legendId = idProp ?? `field-legend-${generatedId}`;

  useFieldsetLegendRegistration(legendId);

  return (
    <legend
      ref={ref}
      {...rest}
      id={legendId}
      className={cx(styles.legend, className)}
      data-disabled={fieldset?.disabled || undefined}
    >
      {children}
    </legend>
  );
});
