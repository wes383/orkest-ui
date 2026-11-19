import type { ReactNode } from 'react';

import type { IconSize } from '../../primitives/icon';
import type { SelectItem, SelectOption, SelectOptionGroup, SelectSize } from './select-types';

export const selectIconSizeBySize: Record<SelectSize, IconSize> = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
};

export const selectActionIconSizeBySize: Record<SelectSize, IconSize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

export function isSelectOptionGroup(item: SelectItem): item is SelectOptionGroup {
  return 'options' in item;
}

export function flattenSelectOptions(items: SelectItem[]): SelectOption[] {
  return items.flatMap((item) => (isSelectOptionGroup(item) ? item.options : [item]));
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

export function excludeSelectValues(items: SelectItem[], values: Set<string>): SelectItem[] {
  return filterSelectItems(items, (option) => !values.has(option.value));
}

export interface SelectRenderGroup {
  key: string;
  label?: ReactNode;
  items: SelectOption[];
}

/**
 * Base UI understands groups as objects with an `items` array. Standalone
 * options are wrapped in a label-less group so the original visual order is
 * preserved.
 */
export function toSelectRenderGroups(items: SelectItem[]): SelectRenderGroup[] {
  return items.map((item, index) =>
    isSelectOptionGroup(item)
      ? { key: `group-${index}`, label: item.label, items: item.options }
      : { key: `option-${item.value}`, items: [item] },
  );
}

export function filterItemsForQuery(
  items: SelectItem[],
  query: string,
  filterOption?: ((option: SelectOption, query: string) => boolean) | null,
): SelectItem[] {
  if (filterOption === null) {
    return items;
  }

  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery === '') {
    return items;
  }

  return filterSelectItems(items, (option) =>
    filterOption
      ? filterOption(option, query)
      : option.label.toLowerCase().includes(normalizedQuery),
  );
}
