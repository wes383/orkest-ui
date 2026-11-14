import type { ComponentPropsWithRef, ElementType } from 'react';

/**
 * Shared polymorphic prop shape for primitives that support `as`.
 * The `as` element drives the available native attributes and ref type.
 */
export type PolymorphicProps<T extends ElementType, Props = object> = Props & {
  as?: T;
} & Omit<ComponentPropsWithRef<T>, keyof Props | 'as'>;
