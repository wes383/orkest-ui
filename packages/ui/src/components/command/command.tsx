'use client';

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { cx } from '../../utils/cx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '../dialog';
import styles from './command.module.css';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Letters that should match regardless of the separator the value uses. */
function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[-_/]+/g, ' ');
}

function matchesQuery(search: string, value: string, keywords: string[]): boolean {
  const terms = normalize(search).split(/\s+/).filter(Boolean);

  if (terms.length === 0) {
    return true;
  }

  const haystack = normalize([value, ...keywords].join(' '));

  return terms.every((term) => haystack.includes(term));
}

interface CommandContextValue {
  search: string;
  setSearch: (search: string) => void;
  shouldFilter: boolean;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  listId: string;
  label: string;
  handleKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

const CommandContext = createContext<CommandContextValue | null>(null);

function useCommandContext(component: string): CommandContextValue {
  const context = useContext(CommandContext);

  if (!context) {
    throw new Error(`${component} must be rendered inside Command.`);
  }

  return context;
}

export interface CommandProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Controlled search text. */
  search?: string;
  /** Initial search text when uncontrolled. */
  defaultSearch?: string;
  onSearchChange?: (search: string) => void;
  /** Disables the built-in filter, e.g. when results come from a server. */
  shouldFilter?: boolean;
  /** Wraps the highlight at the ends of the list. Defaults to `true`. */
  loop?: boolean;
  /** Accessible name for the listbox. Defaults to `Commands`. */
  label?: string;
}

/** Root of a command palette: owns the query, the highlight, and the keyboard loop. */
const CommandRoot = forwardRef<HTMLDivElement, CommandProps>(function CommandRoot(
  {
    search: searchProp,
    defaultSearch = '',
    onSearchChange,
    shouldFilter = true,
    loop = true,
    label = 'Commands',
    className,
    children,
    ...rest
  },
  forwardedRef,
) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [uncontrolledSearch, setUncontrolledSearch] = useState(defaultSearch);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [resultCount, setResultCount] = useState(0);
  const search = searchProp ?? uncontrolledSearch;

  const setSearch = useCallback(
    (next: string) => {
      if (searchProp === undefined) {
        setUncontrolledSearch(next);
      }

      onSearchChange?.(next);
    },
    [searchProp, onSearchChange],
  );

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;

      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef],
  );

  const getItems = useCallback((): HTMLElement[] => {
    const root = rootRef.current;

    if (!root) {
      return [];
    }

    return Array.from(root.querySelectorAll<HTMLElement>('[data-command-item]:not([hidden])'));
  }, []);

  const getEnabledItems = useCallback(
    () => getItems().filter((item) => item.getAttribute('aria-disabled') !== 'true'),
    [getItems],
  );

  const moveActive = useCallback(
    (step: number) => {
      const items = getEnabledItems();

      if (items.length === 0) {
        return;
      }

      const current = activeId ? items.findIndex((item) => item.id === activeId) : -1;

      if (current === -1) {
        setActiveId(items[step > 0 ? 0 : items.length - 1]?.id ?? null);
        return;
      }

      const next = current + step;
      const wrapped = loop
        ? (next + items.length) % items.length
        : Math.min(Math.max(next, 0), items.length - 1);

      setActiveId(items[wrapped]?.id ?? null);
    },
    [activeId, getEnabledItems, loop],
  );

  const moveToEdge = useCallback(
    (edge: 'start' | 'end') => {
      const items = getEnabledItems();
      const target = edge === 'start' ? items[0] : items[items.length - 1];

      setActiveId(target?.id ?? null);
    },
    [getEnabledItems],
  );

  // Keeps the highlight on a visible, enabled row after the query or the list
  // changes, and reports the result count to assistive technology.
  useIsoLayoutEffect(() => {
    const items = getItems();

    setResultCount(items.length);

    const active = activeId ? items.find((item) => item.id === activeId) : undefined;

    if (active && active.getAttribute('aria-disabled') !== 'true') {
      return;
    }

    const first = items.find((item) => item.getAttribute('aria-disabled') !== 'true');
    const nextId = first?.id ?? null;

    if (nextId !== activeId) {
      setActiveId(nextId);
    }
  });

  useIsoLayoutEffect(() => {
    if (!activeId) {
      return;
    }

    const active = document.getElementById(activeId);
    const list = rootRef.current?.querySelector<HTMLElement>('[data-command-list]');

    if (!active || !list) {
      return;
    }

    // Scroll the list itself instead of calling scrollIntoView, which would
    // also move the page when the palette is embedded below the fold.
    const listRect = list.getBoundingClientRect();
    const itemRect = active.getBoundingClientRect();

    if (itemRect.top < listRect.top) {
      list.scrollTop -= listRect.top - itemRect.top;
    } else if (itemRect.bottom > listRect.bottom) {
      list.scrollTop += itemRect.bottom - listRect.bottom;
    }
  }, [activeId]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          moveActive(1);
          return;
        case 'ArrowUp':
          event.preventDefault();
          moveActive(-1);
          return;
        case 'Home':
          event.preventDefault();
          moveToEdge('start');
          return;
        case 'End':
          event.preventDefault();
          moveToEdge('end');
          return;
        case 'Enter': {
          const active = activeId ? document.getElementById(activeId) : null;

          if (active && active.getAttribute('aria-disabled') !== 'true') {
            event.preventDefault();
            active.click();
          }

          return;
        }
        default:
          return;
      }
    },
    [activeId, moveActive, moveToEdge],
  );

  const context = useMemo<CommandContextValue>(
    () => ({
      search,
      setSearch,
      shouldFilter,
      activeId,
      setActiveId,
      listId,
      label,
      handleKeyDown,
    }),
    [search, setSearch, shouldFilter, activeId, listId, label, handleKeyDown],
  );

  return (
    <CommandContext.Provider value={context}>
      <div {...rest} ref={setRefs} className={cx(styles.root, className)} data-command="">
        {children}
        <div className={styles.srOnly} role="status" aria-live="polite">
          {resultCount === 1 ? '1 result' : `${resultCount} results`}
        </div>
      </div>
    </CommandContext.Provider>
  );
});

