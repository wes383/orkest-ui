import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

const AspectRatio = AspectRatioPrimitive.Root;

export interface RatioProps
  extends React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root> {}

/**
 * Ratio — alias for {@link AspectRatio}. Provided so consumers can import
 * either name depending on stylistic preference.
 */
export const Ratio = AspectRatio;

export { AspectRatio };
