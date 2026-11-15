'use client';

import { forwardRef, useId, type LabelHTMLAttributes, type ReactNode } from 'react';
import { Field as BaseField } from '@base-ui/react/field';

import { cx } from '../../utils/cx';
import { useFieldContext, useFieldRegistration } from './field-context';
import { FieldRequiredIndicator } from './field-required-indicator';
import styles from './field.module.css';

export interface FieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Shows the required indicator. Inherits `Field.required` when omitted. */
  required?: boolean;
  /** Shows an optional marker when the field is not required. */
  optional?: boolean;
  /** Dims the label without disabling the control. */
  disabled?: boolean;
  children?: ReactNode;
}

/** Field label with automatic control association and required or optional markers. */
export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(
  function FieldLabel(
    {
      children,
      required,
      optional = false,
      disabled = false,
      htmlFor,
      id: idProp,
      className,
      ...rest
    },
    ref,
  ) {
    const field = useFieldContext();
    const generatedId = useId().replace(/:/g, '');
    const labelId = idProp ?? `field-label-${generatedId}`;
    const isRequired = required ?? field?.required ?? false;
    const isOptional = !isRequired && optional;
    const isDisabled = disabled || field?.disabled || false;

    useFieldRegistration('label', labelId);

    const content = (
      <>
        {children}
        {isRequired ? (
          <>
            {' '}
            <FieldRequiredIndicator />
          </>
        ) : null}
        {isOptional ? (
          <>
            {' '}
            <span className={styles.optional}>Optional</span>
          </>
        ) : null}
      </>
    );

    if (field) {
      return (
        <BaseField.Label
          ref={ref}
          {...rest}
          id={labelId}
          {...(htmlFor !== undefined ? { htmlFor } : {})}
          className={cx(styles.label, className)}
          data-disabled={isDisabled || undefined}
        >
          {content}
        </BaseField.Label>
      );
    }

    return (
      <label
        ref={ref}
        {...rest}
        id={labelId}
        htmlFor={htmlFor}
        className={cx(styles.label, className)}
        data-disabled={isDisabled || undefined}
      >
        {content}
      </label>
    );
  },
);
