import { Icon } from '../../primitives/icon';
import styles from './select.module.css';
import type { SelectOption } from './select-types';

interface SelectOptionContentProps {
  option: SelectOption;
}

/** Shared label, description, and icon layout for Select and MultiSelect items. */
export function SelectOptionContent({ option }: SelectOptionContentProps) {
  return (
    <>
      {option.icon ? (
        <span className={styles.itemIcon}>
          <Icon icon={option.icon} size="sm" />
        </span>
      ) : null}
      <span className={styles.itemText}>
        <span className={styles.itemLabel}>{option.label}</span>{' '}
        {option.description ? (
          <span className={styles.itemDescription}>{option.description}</span>
        ) : null}
      </span>
    </>
  );
}
