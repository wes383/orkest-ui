'use client';

import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type HTMLAttributes,
  type ImgHTMLAttributes,
} from 'react';
import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import type { ImageLoadingStatus } from '@base-ui/react/avatar';

import { cx } from '../../utils/cx';
import styles from './avatar.module.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';
export type AvatarStatus = 'online' | 'away' | 'offline' | 'busy';
export type AvatarGroupSpacing = 0 | 1 | 2 | 3 | 4;
export type AvatarImageStatus = ImageLoadingStatus;

const statusLabels: Record<AvatarStatus, string> = {
  online: 'Online',
  away: 'Away',
  offline: 'Offline',
  busy: 'Busy',
};

interface AvatarGroupContextValue {
  size: AvatarSize;
  shape: AvatarShape;
}

const AvatarGroupContext = createContext<AvatarGroupContextValue | null>(null);

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Avatar size. Defaults to `md`, or the parent AvatarGroup size when present. */
  size?: AvatarSize;
  /** Corner shape. Defaults to `circle`, or the parent AvatarGroup shape when present. */
  shape?: AvatarShape;
  /** Presence indicator rendered at the bottom-right corner. */
  status?: AvatarStatus;
  /** Accessible status text. Defaults to Online, Away, Offline, or Busy. */
  statusLabel?: string;
  /**
   * Accessible name for the avatar. When set, visual content is hidden from
   * assistive technology, which is useful when the fallback is an icon.
   */
  label?: string;
}

/** Avatar container that coordinates image loading, fallback content, and status. */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  {
    size: sizeProp,
    shape: shapeProp,
    status,
    statusLabel,
    label,
    className,
    children,
    ...rest
  },
  ref,
) {
  const group = useContext(AvatarGroupContext);
  const size = sizeProp ?? group?.size ?? 'md';
  const shape = shapeProp ?? group?.shape ?? 'circle';
  const statusText = status ? (statusLabel ?? statusLabels[status]) : undefined;

  return (
    <BaseAvatar.Root
      ref={ref}
      {...rest}
      className={cx(styles.root, className)}
      data-size={size}
      data-shape={shape}
      data-status={status}
    >
      <span className={styles.frame} aria-hidden={label ? true : undefined}>
        {children}
      </span>
      {label ? <span className={styles.srOnly}>{label}</span> : null}
      {status ? (
        <span className={styles.status} data-status={status}>
          <span className={styles.srOnly}>{statusText}</span>
        </span>
      ) : null}
    </BaseAvatar.Root>
  );
});

export interface AvatarImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src: string;
  /** Accessible description of the avatar image. Use an empty string when decorative. */
  alt: string;
  /**
   * Keeps the image mounted while it loads instead of preloading it off-screen.
   * Defaults to `true` so the fallback and image can stack and transition in place.
   */
  keepMounted?: boolean;
  /** Called with the Base UI image loading status. */
  onLoadingStatusChange?: (status: AvatarImageStatus) => void;
}

/** Avatar image backed by Base UI loading, fallback, and error handling. */
export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  function AvatarImage(
    {
      src,
      alt,
      className,
      keepMounted = true,
      onLoadingStatusChange,
      ...rest
    },
    ref,
  ) {
    const [status, setStatus] = useState<AvatarImageStatus>('loading');

    useEffect(() => {
      setStatus('loading');
    }, [src]);

    return (
      <BaseAvatar.Image
        ref={ref}
        {...rest}
        src={src}
        alt={alt}
        keepMounted={keepMounted}
        data-state={status}
        className={cx(styles.image, className)}
        onLoadingStatusChange={(nextStatus) => {
          setStatus(nextStatus);
          onLoadingStatusChange?.(nextStatus);
        }}
      />
    );
  },
);

export interface AvatarFallbackProps extends HTMLAttributes<HTMLSpanElement> {
  /** How long to wait before showing the fallback, in milliseconds. */
  delay?: number;
}

/** Fallback content shown while the image loads, or when it cannot load. */
export const AvatarFallback = forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  function AvatarFallback({ className, delay, ...rest }, ref) {
    return (
      <BaseAvatar.Fallback
        ref={ref}
        {...rest}
        delay={delay}
        className={cx(styles.fallback, className)}
        render={(props, state) => (
          <span
            {...props}
            data-state={
              state.imageLoadingStatus === 'error' ? 'error' : 'loading'
            }
          />
        )}
      />
    );
  },
);

export interface AvatarGroupProps extends HTMLAttributes<HTMLSpanElement> {
  /** Maximum visible avatars before an overflow indicator replaces the rest. */
  max?: number;
  /** Size applied to child avatars that do not set their own size. */
  size?: AvatarSize;
  /** Shape applied to child avatars that do not set their own shape. */
  shape?: AvatarShape;
  /** Overlap between avatars as a spacing token step. Defaults to `2` (8px). */
  spacing?: AvatarGroupSpacing;
  /** Accessible label for the overflow indicator. Defaults to "N more avatars". */
  overflowLabel?: (count: number) => string;
}

function defaultOverflowLabel(count: number): string {
  return count === 1 ? '1 more avatar' : `${count} more avatars`;
}

/** Horizontally overlapping avatar list with an optional overflow count. */
export const AvatarGroup = forwardRef<HTMLSpanElement, AvatarGroupProps>(
  function AvatarGroup(
    {
      max,
      size = 'md',
      shape = 'circle',
      spacing = 2,
      overflowLabel = defaultOverflowLabel,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const items = Children.toArray(children).filter(isValidElement);
    const visibleCount =
      max === undefined
        ? items.length
        : Math.min(Math.max(0, Math.floor(max)), items.length);
    const visibleItems = items.slice(0, visibleCount);
    const overflow = items.length - visibleCount;
    const contextValue = useMemo(() => ({ size, shape }), [size, shape]);

    return (
      <AvatarGroupContext.Provider value={contextValue}>
        <span
          ref={ref}
          {...rest}
          className={cx(styles.group, className)}
          data-spacing={spacing}
        >
          {visibleItems}
          {overflow > 0 ? (
            <Avatar size={size} shape={shape} label={overflowLabel(overflow)}>
              <AvatarFallback>+{overflow}</AvatarFallback>
            </Avatar>
          ) : null}
        </span>
      </AvatarGroupContext.Provider>
    );
  },
);
