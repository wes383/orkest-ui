"use client";

import * as React from "react";

/**
 * useId — stable, unique id generator.
 * Uses React's own `useId` (SSR-safe) and namespaces it with the given prefix.
 *
 * @example
 * const id = useId("field"); // "field-«react-id»"
 */
export function useId(prefix = "orkest"): string {
  const reactId = React.useId();
  // Strip the leading ":" React uses for opacity safety; keep it readable.
  return `${prefix}-${reactId.replace(/[:]/g, "")}`;
}
