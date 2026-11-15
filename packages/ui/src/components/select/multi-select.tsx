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
  type ReactNode,
} from 'react';
import { ChevronDown, X } from 'lucide-react';

import { Icon, type IconSize } from '../../primitives/icon';
import { Tag } from '../tag';
import { assignRef } from '../../utils/assign-ref';
import { cx } from '../../utils/cx';
import {
  SelectMenu,
  excludeSelectValues,
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

export interface MultiSelectProps extends SelectBaseProps {
  /** Controlled selected values. */
  value?: string[];
  /** Initial values for uncontrolled usage. */
  defaultValue?: string[];
  /** Called with the next values and their options. */
  onChange?: (value: string[], options: SelectOption[]) => void;
  /** Limits how many options can be selected. */
  maxSelected?: number;
  /** Removes selected options from the menu. */
  hideSelected?: boolean;
  /** Replaces the default tag display for selected values. */
  renderValue?: (
    selected: SelectOption[],
    remove: (value: string) => void,
  ) => ReactNode;
  /** Accessible label prefix for a tag remove action. */
  removeLabel?: string;
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

/** Multi-value select with tags, search, limits, and a clear action. */
export const MultiSelect = forwardRef<HTMLElement, MultiSelectProps>(
  function MultiSelect(
    {
      options,
      value,
      defaultValue,
      onChange,
      placeholder = 'Select options',
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
      removeLabel = 'Remove',
      maxSelected,
      hideSelected = false,
      renderValue,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-errormessage': ariaErrorMessage,
    },
    ref,
  ) {
    const generatedId = useId().replace(/:/g, '');
    const baseId = `multi-select-${generatedId}`;
    const comboboxId = idProp ?? baseId;
    const listboxId = `${baseId}-listbox`;

    const [internalValues, setInternalValues] = useState<string[]>(
      defaultValue ?? [],
    );
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(-1);

    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const isControlled = value !== undefined;
    const currentValues = isControlled ? value : internalValues;
    const selectedSet = useMemo(() => new Set(currentValues), [currentValues]);

    const allOptions = useMemo(() => flattenSelectOptions(options), [options]);
    const selectedOptions = useMemo(() => {
      const byValue = new Map(allOptions.map((option) => [option.value, option]));

      return currentValues.flatMap((selectedValue) => {
        const option = byValue.get(selectedValue);
        return option ? [option] : [];
      });
    }, [allOptions, currentValues]);

    const atLimit =
      maxSelected !== undefined && currentValues.length >= maxSelected;

    const isOptionDisabled = useCallback(
      (option: SelectOption) =>
        Boolean(option.disabled) ||
        (atLimit && !selectedSet.has(option.value)),
      [atLimit, selectedSet],
    );

    const trimmedQuery = query.trim().toLowerCase();
    const visibleItems = useMemo(() => {
      let items = options;

      if (hideSelected && selectedSet.size > 0) {
        items = excludeSelectValues(items, selectedSet);
      }

      if (searchable && trimmedQuery !== '') {
        items = filterSelectItems(items, (option) =>
          filterOption
            ? filterOption(option, query)
            : option.label.toLowerCase().includes(trimmedQuery),
        );
      }

      return items;
    }, [
      options,
      hideSelected,
      selectedSet,
      searchable,
      trimmedQuery,
      query,
      filterOption,
    ]);

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

        const selectedIndex = visibleOptions.findIndex((option) =>
          selectedSet.has(option.value),
        );
        let nextIndex = -1;

        if (edge === 'last') {
          nextIndex = findLastEnabledOption(visibleOptions, isOptionDisabled);
        } else if (edge === 'first') {
          nextIndex = findFirstEnabledOption(visibleOptions, isOptionDisabled);
        } else if (
          selectedIndex >= 0 &&
          visibleOptions[selectedIndex] &&
          !isOptionDisabled(visibleOptions[selectedIndex])
        ) {
          nextIndex = selectedIndex;
        } else {
          nextIndex = findFirstEnabledOption(visibleOptions, isOptionDisabled);
        }

        setQuery('');
        setOpen(true);
        setActiveIndex(nextIndex);
      },
      [disabled, isOptionDisabled, selectedSet, visibleOptions],
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

    const commitValues = useCallback(
      (nextValues: string[]) => {
        if (!isControlled) {
          setInternalValues(nextValues);
        }

        const byValue = new Map(
          allOptions.map((option) => [option.value, option]),
        );
        const nextOptions = nextValues.flatMap((nextValue) => {
          const option = byValue.get(nextValue);
          return option ? [option] : [];
        });

        onChange?.(nextValues, nextOptions);
      },
      [allOptions, isControlled, onChange],
    );

    const toggleOption = useCallback(
      (option: SelectOption) => {
        if (isOptionDisabled(option)) {
          return;
        }

        const nextValues = selectedSet.has(option.value)
          ? currentValues.filter((currentValue) => currentValue !== option.value)
          : [...currentValues, option.value];

        commitValues(nextValues);
        triggerRef.current?.focus();
      },
      [commitValues, currentValues, isOptionDisabled, selectedSet],
    );

    const removeValue = useCallback(
      (removedValue: string) => {
        commitValues(
          currentValues.filter((currentValue) => currentValue !== removedValue),
        );
        triggerRef.current?.focus();
      },
      [commitValues, currentValues],
    );

    function handleClear(event: MouseEvent<HTMLButtonElement>) {
      event.stopPropagation();
      commitValues([]);
      triggerRef.current?.focus();
    }

    function handleFieldClick() {
      if (disabled) {
        return;
      }

      if (open && !searchable) {
        closeMenu();
        return;
      }

      if (!open) {
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

      if (key === 'Enter' || key === ' ') {
        if (searchable && key === ' ' && open) {
          return;
        }

        event.preventDefault();

        if (!open) {
          openMenu();
          return;
        }

        const option = visibleOptions[activeIndex];

        if (option) {
          toggleOption(option);
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
    const showClear = clearable && currentValues.length > 0 && !disabled;
    const inputPlaceholder = searchable
      ? open
        ? searchPlaceholder
        : currentValues.length === 0
          ? placeholder
          : undefined
      : currentValues.length === 0
        ? placeholder
        : undefined;

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
        <div
          className={styles.field}
          data-size={size}
          data-multiple="true"
          onClick={handleFieldClick}
        >
          {leftIcon ? (
            <span className={styles.iconSlot}>
              <Icon icon={leftIcon} size={iconSize} />
            </span>
          ) : null}
          <div className={styles.multiContent}>
            {renderValue ? (
              <span
                className={styles.customValue}
                onClick={(event) => event.stopPropagation()}
              >
                {renderValue(selectedOptions, removeValue)}
              </span>
            ) : (
              selectedOptions.map((option) => (
                <Tag
                  key={option.value}
                  size={size === 'lg' ? 'md' : 'sm'}
                  removable
                  disabled={disabled}
                  removeLabel={`${removeLabel} ${option.label}`}
                  onRemove={() => removeValue(option.value)}
                >
                  {option.label}
                </Tag>
              ))
            )}
            <input
              ref={setTriggerRef}
              id={comboboxId}
              type="text"
              role="combobox"
              className={cx(styles.input, styles.multiInput)}
              value={open && searchable ? query : ''}
              placeholder={inputPlaceholder}
              autoComplete="off"
              spellCheck={false}
              readOnly={!searchable}
              disabled={disabled}
              aria-autocomplete={searchable ? 'list' : undefined}
              {...ariaProps}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>
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
        <span className={styles.visuallyHidden} role="status" aria-live="polite">
          {currentValues.length === 0
            ? 'No options selected'
            : `${currentValues.length} selected`}
        </span>
        {name
          ? currentValues.map((selectedValue) => (
              <input
                key={selectedValue}
                type="hidden"
                name={name}
                value={selectedValue}
                disabled={disabled}
              />
            ))
          : null}
        {open ? (
          <SelectMenu
            baseId={baseId}
            menuRef={menuRef}
            items={visibleItems}
            options={visibleOptions}
            activeIndex={activeIndex}
            selectedValues={currentValues}
            multiple
            loading={loading}
            emptyMessage={emptyMessage}
            labelledBy={ariaLabelledBy}
            ariaLabel={ariaLabel}
            onActiveIndexChange={setActiveIndex}
            onSelect={toggleOption}
            isOptionDisabled={isOptionDisabled}
          />
        ) : null}
      </div>
    );
  },
);
