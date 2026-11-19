'use client';

import {
  createContext,
  forwardRef,
  useContext,
  type AriaRole,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from 'react';
import { AlertTriangle, CheckCircle, CircleX, Info, X, type LucideIcon } from 'lucide-react';

import { Icon } from '../../primitives/icon';
import { cx } from '../../utils/cx';
import styles from './alert.module.css';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

const iconsByVariant: Record<AlertVariant, LucideIcon> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: CircleX,
};

const rolesByVariant: Record<AlertVariant, AriaRole> = {
  info: 'status',
  success: 'status',
  warning: 'status',
  error: 'alert',
};

const AlertVariantContext = createContext<AlertVariant>('info');

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  /** Visual and semantic state. Defaults to `info`. */
  variant?: AlertVariant;
  /**
   * Status icon glyph. Defaults to the glyph for the variant.
   * Pass `null` to render no icon.
   */
  icon?: LucideIcon | null;
  /** Renders a close button that calls `onClose`. */
  closable?: boolean;
  onClose?: () => void;
  /** Accessible name for the close button. Defaults to `Dismiss`. */
  closeLabel?: string;
  /**
   * Live region role. Defaults to `alert` for errors and `status` for other
   * variants. Pass `null` for a static container with no announcement.
   */
  role?: AriaRole | null;
}

/**
 * Persistent inline message. Compose `AlertTitle`, `AlertDescription`, and
 * `AlertAction` inside it; `AlertIcon` is rendered automatically unless `icon`
 * is `null`.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    variant = 'info',
    icon,
    closable = false,
    onClose,
    closeLabel = 'Dismiss',
    role,
    className,
    children,
    ...rest
  },
  ref,
) {
  const resolvedRole = role === undefined ? rolesByVariant[variant] : role;

  return (
    <div
      ref={ref}
      {...rest}
      role={resolvedRole ?? undefined}
      className={cx(styles.alert, className)}
      data-variant={variant}
    >
      <AlertVariantContext.Provider value={variant}>
        {icon === null ? null : <AlertIcon icon={icon} />}
        <div className={styles.content}>{children}</div>
        {closable ? <AlertClose onClick={onClose} label={closeLabel} /> : null}
      </AlertVariantContext.Provider>
    </div>
  );
});

export interface AlertIconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Overrides the variant inherited from the surrounding `Alert`. */
  variant?: AlertVariant;
  /** Overrides the default icon for the variant. */
  icon?: LucideIcon;
  /**
   * Accessible name for the icon. When omitted the icon is treated as
   * decorative because the surrounding text carries the status.
   */
  label?: string;
}

/** Status icon derived from the alert variant. */
export const AlertIcon = forwardRef<HTMLSpanElement, AlertIconProps>(function AlertIcon(
  { variant: variantProp, icon, label, className, ...rest },
  ref,
) {
  const contextVariant = useContext(AlertVariantContext);
  const variant = variantProp ?? contextVariant;
  const Glyph = icon ?? iconsByVariant[variant];

  return (
    <span
      ref={ref}
      {...rest}
      className={cx(styles.icon, className)}
      data-variant={variant}
      aria-hidden={label ? undefined : true}
    >
      <Icon icon={Glyph} size="sm" label={label} />
    </span>
  );
});

export interface AlertTitleProps extends HTMLAttributes<HTMLParagraphElement> {}

/** Primary message of the alert. Renders a paragraph, not a document heading. */
export const AlertTitle = forwardRef<HTMLParagraphElement, AlertTitleProps>(function AlertTitle(
  { className, ...rest },
  ref,
) {
  return <p ref={ref} {...rest} className={cx(styles.title, className)} />;
});

export interface AlertDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

/** Supporting message of the alert. */
export const AlertDescription = forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  function AlertDescription({ className, ...rest }, ref) {
    return <p ref={ref} {...rest} className={cx(styles.description, className)} />;
  },
);

export interface AlertActionProps extends HTMLAttributes<HTMLDivElement> {}

/** Optional action area, typically one or two buttons. */
export const AlertAction = forwardRef<HTMLDivElement, AlertActionProps>(function AlertAction(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} {...rest} className={cx(styles.action, className)} />;
});

export interface AlertCloseProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Accessible name of the icon-only button. Defaults to `Dismiss`. */
  label?: string;
}

/** Icon-only close button. Rendered automatically when `Alert` is closable. */
export const AlertClose = forwardRef<HTMLButtonElement, AlertCloseProps>(function AlertClose(
  { label = 'Dismiss', type = 'button', className, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      {...rest}
      type={type}
      aria-label={ariaLabel ?? label}
      className={cx(styles.close, className)}
    >
      <Icon icon={X} size="sm" />
    </button>
  );
});
