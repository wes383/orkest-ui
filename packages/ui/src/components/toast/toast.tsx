'use client';

import {
  createContext,
  forwardRef,
  Fragment,
  useContext,
  type MouseEventHandler,
  type ReactNode,
} from 'react';
import { Toast as BaseToast } from '@base-ui/react/toast';
import type {
  ToastActionProps as BaseToastActionProps,
  ToastCloseProps as BaseToastCloseProps,
  ToastContentProps as BaseToastContentProps,
  ToastDescriptionProps as BaseToastDescriptionProps,
  ToastManager,
  ToastManagerAddOptions,
  ToastManagerUpdateOptions,
  ToastObject,
  ToastPortalProps,
  ToastProviderProps as BaseToastProviderProps,
  ToastRootProps,
  ToastTitleProps as BaseToastTitleProps,
  ToastViewportProps as BaseToastViewportProps,
} from '@base-ui/react/toast';
import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  CheckCircle,
  CircleX,
  Info,
  LoaderCircle,
  X,
} from 'lucide-react';

import { Icon, type IconSize } from '../../primitives/icon';
import { cx } from '../../utils/cx';
import styles from './toast.module.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToastActionOptions {
  /** Visible action label, for example "Undo". */
  label: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Accessible name used when the visible label needs more context. */
  altText?: string;
}

export interface ToastOptions {
  /** Reusing an ID updates the existing toast instead of adding another one. */
  id?: string;
  type?: ToastType;
  title?: ReactNode;
  description?: ReactNode;
  /** Auto-dismiss delay in milliseconds. `0` keeps the toast open. */
  duration?: number;
  /** `high` announces the toast as an alert; `low` announces it politely. */
  priority?: 'low' | 'high';
  action?: ToastActionOptions;
  /** Custom payload available to a custom toast renderer. */
  data?: Record<string, unknown>;
}

export type ToastBaseOptions = Omit<ToastOptions, 'id' | 'title' | 'type'>;

export interface ToastPromiseMessages<Value> {
  loading: ReactNode;
  success: ReactNode | ((value: Value) => ReactNode);
  error: ReactNode | ((error: unknown) => ReactNode);
}

type ToastData = Record<string, unknown>;

function mapToastOptions(
  options: ToastOptions,
): ToastManagerUpdateOptions<ToastData> {
  const mapped: ToastManagerUpdateOptions<ToastData> = {};

  if (options.title !== undefined) {
    mapped.title = options.title;
  }
  if (options.description !== undefined) {
    mapped.description = options.description;
  }
  if (options.type !== undefined) {
    mapped.type = options.type;
  }
  if (options.duration !== undefined) {
    mapped.timeout = options.duration;
  }
  if (options.priority !== undefined) {
    mapped.priority = options.priority;
  }
  if (options.data !== undefined) {
    mapped.data = options.data;
  }
  if (options.action !== undefined) {
    mapped.actionProps = {
      children: options.action.label,
      onClick: options.action.onClick,
      'aria-label': options.action.altText,
    };
  }

  return mapped;
}

function mapToastAddOptions(
  options: ToastOptions,
): ToastManagerAddOptions<ToastData> {
  const mapped: ToastManagerAddOptions<ToastData> = mapToastOptions(options);

  if (options.id !== undefined) {
    mapped.id = options.id;
  }

  return mapped;
}

/** Shared manager used by the imperative `toast` API. */
const globalToastManager = BaseToast.createToastManager<ToastData>();

export interface ToastApi {
  /** Adds a toast and returns its ID. */
  show(options: ToastOptions): string;
  success(title: ReactNode, options?: ToastBaseOptions): string;
  error(title: ReactNode, options?: ToastBaseOptions): string;
  warning(title: ReactNode, options?: ToastBaseOptions): string;
  info(title: ReactNode, options?: ToastBaseOptions): string;
  /** Shows a persistent loading toast until it is updated or dismissed. */
  loading(title: ReactNode, options?: ToastBaseOptions): string;
  /** Tracks a promise with loading, success, and error toasts. */
  promise<Value>(
    promise: Promise<Value>,
    messages: ToastPromiseMessages<Value>,
    options?: ToastBaseOptions,
  ): Promise<Value>;
  /** Updates a toast in place. */
  update(id: string, options: ToastOptions): void;
  /** Closes one toast, or every toast when no ID is given. */
  dismiss(id?: string): void;
  dismissAll(): void;
}

