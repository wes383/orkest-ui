'use client';

import { Fragment, type ReactNode } from 'react';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { Check, LoaderCircle } from 'lucide-react';

import { Icon } from '../../primitives/icon';
import { SelectOptionContent } from './select-option';
import { toSelectRenderGroups } from './select-utils';
import type { SelectItem, SelectOption } from './select-types';
import styles from './select.module.css';

export interface OptionListProps {
  /** Options and groups left after filtering. */
  items: SelectItem[];
  /** Shows the loading row and marks the listbox busy. */
  loading?: boolean;
  /** Content shown when the filtered list is empty. */
  emptyMessage?: ReactNode;
  /** Content of the loading row. */
  loadingMessage?: ReactNode;
  /** Replaces the default option content. */
  renderItem?: (option: SelectOption) => ReactNode;
  /** Extra per-option disabled rule, on top of `option.disabled`. */
  isOptionDisabled?: (option: SelectOption) => boolean;
  /** Extra row rendered above the list, e.g. a select-all action. */
  header?: ReactNode;
}

/**
 * The listbox shared by Combobox and MultiSelect: Base UI owns the semantics
 * (listbox, options, highlight, selection) and this module owns the markup, the
 * loading and empty rows, and the optional custom item renderer.
 */
export function OptionList({
  items,
  loading = false,
  emptyMessage,
  loadingMessage = 'Loading options…',
  renderItem,
  isOptionDisabled,
  header,
}: OptionListProps) {
  const groups = toSelectRenderGroups(items);

  function renderOption(option: SelectOption) {
    return (
      <BaseCombobox.Item
        key={option.value}
        value={option.value}
        disabled={option.disabled || isOptionDisabled?.(option)}
        className={styles.item}
      >
        {renderItem ? renderItem(option) : <SelectOptionContent option={option} />}
        <BaseCombobox.ItemIndicator className={styles.itemIndicator}>
          <Icon icon={Check} size="sm" />
        </BaseCombobox.ItemIndicator>
      </BaseCombobox.Item>
    );
  }

  return (
    <>
      {header}
      <BaseCombobox.Status className={styles.status}>
        {loading ? (
          <>
            <Icon icon={LoaderCircle} size="sm" className={styles.spinner} />
            <span>{loadingMessage}</span>
          </>
        ) : null}
      </BaseCombobox.Status>
      <BaseCombobox.Empty className={styles.status}>
        {loading ? null : emptyMessage}
      </BaseCombobox.Empty>
      <BaseCombobox.List className={styles.list} aria-busy={loading || undefined}>
        {groups.map((group) =>
          group.label ? (
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
          ) : (
            <Fragment key={group.key}>{group.items.map(renderOption)}</Fragment>
          ),
        )}
      </BaseCombobox.List>
    </>
  );
}
