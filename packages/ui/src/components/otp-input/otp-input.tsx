'use client';

import { forwardRef, useId, type ReactNode } from 'react';
import { OTPField as BaseOTPField } from '@base-ui/react/otp-field';
import type { OTPFieldRootProps } from '@base-ui/react/otp-field';

import { cx } from '../../utils/cx';
import { VisuallyHidden } from '../visually-hidden';
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
  /**
   * Accessible name for one slot. Every slot is a separate text field, so each one
   * needs a name of its own; the default reports the position inside the group.
   */
  slotLabel?: (index: number, length: number) => string;
}

const defaultSlotLabel = (index: number, length: number) => `Digit ${index + 1} of ${length}`;

function renderSlots(
  length: number,
  separator: ReactNode,
  slotLabel: (index: number, length: number) => string,
  firstSlotLabelId: string,
) {
  const slots: ReactNode[] = [];

  for (let index = 0; index < length; index += 1) {
    slots.push(
      <BaseOTPField.Input
        key={`slot-${index}`}
        className={styles.input}
        // Base UI labels the first slot through a referenced element and drops its
        // `aria-label`, so that slot points at the hidden label instead.
        {...(index === 0
          ? { 'aria-labelledby': firstSlotLabelId }
          : { 'aria-label': slotLabel(index, length) })}
      />,
    );

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
  { className, size = 'md', separator, slotLabel = defaultSlotLabel, length, ...rest },
  ref,
) {
  const generatedId = useId().replace(/:/g, '');
  const firstSlotLabelId = `otp-slot-label-${generatedId}`;

  return (
    <BaseOTPField.Root
      ref={ref}
      {...rest}
      length={length}
      className={cx(styles.root, className)}
      data-size={size}
    >
      {renderSlots(length, separator, slotLabel, firstSlotLabelId)}
      <VisuallyHidden id={firstSlotLabelId}>{slotLabel(0, length)}</VisuallyHidden>
    </BaseOTPField.Root>
  );
});