function createToastApi(manager: ToastManager<ToastData>): ToastApi {
  function addWithType(type: ToastType) {
    return (title: ReactNode, options: ToastBaseOptions = {}) =>
      manager.add(mapToastAddOptions({ ...options, title, type }));
  }

  return {
    show: (options) => manager.add(mapToastAddOptions(options)),
    success: addWithType('success'),
    error: addWithType('error'),
    warning: addWithType('warning'),
    info: addWithType('info'),
    loading: addWithType('loading'),
    promise: (promise, messages, options = {}) =>
      manager.promise(promise, {
        loading: mapToastAddOptions({
          ...options,
          title: messages.loading,
          type: 'loading',
        }),
        success: (value) =>
          mapToastAddOptions({
            ...options,
            title:
              typeof messages.success === 'function'
                ? messages.success(value)
                : messages.success,
            type: 'success',
          }),
        error: (error) =>
          mapToastAddOptions({
            ...options,
            title:
              typeof messages.error === 'function'
                ? messages.error(error)
                : messages.error,
            type: 'error',
          }),
      }),
    update: (id, options) => manager.update(id, mapToastOptions(options)),
    dismiss: (id) => manager.close(id),
    dismissAll: () => manager.close(),
  };
}

/** Imperative API for the app-level toast provider. */
export const toast: ToastApi = createToastApi(globalToastManager);

/** Creates an isolated toast API and manager for a nested provider. */
export function createToast(): {
  manager: ToastManager<ToastData>;
  toast: ToastApi;
} {
  const manager = BaseToast.createToastManager<ToastData>();
  return { manager, toast: createToastApi(manager) };
}

/** Manager-based hook for rendering and managing toasts inside a provider. */
export function useToast() {
  return BaseToast.useToastManager();
}

export interface ToastProviderProps extends BaseToastProviderProps {
  /**
   * Manager shared with the imperative API. Defaults to the module manager used
   * by `toast`. Pass a manager created with `createToast` for an isolated tree.
   */
  toastManager?: ToastManager<ToastData>;
}

/** Provides toast state and connects the imperative API to the viewport. */
export function ToastProvider({
  toastManager = globalToastManager,
  ...rest
}: ToastProviderProps) {
  return <BaseToast.Provider {...rest} toastManager={toastManager} />;
}

export interface ToastViewportProps
  extends Omit<BaseToastViewportProps, 'children' | 'className'> {
  className?: string;
  /** Corner or edge where toasts stack. Defaults to `top-right`. */
  position?: ToastPosition;
  /** Replaces the default toast rendering for every item. */
  children?: (toastObject: ToastObject<ToastData>) => ReactNode;
  /** Portal container. Defaults to the document body. */
  container?: ToastPortalProps['container'];
}

const iconsByType: Record<string, LucideIcon | undefined> = {
  success: CheckCircle,
  error: CircleX,
  warning: AlertTriangle,
  info: Info,
  loading: LoaderCircle,
};

const iconSize: IconSize = 'sm';

const ToastTypeContext = createContext<string | undefined>(undefined);

export interface ToastProps
  extends Omit<ToastRootProps, 'children' | 'className' | 'toast'> {
  className?: string;
  children?: ReactNode;
  toast: ToastRootProps['toast'];
}

/** Root of one toast. Provides the type to `ToastIcon`. */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { className, children, toast: toastObject, ...rest },
  ref,
) {
  return (
    <BaseToast.Root
      ref={ref}
      {...rest}
      toast={toastObject}
      className={cx(styles.toast, className)}
    >
      <ToastTypeContext.Provider value={toastObject.type}>
        {children}
      </ToastTypeContext.Provider>
    </BaseToast.Root>
  );
});

export interface ToastContentProps
  extends Omit<BaseToastContentProps, 'className'> {
  className?: string;
}

/** Layout container for the toast icon, text, action, and close button. */
export const ToastContent = forwardRef<HTMLDivElement, ToastContentProps>(
  function ToastContent({ className, ...rest }, ref) {
    return (
      <BaseToast.Content
        ref={ref}
        {...rest}
        className={cx(styles.content, className)}
      />
    );
  },
);

