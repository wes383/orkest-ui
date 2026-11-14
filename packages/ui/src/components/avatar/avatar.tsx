'use client';

import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type SyntheticEvent,
} from 'react';

import { assignRef } from '../../utils/assign-ref';
import { cx } from '../../utils/cx';
import styles from './avatar.module.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';
export type AvatarStatus = 'online' | 'away' | 'offline' | 'busy';
export type AvatarGroupSpacing = 0 | 1 | 2 | 3 | 4;
export type AvatarImageStatus = 'idle' | 'loading' | 'loaded' | 'error';

const statusLabels: Record<AvatarStatus, string> = {
  online: 'Online',
  away: 'Away',
  offline: 'Offline',
  busy: 'Busy',
};

interface AvatarContextValue {
  size: AvatarSize;
  shape: AvatarShape;
  imageStatus: AvatarImageStatus;
  setImageStatus: (status: AvatarImageStatus) => void;
}

interface AvatarGroupContextValue {
  size: AvatarSize;
  shape: AvatarShape;
}

const AvatarContext = createContext<AvatarContextValue | null>(null);
const AvatarGroupContext = createContext<AvatarGroupContextValue | null>(null);

function useAvatarContext(component: string): AvatarContextValue {
  const context = useContext(AvatarContext);

  if (!context) {
    throw new Error(`${component} must be used inside <Avatar>.`);
  }

  return context;
}

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
  const [imageStatus, setImageStatus] = useState<AvatarImageStatus>('idle');
  const contextValue = useMemo(
    () => ({ size, shape, imageStatus, setImageStatus }),
    [size, shape, imageStatus],
  );
  const statusText = status ? (statusLabel ?? statusLabels[status]) : undefined;

  return (
    <AvatarContext.Provider value={contextValue}>
      <span
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
      </span>
    </AvatarContext.Provider>
  );
});

export interface AvatarImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src: string;
  /** Accessible description of the avatar image. Use an empty string when decorative. */
  alt: string;
}

/** Avatar image that reports loading failures so AvatarFallback can take over. */
export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(function AvatarImage(
  { src, alt, className, onLoad, onError, ...rest },
  ref,
) {
  const { setImageStatus } = useAvatarContext('AvatarImage');
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = failedSrc === src;
  const loaded = loadedSrc === src;

  const setImageRef = useCallback(
    (node: HTMLImageElement | null) => {
      imageRef.current = node;
      assignRef(ref, node);
    },
    [ref],
  );

  // Cached images can finish before hydration, so the load event may never fire.
  useEffect(() => {
    const image = imageRef.current;

    if (!image || !image.complete) {
      return;
    }

    if (image.naturalWidth > 0) {
      setFailedSrc(null);
      setLoadedSrc(src);
    } else {
      setLoadedSrc(null);
      setFailedSrc(src);
    }
  }, [src]);

  useEffect(() => {
    setImageStatus(failed ? 'error' : loaded ? 'loaded' : 'loading');
  }, [failed, loaded, setImageStatus]);

  useEffect(() => {
    return () => {
      setImageStatus('idle');
    };
  }, [setImageStatus]);

  function handleLoad(event: SyntheticEvent<HTMLImageElement>) {
    setFailedSrc(null);
    setLoadedSrc(src);
    onLoad?.(event);
  }

  function handleError(event: SyntheticEvent<HTMLImageElement>) {
    setLoadedSrc(null);
    setFailedSrc(src);
    onError?.(event);
  }

  if (failed) {
    return null;
  }

  return (
    <img
      ref={setImageRef}
      {...rest}
      src={src}
      alt={alt}
      className={cx(styles.image, className)}
      data-state={loaded ? 'loaded' : 'loading'}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
});

export type AvatarFallbackProps = HTMLAttributes<HTMLSpanElement>;

/** Fallback content shown until the avatar image loads, or when it cannot load. */
export const AvatarFallback = forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  function AvatarFallback({ className, ...rest }, ref) {
    const { imageStatus } = useAvatarContext('AvatarFallback');

    if (imageStatus === 'loaded') {
      return null;
    }

    return (
      <span
        ref={ref}
        {...rest}
        className={cx(styles.fallback, className)}
        data-state={imageStatus}
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
export const AvatarGroup = forwardRef<HTMLSpanElement, AvatarGroupProps>(function AvatarGroup(
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
    max === undefined ? items.length : Math.min(Math.max(0, Math.floor(max)), items.length);
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
});
