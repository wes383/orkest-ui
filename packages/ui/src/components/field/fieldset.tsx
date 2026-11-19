'use client';

import { forwardRef, useCallback, useMemo, useState, type FieldsetHTMLAttributes } from 'react';
import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';

import { assignRef } from '../../utils/assign-ref';
import { cx } from '../../utils/cx';
import { FieldsetContext, useFieldsetContext, type FieldsetContextValue } from './field-context';
import styles from './field.module.css';

export interface FieldsetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {}

/** Semantic group for related fields with shared disabled state. */
export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(function Fieldset(
  { children, disabled = false, className, 'aria-labelledby': ariaLabelledBy, ...rest },
  ref,
) {
  const parent = useFieldsetContext();
  const isDisabled = disabled || parent?.disabled || false;
  const [legendId, setLegendId] = useState<string | undefined>(undefined);

  const registerLegend = useCallback((id: string) => {
    setLegendId(id);

    return () => {
      setLegendId((current) => (current === id ? undefined : current));
    };
  }, []);

  const contextValue = useMemo<FieldsetContextValue>(
    () => ({ disabled: isDisabled, legendId, registerLegend }),
    [isDisabled, legendId, registerLegend],
  );

  const setRef = useCallback(
    (node: HTMLElement | null) => {
      assignRef(ref, node as HTMLFieldSetElement | null);
    },
    [ref],
  );

  return (
    <FieldsetContext.Provider value={contextValue}>
      <BaseFieldset.Root
        ref={setRef}
        {...rest}
        aria-labelledby={ariaLabelledBy ?? legendId}
        disabled={isDisabled}
        className={cx(styles.fieldset, className)}
      >
        {children}
      </BaseFieldset.Root>
    </FieldsetContext.Provider>
  );
});
