import type { CSSProperties } from 'react';

export type SpaceStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20;

export const responsiveBreakpoints = ['sm', 'md', 'lg', 'xl'] as const;

export type ResponsiveBreakpoint = (typeof responsiveBreakpoints)[number];
export type ResponsiveObject<T> = { base?: T } &
  Partial<Record<ResponsiveBreakpoint, T>>;
export type ResponsiveValue<T> = T | ResponsiveObject<T>;

export type LayoutStyle = CSSProperties & Record<`--${string}`, string>;

const layoutBreakpoints = ['base', ...responsiveBreakpoints] as const;
type LayoutBreakpoint = (typeof layoutBreakpoints)[number];

/** Resolves a spacing step to its design token. */
export function spaceValue(step: SpaceStep): string {
  return `var(--ok-space-${step})`;
}

/** Treats numbers as pixels and passes CSS strings through unchanged. */
export function sizeValue(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value;
}

/** Merges optional style objects, letting later objects win. */
export function mergeStyles(
  ...styles: Array<CSSProperties | undefined>
): CSSProperties | undefined {
  const definedStyles = styles.filter((style): style is CSSProperties => style !== undefined);
  const merged = Object.assign({}, ...definedStyles) as CSSProperties;

  return Object.keys(merged).length > 0 ? merged : undefined;
}

function isResponsiveObject(value: unknown): boolean {
  return typeof value === 'object' && value !== null;
}

/**
 * Expands a responsive value into every breakpoint so CSS can read a single
 * variable per media query. Values carry forward to larger breakpoints.
 */
function expandResponsive<T>(
  value: ResponsiveValue<T> | undefined,
): Partial<Record<LayoutBreakpoint, T>> {
  if (value === undefined) {
    return {};
  }

  if (!isResponsiveObject(value)) {
    const plainValue = value as T;

    return {
      base: plainValue,
      sm: plainValue,
      md: plainValue,
      lg: plainValue,
      xl: plainValue,
    };
  }

  const responsiveValue = value as ResponsiveObject<T>;
  const expanded: Partial<Record<LayoutBreakpoint, T>> = {};
  let current = responsiveValue.base;

  if (current !== undefined) {
    expanded.base = current;
  }

  for (const breakpoint of responsiveBreakpoints) {
    const next = responsiveValue[breakpoint];

    if (next !== undefined) {
      current = next;
    }

    if (current !== undefined) {
      expanded[breakpoint] = current;
    }
  }

  return expanded;
}

/**
 * Converts a responsive layout prop into CSS variables such as
 * `--grid-columns-base` and `--grid-columns-md`. Media queries consume these
 * variables in the component stylesheet.
 */
export function responsiveStyle<T>(
  name: string,
  value: ResponsiveValue<T> | undefined,
  transform: (value: T) => string,
): LayoutStyle | undefined {
  const expanded = expandResponsive(value);
  const style: LayoutStyle = {};

  for (const breakpoint of layoutBreakpoints) {
    const item = expanded[breakpoint];

    if (item !== undefined) {
      style[`--${name}-${breakpoint}`] = transform(item);
    }
  }

  return Object.keys(style).length > 0 ? style : undefined;
}
