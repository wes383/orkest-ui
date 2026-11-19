'use client';

import { forwardRef, useId, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { Field as BaseField } from '@base-ui/react/field';
import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from 'lucide-react';

import { Icon } from '../../primitives/icon';
import { cx } from '../../utils/cx';
import { useFieldContext, useFieldRegistration } from './field-context';
import styles from './field.module.css';

export type FieldMessageType = 'error' | 'success' | 'warning' | 'info';

const messageIcons: Record<FieldMessageType, LucideIcon> = {
  error: CircleAlert,
  success: CircleCheck,
  warning: TriangleAlert,
  info: Info,
};

export interface FieldMessageProps extends HTMLAttributes<HTMLDivElement> {
  /** Message tone. Defaults to `error`. */
  type?: FieldMessageType;
  /** Shows the icon that matches the message type. */
  icon?: boolean;
  children?: ReactNode;
}

/**
 * Validation or status message. Error messages are shown automatically while the
 * surrounding field is invalid and hidden again once it becomes valid.
 */
export const FieldMessage = forwardRef<HTMLDivElement, FieldMessageProps>(function FieldMessage(
  { type = 'error', icon = false, id: idProp, className, children, role, ...rest },
  ref,
) {
  const field = useFieldContext();
  const generatedId = useId().replace(/:/g, '');
  const messageId = idProp ?? `field-message-${generatedId}`;
  const isError = type === 'error';
  const errors = field?.errors ?? [];
  const errorContent =
    children ??
    (errors.length > 1 ? (
      <ul className={styles.messageList}>
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    ) : (
      errors[0]
    ));
  const hasErrorContent =
    errorContent !== undefined && errorContent !== null && errorContent !== '';
  const visible = field
    ? isError
      ? field.invalid && !field.disabled && hasErrorContent
      : true
    : hasErrorContent || !isError;

  useFieldRegistration('message', messageId, visible);

  if (!visible) {
    return null;
  }

  const content = (
    <>
      {icon ? <Icon icon={messageIcons[type]} size="sm" className={styles.messageIcon} /> : null}
      {isError ? errorContent : children}
    </>
  );

  const sharedProps = {
    ...rest,
    id: messageId,
    className: cx(styles.message, className),
    'data-type': type,
    role: role ?? (isError ? 'alert' : 'status'),
  };

  if (field && isError) {
    return (
      <BaseField.Error ref={ref} {...sharedProps} match>
        {content}
      </BaseField.Error>
    );
  }

  if (field) {
    return (
      <BaseField.Description
        ref={ref as unknown as Ref<HTMLParagraphElement>}
        {...sharedProps}
        render={<div />}
      >
        {content}
      </BaseField.Description>
    );
  }

  return (
    <div ref={ref} {...sharedProps}>
      {content}
    </div>
  );
});
