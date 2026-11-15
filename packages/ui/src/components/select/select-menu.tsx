'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from 'react';
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  size as sizeMiddleware,
} from '@floating-ui/dom';
import { Check, LoaderCircle } from 'lucide-react';

import { Icon, type IconSize } from '../../primitives/icon';
import type { SelectItem, SelectOption, SelectOptionGroup } from './select-types';
import styles from './select.module.css';

export function isSelectOptionGroup(item: SelectItem): item is SelectOptionGroup {
  return 'options' in item;
}

export function flattenSelectOptions(items: SelectItem[]): SelectOption[] {
  return items.flatMap((item) =>
    isSelectOptionGroup(item) ? item.options : [item],
  );
}

export function filterSelectItems(
  items: SelectItem[],
  predicate: (option: SelectOption) => boolean,
): SelectItem[] {
  const result: SelectItem[] = [];

  for (const item of items) {
    if (isSelectOptionGroup(item)) {
      const options = item.options.filter(predicate);

      if (options.length > 0) {
        result.push({ ...item, options });
      }

      continue;
    }

    if (predicate(item)) {
      result.push(item);
    }
  }

  return result;
}

export function excludeSelectValues(
  items: SelectItem[],
  values: Set<string>,
): SelectItem[] {
  return filterSelectItems(items, (option) => !values.has(option.value));
}

export function findFirstEnabledOption(
  options: SelectOption[],
  isDisabled: (option: SelectOption) => boolean,
): number {
  return options.findIndex((option) => !isDisabled(option));
}

export function findLastEnabledOption(
  options: SelectOption[],
  isDisabled: (option: SelectOption) => boolean,
): number {
  for (let index = options.length - 1; index >= 0; index -= 1) {
    const option = options[index];

    if (option && !isDisabled(option)) {
      return index;
    }
  }

  return -1;
}

export function findNextEnabledOption(
  options: SelectOption[],
  currentIndex: number,
  direction: 1 | -1,
  isDisabled: (option: SelectOption) => boolean,
): number {
  if (options.length === 0) {
    return -1;
  }

  if (currentIndex < 0) {
    return direction === 1
      ? findFirstEnabledOption(options, isDisabled)
      : findLastEnabledOption(options, isDisabled);
  }

  for (let step = 1; step <= options.length; step += 1) {
    const index = (currentIndex + direction * step + options.length) % options.length;
    const option = options[index];

    if (option && !isDisabled(option)) {
      return index;
    }
  }

  return -1;
}

export function getSelectOptionId(baseId: string, index: number): string {
  return `${baseId}-option-${index}`;
}

function getSelectGroupId(baseId: string, index: number): string {
  return `${baseId}-group-${index}`;
}

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

const MENU_GUTTER = 8;
const MENU_MAX_HEIGHT = 304;

/** Positions the menu below the trigger and keeps it inside the viewport. */
export function useSelectPosition(
  open: boolean,
  triggerRef: RefObject<HTMLElement | null>,
  menuRef: RefObject<HTMLDivElement | null>,
): void {
  useIsomorphicLayoutEffect(() => {
    const reference = triggerRef.current;
    const floating = menuRef.current;

    if (!open || !reference || !floating) {
      return;
    }

    const update = () => {
      void computePosition(reference, floating, {
        placement: 'bottom-start',
        strategy: 'fixed',
        middleware: [
          offset(4),
          flip({ padding: MENU_GUTTER }),
          shift({ padding: MENU_GUTTER }),
          sizeMiddleware({
            padding: MENU_GUTTER,
            apply({ rects, availableHeight, elements }) {
              elements.floating.style.setProperty(
                '--select-reference-width',
                `${rects.reference.width}px`,
              );
              elements.floating.style.setProperty(
                '--select-available-height',
                `${Math.min(Math.max(availableHeight, 0), MENU_MAX_HEIGHT)}px`,
              );
            },
          }),
        ],
      }).then(({ x, y }) => {
        if (!floating.isConnected) {
          return;
        }

        floating.style.left = `${x}px`;
        floating.style.top = `${y}px`;
        floating.dataset.positioned = 'true';
      });
    };

    update();

    return autoUpdate(reference, floating, update);
  }, [open, triggerRef, menuRef]);
}

/** Closes the menu when a pointer interaction starts outside the component. */
export function useSelectDismiss(
  open: boolean,
  rootRef: RefObject<HTMLDivElement | null>,
  onDismiss: () => void,
): void {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (target instanceof Node && rootRef.current?.contains(target)) {
        return;
      }

      onDismiss();
    }

    document.addEventListener('pointerdown', handlePointerDown);

    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open, rootRef, onDismiss]);
}

/** Keeps the active option visible while navigating with the keyboard. */
export function useActiveOptionScroll(
  open: boolean,
  activeIndex: number,
  menuRef: RefObject<HTMLDivElement | null>,
): void {
  useEffect(() => {
    if (!open || activeIndex < 0) {
      return;
    }

    const active = menuRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    active?.scrollIntoView?.({ block: 'nearest' });
  }, [open, activeIndex, menuRef]);
}