export interface CommandInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onValueChange?: (value: string) => void;
}

/** Search field that filters the list and keeps the highlight in sync. */
export const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(function CommandInput(
  { className, value: valueProp, onValueChange, onKeyDown, ...rest },
  ref,
) {
  const { search, setSearch, activeId, listId, handleKeyDown } = useCommandContext('Command.Input');
  const value = valueProp ?? search;

  return (
    <input
      {...rest}
      ref={ref}
      type="text"
      role="combobox"
      aria-expanded
      aria-controls={listId}
      aria-activedescendant={activeId ?? undefined}
      aria-autocomplete="list"
      aria-label={rest['aria-label'] ?? 'Search commands'}
      className={cx(styles.input, className)}
      autoComplete="off"
      spellCheck={false}
      value={value}
      onChange={(event) => {
        if (valueProp === undefined) {
          setSearch(event.target.value);
        }

        onValueChange?.(event.target.value);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);

        if (!event.defaultPrevented) {
          handleKeyDown(event);
        }
      }}
    />
  );
});

export interface CommandListProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible name for the listbox. Inherited from Command by default. */
  'aria-label'?: string;
}

/** Listbox holding the groups and items. */
export const CommandList = forwardRef<HTMLDivElement, CommandListProps>(function CommandList(
  { className, ...rest },
  ref,
) {
  const { listId, label } = useCommandContext('Command.List');

  return (
    <div
      {...rest}
      ref={ref}
      id={listId}
      role="listbox"
      aria-label={rest['aria-label'] ?? label}
      data-command-list=""
      className={cx(styles.list, className)}
    />
  );
});

export interface CommandGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Section label rendered above the group. */
  heading?: ReactNode;
}

/** Section of related commands. Groups without visible items collapse. */
export const CommandGroup = forwardRef<HTMLDivElement, CommandGroupProps>(function CommandGroup(
  { heading, className, children, ...rest },
  ref,
) {
  const headingId = useId();

  return (
    <div
      {...rest}
      ref={ref}
      role="group"
      aria-labelledby={heading ? headingId : undefined}
      className={cx(styles.group, className)}
      data-command-group=""
    >
      {heading ? (
        <div id={headingId} className={styles.groupHeading}>
          {heading}
        </div>
      ) : null}
      {children}
    </div>
  );
});

export interface CommandItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Stable value passed to `onSelect` and used for matching. */
  value: string;
  /** Extra words that should match this command, e.g. synonyms. */
  keywords?: string[];
  disabled?: boolean;
  /** Runs the command. Called for both pointer and keyboard activation. */
  onSelect?: (value: string) => void;
}

