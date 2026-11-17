'use client';

import {
  Fragment,
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ForwardedRef,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { Check, ChevronDown, LoaderCircle, X } from 'lucide-react';

import { Icon } from '../../primitives/icon';
import { assignRef } from '../../utils/assign-ref';
import { cx } from '../../utils/cx';
import { useFieldControl } from '../field/field-context';
import { SelectOptionContent } from './select-option';
import {
  excludeSelectValues,
  filterItemsForQuery,
  flattenSelectOptions,
  selectActionIconSizeBySize,
  selectIconSizeBySize,
  toSelectRenderGroups,
  type SelectRenderGroup,
} from './select-utils';
import type { SelectBaseProps, SelectOption } from './select-types';
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

/** Multi-value select with tags, search, limits, and a clear action. */
export const MultiSelect = forwardRef<HTMLElement, MultiSelectProps>(
  function MultiSelect(props, ref) {
    return <MultiSelectImpl {...props} forwardedRef={ref} />;
  },
);

interface MultiSelectImplProps extends MultiSelectProps {
  forwardedRef: ForwardedRef<HTMLElement>;
}

function MultiSelectImpl({
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
  emptyMessage = 'No options',
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
  forwardedRef,
}: MultiSelectImplProps) {
  const generatedId = useId().replace(/:/g, '');
  const control = useFieldControl({
    id: idProp,
    name,
    disabled,
    required,
    invalid,
  });
  const comboboxId = control.id ?? `multi-select-${generatedId}`;

  const [internalValues, setInternalValues] = useState<string[]>(
    defaultValue ?? [],
  );
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const rootRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  const currentValues = isControlled ? value : internalValues;
  const selectedSet = useMemo(() => new Set(currentValues), [currentValues]);

  const allOptions = useMemo(() => flattenSelectOptions(options), [options]);
  const allGroups = useMemo(() => toSelectRenderGroups(options), [options]);
  const optionByValue = useMemo(
    () => new Map(allOptions.map((option) => [option.value, option])),
    [allOptions],
  );
  const selectedOptions = useMemo(
    () =>
      currentValues.flatMap((selectedValue) => {
        const option = optionByValue.get(selectedValue);
        return option ? [option] : [];
      }),
    [currentValues, optionByValue],
  );

  const atLimit =
    maxSelected !== undefined && currentValues.length >= maxSelected;

  const visibleItems = useMemo(() => {
    let items = options;

    if (hideSelected && selectedSet.size > 0) {
      items = excludeSelectValues(items, selectedSet);
    }

    return filterItemsForQuery(items, query, filterOption);
  }, [options, hideSelected, selectedSet, query, filterOption]);
  const visibleGroups = useMemo(
    () => toSelectRenderGroups(visibleItems),
    [visibleItems],
  );

  const iconSize = selectIconSizeBySize[size];
  const actionIconSize = selectActionIconSizeBySize[size];
  const showClear = clearable && currentValues.length > 0 && !control.disabled;
  const inputPlaceholder = searchable
    ? open
      ? searchPlaceholder
      : currentValues.length === 0
        ? placeholder
        : undefined
    : currentValues.length === 0
      ? placeholder
      : undefined;

  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      assignRef(forwardedRef, node);
    },
    [forwardedRef],
  );

  const commitValues = useCallback(
    (nextValues: string[]) => {
      if (!isControlled) {
        setInternalValues(nextValues);
      }

      const nextOptions = nextValues.flatMap((nextValue) => {
        const option = optionByValue.get(nextValue);
        return option ? [option] : [];
      });

      onChange?.(nextValues, nextOptions);
    },
    [isControlled, onChange, optionByValue],
  );

  const handleValueChange = useCallback(
    (nextValues: string[]) => {
      commitValues([...nextValues]);
    },
    [commitValues],
  );

  const removeValue = useCallback(
    (removedValue: string) => {
      commitValues(
        currentValues.filter((currentValue) => currentValue !== removedValue),
      );
    },
    [commitValues, currentValues],
  );

  const handleInputValueChange = useCallback(
    (inputValue: string, details: { reason: string }) => {
      if (
        details.reason === 'input-change' ||
        details.reason === 'input-clear' ||
        details.reason === 'clear-press'
      ) {
        setQuery(inputValue);
        onSearchChange?.(inputValue);
      }
    },
    [onSearchChange],
  );

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);

      if (!nextOpen) {
        if (query !== '') {
          onSearchChange?.('');
        }

        setQuery('');
      }
    },
    [onSearchChange, query],
  );

  function handleGroupMouseDown(event: MouseEvent<HTMLDivElement>) {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    if (event.target.closest('button, input')) {
      return;
    }

    event.preventDefault();
    inputRef.current?.focus();
  }

  function isOptionDisabled(option: SelectOption) {
    return (
      Boolean(option.disabled) ||
      (atLimit && !selectedSet.has(option.value))
    );
  }

  function renderOption(option: SelectOption) {
    return (
      <BaseCombobox.Item
        key={option.value}
        value={option.value}
        disabled={isOptionDisabled(option)}
        className={styles.item}
      >
        <SelectOptionContent option={option} />
        <BaseCombobox.ItemIndicator className={styles.itemIndicator}>
          <Icon icon={Check} size="sm" />
        </BaseCombobox.ItemIndicator>
      </BaseCombobox.Item>
    );
  }

  function renderGroup(group: SelectRenderGroup) {
    if (!group.label) {
      return (
        <Fragment key={group.key}>
          {group.items.map((option) => renderOption(option))}
        </Fragment>
      );
    }

    return (
      <BaseCombobox.Group
        key={group.key}
        items={group.items}
        className={styles.group}
      >
        <BaseCombobox.GroupLabel className={styles.groupLabel}>
          {group.label}
        </BaseCombobox.GroupLabel>
        <BaseCombobox.Collection>
          {(option: SelectOption) => renderOption(option)}
        </BaseCombobox.Collection>
      </BaseCombobox.Group>
    );
  }

  return (
    <BaseCombobox.Root
      items={allGroups}
      filteredItems={visibleGroups}
      multiple
      value={currentValues}
      onValueChange={handleValueChange}
      onInputValueChange={handleInputValueChange}
      onOpenChange={handleOpenChange}
      open={open}
      inputValue={searchable ? query : ''}
      autoHighlight={searchable}
      name={control.name}
      required={control.required}
      disabled={control.disabled}
      modal={false}
      openOnInputClick
    >
      <div
        ref={rootRef}
        className={cx(styles.root, className)}
        data-size={size}
        data-open={open || undefined}
        data-disabled={control.disabled || undefined}
        data-invalid={control.invalid || undefined}
      >
        <BaseCombobox.InputGroup
          ref={fieldRef}
          className={styles.field}
          data-size={size}
          data-multiple="true"
          data-open={open || undefined}
          data-disabled={control.disabled || undefined}
          data-invalid={control.invalid || undefined}
          onMouseDown={handleGroupMouseDown}
          onKeyDownCapture={(event) => {
            if (
              event.key === 'Enter' &&
              open &&
              visibleItems.length === 0 &&
              !event.nativeEvent.isComposing &&
              !event.altKey &&
              !event.ctrlKey &&
              !event.metaKey
            ) {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
        >
          {leftIcon ? (
            <span className={styles.iconSlot}>
              <Icon icon={leftIcon} size={iconSize} />
            </span>
          ) : null}
          <BaseCombobox.Value>
            {(selectedValues: string[]) => (
              <BaseCombobox.Chips className={styles.chips}>
                {renderValue ? (
                  <span
                    className={styles.customValue}
                    role="presentation"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {renderValue(selectedOptions, removeValue)}
                  </span>
                ) : (
                  selectedValues.map((selectedValue) => {
                    const option = optionByValue.get(selectedValue);
                    const label = option?.label ?? selectedValue;

                    return (
                      <BaseCombobox.Chip
                        key={selectedValue}
                        className={styles.chip}
                        aria-label={label}
                      >
                        {option?.icon ? (
                          <span className={styles.chipIcon}>
                            <Icon icon={option.icon} size="xs" />
                          </span>
                        ) : null}
                        <span className={styles.chipLabel}>{label}</span>
                        <BaseCombobox.ChipRemove
                          className={styles.chipRemove}
                          disabled={control.disabled}
                          aria-label={`${removeLabel} ${label}`}
                        >
                          <Icon icon={X} size="xs" />
                        </BaseCombobox.ChipRemove>
                      </BaseCombobox.Chip>
                    );
                  })
                )}
                <BaseCombobox.Input
                  ref={setInputRef}
                  id={comboboxId}
                  className={cx(styles.input, styles.multiInput)}
                  placeholder={inputPlaceholder}
                  readOnly={!searchable}
                  autoComplete="off"
                  spellCheck={false}
                  aria-label={ariaLabel}
                  aria-labelledby={ariaLabelledBy}
                  aria-describedby={ariaDescribedBy}
                  aria-errormessage={ariaErrorMessage}
                  aria-invalid={control.invalid || undefined}
                  aria-description={
                    currentValues.length > 0
                      ? maxSelected !== undefined
                        ? `${currentValues.length} of ${maxSelected} selected`
                        : `${currentValues.length} selected`
                      : undefined
                  }
                />
              </BaseCombobox.Chips>
            )}
          </BaseCombobox.Value>
          {maxSelected !== undefined ? (
            <span className={styles.selectionCount} aria-hidden="true">
              {currentValues.length}/{maxSelected}
            </span>
          ) : null}
          {showClear ? (
            <BaseCombobox.Clear className={styles.clear} aria-label={clearLabel}>
              <Icon icon={X} size={actionIconSize} />
            </BaseCombobox.Clear>
          ) : null}
          <BaseCombobox.Trigger className={styles.iconButton} aria-label="Open options">
            <span className={styles.chevron}>
              <Icon icon={ChevronDown} size={iconSize} />
            </span>
          </BaseCombobox.Trigger>
        </BaseCombobox.InputGroup>
        <BaseCombobox.Portal container={rootRef}>
          <BaseCombobox.Positioner
            anchor={fieldRef}
            sideOffset={8}
            positionMethod="fixed"
            className={styles.positioner}
          >
            <BaseCombobox.Popup className={styles.menu}>
              <BaseCombobox.Status className={styles.status}>
                {loading ? (
                  <>
                    <Icon icon={LoaderCircle} size="sm" className={styles.spinner} />
                    <span>Loading options…</span>
                  </>
                ) : null}
              </BaseCombobox.Status>
              <BaseCombobox.Empty className={styles.status}>
                {loading ? null : emptyMessage}
              </BaseCombobox.Empty>
              <BaseCombobox.List
                className={styles.list}
                aria-busy={loading || undefined}
              >
                {visibleGroups.map(renderGroup)}
              </BaseCombobox.List>
            </BaseCombobox.Popup>
          </BaseCombobox.Positioner>
        </BaseCombobox.Portal>
      </div>
    </BaseCombobox.Root>
  );
}
