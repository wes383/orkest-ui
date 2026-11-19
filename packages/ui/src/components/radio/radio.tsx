'use client';

import { createContext, forwardRef, useContext, useId, useMemo, type ReactNode } from 'react';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import type { RadioRootProps } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import type { RadioGroupProps as BaseRadioGroupProps } from '@base-ui/react/radio-group';

import { cx } from '../../utils/cx';
import { mergeIds, useFieldContext } from '../field/field-context';
import styles from './radio.module.css';

export type RadioSize = 'sm' | 'md' | 'lg';
export type RadioOrientation = 'horizontal' | 'vertical';

interface RadioGroupUiContextValue {
  size: RadioSize;
}

const RadioGroupUiContext = createContext<RadioGroupUiContextValue | null>(null);

export interface RadioProps extends Omit<
  RadioRootProps<string>,
  'children' | 'className' | 'nativeButton' | 'render'
> {
  className?: string;
  /** Control size. Defaults to `md`, or the parent RadioGroup size. */
  size?: RadioSize;
  /** Label rendered beside the control. */
  label?: ReactNode;
}

/** Base UI radio with token styling. Use RadioGroup for managed groups. */
export const Radio = forwardRef<HTMLElement, RadioProps>(function Radio(
  { size: sizeProp, label, className, ...rest },
  ref,
) {
  const group = useContext(RadioGroupUiContext);
  const size = sizeProp ?? group?.size ?? 'md';

  return (
    <label className={cx(styles.root, className)} data-size={size}>
      <BaseRadio.Root ref={ref} {...rest} className={styles.control}>
        <BaseRadio.Indicator keepMounted className={styles.indicator} />
      </BaseRadio.Root>
      {label ? <span className={styles.label}>{label}</span> : null}
    </label>
  );
});

export interface RadioGroupProps extends Omit<
  BaseRadioGroupProps<string>,
  'children' | 'className' | 'defaultValue' | 'onValueChange' | 'value'
> {
  className?: string;
  /** Controlled selected value. */
  value?: string;
  /** Initial selected value for uncontrolled usage. */
  defaultValue?: string;
  /** Called with the next selected value. */
  onValueChange?: (value: string) => void;
  /** Applies the invalid state to the group. */
  invalid?: boolean;
  /** Layout direction. Defaults to `vertical`. */
  orientation?: RadioOrientation;
  /** Size applied to radios that do not set their own size. */
  size?: RadioSize;
  children?: ReactNode;
}

/** Managed radio group backed by Base UI keyboard navigation and form semantics. */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  {
    name: nameProp,
    value,
    defaultValue,
    onValueChange,
    invalid = false,
    orientation = 'vertical',
    size = 'md',
    className,
    children,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const field = useFieldContext();
  const generatedId = useId().replace(/:/g, '');
  const name = nameProp ?? field?.name ?? `radio-group-${generatedId}`;
  const resolvedInvalid = invalid || field?.invalid || false;
  const resolvedDescribedBy = mergeIds(ariaDescribedBy, field?.describedBy);
  const resolvedLabelledBy = ariaLabelledBy ?? field?.labelId;
  const contextValue = useMemo(() => ({ size }), [size]);

  return (
    <RadioGroupUiContext.Provider value={contextValue}>
      <BaseRadioGroup
        ref={ref}
        {...rest}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(nextValue) => onValueChange?.(nextValue)}
        aria-orientation={orientation}
        aria-invalid={resolvedInvalid || undefined}
        aria-labelledby={resolvedLabelledBy}
        aria-describedby={resolvedDescribedBy}
        data-orientation={orientation}
        data-invalid={resolvedInvalid || undefined}
        className={cx(styles.group, className)}
      >
        {children}
      </BaseRadioGroup>
    </RadioGroupUiContext.Provider>
  );
});
