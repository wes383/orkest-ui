'use client';

import {
  forwardRef,
  useCallback,
  useId,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Field as BaseField } from '@base-ui/react/field';
import type { FieldRootProps } from '@base-ui/react/field';

import { cx } from '../../utils/cx';
import {
  FieldContext,
  mergeIds,
  useFieldsetContext,
  type FieldContextValue,
  type FieldOrientation,
} from './field-context';
import styles from './field.module.css';

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: ReactNode;
  /** Label and control arrangement. Defaults to `vertical`. */
  orientation?: FieldOrientation;
  /** Stable id assigned to the control. Generated when omitted. */
  controlId?: string;
  /** Requires the control and shows the required indicator in FieldLabel. */
  required?: boolean;
  /** Disables the field and its controls. */
  disabled?: boolean;
  /** Applies the invalid state to the field and its controls. */
  invalid?: boolean;
  /** Form field name inherited by controls. */
  name?: string;
  /** Custom validation callback, delegated to Base UI Field. */
  validate?: FieldRootProps['validate'];
  /** Validation timing, delegated to Base UI Field. */
  validationMode?: FieldRootProps['validationMode'];
  /** Debounce for `validationMode="onChange"`. */
  validationDebounceTime?: FieldRootProps['validationDebounceTime'];
  /** Imperative Base UI Field actions. */
  actionsRef?: FieldRootProps['actionsRef'];
  /** Marks the field dirty for external validation libraries. */
  dirty?: FieldRootProps['dirty'];
  /** Marks the field touched for external validation libraries. */
  touched?: FieldRootProps['touched'];
}

/** Groups a label, control, description, and messages with shared field state. */
export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  {
    children,
    orientation = 'vertical',
    controlId: controlIdProp,
    required = false,
    disabled = false,
    invalid = false,
    name,
    validate,
    validationMode,
    validationDebounceTime,
    actionsRef,
    dirty,
    touched,
    className,
    ...rest
  },
  ref,
) {
  const generatedId = useId().replace(/:/g, '');
  const controlId = controlIdProp ?? `field-${generatedId}`;
  const fieldset = useFieldsetContext();
  const isDisabled = disabled || fieldset?.disabled || false;

  const [labelId, setLabelId] = useState<string | undefined>(undefined);
  const [descriptionIds, setDescriptionIds] = useState<string[]>([]);
  const [messageIds, setMessageIds] = useState<string[]>([]);

  const registerLabel = useCallback((id: string) => {
    setLabelId(id);

    return () => {
      setLabelId((current) => (current === id ? undefined : current));
    };
  }, []);

  const registerDescription = useCallback((id: string) => {
    setDescriptionIds((current) =>
      current.includes(id) ? current : [...current, id],
    );

    return () => {
      setDescriptionIds((current) => current.filter((item) => item !== id));
    };
  }, []);

  const registerMessage = useCallback((id: string) => {
    setMessageIds((current) =>
      current.includes(id) ? current : [...current, id],
    );

    return () => {
      setMessageIds((current) => current.filter((item) => item !== id));
    };
  }, []);

  return (
    <BaseField.Root
      ref={ref}
      {...rest}
      className={cx(styles.root, className)}
      data-orientation={orientation}
      data-required={required || undefined}
      disabled={isDisabled}
      invalid={invalid}
      name={name}
      validate={validate}
      validationMode={validationMode}
      validationDebounceTime={validationDebounceTime}
      actionsRef={actionsRef}
      dirty={dirty}
      touched={touched}
    >
      <BaseField.Validity>
        {(validity) => {
          const contextValue: FieldContextValue = {
            controlId,
            labelId,
            describedBy: mergeIds(
              descriptionIds.join(' '),
              messageIds.join(' '),
            ),
            disabled: isDisabled,
            invalid: Boolean(invalid || validity.validity.valid === false),
            required,
            name,
            orientation,
            errors: validity.errors,
            registerLabel,
            registerDescription,
            registerMessage,
          };

          return (
            <FieldContext.Provider value={contextValue}>
              {children}
            </FieldContext.Provider>
          );
        }}
      </BaseField.Validity>
    </BaseField.Root>
  );
});
