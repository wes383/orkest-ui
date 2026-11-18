'use client';

import {
  Fragment,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ForwardedRef,
  type MouseEvent,
} from 'react';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { Check, ChevronDown, LoaderCircle, X } from 'lucide-react';

import { Icon } from '../../primitives/icon';
import { assignRef } from '../../utils/assign-ref';
import { cx } from '../../utils/cx';
import { useFieldControl } from '../field/field-context';
import type { SelectProps } from './select';
import { SelectOptionContent } from './select-option';
import {
  filterItemsForQuery,
  flattenSelectOptions,
  selectActionIconSizeBySize,
  selectIconSizeBySize,
  toSelectRenderGroups,
  type SelectRenderGroup,
} from './select-utils';
import type { SelectOption } from './select-types';
import styles from './select.module.css';

interface SearchableSelectProps extends SelectProps {
  forwardedRef: ForwardedRef<HTMLElement>;
}

export function SearchableSelect({
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
  searchPlaceholder = 'Search…',
  onSearchChange,
  filterOption,
  emptyMessage = 'No options',
  loading = false,
  clearLabel = 'Clear selection',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-errormessage': ariaErrorMessage,
  forwardedRef,
}: SearchableSelectProps) {
  const generatedId = useId().replace(/:/g, '');
  const control = useFieldControl({
    id: idProp,
    name,
    disabled,
    required,
    invalid,
  });
  const comboboxId = control.id ?? `select-${generatedId}`;

  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const rootRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const allOptions = useMemo(() => flattenSelectOptions(options), [options]);
  const selectedOption = useMemo(
    () => allOptions.find((option) => option.value === currentValue),
    [allOptions, currentValue],
  );
  const allGroups = useMemo(() => toSelectRenderGroups(options), [options]);
  const visibleItems = useMemo(
    () => filterItemsForQuery(options, query, filterOption),
    [options, query, filterOption],
  );
  const visibleGroups = useMemo(
    () => toSelectRenderGroups(visibleItems),
    [visibleItems],
  );

  const iconSize = selectIconSizeBySize[size];
  const actionIconSize = selectActionIconSizeBySize[size];
  const showClear = clearable && currentValue !== undefined && !control.disabled;

  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      assignRef(forwardedRef, node);
    },
    [forwardedRef],
  );

  const handleValueChange = useCallback(
    (nextValue: string | null) => {
      const resolvedValue = nextValue ?? undefined;

      if (!isControlled) {
        setInternalValue(resolvedValue);
      }

      onChange?.(
        resolvedValue,
        resolvedValue === undefined
          ? undefined
          : allOptions.find((option) => option.value === resolvedValue),
      );
    },
    [allOptions, isControlled, onChange],
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

        if (!open) {
          setOpen(true);
        }
      }
    },
    [onSearchChange, open],
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

  function renderOption(option: SelectOption) {
    return (
      <BaseCombobox.Item
        key={option.value}
        value={option.value}
        disabled={option.disabled}
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
      value={currentValue ?? null}
      onValueChange={handleValueChange}
      onInputValueChange={handleInputValueChange}
      onOpenChange={handleOpenChange}
      open={open}
      inputValue={open ? query : (selectedOption?.label ?? '')}
      name={control.name}
      required={control.required}
      disabled={control.disabled}
      modal={false}
      autoHighlight
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
          <BaseCombobox.Input
            ref={setInputRef}
            id={comboboxId}
            className={styles.input}
            placeholder={open ? searchPlaceholder : placeholder}
            autoComplete="off"
            spellCheck={false}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            aria-errormessage={ariaErrorMessage}
            aria-invalid={control.invalid || undefined}
          />
          {showClear ? (
            <BaseCombobox.Clear
              className={styles.clear}
              aria-label={clearLabel}
            >
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
                {loading ? null : visibleGroups.map(renderGroup)}
              </BaseCombobox.List>
            </BaseCombobox.Popup>
          </BaseCombobox.Positioner>
        </BaseCombobox.Portal>
      </div>
    </BaseCombobox.Root>
  );
}
