'use client';

import {
  forwardRef,
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { Input as BaseInput } from '@base-ui/react/input';
import { Eye, EyeOff, X, type LucideIcon } from 'lucide-react';

import { Icon, type IconSize } from '../../primitives/icon';
import { assignRef } from '../../utils/assign-ref';
import { cx } from '../../utils/cx';
import { useFieldContext, useFieldControl } from '../field/field-context';
import styles from './input.module.css';

export type InputSize = 'sm' | 'md' | 'lg' | 'xl';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** Control size. Defaults to `md`. */
  size?: InputSize;
  /** Applies the invalid border and `aria-invalid`. */
  invalid?: boolean;
  /** Decorative Lucide icon rendered before the input text. */
  leftIcon?: LucideIcon;
  /** Decorative Lucide icon rendered after the input text. */
  rightIcon?: LucideIcon;
  /** Text or node rendered before the input value. */
  prefix?: ReactNode;
  /** Text or node rendered after the input value. */
  suffix?: ReactNode;
  /** Shows a clear action while the input has a value. */
  clearable?: boolean;
  /** Accessible name for the clear action. */
  clearLabel?: string;
  /** Shows a visibility toggle when `type="password"`. */
  passwordToggle?: boolean;
  /** Accessible name for the show-password action. */
  showPasswordLabel?: string;
  /** Accessible name for the hide-password action. */
  hidePasswordLabel?: string;
  /** Shows the current character count below the field. */
  showCount?: boolean;
}

const iconSizeByInputSize: Record<InputSize, IconSize> = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
  xl: 'lg',
};

const actionIconSizeByInputSize: Record<InputSize, IconSize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
  xl: 'lg',
};

/** Native single-line input with token sizes, icons, actions, and validation state. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = 'md',
    invalid = false,
    leftIcon,
    rightIcon,
    prefix,
    suffix,
    clearable = false,
    clearLabel = 'Clear input',
    passwordToggle = false,
    showPasswordLabel = 'Show password',
    hidePasswordLabel = 'Hide password',
    showCount = false,
    className,
    disabled,
    readOnly,
    value,
    defaultValue,
    maxLength,
    onChange,
    type,
    ...rest
  },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const field = useFieldContext();
  const control = useFieldControl({
    id: rest.id,
    name: rest.name,
    disabled,
    required: rest.required,
    invalid,
  });
  const [uncontrolledLength, setUncontrolledLength] = useState(
    () => String(defaultValue ?? '').length,
  );
  const [passwordVisible, setPasswordVisible] = useState(false);

  const length = value === undefined ? uncontrolledLength : String(value ?? '').length;
  const iconSize = iconSizeByInputSize[size];
  const actionIconSize = actionIconSizeByInputSize[size];
  const resolvedType = type === 'password' && passwordVisible ? 'text' : type;
  const showClear = clearable && length > 0 && !control.disabled && !readOnly;
  const showPasswordAction =
    passwordToggle && type === 'password' && !control.disabled;
  const hasActions = showClear || showPasswordAction;
  const countText = maxLength === undefined ? String(length) : `${length} / ${maxLength}`;

  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      assignRef(ref, node);
    },
    [ref],
  );

  const inputProps = {
    ...rest,
    id: control.id,
    name: control.name,
    type: resolvedType,
    value,
    defaultValue,
    maxLength,
    className: cx(styles.input, className),
    disabled: control.disabled,
    readOnly,
    required: control.required,
    ...(control.invalid ? { 'aria-invalid': true as const } : {}),
    onChange: handleChange,
  };

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (value === undefined) {
      setUncontrolledLength(event.currentTarget.value.length);
    }

    onChange?.(event);
  }

  function handleClear() {
    const input = inputRef.current;

    if (!input) {
      return;
    }

    // Bypass React's value tracker so the input event still reaches onChange.
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;

    if (setter) {
      setter.call(input, '');
    } else {
      input.value = '';
    }

    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
  }

  function handleTogglePassword() {
    setPasswordVisible((visible) => !visible);
    inputRef.current?.focus();
  }

  return (
    <div className={styles.root} data-disabled={control.disabled || undefined}>
      <div
        className={styles.field}
        data-size={size}
        data-invalid={control.invalid || undefined}
        data-disabled={control.disabled || undefined}
        data-read-only={readOnly || undefined}
        data-actions={hasActions || undefined}
      >
        {leftIcon ? (
          <span className={styles.iconSlot}>
            <Icon icon={leftIcon} size={iconSize} />
          </span>
        ) : null}
        {prefix !== undefined && prefix !== null ? (
          <span className={styles.affix}>{prefix}</span>
        ) : null}
        {field ? (
          <BaseInput
            ref={setInputRef as unknown as Ref<HTMLElement>}
            {...inputProps}
          />
        ) : (
          <input ref={setInputRef} {...inputProps} />
        )}
        {suffix !== undefined && suffix !== null ? (
          <span className={styles.affix}>{suffix}</span>
        ) : null}
        {showClear ? (
          <button
            type="button"
            className={styles.action}
            aria-label={clearLabel}
            onClick={handleClear}
          >
            <Icon icon={X} size={actionIconSize} />
          </button>
        ) : null}
        {showPasswordAction ? (
          <button
            type="button"
            className={styles.action}
            aria-label={passwordVisible ? hidePasswordLabel : showPasswordLabel}
            aria-pressed={passwordVisible}
            onClick={handleTogglePassword}
          >
            <Icon icon={passwordVisible ? EyeOff : Eye} size={actionIconSize} />
          </button>
        ) : null}
        {rightIcon ? (
          <span className={styles.iconSlot}>
            <Icon icon={rightIcon} size={iconSize} />
          </span>
        ) : null}
      </div>
      {showCount ? <span className={styles.countBelow}>{countText}</span> : null}
    </div>
  );
});
