'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { ChevronDown, X } from 'lucide-react';

import { Icon, type IconSize } from '../../primitives/icon';
import { assignRef } from '../../utils/assign-ref';
import { cx } from '../../utils/cx';
import {
  SelectMenu,
  filterSelectItems,
  findFirstEnabledOption,
  findLastEnabledOption,
  findNextEnabledOption,
  flattenSelectOptions,
  getSelectOptionId,
  useActiveOptionScroll,
  useSelectDismiss,
  useSelectPosition,
  useSelectTypeahead,
} from './select-menu';
import type { SelectBaseProps, SelectOption, SelectSize } from './select-types';
import styles from './select.module.css';

export interface SelectProps extends SelectBaseProps {
  /** Controlled selected value. */
  value?: string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  /** Called with the next value, or `undefined` when cleared. */
  onChange?: (value: string | undefined, option?: SelectOption) => void;
}

const iconSizeBySelectSize: Record<SelectSize, IconSize> = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
};

const actionIconSizeBySelectSize: Record<SelectSize, IconSize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

/** Single-value select with optional search, groups, and clearable state. */
export const Select = forwardRef<HTMLElement, SelectProps>(function Select(
  {
    options,
    value,
    defaultValue,
    onChange,
    placeholder = 'Select an option',
    disabled = false,
    required = false,
    size = 'md',
    clearable = false,
    invalid = false,
    name,
    id: idProp,
    className,
    leftIcon,
    searchable = false,
    searchPlaceholder = 'Search…',
    onSearchChange,
    filterOption,
    emptyMessage,
    loading = false,
    clearLabel = 'Clear selection',
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
  },
  ref,
) {
  const generatedId = useId().replace(/:/g, '');
  const baseId = `select-${generatedId}`;
  const comboboxId = idProp ?? baseId;
  const listboxId = `${baseId}-listbox`;

  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const allOptions = useMemo(() => flattenSelectOptions(options), [options]);
  const selectedOption = useMemo(
    () => allOptions.find((option) => option.value === currentValue),
    [allOptions, currentValue],
  );

  const isOptionDisabled = useCallback(
    (option: SelectOption) => Boolean(option.disabled),
    [],
  );

  const trimmedQuery = query.trim().toLowerCase();
  const visibleItems = useMemo(() => {
    if (!searchable || trimmedQuery === '') {
      return options;
    }

    return filterSelectItems(options, (option) =>
      filterOption
        ? filterOption(option, query)
        : option.label.toLowerCase().includes(trimmedQuery),
    );
  }, [options, searchable, trimmedQuery, query, filterOption]);

  const visibleOptions = useMemo(
    () => flattenSelectOptions(visibleItems),
    [visibleItems],
  );

  const setTriggerRef = useCallback(
    (node: HTMLElement | null) => {
      triggerRef.current = node;
      assignRef(ref, node);
    },
    [ref],
  );

  const openMenu = useCallback(
    (edge: 'selected' | 'first' | 'last' = 'selected') => {
      if (disabled) {
        return;
      }

      const fullOptions = flattenSelectOptions(options);
      const selectedIndex = fullOptions.findIndex(
        (option) => option.value === currentValue,
      );
      let nextIndex = -1;

      if (edge === 'last') {
        nextIndex = findLastEnabledOption(fullOptions, isOptionDisabled);
      } else if (edge === 'first') {
        nextIndex = findFirstEnabledOption(fullOptions, isOptionDisabled);
      } else if (
        selectedIndex >= 0 &&
        fullOptions[selectedIndex] &&
        !isOptionDisabled(fullOptions[selectedIndex])
      ) {
        nextIndex = selectedIndex;
      } else {
        nextIndex = findFirstEnabledOption(fullOptions, isOptionDisabled);
      }

      setQuery('');
      setOpen(true);
      setActiveIndex(nextIndex);
    },
    [currentValue, disabled, isOptionDisabled, options],
  );

  const resetSearch = useCallback(() => {
    setQuery('');

    if (query !== '') {
      onSearchChange?.('');
    }
  }, [onSearchChange, query]);

  const closeMenu = useCallback(
    (restoreFocus = false) => {
      setOpen(false);
      resetSearch();

      if (restoreFocus) {
        triggerRef.current?.focus();
      }
    },
    [resetSearch],
  );

  const dismiss = useCallback(() => {
    setOpen(false);
    resetSearch();
  }, [resetSearch]);

  useSelectPosition(open, triggerRef, menuRef);
  useSelectDismiss(open, rootRef, dismiss);
  useActiveOptionScroll(open, activeIndex, menuRef);

  const handleTypeahead = useSelectTypeahead(
    visibleOptions,
    activeIndex,
    setActiveIndex,
    !searchable,
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    setActiveIndex((current) => {
      const currentOption = visibleOptions[current];

      if (currentOption && !isOptionDisabled(currentOption)) {
        return current;
      }

      return findFirstEnabledOption(visibleOptions, isOptionDisabled);
    });
  }, [open, visibleOptions, isOptionDisabled]);

  const commitValue = useCallback(
    (nextValue: string | undefined, option?: SelectOption) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onChange?.(nextValue, option);
    },
    [isControlled, onChange],
  );

  const handleSelect = useCallback(
    (option: SelectOption) => {
      if (isOptionDisabled(option)) {
        return;
      }

      commitValue(option.value, option);
      setOpen(false);
      resetSearch();
      triggerRef.current?.focus();
    },
    [commitValue, isOptionDisabled, resetSearch],
  );

  function handleClear(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    commitValue(undefined, undefined);
    triggerRef.current?.focus();
  }

  function handleFieldClick() {
    if (disabled) {
      return;
    }

    if (searchable) {
      if (!open) {
        openMenu();
      }

      triggerRef.current?.focus();
      return;
    }

    if (open) {
      closeMenu();
    } else {
      openMenu();
    }

    triggerRef.current?.focus();
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const nextQuery = event.target.value;

    if (!open) {
      openMenu();
    }

    setQuery(nextQuery);
    onSearchChange?.(nextQuery);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.nativeEvent.isComposing) {
      return;
    }

    const key = event.key;

    if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault();

      if (!open) {
        openMenu(key === 'ArrowDown' ? 'selected' : 'last');
      } else {
        setActiveIndex(
          findNextEnabledOption(
            visibleOptions,
            activeIndex,
            key === 'ArrowDown' ? 1 : -1,
            isOptionDisabled,
          ),
        );
      }

      return;
    }

    if (key === 'Home' || key === 'End') {
      if (!open) {
        return;
      }

      event.preventDefault();
      setActiveIndex(
        key === 'Home'
          ? findFirstEnabledOption(visibleOptions, isOptionDisabled)
          : findLastEnabledOption(visibleOptions, isOptionDisabled),
      );
      return;
    }

    if (key === 'Enter') {
      event.preventDefault();

      if (!open) {
        openMenu();
        return;
      }

      const option = visibleOptions[activeIndex];

      if (option && !isOptionDisabled(option)) {
        handleSelect(option);
      }

      return;
    }

    if (key === ' ') {
      if (searchable && open) {
        return;
      }

      event.preventDefault();

      if (!open) {
        openMenu();
        return;
      }

      const option = visibleOptions[activeIndex];

      if (option && !isOptionDisabled(option)) {
        handleSelect(option);
      }

      return;
    }

    if (key === 'Escape') {
      if (!open) {
        return;
      }

      event.preventDefault();
      closeMenu(true);
      return;
    }

    if (key === 'Tab') {
      if (open) {
        closeMenu();
      }

      return;
    }

    if (
      searchable &&
      !open &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      (key === 'Backspace' || key === 'Delete')
    ) {
      event.preventDefault();
      openMenu();
      return;
    }

    if (
      searchable &&
      !open &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      key.length === 1
    ) {
      event.preventDefault();
      openMenu();
      setQuery(key);
      onSearchChange?.(key);
      return;
    }

    if (handleTypeahead(key)) {
      event.preventDefault();
    }
  }

  const iconSize = iconSizeBySelectSize[size];
  const actionIconSize = actionIconSizeBySelectSize[size];
  const showClear = clearable && currentValue !== undefined && !disabled;

  const ariaProps = {
    'aria-expanded': open,
    'aria-controls': listboxId,
    'aria-haspopup': 'listbox' as const,
    'aria-required': required || undefined,
    'aria-invalid': invalid || undefined,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-activedescendant':
      open && activeIndex >= 0
        ? getSelectOptionId(baseId, activeIndex)
        : undefined,
  };

  return (
    <div
      ref={rootRef}
      className={cx(styles.root, className)}
      data-size={size}
      data-open={open || undefined}
      data-disabled={disabled || undefined}
      data-invalid={invalid || undefined}
    >
      <div className={styles.field} data-size={size} onClick={handleFieldClick}>
        {leftIcon ? (
          <span className={styles.iconSlot}>
            <Icon icon={leftIcon} size={iconSize} />
          </span>
        ) : null}
        {searchable ? (
          <input
            ref={setTriggerRef}
            id={comboboxId}
            type="text"
            role="combobox"
            className={styles.input}
            value={open ? query : (selectedOption?.label ?? '')}
            placeholder={open ? searchPlaceholder : placeholder}
            autoComplete="off"
            spellCheck={false}
            disabled={disabled}
            aria-autocomplete="list"
            {...ariaProps}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <button
            ref={setTriggerRef}
            id={comboboxId}
            type="button"
            role="combobox"
            className={styles.trigger}
            disabled={disabled}
            {...ariaProps}
            onKeyDown={handleKeyDown}
          >
            <span
              className={cx(styles.value, !selectedOption && styles.placeholder)}
            >
              {selectedOption?.label ?? placeholder}
            </span>
          </button>
        )}
        {showClear ? (
          <button
            type="button"
            className={styles.clear}
            aria-label={clearLabel}
            onClick={handleClear}
          >
            <Icon icon={X} size={actionIconSize} />
          </button>
        ) : null}
        <span className={styles.chevron} aria-hidden="true">
          <Icon icon={ChevronDown} size={iconSize} />
        </span>
      </div>
      {name && currentValue !== undefined ? (
        <input
          type="hidden"
          name={name}
          value={currentValue}
          disabled={disabled}
        />
      ) : null}
      {open ? (
        <SelectMenu
          baseId={baseId}
          menuRef={menuRef}
          items={visibleItems}
          options={visibleOptions}
          activeIndex={activeIndex}
          selectedValues={currentValue !== undefined ? [currentValue] : []}
          loading={loading}
          emptyMessage={emptyMessage}
          labelledBy={ariaLabelledBy}
          ariaLabel={ariaLabel}
          onActiveIndexChange={setActiveIndex}
          onSelect={handleSelect}
          isOptionDisabled={isOptionDisabled}
        />
      ) : null}
    </div>
  );
});
