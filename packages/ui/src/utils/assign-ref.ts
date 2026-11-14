import type { ForwardedRef } from 'react';

/** Assigns a node to either a callback ref or a mutable ref object. */
export function assignRef<T>(ref: ForwardedRef<T>, value: T | null): void {
  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
}
