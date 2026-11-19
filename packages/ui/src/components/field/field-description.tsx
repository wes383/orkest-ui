'use client';

import { forwardRef, useId, type HTMLAttributes } from 'react';
import { Field as BaseField } from '@base-ui/react/field';

import { cx } from '../../utils/cx';
import { useFieldContext, useFieldRegistration } from './field-context';
import styles from './field.module.css';

export interface FieldDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

/** Supporting text linked to the field control through aria-describedby. */
export const FieldDescription = forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  function FieldDescription({ id: idProp, className, children, ...rest }, ref) {
    const field = useFieldContext();
    const generatedId = useId().replace(/:/g, '');
    const descriptionId = idProp ?? `field-description-${generatedId}`;

    useFieldRegistration('description', descriptionId);

    if (field) {
      return (
        <BaseField.Description
          ref={ref}
          {...rest}
          id={descriptionId}
          className={cx(styles.description, className)}
        >
          {children}
        </BaseField.Description>
      );
    }

    return (
      <p ref={ref} {...rest} id={descriptionId} className={cx(styles.description, className)}>
        {children}
      </p>
    );
  },
);