/** Matches single-letter keystrokes against option labels. */
export function useSelectTypeahead(
  options: SelectOption[],
  activeIndex: number,
  setActiveIndex: (index: number) => void,
  enabled: boolean,
): (key: string) => boolean {
  const bufferRef = useRef('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  return useCallback(
    (key: string) => {
      if (!enabled || key.length !== 1 || key === ' ') {
        return false;
      }

      const needle = key.toLowerCase();

      const search = (value: string) => {
        const candidates = options
          .map((option, index) => ({ option, index }))
          .filter(({ option }) => !option.disabled);

        if (candidates.length === 0) {
          return -1;
        }

        const start = activeIndex >= 0 ? activeIndex + 1 : 0;
        const after = candidates.find(
          ({ index, option }) =>
            index >= start && option.label.toLowerCase().startsWith(value),
        );
        const wrapped = candidates.find(({ option }) =>
          option.label.toLowerCase().startsWith(value),
        );

        return (after ?? wrapped)?.index ?? -1;
      };

      const buffer = `${bufferRef.current}${needle}`;
      let match = search(buffer);
      let nextBuffer = buffer;

      if (match === -1) {
        nextBuffer = needle;
        match = search(needle);
      }

      bufferRef.current = nextBuffer;

      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        bufferRef.current = '';
        timeoutRef.current = null;
      }, 500);

      if (match === -1) {
        return false;
      }

      setActiveIndex(match);
      return true;
    },
    [activeIndex, enabled, options, setActiveIndex],
  );
}

interface SelectMenuProps {
  baseId: string;
  menuRef: RefObject<HTMLDivElement | null>;
  items: SelectItem[];
  options: SelectOption[];
  activeIndex: number;
  selectedValues: string[];
  multiple?: boolean;
  loading?: boolean;
  loadingMessage?: string;
  emptyMessage?: ReactNode;
  labelledBy?: string;
  ariaLabel?: string;
  onActiveIndexChange: (index: number) => void;
  onSelect: (option: SelectOption) => void;
  isOptionDisabled: (option: SelectOption) => boolean;
}

const optionIconSize: IconSize = 'sm';

/** Listbox rendered by Select and MultiSelect. */
export function SelectMenu({
  baseId,
  menuRef,
  items,
  options,
  activeIndex,
  selectedValues,
  multiple = false,
  loading = false,
  loadingMessage = 'Loading options…',
  emptyMessage = 'No options',
  labelledBy,
  ariaLabel,
  onActiveIndexChange,
  onSelect,
  isOptionDisabled,
}: SelectMenuProps) {
  const selected = new Set(selectedValues);
  let optionIndex = -1;

  function renderOption(option: SelectOption, index: number) {
    const disabled = isOptionDisabled(option);
    const isSelected = selected.has(option.value);

    return (
      <div
        key={option.value}
        id={getSelectOptionId(baseId, index)}
        role="option"
        aria-selected={isSelected}
        aria-disabled={disabled || undefined}
        data-active={index === activeIndex || undefined}
        data-selected={isSelected || undefined}
        data-disabled={disabled || undefined}
        className={styles.option}
        onMouseDown={(event) => event.preventDefault()}
        onMouseEnter={() => {
          if (!disabled) {
            onActiveIndexChange(index);
          }
        }}
        onClick={() => {
          if (!disabled) {
            onSelect(option);
          }
        }}
      >
        {option.icon ? (
          <span className={styles.optionIcon}>
            <Icon icon={option.icon} size={optionIconSize} />
          </span>
        ) : null}
        <span className={styles.optionText}>
          <span className={styles.optionLabel}>{option.label}</span>{' '}
          {option.description ? (
            <span className={styles.optionDescription}>{option.description}</span>
          ) : null}
        </span>
        {isSelected ? (
          <span className={styles.optionCheck}>
            <Icon icon={Check} size={optionIconSize} />
          </span>
        ) : null}
      </div>
    );
  }

  const renderedItems = items.map((item, itemIndex) => {
    if (isSelectOptionGroup(item)) {
      const groupId = getSelectGroupId(baseId, itemIndex);

      return (
        <div
          key={`group-${groupId}`}
          role="group"
          aria-labelledby={groupId}
          className={styles.group}
        >
          <div id={groupId} className={styles.groupLabel}>
            {item.label}
          </div>
          {item.options.map((option) => {
            optionIndex += 1;
            return renderOption(option, optionIndex);
          })}
        </div>
      );
    }

    optionIndex += 1;
    return renderOption(item, optionIndex);
  });

  return (
    <div
      ref={menuRef}
      id={`${baseId}-listbox`}
      role="listbox"
      aria-multiselectable={multiple || undefined}
      aria-labelledby={labelledBy}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      className={styles.menu}
    >
      <span className={styles.visuallyHidden} role="status" aria-live="polite">
        {loading
          ? loadingMessage
          : `${options.length} ${options.length === 1 ? 'option' : 'options'} available`}
      </span>
      {loading ? (
        <div className={styles.status}>
          <Icon icon={LoaderCircle} size="sm" className={styles.spinner} />
          <span>{loadingMessage}</span>
        </div>
      ) : null}
      {!loading && options.length === 0 ? (
        <div className={styles.status}>{emptyMessage}</div>
      ) : null}
      {renderedItems}
    </div>
  );
}
