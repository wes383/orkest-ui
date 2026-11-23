'use client';

import { forwardRef, type ReactNode } from 'react';
import { OTPField as BaseOTPField } from '@base-ui/react/otp-field';
import type { OTPFieldRootProps } from '@base-ui/react/otp-field';

import { cx } from '../../utils/cx';
import styles from './otp-input.module.css';

export type OTPInputSize = 'sm' | 'md' | 'lg';

export interface OTPInputProps extends Omit<OTPFieldRootProps, 'children' | 'className'> {
  className?: string;
  /** Slot size. Defaults to `md`. */
  size?: OTPInputSize;
  /**
   * Content rendered between every third slot. No separator is rendered after
   * the final slot.
   */
  separator?: ReactNode;
}

function renderSlots(length: number, separator: ReactNode) {
  const slots: ReactNode[] = [];

  for (let index = 0; index < length; index += 1) {
    slots.push(<BaseOTPField.Input key={`slot-${index}`} className={styles.input} />);

    const isLastSlot = index === length - 1;
    const isGroupBoundary = (index + 1) % 3 === 0;

    if (separator !== undefined && separator !== null && isGroupBoundary && !isLastSlot) {
      slots.push(
        <BaseOTPField.Separator key={`separator-${index}`} className={styles.separator}>
          {separator}
        </BaseOTPField.Separator>,
      );
    }
  }

  return slots;
}

/** One-time-code input rendered as `length` equally sized slots. */
export const OTPInput = forwardRef<HTMLDivElement, OTPInputProps>(function OTPInput(
  { className, size = 'md', separator, length, ...rest },
  ref,
) {
  return (
    <BaseOTPField.Root
      ref={ref}
      {...rest}
      length={length}
      className={cx(styles.root, className)}
      data-size={size}
    >
      {renderSlots(length, separator)}
    </BaseOTPField.Root>
  );
});
