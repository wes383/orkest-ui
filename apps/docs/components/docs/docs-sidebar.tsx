'use client';

import { usePathname } from 'next/navigation';

import type { NavGroup } from '@/lib/docs-types';

import { DocsNav } from './docs-nav';
import { useScrollOverflow } from './use-scroll-overflow';

export function DocsSidebar({ navigation }: { navigation: NavGroup[] }) {
  const pathname = usePathname();
  const { ref, overflowing, atTop, atBottom } = useScrollOverflow<HTMLDivElement>(navigation);
  const className = [
    'docs-sidebar',
    overflowing && !atTop ? 'docs-sidebar-fade-top' : '',
    overflowing && !atBottom ? 'docs-sidebar-fade-bottom' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <aside className={className}>
      <div ref={ref} className="docs-sidebar-scroll">
        <DocsNav navigation={navigation} activePath={pathname} />
      </div>
    </aside>
  );
}
