'use client';

import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ForwardedRef,
  type MouseEvent,
} from 'react';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { ChevronDown, X } from 'lucide-react';

import { Icon } from '../../primitives/icon';
import { assignRef } from '../../utils/assign-ref';
import { cx } from '../../utils/cx';
import { useFieldControl } from '../field/field-context';
import { OptionList } from '../select/option-list';
import {
  filterItemsForQuery,
  flattenSelectOptions,
  selectActionIconSizeBySize,
  selectIconSizeBySize,
  toSelectRenderGroups,
} from '../select/select-utils';
import type { FilterableSelectBaseProps, SelectOption } from '../select/select-types';
import styles from '../select/select.module.css';

export interface ComboboxProps extends Omit<FilterableSelectBaseProps, 'searchable'> {
  /** Controlled selected value. */
  value?: string | null;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string | null;
  /** Called with the next value, or `null` when cleared. */
  onChange?: (value: string | null, option?: SelectOption) => void;
}

/**
 * Searchable single-value picker. The input filters the list as you type and
 * the chosen option is written back into the field; unlike Autocomplete it only
 * ever commits values that exist in `options`.
 */
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(props, ref) {
  return <ComboboxImpl {...props} forwardedRef={ref} />;
});

interface ComboboxImplProps extends ComboboxProps {
  forwardedRef: ForwardedRef<HTMLInputElement>;
}

function ComboboxImpl({
  options,
  value,
  defaultValue = null,
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
  loadingMessage,
  clearLabel = 'Clear selection',
  renderItem,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-errormessage': ariaErrorMessage,
  forwardedRef,
}: ComboboxImplProps) {
  const generatedId = useId().replace(/:/g, '');
  const control = useFieldControl({
    id: idProp,
    name,
    disabled,
    required,
    invalid,
  });
  const inputId = control.id ?? `combobox-${generatedId}`;

  const [internalValue, setInternalValue] = useState<string | null>(defaultValue);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const rootRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? (value ?? null) : internalValue;

  const allOptions = useMemo(() => flattenSelectOptions(options), [options]);
  const allGroups = useMemo(() => toSelectRenderGroups(options), [options]);
  const optionByValue = useMemo(
    () => new Map(allOptions.map((option) => [option.value, option])),
    [allOptions],
  );
  const visibleItems = useMemo(
    () => filterItemsForQuery(options, query, filterOption),
    [options, query, filterOption],
  );
  const visibleGroups = useMemo(() => toSelectRenderGroups(visibleItems), [visibleItems]);
  const selectedOption = currentValue === null ? undefined : optionByValue.get(currentValue);

  const iconSize = selectIconSizeBySize[size];
  const actionIconSize = selectActionIconSizeBySize[size];
  const showClear = clearable && currentValue !== null && !control.disabled;

  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      assignRef(forwardedRef, node);
    },
    [forwardedRef],
  );

  const handleValueChange = useCallback(
    (nextValue: string | null) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onChange?.(nextValue, nextValue === null ? undefined : optionByValue.get(nextValue));
    },
    [isControlled, onChange, optionByValue],
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

  return (
    <BaseCombobox.Root
      items={allGroups}
      filteredItems={visibleGroups}
      value={currentValue}
      onValueChange={handleValueChange}
      onInputValueChange={handleInputValueChange}
      onOpenChange={handleOpenChange}
      open={open}
      /* Closed, the field mirrors the choice; open, it mirrors the query so a
         new search never has to delete the old label first. */
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
          data-clearable={showClear || undefined}
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
            id={inputId}
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
              <OptionList
                items={visibleItems}
                loading={loading}
                loadingMessage={loadingMessage}
                emptyMessage={emptyMessage}
                renderItem={renderItem}
              />
            </BaseCombobox.Popup>
          </BaseCombobox.Positioner>
        </BaseCombobox.Portal>
      </div>
    </BaseCombobox.Root>
  );
}