export interface ToastTitleProps
  extends Omit<BaseToastTitleProps, 'className'> {
  className?: string;
}

/** Toast title. Draws its text from the toast options. */
export const ToastTitle = forwardRef<HTMLHeadingElement, ToastTitleProps>(
  function ToastTitle({ className, ...rest }, ref) {
    return (
      <BaseToast.Title
        ref={ref}
        {...rest}
        className={cx(styles.title, className)}
      />
    );
  },
);

export interface ToastDescriptionProps
  extends Omit<BaseToastDescriptionProps, 'className'> {
  className?: string;
}

/** Supporting text for the toast. */
export const ToastDescription = forwardRef<
  HTMLParagraphElement,
  ToastDescriptionProps
>(function ToastDescription({ className, ...rest }, ref) {
  return (
    <BaseToast.Description
      ref={ref}
      {...rest}
      className={cx(styles.description, className)}
    />
  );
});

export interface ToastIconProps {
  className?: string;
  /** Overrides the icon derived from the toast type. */
  icon?: LucideIcon;
  /** Overrides the type from the surrounding `Toast`. */
  type?: ToastType | (string & {});
}

/** Status icon derived from the toast type. */
export const ToastIcon = forwardRef<HTMLSpanElement, ToastIconProps>(
  function ToastIcon({ className, icon, type: typeProp }, ref) {
    const contextType = useContext(ToastTypeContext);
    const type = typeProp ?? contextType;
    const Glyph = icon ?? (type ? iconsByType[type] : undefined);

    if (!Glyph) {
      return null;
    }

    return (
      <span
        ref={ref}
        className={cx(styles.icon, className)}
        data-type={type}
        aria-hidden="true"
      >
        <Icon icon={Glyph} size={iconSize} />
      </span>
    );
  },
);

export interface ToastActionProps
  extends Omit<BaseToastActionProps, 'className'> {
  className?: string;
}

/** Optional action button, such as "Undo". */
export const ToastAction = forwardRef<HTMLButtonElement, ToastActionProps>(
  function ToastAction({ className, ...rest }, ref) {
    return (
      <BaseToast.Action
        ref={ref}
        {...rest}
        className={cx(styles.action, className)}
      />
    );
  },
);

export interface ToastCloseProps
  extends Omit<BaseToastCloseProps, 'children' | 'className'> {
  className?: string;
  /** Accessible name for the icon-only close button. */
  label?: string;
  children?: ReactNode;
}

/** Closes the surrounding toast. Renders an icon-only button by default. */
export const ToastClose = forwardRef<HTMLButtonElement, ToastCloseProps>(
  function ToastClose(
    {
      className,
      label = 'Close notification',
      children,
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    return (
      <BaseToast.Close
        ref={ref}
        {...rest}
        aria-label={ariaLabel ?? label}
        className={cx(styles.close, className)}
      >
        {children ?? <Icon icon={X} size="sm" />}
      </BaseToast.Close>
    );
  },
);

function DefaultToast({ toastObject }: { toastObject: ToastObject<ToastData> }) {
  return (
    <Toast toast={toastObject}>
      <ToastContent>
        <ToastIcon />
        <div className={styles.text}>
          <ToastTitle />
          <ToastDescription />
        </div>
        <ToastAction />
        <ToastClose />
      </ToastContent>
    </Toast>
  );
}

/**
 * Fixed viewport that renders the toast stack. Place a single viewport next to
 * the app-level `ToastProvider`.
 */
export const ToastViewport = forwardRef<HTMLDivElement, ToastViewportProps>(
  function ToastViewport(
    {
      className,
      position = 'top-right',
      children,
      container,
      ...rest
    },
    ref,
  ) {
    const { toasts } = BaseToast.useToastManager();

    return (
      <BaseToast.Portal container={container}>
        <BaseToast.Viewport
          ref={ref}
          {...rest}
          className={cx(styles.viewport, className)}
          data-position={position}
        >
          {toasts.map((toastObject) => (
            <Fragment key={toastObject.id}>
              {children ? (
                children(toastObject)
              ) : (
                <DefaultToast toastObject={toastObject} />
              )}
            </Fragment>
          ))}
        </BaseToast.Viewport>
      </BaseToast.Portal>
    );
  },
);
