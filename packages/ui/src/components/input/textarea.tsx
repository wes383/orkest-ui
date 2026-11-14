'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type TextareaHTMLAttributes,
} from 'react';

import { assignRef } from '../../utils/assign-ref';
import { cx } from '../../utils/cx';
import type { InputSize } from './input';
import styles from './input.module.css';

export type TextareaSize = InputSize;
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /** Control size. Defaults to `md`. */
  size?: TextareaSize;
  /** Applies the invalid border and `aria-invalid`. */
  invalid?: boolean;
  /** Grows the textarea with its content. Disables manual resize. */
  autoResize?: boolean;
  /** Minimum visible rows when auto-resizing. */
  minRows?: number;
  /** Maximum visible rows when auto-resizing; extra content scrolls. */
  maxRows?: number;
  /** Manual resize direction. Ignored when `autoResize` is enabled. */
  resize?: TextareaResize;
  /** Shows the current character count below the field. */
  showCount?: boolean;
}

/** Native multi-line input with token sizes, auto-resize, and validation state. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    size = 'md',
    invalid = false,
    autoResize = false,
    minRows,
    maxRows,
    resize = 'vertical',
    showCount = false,
    className,
    disabled,
    readOnly,
    rows = 3,
    value,
    defaultValue,
    maxLength,
    onChange,
    ...rest
  },
  ref,
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [uncontrolledLength, setUncontrolledLength] = useState(
    () => String(defaultValue ?? '').length,
  );

  const length = value === undefined ? uncontrolledLength : String(value ?? '').length;

  const setTextareaRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node;
      assignRef(ref, node);
    },
    [ref],
  );

  const resizeToContent = useCallback(() => {
    const textarea = textareaRef.current;

    if (!textarea || !autoResize) {
      return;
    }

    const computed = window.getComputedStyle(textarea);
    const lineHeight = Number.parseFloat(computed.lineHeight) || 20;
    const paddingY =
      (Number.parseFloat(computed.paddingTop) || 0) +
      (Number.parseFloat(computed.paddingBottom) || 0);
    const minHeight = Math.max(
      lineHeight + paddingY,
      minRows === undefined ? 0 : minRows * lineHeight + paddingY,
    );
    const maxHeight =
      maxRows === undefined ? Number.POSITIVE_INFINITY : maxRows * lineHeight + paddingY;

    textarea.style.height = 'auto';
    const nextHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [autoResize, maxRows, minRows]);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    if (!autoResize) {
      textarea.style.height = '';
      textarea.style.overflowY = '';
      return;
    }

    resizeToContent();
  }, [autoResize, resizeToContent, value]);

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    if (value === undefined) {
      setUncontrolledLength(event.currentTarget.value.length);
    }

    onChange?.(event);

    if (autoResize) {
      resizeToContent();
    }
  }

  const countText = maxLength === undefined ? String(length) : `${length} / ${maxLength}`;

  return (
    <div className={styles.root} data-disabled={disabled || undefined}>
      <div
        className={cx(styles.field, styles.textareaField)}
        data-size={size}
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
        data-read-only={readOnly || undefined}
      >
        <textarea
          ref={setTextareaRef}
          {...rest}
          rows={rows}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          className={cx(styles.input, styles.textarea, className)}
          data-auto-resize={autoResize || undefined}
          data-resize={autoResize ? 'none' : resize}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={invalid || undefined}
          onChange={handleChange}
        />
      </div>
      {showCount ? <span className={styles.countBelow}>{countText}</span> : null}
    </div>
  );
});
