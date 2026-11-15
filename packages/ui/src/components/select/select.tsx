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
import { Select as BaseSelect } from '@base-ui/react/select';
import { Check, ChevronDown, LoaderCircle, X } from 'lucide-react';

import { Icon } from '../../primitives/icon';
import { assignRef } from '../../utils/assign-ref';
import { cx } from '../../utils/cx';
import { SearchableSelect } from './searchable-select';
import { SelectOptionContent } from './select-option';
import {
  flattenSelectOptions,
  isSelectOptionGroup,
  selectActionIconSizeBySize,
  selectIconSizeBySize,
} from './select-utils';
import type { SelectBaseProps, SelectItem, SelectOption } from './select-types';
import styles from './select.module.css';

export interface SelectProps extends SelectBaseProps {
  /** Controlled selected value. */
  value?: string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  /** Called with the next value, or `undefined` when cleared. */
  onChange?: (value: string | undefined, option?: SelectOption) => void;
}

/** Single-value select with optional search, groups, and clearable state. */
export const Select = forwardRef<HTMLElement, SelectProps>(function Select(props, ref) {
  if (props.searchable) {
    return <SearchableSelect {...props} forwardedRef={ref} />;
  }

  return <PlainSelect {...props} forwardedRef={ref} />;
});

interface InternalSelectProps extends SelectProps {
  forwardedRef: ForwardedRef<HTMLElement>;
}

function PlainSelect({
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
  emptyMessage = 'No options',
  loading = false,
  clearLabel = 'Clear selection',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-errormessage': ariaErrorMessage,
  forwardedRef,
}: InternalSelectProps) {
  const generatedId = useId().replace(/:/g, '');
  const comboboxId = idProp ?? `select-${generatedId}`;

  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const [open, setOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const allOptions = useMemo(() => flattenSelectOptions(options), [options]);

  const iconSize = selectIconSizeBySize[size];
  const actionIconSize = selectActionIconSizeBySize[size];
  const showClear = clearable && currentValue !== undefined && !disabled;

  const setTriggerRef = useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node;
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

  function handleClear(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    handleValueChange(null);
    triggerRef.current?.focus();
  }

  function handleFieldMouseDown(event: MouseEvent<HTMLDivElement>) {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    if (event.target.closest('button')) {
      return;
    }

    event.preventDefault();
    triggerRef.current?.click();
  }

  function renderOption(option: SelectOption) {
    return (
      <BaseSelect.Item
        key={option.value}
        value={option.value}
        label={option.label}
        disabled={option.disabled}
        className={styles.item}
      >
        <SelectOptionContent option={option} />
        <BaseSelect.ItemIndicator className={styles.itemIndicator}>
          <Icon icon={Check} size="sm" />
        </BaseSelect.ItemIndicator>
      </BaseSelect.Item>
    );
  }

  function renderOptions(items: SelectItem[]) {
    return items.map((item, index) => {
      if (isSelectOptionGroup(item)) {
        return (
          <BaseSelect.Group key={`group-${index}`} className={styles.group}>
            <BaseSelect.GroupLabel className={styles.groupLabel}>
              {item.label}
            </BaseSelect.GroupLabel>
            {item.options.map(renderOption)}
          </BaseSelect.Group>
        );
      }

      return renderOption(item);
    });
  }

  return (
    <BaseSelect.Root
      items={allOptions}
      value={currentValue ?? null}
      onValueChange={handleValueChange}
      onOpenChange={(nextOpen) => setOpen(nextOpen)}
      name={name}
      required={required}
      disabled={disabled}
      modal={false}
    >
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
          data-open={open || undefined}
          data-disabled={disabled || undefined}
          data-invalid={invalid || undefined}
          onMouseDown={handleFieldMouseDown}
        >
          {leftIcon ? (
            <span className={styles.iconSlot}>
              <Icon icon={leftIcon} size={iconSize} />
            </span>
          ) : null}
          <BaseSelect.Trigger
            ref={setTriggerRef}
            id={comboboxId}
            className={styles.trigger}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            aria-errormessage={ariaErrorMessage}
            aria-invalid={invalid || undefined}
          >
            <BaseSelect.Value className={styles.value} placeholder={placeholder} />
            <span className={styles.chevron} aria-hidden="true">
              <Icon icon={ChevronDown} size={iconSize} />
            </span>
          </BaseSelect.Trigger>
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
        </div>
        <BaseSelect.Portal container={rootRef}>
          <BaseSelect.Positioner
            sideOffset={4}
            alignItemWithTrigger={false}
            positionMethod="fixed"
            className={styles.positioner}
          >
            <BaseSelect.Popup className={styles.menu}>
              {loading ? (
                <div className={styles.status} role="status">
                  <Icon icon={LoaderCircle} size="sm" className={styles.spinner} />
                  <span>Loading options…</span>
                </div>
              ) : null}
              {!loading && allOptions.length === 0 ? (
                <div className={styles.status}>{emptyMessage}</div>
              ) : null}
              <BaseSelect.List className={styles.list}>
                {renderOptions(options)}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </div>
    </BaseSelect.Root>
  );
}