/** Single command row. */
export const CommandItem = forwardRef<HTMLDivElement, CommandItemProps>(function CommandItem(
  {
    value,
    keywords,
    disabled = false,
    onSelect,
    className,
    children,
    onClick,
    onKeyDown,
    onPointerMove,
    ...rest
  },
  ref,
) {
  const { search, shouldFilter, activeId, setActiveId } = useCommandContext('Command.Item');
  const id = useId();
  const visible = !shouldFilter || matchesQuery(search, value, keywords ?? []);
  const active = activeId === id;

  return (
    <div
      {...rest}
      ref={ref}
      id={id}
      role="option"
      tabIndex={-1}
      data-command-item=""
      data-value={value}
      data-active={active || undefined}
      aria-selected={active}
      aria-disabled={disabled || undefined}
      hidden={!visible}
      className={cx(styles.item, className)}
      onClick={(event) => {
        onClick?.(event);

        if (event.defaultPrevented || disabled) {
          return;
        }

        onSelect?.(value);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);

        if (event.defaultPrevented || disabled) {
          return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect?.(value);
        }
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);

        if (!disabled && !active) {
          setActiveId(id);
        }
      }}
    >
      {children}
    </div>
  );
});

export type CommandEmptyProps = HTMLAttributes<HTMLDivElement>;

/** Message rendered when no command matches the query. */
export const CommandEmpty = forwardRef<HTMLDivElement, CommandEmptyProps>(function CommandEmpty(
  { className, ...rest },
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      role="presentation"
      data-command-empty=""
      className={cx(styles.empty, className)}
    />
  );
});

export type CommandSeparatorProps = HTMLAttributes<HTMLDivElement>;

/** Divider between commands or groups. Hides when either side is empty. */
export const CommandSeparator = forwardRef<HTMLDivElement, CommandSeparatorProps>(
  function CommandSeparator({ className, ...rest }, ref) {
    const localRef = useRef<HTMLDivElement>(null);
    const { search } = useCommandContext('Command.Separator');

    useIsoLayoutEffect(() => {
      const separator = localRef.current;

      if (!separator) {
        return;
      }

      const hasVisibleItems = (node: Element | null) =>
        Boolean(node?.querySelector('[data-command-item]:not([hidden])'));

      separator.hidden =
        !hasVisibleItems(separator.previousElementSibling) ||
        !hasVisibleItems(separator.nextElementSibling);
    }, [search]);

    return (
      <div
        {...rest}
        ref={(node) => {
          localRef.current = node;

          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        role="separator"
        className={cx(styles.separator, className)}
      />
    );
  },
);

export type CommandShortcutProps = HTMLAttributes<HTMLElement>;

/** Keyboard hint rendered at the end of a command row. */
export const CommandShortcut = forwardRef<HTMLElement, CommandShortcutProps>(
  function CommandShortcut({ className, children, ...rest }, ref) {
    return (
      <kbd {...rest} ref={ref} aria-hidden="true" className={cx(styles.shortcut, className)}>
        {children}
      </kbd>
    );
  },
);

export type CommandFooterProps = HTMLAttributes<HTMLDivElement>;

/**
 * Hint bar below the list, typically for keyboard guidance. It only provides
 * the surface and layout; the caller supplies the text so the component stays
 * language-neutral.
 */
export const CommandFooter = forwardRef<HTMLDivElement, CommandFooterProps>(function CommandFooter(
  { className, ...rest },
  ref,
) {
  return <div {...rest} ref={ref} className={cx(styles.footer, className)} />;
});

export interface CommandDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Required accessible name for the dialog. */
  title?: string;
  /** Optional supporting text announced with the dialog. */
  description?: string;
  shouldFilter?: boolean;
  loop?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Modal palette. The app owns the shortcut that opens it: registering a global
 * listener inside every instance would collide when more than one is mounted.
 */
export function CommandDialog({
  open,
  defaultOpen,
  onOpenChange,
  title = 'Command menu',
  description,
  shouldFilter,
  loop,
  className,
  children,
}: CommandDialogProps) {
  return (
    <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent
          data-align="top"
          showCloseButton={false}
          className={cx(styles.dialog, className)}
        >
          <DialogTitle className={styles.srOnly}>{title}</DialogTitle>
          {description ? (
            <DialogDescription className={styles.srOnly}>{description}</DialogDescription>
          ) : null}
          <CommandRoot
            label={title}
            shouldFilter={shouldFilter}
            loop={loop}
            className={styles.dialogCommand}
          >
            {children}
          </CommandRoot>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export const Command = Object.assign(CommandRoot, {
  Dialog: CommandDialog,
  Input: CommandInput,
  List: CommandList,
  Group: CommandGroup,
  Item: CommandItem,
  Empty: CommandEmpty,
  Separator: CommandSeparator,
  Shortcut: CommandShortcut,
  Footer: CommandFooter,
});
