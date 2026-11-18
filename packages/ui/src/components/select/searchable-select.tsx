'use client';

import type { ForwardedRef } from 'react';

import { Combobox } from '../combobox';
import type { SelectProps } from './select';

interface SearchableSelectProps extends SelectProps {
  forwardedRef: ForwardedRef<HTMLElement>;
}

/**
 * `Select` in search mode *is* the Combobox, with Select's cleared-value
 * convention (`undefined` instead of `null`). Keeping it a thin wrapper means
 * the two public names can never drift apart the way two copies would.
 */
export function SearchableSelect({
  value,
  defaultValue,
  onChange,
  forwardedRef,
  ...rest
}: SearchableSelectProps) {
  const ref = forwardedRef as ForwardedRef<HTMLInputElement>;

  return (
    <Combobox
      /* `searchable` rides along in the spread and is ignored by the Combobox,
         which is the search mode itself. */
      {...rest}
      ref={ref}
      {...(value === undefined ? {} : { value })}
      {...(defaultValue === undefined ? {} : { defaultValue })}
      onChange={(next, option) => onChange?.(next ?? undefined, option)}
    />
  );
}
