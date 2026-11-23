'use client';

import { MoreHorizontal } from 'lucide-react';

import { Icon } from '../../primitives/icon';
import { cx } from '../../utils/cx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  type DropdownMenuContentProps,
} from '../dropdown-menu';
import styles from './breadcrumb.module.css';

export interface BreadcrumbEllipsisMenuItem {
  /** Visible label. */
  label: string;
  /** Renders a link item when present. */
  href?: string;
  /** Called for action items that have no `href`. */
  onSelect?: () => void;
}

export interface BreadcrumbEllipsisMenuProps {
  items: BreadcrumbEllipsisMenuItem[];
  /** Accessible name for the trigger. Defaults to `More`. */
  label?: string;
  className?: string;
  /** Menu alignment against the trigger. Defaults to `start`. */
  align?: DropdownMenuContentProps['align'];
}

/** Collapsed breadcrumb entries that open a menu when pressed. */
export function BreadcrumbEllipsisMenu({
  items,
  label = 'More',
  className,
  align = 'start',
}: BreadcrumbEllipsisMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        variant="ghost"
        size="sm"
        iconOnly
        aria-label={label}
        className={cx(styles.ellipsisTrigger, className)}
      >
        <Icon icon={MoreHorizontal} size="xs" />
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent align={align}>
          {items.map((item) =>
            item.href ? (
              <DropdownMenuLinkItem key={item.label} href={item.href}>
                {item.label}
              </DropdownMenuLinkItem>
            ) : (
              <DropdownMenuItem key={item.label} onClick={() => item.onSelect?.()}>
                {item.label}
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
