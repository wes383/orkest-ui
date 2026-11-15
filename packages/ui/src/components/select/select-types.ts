import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  /** Unique option value used for selection and form submission. */
  value: string;
  /** Visible option text. */
  label: string;
  /** Secondary text rendered below the label. */
  description?: ReactNode;
  /** Decorative icon rendered before the label. */
  icon?: LucideIcon;
  /** Prevents selecting this option. */
  disabled?: boolean;
}

export interface SelectOptionGroup {
  /** Group heading. */
  label: string;
  options: SelectOption[];
}

export type SelectItem = SelectOption | SelectOptionGroup;

export interface SelectBaseProps {
  /** Options or groups rendered in the menu. */
  options: SelectItem[];
  /** Text shown when nothing is selected. */
  placeholder?: string;
  /** Disables the control. */
  disabled?: boolean;
  /** Exposes a required state with `aria-required`. */
  required?: boolean;
  /** Control size. Defaults to `md`. */
  size?: SelectSize;
  /** Shows a clear action while a value is selected. */
  clearable?: boolean;
  /** Applies the invalid border and `aria-invalid`. */
  invalid?: boolean;
  /** Form field name for the hidden input. */
  name?: string;
  /** Id applied to the combobox trigger. */
  id?: string;
  /** Class name applied to the root element. */
  className?: string;
  /** Decorative Lucide icon rendered before the value. */
  leftIcon?: LucideIcon;
  /** Enables local search input and filtering. */
  searchable?: boolean;
  /** Placeholder for the search input. Defaults to `Search…`. */
  searchPlaceholder?: string;
  /** Called with the next query when the user types. */
  onSearchChange?: (query: string) => void;
  /** Custom filter. Defaults to a case-insensitive label match. */
  filterOption?: (option: SelectOption, query: string) => boolean;
  /** Content shown when filtering returns no options. */
  emptyMessage?: ReactNode;
  /** Shows a loading row and marks the listbox busy. */
  loading?: boolean;
  /** Accessible name for the clear action. */
  clearLabel?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-errormessage'?: string;
}
