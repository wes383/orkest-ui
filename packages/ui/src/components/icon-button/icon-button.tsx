import { forwardRef } from 'react';
import type { LucideIcon } from 'lucide-react';

import { Button, type ButtonProps } from '../button';

export interface IconButtonProps
  extends Omit<
    ButtonProps,
    'children' | 'leftIcon' | 'rightIcon' | 'iconOnly' | 'fullWidth' | 'aria-label'
  > {
  /** Lucide icon rendered inside the button. */
  icon: LucideIcon;
  /** Accessible name applied as `aria-label`. */
  label: string;
}

/** Square, icon-only button with a required accessible name. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, ...rest },
  ref,
) {
  return <Button ref={ref} {...rest} iconOnly leftIcon={icon} aria-label={label} />;
});
